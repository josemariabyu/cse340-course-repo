import db from '../config/db-connect.js';

export async function getAllOrganizations() {
  const sql = 'SELECT * FROM organizations ORDER BY name ASC';
  const result = await db.query(sql);
  return result.rows;
}

export async function getOrganizationById(organization_id) {
  const sql = 'SELECT * FROM organizations WHERE organization_id = $1';
  const result = await db.query(sql, [organization_id]);
  return result.rows;
}

export async function insertOrganization(name) {
  const sql = 'INSERT INTO organizations (name) VALUES ($1) RETURNING *';
  const result = await db.query(sql, [name]);
  return result.rows[0];
}

export async function updateOrganization(organization_id, name) {
  const sql = 'UPDATE organizations SET name = $1 WHERE organization_id = $2 RETURNING *';
  const result = await db.query(sql, [name, organization_id]);
  return result.rows[0];
}
// IDs de las categorías ya asignadas a un proyecto
export async function getCategoryIdsForProject(project_id) {
  const sql = `SELECT category_id FROM project_categories WHERE project_id = $1`;
  const result = await db.query(sql, [project_id]);
  return result.rows.map(r => r.category_id);
}

// Reemplaza todas las categorías de un proyecto por la lista nueva
export async function setCategoriesForProject(project_id, categoryIds) {
  await db.query('DELETE FROM project_categories WHERE project_id = $1', [project_id]);

  if (categoryIds.length > 0) {
    const values = categoryIds.map((_, i) => `($1, $${i + 2})`).join(', ');
    const sql = `INSERT INTO project_categories (project_id, category_id) VALUES ${values}`;
    await db.query(sql, [project_id, ...categoryIds]);
  }
}

