import db from '../config/db-connect.js';

export const getAllProjects = async () => {
    try {
        const query = `
            SELECT p.*, o.name as organization_name 
            FROM service_projects p
            JOIN organizations o ON p.organization_id = o.organization_id
            ORDER BY p.date DESC
        `;
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error("Error al obtener proyectos:", error);
        throw error;
    }
};
// Obtener un solo proyecto por su ID con el nombre de su organización aliado
export const getProjectById = async (projectId) => {
  try {
    const query = `
      SELECT p.*, o.name as organization_name 
      FROM service_projects p
      JOIN organizations o ON p.organization_id = o.organization_id
      WHERE p.project_id = $1
    `;
    const result = await db.query(query, [projectId]);
    return result.rows[0]; // Retorna el primer resultado (el proyecto único)
  } catch (error) {
    console.error("Error al obtener proyecto por ID:", error);
    throw error;
  }
};
