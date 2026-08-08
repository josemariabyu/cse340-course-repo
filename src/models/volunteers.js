import db from '../config/db-connect.js';

// Agrega a un usuario como voluntario de un proyecto
export async function addVolunteer(user_id, project_id) {
  const sql = `
    INSERT INTO volunteers (user_id, project_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, project_id) DO NOTHING
    RETURNING *
  `;
  const result = await db.query(sql, [user_id, project_id]);
  return result.rows[0] || null;
}

// Quita a un usuario como voluntario de un proyecto
export async function removeVolunteer(user_id, project_id) {
  const sql = `
    DELETE FROM volunteers
    WHERE user_id = $1 AND project_id = $2
  `;
  await db.query(sql, [user_id, project_id]);
}

// ¿Este usuario ya es voluntario de este proyecto?
export async function isVolunteering(user_id, project_id) {
  const sql = `
    SELECT 1 FROM volunteers
    WHERE user_id = $1 AND project_id = $2
  `;
  const result = await db.query(sql, [user_id, project_id]);
  return result.rows.length > 0;
}

// Todos los proyectos para los que un usuario se ofreció como voluntario
export async function getVolunteeredProjectsByUser(user_id) {
  const sql = `
    SELECT p.project_id, p.title, p.location, p.date, o.name AS organization_name
    FROM volunteers v
    JOIN service_projects p ON v.project_id = p.project_id
    LEFT JOIN organizations o ON p.organization_id = o.organization_id
    WHERE v.user_id = $1
    ORDER BY p.date ASC
  `;
  const result = await db.query(sql, [user_id]);
  return result.rows;
}