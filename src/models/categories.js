import db from '../config/db-connect.js';

export async function getCategoryById(category_id) {
  const sql = "SELECT * FROM categories WHERE category_id = $1";
  const result = await db.query(sql, [category_id]);
  return result.rows;
}

export async function getAllCategories() {
  const sql = "SELECT * FROM categories ORDER BY name ASC";
  const result = await db.query(sql);
  return result.rows;
}

export async function getCategoriesByProject(project_id) {
  const sql = `
    SELECT c.*
    FROM categories c
    JOIN project_categories pc ON c.category_id = pc.category_id
    WHERE pc.project_id = $1
  `;
  const result = await db.query(sql, [project_id]);
  return result.rows;
}

// W04: insertar nueva categoría
export async function insertCategory(name) {
  const sql = "INSERT INTO categories (name) VALUES ($1) RETURNING *";
  const result = await db.query(sql, [name]);
  return result.rows[0];
}

// W04: actualizar categoría existente
export async function updateCategory(category_id, name) {
  const sql = "UPDATE categories SET name = $1 WHERE category_id = $2 RETURNING *";
  const result = await db.query(sql, [name, category_id]);
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


