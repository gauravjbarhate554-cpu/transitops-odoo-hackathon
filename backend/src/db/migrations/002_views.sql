-- Per-vehicle cost & efficiency: single source of truth for reports and CSV export.
CREATE VIEW v_vehicle_analytics AS
SELECT
    v.id, v.registration_number, v.name, v.vehicle_type, v.region, v.status,
    v.acquisition_cost,
    COALESCE(f.fuel_cost, 0)                          AS fuel_cost,
    COALESCE(f.total_liters, 0)                       AS total_liters,
    COALESCE(m.maintenance_cost, 0)                   AS maintenance_cost,
    COALESCE(e.other_expenses, 0)                     AS other_expenses,
    COALESCE(f.fuel_cost,0) + COALESCE(m.maintenance_cost,0)      AS operational_cost,
    COALESCE(t.total_distance, 0)                     AS total_distance_km,
    COALESCE(t.total_revenue, 0)                      AS total_revenue,
    CASE WHEN COALESCE(f.total_liters,0) > 0
         THEN ROUND(t.total_distance / f.total_liters, 2) END     AS fuel_efficiency_km_l,
    ROUND( (COALESCE(t.total_revenue,0)
            - (COALESCE(m.maintenance_cost,0) + COALESCE(f.fuel_cost,0)))
           / v.acquisition_cost, 4)                               AS roi
FROM vehicles v
LEFT JOIN (SELECT vehicle_id, SUM(cost) fuel_cost, SUM(liters) total_liters
           FROM fuel_logs GROUP BY vehicle_id) f ON f.vehicle_id = v.id
LEFT JOIN (SELECT vehicle_id, SUM(cost) maintenance_cost
           FROM maintenance_logs GROUP BY vehicle_id) m ON m.vehicle_id = v.id
LEFT JOIN (SELECT vehicle_id, SUM(amount) other_expenses
           FROM expenses GROUP BY vehicle_id) e ON e.vehicle_id = v.id
LEFT JOIN (SELECT vehicle_id,
                  SUM(end_odometer_km - start_odometer_km) total_distance,
                  SUM(revenue) total_revenue
           FROM trips WHERE status = 'completed' GROUP BY vehicle_id) t
           ON t.vehicle_id = v.id;

-- Dashboard KPIs in ONE query.
CREATE VIEW v_fleet_kpis AS
SELECT
    (SELECT COUNT(*) FROM vehicles WHERE status <> 'retired')        AS active_vehicles,
    (SELECT COUNT(*) FROM vehicles WHERE status = 'available')       AS available_vehicles,
    (SELECT COUNT(*) FROM vehicles WHERE status = 'in_shop')         AS vehicles_in_maintenance,
    (SELECT COUNT(*) FROM trips    WHERE status = 'dispatched')      AS active_trips,
    (SELECT COUNT(*) FROM trips    WHERE status = 'draft')           AS pending_trips,
    (SELECT COUNT(*) FROM drivers  WHERE status IN ('available','on_trip')) AS drivers_on_duty,
    ROUND( (SELECT COUNT(*)::numeric FROM vehicles WHERE status = 'on_trip')
         / NULLIF((SELECT COUNT(*) FROM vehicles WHERE status <> 'retired'), 0)
         * 100, 1)                                                   AS fleet_utilization_pct;

-- Safety officer's watchlist: licenses expiring in 30 days or already expired.
CREATE VIEW v_license_alerts AS
SELECT id, full_name, license_number, license_expiry,
       (license_expiry - CURRENT_DATE) AS days_left,
       CASE WHEN license_expiry < CURRENT_DATE THEN 'expired' ELSE 'expiring_soon' END AS alert
FROM drivers
WHERE license_expiry < CURRENT_DATE + INTERVAL '30 days';
