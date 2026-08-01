import express from 'express';
import { body } from 'express-validator';
import {
  getOrganizationsList,
  newOrganizationForm,
  createOrganization,
  editOrganizationForm,
  editOrganization
} from '../controllers/organizations-controller.js';

const router = express.Router();

const organizationValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Organization name is required.')
    .isLength({ min: 3 }).withMessage('Organization name must be at least 3 characters long.')
    .isLength({ max: 150 }).withMessage('Organization name must be 150 characters or less.')
];

// Listado
router.get('/organizations', getOrganizationsList);

// CREATE
router.get('/new-organization', newOrganizationForm);
router.post('/new-organization', organizationValidationRules, createOrganization);

// EDIT
router.get('/edit-organization/:id', editOrganizationForm);
router.post('/edit-organization/:id', organizationValidationRules, editOrganization);

export default router;
