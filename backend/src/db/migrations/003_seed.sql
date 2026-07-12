-- ── Roles ───────────────────────────────────────────────────────────────────
INSERT INTO roles (name) VALUES
  ('fleet_manager'),
  ('dispatcher'),
  ('safety_officer'),
  ('financial_analyst');

-- ── Users (password for all demo accounts: Demo@1234) ──────────────────────
INSERT INTO users (full_name, email, password_hash, role_id) VALUES
  ('Fleet Manager', 'manager@transitops.in', '$2a$10$YGgohFNgrVb5gB2gje2YkOodRSCMdFGaZvuq7QS2JKF9.jr1p1DV.', 1),
  ('Dispatch Lead', 'dispatch@transitops.in', '$2a$10$YGgohFNgrVb5gB2gje2YkOodRSCMdFGaZvuq7QS2JKF9.jr1p1DV.', 2),
  ('Safety Officer', 'safety@transitops.in', '$2a$10$YGgohFNgrVb5gB2gje2YkOodRSCMdFGaZvuq7QS2JKF9.jr1p1DV.', 3),
  ('Finance Analyst', 'finance@transitops.in', '$2a$10$YGgohFNgrVb5gB2gje2YkOodRSCMdFGaZvuq7QS2JKF9.jr1p1DV.', 4);

-- ── Vehicles (8) ─────────────────────────────────────────────────────────────
INSERT INTO vehicles (registration_number, name, model, vehicle_type, region, max_load_capacity_kg, odometer_km, acquisition_cost, status) VALUES
  ('MH-12-AB-1234', 'Van-05',      'Tata Ace',       'van',        'central', 500,  4200,  650000,  'available'), -- 1: demo star
  ('MH-12-AB-2001', 'Truck-01',    'Ashok Leyland',  'truck',      'central', 5000, 15000, 2800000, 'available'), -- 2
  ('MH-12-AB-2002', 'Truck-02',    'Ashok Leyland',  'truck',      'central', 5000, 22000, 2800000, 'available'), -- 3
  ('MH-12-AB-2003', 'Truck-03',    'Tata Signa',     'truck',      'south',   5000, 8000,  2900000, 'available'), -- 4
  ('MH-12-AB-2004', 'Truck-04',    'Tata Signa',     'truck',      'south',   5000, 31000, 2900000, 'on_trip'),   -- 5
  ('MH-12-AB-2005', 'Truck-05',    'Bharat Benz',    'truck',      'central', 5000, 48000, 3100000, 'in_shop'),   -- 6
  ('MH-12-AB-1999', 'Truck-Old-06','Tata 1109',      'truck',      'central', 4000, 120000,1800000, 'retired'),   -- 7
  ('MH-12-AB-3001', 'MiniTruck-01','Tata Intra',     'mini_truck', 'north',   1000, 9000,  850000,  'available'); -- 8

-- ── Drivers (6) ──────────────────────────────────────────────────────────────
INSERT INTO drivers (full_name, license_number, license_category, license_expiry, contact_number, safety_score, status) VALUES
  ('Alex Mathew',     'DL-MH-0120260001234', 'HMV',   '2027-06-01', '+91 9876500001', 98, 'available'), -- 1: demo star
  ('Priya Singh',     'DL-MH-0120260002345', 'HMV',   '2027-03-15', '+91 9876500002', 92, 'available'), -- 2
  ('Ramesh Kumar',    'DL-MH-0120260003456', 'LMV',   '2026-08-01', '+91 9876500003', 88, 'available'), -- 3: expiring soon (amber)
  ('Suresh Patel',    'DL-MH-0120260004567', 'HMV',   '2027-05-20', '+91 9876500004', 95, 'on_trip'),   -- 4: matches dispatched trip
  ('Old Licence Rao', 'DL-MH-0120260005678', 'TRANS', '2026-05-01', '+91 9876500005', 80, 'available'), -- 5: expired
  ('Vikram Suspended','DL-MH-0120260006789', 'HMV',   '2027-01-10', '+91 9876500006', 40, 'suspended'); -- 6: suspended

-- ── Trips (10) ───────────────────────────────────────────────────────────────
-- 5 completed
INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight_kg, planned_distance_km, revenue, status, start_odometer_km, end_odometer_km, fuel_consumed_l, dispatched_at, completed_at, created_by) VALUES
  ('Pune', 'Mumbai',      2, 1, 3000, 150, 8000, 'completed', 14700, 14850, 15, now() - interval '10 days', now() - interval '9 days',  2),
  ('Nashik', 'Pune',      3, 2, 2500, 210, 6000, 'completed', 21600, 21810, 20, now() - interval '9 days',  now() - interval '8 days',  2),
  ('Pune', 'Satara',      1, 1, 400,  120, 3000, 'completed', 3900,  4020,  6,  now() - interval '8 days',  now() - interval '7 days',  1),
  ('Nagpur', 'Amravati',  8, 3, 800,  95,  2500, 'completed', 8850,  8920,  8,  now() - interval '7 days',  now() - interval '6 days',  2),
  ('Pune', 'Kolhapur',    2, 2, 4000, 230, 9000, 'completed', 14850, 15000, 25, now() - interval '6 days',  now() - interval '5 days',  1);

