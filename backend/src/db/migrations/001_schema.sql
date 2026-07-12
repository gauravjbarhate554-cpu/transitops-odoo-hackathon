CREATE EXTENSION IF NOT EXISTS citext;

CREATE TYPE vehicle_status     AS ENUM ('available','on_trip','in_shop','retired');
CREATE TYPE driver_status      AS ENUM ('available','on_trip','off_duty','suspended');
CREATE TYPE trip_status        AS ENUM ('draft','dispatched','completed','cancelled');
CREATE TYPE maintenance_status AS ENUM ('open','closed');
CREATE TYPE expense_category   AS ENUM ('toll','parking','repair','insurance','other');

CREATE TABLE roles (
    id   SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE users (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name     TEXT   NOT NULL CHECK (length(trim(full_name)) >= 2),
    email         CITEXT NOT NULL UNIQUE
                  CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
    password_hash TEXT   NOT NULL,
    role_id       SMALLINT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE vehicles (
    id                   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    registration_number  TEXT NOT NULL UNIQUE,
    name                 TEXT NOT NULL,
    model                TEXT,
    vehicle_type         TEXT NOT NULL
                         CHECK (vehicle_type IN ('truck','van','mini_truck','trailer')),
    region               TEXT NOT NULL DEFAULT 'central',
    max_load_capacity_kg NUMERIC(10,2) NOT NULL CHECK (max_load_capacity_kg > 0),
    odometer_km          NUMERIC(12,1) NOT NULL DEFAULT 0 CHECK (odometer_km >= 0),
    acquisition_cost     NUMERIC(14,2) NOT NULL CHECK (acquisition_cost > 0),
    status               vehicle_status NOT NULL DEFAULT 'available',
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE drivers (
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name        TEXT NOT NULL CHECK (length(trim(full_name)) >= 2),
    license_number   TEXT NOT NULL UNIQUE,
    license_category TEXT NOT NULL CHECK (license_category IN ('LMV','HMV','TRANS')),
    license_expiry   DATE NOT NULL,
    contact_number   TEXT NOT NULL CHECK (contact_number ~ '^[0-9+][0-9 -]{6,14}$'),
    safety_score     SMALLINT NOT NULL DEFAULT 100 CHECK (safety_score BETWEEN 0 AND 100),
    status           driver_status NOT NULL DEFAULT 'available',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE trips (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    source              TEXT NOT NULL,
    destination         TEXT NOT NULL,
    vehicle_id          BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    driver_id           BIGINT NOT NULL REFERENCES drivers(id)  ON DELETE RESTRICT,
    cargo_weight_kg     NUMERIC(10,2) NOT NULL CHECK (cargo_weight_kg > 0),
    planned_distance_km NUMERIC(10,1) NOT NULL CHECK (planned_distance_km > 0),
    revenue             NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (revenue >= 0),
    status              trip_status NOT NULL DEFAULT 'draft',
    start_odometer_km   NUMERIC(12,1),
    end_odometer_km     NUMERIC(12,1),
    fuel_consumed_l     NUMERIC(10,2) CHECK (fuel_consumed_l IS NULL OR fuel_consumed_l > 0),
    dispatched_at       TIMESTAMPTZ,
    completed_at        TIMESTAMPTZ,
    created_by          BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_src_dst_differ    CHECK (source <> destination),
    CONSTRAINT chk_odometer_forward  CHECK (end_odometer_km IS NULL
                                            OR start_odometer_km IS NULL
                                            OR end_odometer_km > start_odometer_km),
    CONSTRAINT chk_completed_has_readings CHECK (status <> 'completed'
                                            OR (start_odometer_km IS NOT NULL
                                                AND end_odometer_km IS NOT NULL))
);

CREATE TABLE maintenance_logs (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    vehicle_id  BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    title       TEXT NOT NULL CHECK (length(trim(title)) >= 3),
    description TEXT,
    cost        NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (cost >= 0),
    status      maintenance_status NOT NULL DEFAULT 'open',
    opened_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    closed_at   TIMESTAMPTZ,
    opened_by   BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT chk_close_consistency CHECK (
        (status = 'open'   AND closed_at IS NULL) OR
        (status = 'closed' AND closed_at IS NOT NULL AND closed_at >= opened_at))
);

CREATE TABLE fuel_logs (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    vehicle_id  BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    trip_id     BIGINT REFERENCES trips(id) ON DELETE SET NULL,
    liters      NUMERIC(8,2)  NOT NULL CHECK (liters > 0),
    cost        NUMERIC(12,2) NOT NULL CHECK (cost >= 0),
    log_date    DATE NOT NULL DEFAULT CURRENT_DATE,
    recorded_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE expenses (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    vehicle_id   BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    trip_id      BIGINT REFERENCES trips(id) ON DELETE SET NULL,
    category     expense_category NOT NULL,
    amount       NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    description  TEXT,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    recorded_by  BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT
);

-- Business rules encoded as partial unique indexes
CREATE UNIQUE INDEX uq_active_trip_per_vehicle ON trips(vehicle_id)
    WHERE status = 'dispatched';
CREATE UNIQUE INDEX uq_active_trip_per_driver  ON trips(driver_id)
    WHERE status = 'dispatched';
CREATE UNIQUE INDEX uq_open_maintenance_per_vehicle ON maintenance_logs(vehicle_id)
    WHERE status = 'open';

-- Hot-path indexes
CREATE INDEX idx_trips_status        ON trips(status);
CREATE INDEX idx_trips_vehicle       ON trips(vehicle_id);
CREATE INDEX idx_trips_driver        ON trips(driver_id);
CREATE INDEX idx_vehicles_status     ON vehicles(status);
CREATE INDEX idx_vehicles_type_region ON vehicles(vehicle_type, region);
CREATE INDEX idx_drivers_status      ON drivers(status);
CREATE INDEX idx_drivers_expiry      ON drivers(license_expiry);
CREATE INDEX idx_fuel_vehicle        ON fuel_logs(vehicle_id);
CREATE INDEX idx_expenses_vehicle    ON expenses(vehicle_id);
CREATE INDEX idx_maint_vehicle       ON maintenance_logs(vehicle_id);

-- Trigger: cargo weight may never exceed vehicle capacity (cross-table rule)
CREATE OR REPLACE FUNCTION fn_check_cargo_capacity() RETURNS trigger AS $$
DECLARE cap NUMERIC;
BEGIN
    SELECT max_load_capacity_kg INTO cap FROM vehicles WHERE id = NEW.vehicle_id;
    IF NEW.cargo_weight_kg > cap THEN
        RAISE EXCEPTION 'CARGO_EXCEEDS_CAPACITY: % kg > % kg', NEW.cargo_weight_kg, cap
              USING ERRCODE = 'check_violation';
    END IF;
    RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_cargo_capacity
    BEFORE INSERT OR UPDATE OF cargo_weight_kg, vehicle_id ON trips
    FOR EACH ROW EXECUTE FUNCTION fn_check_cargo_capacity();

-- Trigger: keep vehicles.updated_at / drivers.updated_at current
CREATE OR REPLACE FUNCTION fn_set_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_drivers_updated_at
    BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
