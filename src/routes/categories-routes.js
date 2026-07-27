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

// Validación SERVER-SIDE (incluye min 3, que NO va en el cliente a propósito)
const categoryValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required.')
    .isLength({ min: 3 }).withMessage('Category name must be at least 3 characters.')
    .isLength({ max: 100 }).withMessage('Category name must be at most 100 characters.')
    .escape()
];

// Listado y detalle
router.get('/', getCategoriesList);
router.get('/:id', getCategoryDetails);

// W04 - CREATE
router.get('/new-category', newCategoryForm);
router.post('/new-category', categoryValidationRules, createCategory);

// W04 - EDIT
router.get('/edit-category/:id', editCategoryForm);
router.post('/edit-category/:id', categoryValidationRules, editCategory);

export default router;
