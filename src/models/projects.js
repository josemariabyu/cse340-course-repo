import db from '../config/db-connect.js';

// 1. Recuperar un proyecto específico por su ID con su organización vinculada
export async function getProjectById(project_id) {
  try {
    const sql = `
      SELECT p.*, o.name as organization_name 
      FROM service_projects p 
      LEFT JOIN organizations o ON p.organization_id = o.organization_id 
      WHERE p.project_id = $1
    `;
    const result = await db.query(sql, [project_id]);
    return result.rows; 
  } catch (error) {
    console.error("Error en model getProjectById: " + error);
    throw error;
  }
}

// 2. Recuperar todos los proyectos vinculados a una categoría específica
export async function getProjectsByCategory(category_id) {
  try {
    const sql = `
      SELECT p.* 
      FROM service_projects p
      JOIN project_categories pc ON p.project_id = pc.project_id
      WHERE pc.category_id = $1
      ORDER BY p.date DESC
    `;
    const result = await db.query(sql, [category_id]);
    return result.rows;
  } catch (error) {
    console.error("Error en model getProjectsByCategory: " + error);
    throw error;
  }
}

