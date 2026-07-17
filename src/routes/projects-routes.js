import express from 'express';
import { getProjectDetails } from '../controllers/projects-controller.js';

const router = express.Router();

// Ruta para la página de detalle de un proyecto
router.get('/:id', getProjectDetails);

export default router;
