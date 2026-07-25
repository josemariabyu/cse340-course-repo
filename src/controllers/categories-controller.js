<<<<<<< HEAD
import { validationResult } from 'express-validator';
import { getAllCategories, getCategoryById } from '../models/categories.js';
import db from '../config/db-connect.js';

export async function getCategoriesList(req, res, next) {
    try {
        const categories = await getAllCategories();
        res.render('categories', { title: 'Categories & Organizations', categories: categories || [] });
    } catch (error) { next(error); }
}

=======
import { getAllCategories, getCategoryById } from '../models/categories.js';
import { getProjectsByCategory } from '../models/projects.js';

// 1. Mostrar la lista general de categorías (/categories)
export async function getCategoriesList(req, res, next) {
    try {
        const categories = await getAllCategories();

        res.render('categories', {
            title: 'Categories & Organizations',
            categories: categories || []
        });
    } catch (error) {
        console.error("Error en getCategoriesList controller: ", error);
        next(error);
    }
}

// 2. Mostrar el detalle de una categoría específica y sus proyectos asociados (/category/:id)
>>>>>>> 3c915731d1d1b044e32da89b54e147a67a6f60e6
export async function getCategoryDetails(req, res, next) {
    try {
        const categoryId = req.params.id;
        const categoryRows = await getCategoryById(categoryId);
<<<<<<< HEAD
        const category = categoryRows && categoryRows.length > 0 ? categoryRows[0] : null;
        if (!category) { return res.status(404).send('Category not found'); }
        res.render('category-detail', { title: category.name, category: category, projects: [] });
    } catch (error) { next(error); }
}

// 1. Mostrar el formulario para añadir una nueva categoría (GET)
export function addCategoryForm(req, res) {
    res.render('add-category', { 
        title: 'Añadir Nueva Categoría', 
        errors: null, 
        oldData: { name: '' } 
    });
}

// 2. Procesar y validar la creación de la categoría (POST)
export async function createCategory(req, res, next) {
    const errors = validationResult(req);
    
    // Si hay errores de validación, volvemos a mostrar el formulario con las alertas
    if (!errors.isEmpty()) {
        return res.render('add-category', {
            title: 'Añadir Nueva Categoría',
            errors: errors.array(),
            oldData: req.body // Mantiene lo que el usuario escribió
=======
        
        // CORRECCIÓN CRÍTICA: Extraemos la primera fila [0]
        const category = categoryRows && categoryRows.length > 0 ? categoryRows[0] : null;

        if (!category) {
            const err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }

        const rawProjects = await getProjectsByCategory(categoryId);

        // Mapeamos 'title' de la BD a 'name' para compatibilidad con la vista
        const projects = rawProjects.map(proj => ({
            project_id: proj.project_id,
            name: proj.title, 
            date: proj.date
        }));

        res.render('category-detail', {
            title: category.name,
            category: category,
            projects: projects || []
>>>>>>> 3c915731d1d1b044e32da89b54e147a67a6f60e6
        });
    }

    try {
        const { name } = req.body;
        // Consulta SQL parametrizada segura contra inyección SQL
        const sql = "INSERT INTO categories (name) VALUES ($1) RETURNING *";
        await db.query(sql, [name]);
        
        // Redirige al listado general de categorías al guardar con éxito
        res.redirect('/categories');
    } catch (error) {
        console.error("Error al guardar la categoría: ", error);
        next(error);
    }
}