-- 1 dispatched (matches vehicle 5 / driver 4, both on_trip)
INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight_kg, planned_distance_km, revenue, status, start_odometer_km, dispatched_at, created_by) VALUES
  ('Hyderabad', 'Bengaluru', 5, 4, 3500, 570, 15000, 'dispatched', 31000, now() - interval '2 hours', 2);

-- 2 draft
INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight_kg, planned_distance_km, revenue, status, created_by) VALUES
  ('Pune', 'Aurangabad', 1, 2, 350,  220, 4000, 'draft', 2),
  ('Pune', 'Solapur',    4, 5, 2000, 260, 5500, 'draft', 1);

-- 2 cancelled
INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight_kg, planned_distance_km, revenue, status, created_by) VALUES
  ('Pune', 'Indore',   3, 1, 1000, 400, 7000, 'cancelled', 2),
  ('Nagpur', 'Raipur', 8, 2, 300,  310, 3200, 'cancelled', 1);

-- ── Maintenance logs (4) ─────────────────────────────────────────────────────
INSERT INTO maintenance_logs (vehicle_id, title, description, cost, status, opened_at, closed_at, opened_by) VALUES
  (2, 'Brake Service',    'Front and rear brake pad replacement', 4500,  'closed', now() - interval '30 days', now() - interval '28 days', 1),
  (3, 'Tire Replacement', 'All 6 tires replaced',                 12000, 'closed', now() - interval '20 days', now() - interval '19 days', 1),
  (7, 'Engine Overhaul',  'Full engine rebuild before retirement', 25000, 'closed', now() - interval '60 days', now() - interval '55 days', 1),
  (6, 'Oil Change',       'Scheduled oil and filter change',       0,     'open',   now() - interval '1 days',  NULL,                        1);

-- ── Fuel logs (12) ───────────────────────────────────────────────────────────
INSERT INTO fuel_logs (vehicle_id, trip_id, liters, cost, log_date, recorded_by) VALUES
  (2, 1, 15, 1500, CURRENT_DATE - interval '9 days',  4),
  (3, 2, 20, 2000, CURRENT_DATE - interval '8 days',  4),
  (1, 3, 6,  600,  CURRENT_DATE - interval '7 days',  4),
  (8, 4, 8,  800,  CURRENT_DATE - interval '6 days',  4),
  (2, 5, 25, 2500, CURRENT_DATE - interval '5 days',  4),
  (5, NULL, 30, 3000, CURRENT_DATE - interval '2 days', 4),
  (4, NULL, 18, 1800, CURRENT_DATE - interval '12 days', 1),
  (6, NULL, 22, 2200, CURRENT_DATE - interval '15 days', 1),
  (1, NULL, 5,  500,  CURRENT_DATE - interval '20 days', 4),
  (3, NULL, 17, 1700, CURRENT_DATE - interval '25 days', 4),
  (8, NULL, 9,  900,  CURRENT_DATE - interval '18 days', 1),
  (2, NULL, 14, 1400, CURRENT_DATE - interval '30 days', 4);

-- ── Expenses (8) ─────────────────────────────────────────────────────────────
INSERT INTO expenses (vehicle_id, trip_id, category, amount, description, expense_date, recorded_by) VALUES
  (2, 1, 'toll',      450,  'Pune-Mumbai expressway toll',   CURRENT_DATE - interval '9 days', 4),
  (3, 2, 'toll',      380,  'Nashik-Pune toll',               CURRENT_DATE - interval '8 days', 4),
  (1, NULL, 'parking', 100, 'Overnight parking',              CURRENT_DATE - interval '7 days', 4),
  (8, NULL, 'repair',  2200, 'Puncture repair',               CURRENT_DATE - interval '6 days', 1),
  (2, NULL, 'insurance', 18000, 'Annual insurance renewal',   CURRENT_DATE - interval '40 days', 1),
  (5, NULL, 'toll',    600,  'Hyderabad-Bengaluru toll',      CURRENT_DATE - interval '2 days', 4),
  (4, NULL, 'parking', 150,  'City parking fee',              CURRENT_DATE - interval '10 days', 4),
  (6, NULL, 'other',   950,  'Cleaning and detailing',        CURRENT_DATE - interval '15 days', 1);
