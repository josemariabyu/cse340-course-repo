import express from 'express';
import { body } from 'express-validator';
import {
  getOrganizationsList,
  getOrganizationDetails,
  newOrganizationForm,
  createOrganization,
  editOrganizationForm,
  editOrganization
} from '../controllers/organizations-controller.js';
import { requireLogin, requireRole } from '../middleware/auth.js';

const router = express.Router();

const organizationValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Organization name is required.')
    .isLength({ min: 3 }).withMessage('Organization name must be at least 3 characters long.')
    .isLength({ max: 150 }).withMessage('Organization name must be 150 characters or less.'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required.'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('A valid email is required.')
];

// Listado (público)
router.get('/organizations', getOrganizationsList);

// CREATE (solo admin)
router.get('/new-organization', requireLogin, requireRole('admin'), newOrganizationForm);
router.post('/new-organization', requireLogin, requireRole('admin'), organizationValidationRules, createOrganization);

// EDIT (solo admin)
router.get('/edit-organization/:id', requireLogin, requireRole('admin'), editOrganizationForm);
router.post('/edit-organization/:id', requireLogin, requireRole('admin'), organizationValidationRules, editOrganization);

// Detalle (público)
router.get('/organization/:id', getOrganizationDetails);

export default router;