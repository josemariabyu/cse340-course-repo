import express from 'express';
import { body } from 'express-validator';
import { getCategoryDetails, getCategoriesList, addCategoryForm, createCategory } from '../controllers/categories-controller.js';

const router = express.Router();

// Reglas estrictas de validación para proteger el sistema contra inyecciones y datos vacíos
const categoryValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre de la categoría es obligatorio.')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.')
    .escape() // Neutraliza ataques XSS escapando caracteres peligrosos
];

// Ruta GET para mostrar el formulario (Muestra la vista)
router.get('/add', addCategoryForm);

// Ruta POST para procesar el formulario (Aplica las validaciones antes de guardar)
router.post('/add', categoryValidationRules, createCategory);

router.get('/', getCategoriesList);
router.get('/:id', getCategoryDetails);

export default router;
