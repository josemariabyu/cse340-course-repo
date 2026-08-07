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
import { requireLogin, requireRole } from '../middleware/auth.js';

const router = express.Router();

const categoryValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required.')
    .isLength({ min: 3 }).withMessage('Category name must be at least 3 characters long.')
    .isLength({ max: 100 }).withMessage('Category name must be 100 characters or less.')
];

// Listado y detalle (público)
router.get('/categories', getCategoriesList);
router.get('/category/:id', getCategoryDetails);

// CREATE (solo admin)
router.get('/new-category', requireLogin, requireRole('admin'), newCategoryForm);
router.post('/new-category', requireLogin, requireRole('admin'), categoryValidationRules, createCategory);

// EDIT (solo admin)
router.get('/edit-category/:id', requireLogin, requireRole('admin'), editCategoryForm);
router.post('/edit-category/:id', requireLogin, requireRole('admin'), categoryValidationRules, editCategory);

export default router;
