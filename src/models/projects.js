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
