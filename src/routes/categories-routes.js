import express from 'express';
import { body } from 'express-validator';
import {
  getCategoryDetails,
  getCategoriesList,
  newCategoryForm,
  createCategory,
  editCategoryForm,
  editCategory
} from '../controllers/categories-controller.js';

const router = express.Router();

const categoryValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required.')
    .isLength({ min: 3 }).withMessage('Category name must be at least 3 characters.')
    .isLength({ max: 100 }).withMessage('Category name must be at most 100 characters.')
    .escape()
];

// Listado
router.get('/', getCategoriesList);

// W04 - CREATE  (¡ANTES de /:id!)
router.get('/new-category', newCategoryForm);
router.post('/new-category', categoryValidationRules, createCategory);

// W04 - EDIT  (¡ANTES de /:id!)
router.get('/edit-category/:id', editCategoryForm);
router.post('/edit-category/:id', categoryValidationRules, editCategory);

// Detalle (siempre AL FINAL, solo acepta números)
router.get('/:id(\\d+)', getCategoryDetails);

export default router;

