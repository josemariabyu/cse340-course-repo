import db from '../../database/index.js'; // Ajustaremos esta línea si da error de archivo

export const getAllCategories = async () => {
    try {
        const query = 'SELECT * FROM categories ORDER BY name ASC';
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        throw error;
    }
};
