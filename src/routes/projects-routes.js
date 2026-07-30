import express from 'express';
import { body } from 'express-validator';
import { 
    getProjectDetails, 
    getAllProjects,
    newProjectForm,
    createProject,
    editProjectForm,
    editProject
} from '../controllers/projects-controller.js';

const router = express.Router();

const projectValidationRules = [
    body('title')
        .trim()
        .notEmpty().withMessage('Project title is required.')
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters.'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required.'),
    body('organization_id')
        .notEmpty().withMessage('Organization is required.')
];

// 1. Listado General (Raíz)
router.get('/', getAllProjects);

// 2. ➕ CREATE PROYECTO (¡Van ARRIBA porque usan palabras fijas!)
router.get('/new-project', newProjectForm);
router.post('/new-project', projectValidationRules, createProject);

// 3. ✏️ EDIT PROYECTO (¡Va ARRIBA por la misma razón!)
router.get('/edit-project/:id', editProjectForm);
router.post('/edit-project/:id', projectValidationRules, editProject);

// 4. 🔍 DETALLE DEL PROYECTO (¡Siempre AL FINAL del archivo!)
// 4. 🔍 DETALLE DEL PROYECTO (¡Solo entra si son números del 0 al 9!)
// 4. 🔍 DETALLE DEL PROYECTO (¡Limpio sin expresiones grupales!)
router.get('/:id', getProjectDetails);

export default router;
