import express from 'express';
import { body } from 'express-validator';
import {
  registerForm,
  register,
  loginForm,
  login,
  logout,
  dashboard,
  usersList
} from '../controllers/users.js';
import { requireLogin, requireRole } from '../middleware/auth.js';

const router = express.Router();

// ---------- Validaciones server-side ----------
const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long.')
    .isLength({ max: 100 }).withMessage('Name must be 100 characters or fewer.'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('A valid email is required.')
    .isLength({ max: 150 }).withMessage('Email must be 150 characters or fewer.'),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('A valid email is required.'),
  body('password')
    .notEmpty().withMessage('Password is required.')
];

// ---------- Rutas públicas ----------
router.get('/register', registerForm);
router.post('/register', registerRules, register);

router.get('/login', loginForm);
router.post('/login', loginRules, login);

router.get('/logout', logout);
router.post('/logout', logout);

// ---------- Rutas protegidas ----------
router.get('/dashboard', requireLogin, dashboard);

// Solo admins (W05)
router.get('/users', requireLogin, requireRole('admin'), usersList);

export default router;
