import { validationResult } from 'express-validator';
import {
  getAllCategories,
  getCategoryById,
  insertCategory,
  updateCategory
} from '../models/categories.js';
import { getProjectsByCategory } from '../models/projects.js';

// Lista de categorías
export async function getCategoriesList(req, res, next) {
  try {
    const categories = await getAllCategories();
    res.render('categories', {
      title: 'Categories & Organizations',
      categories: categories || []
    });
  } catch (error) { next(error); }
}

// Detalle de categoría
export async function getCategoryDetails(req, res, next) {
  try {
    const categoryId = req.params.id;

    // 🛡️ CONTROL DE SEGURIDAD: Si el ID NO es un número válido, redirige al listado
    if (isNaN(categoryId) || isNaN(parseInt(categoryId))) {
      return res.redirect('/categories');
    }

    const categoryRows = await getCategoryById(categoryId);
    const category = categoryRows && categoryRows.length > 0 ? categoryRows[0] : null;

    if (!category) {
      const err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }

    const rawProjects = await getProjectsByCategory(categoryId);
    const projects = rawProjects.map(p => ({ project_id: p.project_id, name: p.title, date: p.date }));

    res.render('category-detail', { title: category.name, category, projects: projects || [] });
  } catch (error) {
    next(error);
  }
}
// ---------- W04: CREATE ----------
export function newCategoryForm(req, res) {
  res.render('new-category', {
    title: 'New Category',
    errors: null,
    oldData: { name: '' }
  });
}

export async function createCategory(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('new-category', {
      title: 'New Category',
      errors: errors.array(),
      oldData: req.body
    });
  }
  try {
    await insertCategory(req.body.name);
    res.redirect('/categories');
  } catch (error) { next(error); }
}

// ---------- W04: EDIT ----------
export async function editCategoryForm(req, res, next) {
  try {
    const rows = await getCategoryById(req.params.id);
    const category = rows && rows.length > 0 ? rows[0] : null;
    if (!category) {
      const err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }
    res.render('edit-category', {
      title: 'Edit Category',
      errors: null,
      category
    });
  } catch (error) { next(error); }
}

export async function editCategory(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('edit-category', {
      title: 'Edit Category',
      errors: errors.array(),
      category: { category_id: req.params.id, name: req.body.name }
    });
  }
  try {
    await updateCategory(req.params.id, req.body.name);
    res.redirect('/categories');
  } catch (error) { next(error); }
}
