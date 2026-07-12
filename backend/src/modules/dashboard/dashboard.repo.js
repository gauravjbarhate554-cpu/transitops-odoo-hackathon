const { pool } = require('../../db/pool');

async function getKpis({ type, status, region }) {
  const hasFilters = type || status || region;

  if (!hasFilters) {
    const { rows } = await pool.query('SELECT * FROM v_fleet_kpis');
    return rows[0];
  }

  const params = [];
  const vClauses = [];
  if (type) {
    params.push(type);
    vClauses.push(`vehicle_type = $${params.length}`);
  }
  if (region) {
    params.push(region);
    vClauses.push(`region = $${params.length}`);
  }
  if (status) {
    params.push(status);
    vClauses.push(`status = $${params.length}`);
  }
  const vehicleWhere = vClauses.length ? `WHERE ${vClauses.join(' AND ')}` : '';
  const joinedWhere = vClauses.length ? `AND ${vClauses.map((c) => `v.${c}`).join(' AND ')}` : '';

  const { rows } = await pool.query(
    `
    SELECT
      (SELECT COUNT(*) FROM vehicles ${vehicleWhere ? vehicleWhere + " AND status <> 'retired'" : "WHERE status <> 'retired'"}) AS active_vehicles,
      (SELECT COUNT(*) FROM vehicles ${vehicleWhere ? vehicleWhere + " AND status = 'available'" : "WHERE status = 'available'"}) AS available_vehicles,
      (SELECT COUNT(*) FROM vehicles ${vehicleWhere ? vehicleWhere + " AND status = 'in_shop'" : "WHERE status = 'in_shop'"}) AS vehicles_in_maintenance,
      (SELECT COUNT(*) FROM trips t JOIN vehicles v ON v.id = t.vehicle_id WHERE t.status = 'dispatched' ${joinedWhere}) AS active_trips,
      (SELECT COUNT(*) FROM trips t JOIN vehicles v ON v.id = t.vehicle_id WHERE t.status = 'draft' ${joinedWhere}) AS pending_trips,
      (SELECT COUNT(*) FROM drivers WHERE status IN ('available','on_trip')) AS drivers_on_duty,
      ROUND(
        (SELECT COUNT(*)::numeric FROM vehicles ${vehicleWhere ? vehicleWhere + " AND status = 'on_trip'" : "WHERE status = 'on_trip'"})
        / NULLIF((SELECT COUNT(*) FROM vehicles ${vehicleWhere ? vehicleWhere + " AND status <> 'retired'" : "WHERE status <> 'retired'"}), 0)
        * 100, 1
      ) AS fleet_utilization_pct
    `,
    params
  );
  return rows[0];
}

module.exports = { getKpis };
