import db from '../config/db-connect.js';

// 1. Recuperar una sola categoría por su ID
export async function getCategoryById(category_id) {
  try {
    const sql = "SELECT * FROM categories WHERE category_id = $1";
    const result = await db.query(sql, [category_id]);
    return result.rows;
  } catch (error) {
    console.error("Error en model getCategoryById: " + error);
    throw error;
  }
}

// 2. Recuperar todas las categorías del sistema para la página principal
export async function getAllCategories() {
  try {
    const sql = "SELECT * FROM categories ORDER BY name ASC";
    const result = await db.query(sql);
    return result.rows;
  } catch (error) {
    console.error("Error en model getAllCategories: " + error);
    throw error;
  }
}

// 3. Recuperar todas las categorías vinculadas a un proyecto de servicio específico
export async function getCategoriesByProject(project_id) {
  try {
    const sql = `
      SELECT c.* 
      FROM categories c
      JOIN project_categories pc ON c.category_id = pc.category_id
      WHERE pc.project_id = $1
    `;
    const result = await db.query(sql, [project_id]);
    return result.rows;
  } catch (error) {
    console.error("Error en model getCategoriesByProject: " + error);
    throw error;
  }
}



