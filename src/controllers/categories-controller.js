import { getAllCategories, getCategoryById } from '../models/categories.js';
import { getProjectsByCategory } from '../models/projects.js';

// 1. Mostrar la lista general de categorías (/categories)
export async function getCategoriesList(req, res, next) {
    try {
        const categories = await getAllCategories();

        res.render('categories', {
            title: 'Categories & Organizations',
            categories: categories
        });
    } catch (error) {
        console.error("Error en getCategoriesList controller: ", error);
        next(error);
    }
}

// 2. Mostrar el detalle de una categoría específica y sus proyectos asociados (/category/:id)
export async function getCategoryDetails(req, res, next) {
    try {
        const categoryId = req.params.id;
        const categoryRows = await getCategoryById(categoryId);
        const category = categoryRows && categoryRows.length > 0 ? categoryRows[0] : null;

        if (!category) {
            const err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }

        const rawProjects = await getProjectsByCategory(categoryId);

        // Mapeamos 'title' a 'name' para que la vista renderice el enlace correctamente
        const projects = rawProjects.map(proj => ({
            project_id: proj.project_id,
            name: proj.title, // Transforma 'title' en 'name' para la plantilla
            date: proj.date
        }));

        res.render('category-detail', {
            title: category.name,
            category: category,
            projects: projects || []
        });
    } catch (error) {
        console.error("Error en getCategoryDetails controller: ", error);
        next(error);
    }
}

