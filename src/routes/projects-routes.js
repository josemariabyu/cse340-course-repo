import express from 'express';
import { body } from 'express-validator';
import {
  getAllProjects,
  getProjectDetails,
  newProjectForm,
  createProject,
  editProjectForm,
  editProject,
  volunteerForProject,
  unvolunteerFromProject,
  assignCategoriesForm,
  updateProjectCategories
} from '../controllers/projects-controller.js';
import { requireLogin, requireRole } from '../middleware/auth.js';


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

// Listado y detalle (público)
router.get('/projects', getAllProjects);
router.get('/project/:id', getProjectDetails);

// CREATE (solo admin)
router.get('/new-project', requireLogin, requireRole('admin'), newProjectForm);
router.post('/new-project', requireLogin, requireRole('admin'), projectValidationRules, createProject);

// EDIT (solo admin)
router.get('/edit-project/:id', requireLogin, requireRole('admin'), editProjectForm);
router.post('/edit-project/:id', requireLogin, requireRole('admin'), projectValidationRules, editProject);

// W06: voluntariado (cualquier usuario logueado, no solo admin)
router.post('/project/:id/volunteer', requireLogin, volunteerForProject);
router.post('/project/:id/unvolunteer', requireLogin, unvolunteerFromProject);

router.get('/project/:id/categories', requireLogin, requireRole('admin'), assignCategoriesForm);
router.post('/project/:id/categories', requireLogin, requireRole('admin'), updateProjectCategories);

export default router;