import express from 'express';
import { getCategoryDetails, getCategoriesList } from '../controllers/categories-controller.js';

const router = express.Router();

// Ruta para la lista general (/categories)
router.get('/', getCategoriesList);

// Ruta para el detalle de una categoría (/category/[id])
router.get('/:id', getCategoryDetails);

export default router;
