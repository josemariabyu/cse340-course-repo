import db from '../../database/index.js'; 

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
