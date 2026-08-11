import db from '../config/db-connect.js';

// Todos los proyectos (con su organización)
export async function getAllProjects() {
  const sql = `
    SELECT p.*, o.name AS organization_name
    FROM service_projects p
    JOIN organizations o ON p.organization_id = o.organization_id
    ORDER BY p.date DESC
    LIMIT 5
  `;
  const result = await db.query(sql);
  return result.rows;
}

// Un proyecto por ID
export async function getProjectById(project_id) {
  const sql = `
    SELECT p.*, o.name AS organization_name
    FROM service_projects p
    LEFT JOIN organizations o ON p.organization_id = o.organization_id
    WHERE p.project_id = $1
  `;
  const result = await db.query(sql, [project_id]);
  return result.rows;
}

// Proyectos de una categoría
export async function getProjectsByCategory(category_id) {
  const sql = `
    SELECT p.*
    FROM service_projects p
    JOIN project_categories pc ON p.project_id = pc.project_id
    WHERE pc.category_id = $1
    ORDER BY p.date DESC
  `;
  const result = await db.query(sql, [category_id]);
  return result.rows;
}

// W04: insertar proyecto
export async function insertProject(title, description, location, organization_id) {
  const sql = `
    INSERT INTO service_projects (title, description, location, organization_id, date)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING *
  `;
  const result = await db.query(sql, [title, description, location, organization_id]);
  return result.rows[0];
}

// W04: actualizar proyecto
export async function updateProject(project_id, title, description, location, organization_id) {
  const sql = `
    UPDATE service_projects
    SET title = $1, description = $2, location = $3, organization_id = $4
    WHERE project_id = $5
    RETURNING *
  `;
  const result = await db.query(sql, [title, description, location, organization_id, project_id]);
  return result.rows[0];
}
// ---------- W06: VOLUNTEERS ----------

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
// Proyectos de una organización específica
export async function getProjectsByOrganization(organization_id) {
  const sql = `
    SELECT *
    FROM service_projects
    WHERE organization_id = $1
    ORDER BY date DESC
  `;
  const result = await db.query(sql, [organization_id]);
  return result.rows;
}
