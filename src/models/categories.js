import db from '../config/db-connect.js';

// 1. Obtener una sola categoría por su ID
export async function getCategoryById(categoryId) {
  try {
    const sql = "SELECT * FROM categories WHERE category_id = $1";
    const result = await db.query(sql, [categoryId]);
    return result.rows[0]; // Retorna el objeto de la categoría
  } catch (error) {
    console.error("getCategoryById error: " + error);
    throw error;
  }
}

// 2. Obtener todas las categorías para un proyecto de servicio dado (para las etiquetas/tags)
export async function getCategoriesByProject(projectId) {
  try {
    const sql = `
      SELECT c.* FROM categories c
      JOIN project_categories pc ON c.category_id = pc.category_id
      WHERE pc.project_id = $1
    `;
    const result = await db.query(sql, [projectId]);
    return result.rows; // Retorna un array de categorías
  } catch (error) {
    console.error("getCategoriesByProject error: " + error);
    throw error;
  }
}

// 3. Obtener todos los proyectos de servicio para una categoría dada
export async function getProjectsByCategory(categoryId) {
  try {
    const sql = `
      SELECT sp.* FROM service_projects sp
      JOIN project_categories pc ON sp.project_id = pc.project_id
      WHERE pc.category_id = $1
    `;
    const result = await db.query(sql, [categoryId]);
    return result.rows; // Retorna un array de proyectos
  } catch (error) {
    console.error("getProjectsByCategory error: " + error);
    throw error;
  }
}

// Opcional: Obtener todas las categorías (para la página principal de categorías /categories)
export async function getAllCategories() {
  try {
    const sql = "SELECT * FROM categories ORDER BY name ASC";
    const result = await db.query(sql);
    return result.rows;
  } catch (error) {
    console.error("getAllCategories error: " + error);
    throw error;
  }
}

