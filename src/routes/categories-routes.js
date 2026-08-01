import express from 'express';
import { body } from 'express-validator';
import {
  getCategoriesList,
  getCategoryDetails,
  newCategoryForm,
  createCategory,
  editCategoryForm,
  editCategory
} from '../controllers/categories-controller.js';

const router = express.Router();

// Validación del lado del servidor: requerida, min 3, max 100
const categoryValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required.')
    .isLength({ min: 3 }).withMessage('Category name must be at least 3 characters long.')
    .isLength({ max: 100 }).withMessage('Category name must be 100 characters or less.')
];

// Listado de categorías
router.get('/categories', getCategoriesList);

// W04 - CREATE
router.get('/new-category', newCategoryForm);
router.post('/new-category', categoryValidationRules, createCategory);

// W04 - EDIT
router.get('/edit-category/:id', editCategoryForm);
router.post('/edit-category/:id', categoryValidationRules, editCategory);

// W03 - Detalle de categoría
router.get('/category/:id', getCategoryDetails);

export default router;

