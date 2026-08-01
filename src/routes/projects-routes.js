import express from 'express';
import { body } from 'express-validator';
import {
  getAllProjects,
  getProjectDetails,
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
    .isLength({ min: 3 }).withMessage('Project title must be at least 3 characters long.')
    .isLength({ max: 150 }).withMessage('Project title must be 150 characters or less.'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required.')
    .isLength({ min: 3 }).withMessage('Description must be at least 3 characters long.'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required.')
    .isLength({ max: 255 }).withMessage('Location must be 255 characters or less.'),
  body('organization_id')
    .notEmpty().withMessage('Organization is required.')
    .isInt().withMessage('Organization is not valid.')
];

// Listado
router.get('/projects', getAllProjects);

// CREATE
router.get('/new-project', newProjectForm);
router.post('/new-project', projectValidationRules, createProject);

// EDIT
router.get('/edit-project/:id', editProjectForm);
router.post('/edit-project/:id', projectValidationRules, editProject);

// Detalle
router.get('/project/:id', getProjectDetails);

export default router;
