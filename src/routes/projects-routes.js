import express from 'express';
import { getProjectDetails, getAllProjects } from '../controllers/projects-controller.js'; // <-- Agregamos getAllProjects

const router = express.Router();

// Ruta para la lista general de todos los proyectos (¡NUEVA!)
// Como en server.js se monta en '/projects', la raíz '/' aquí equivale a '/projects'
router.get('/', getAllProjects); 

// Ruta para la página de detalle de un proyecto
router.get('/:id', getProjectDetails);

export default router;
