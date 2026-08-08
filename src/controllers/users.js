import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { getVolunteeredProjectsByUser } from '../models/volunteers.js';
import {
  getAllUsers,
  getUserByEmail,
  insertUser
} from '../models/users.js';

// ---------- REGISTER ----------
export function registerForm(req, res) {
  res.render('register', {
    title: 'Register',
    errors: null,
    oldData: { name: '', email: '' }
  });
}

export async function register(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('register', {
      title: 'Register',
      errors: errors.array(),
      oldData: req.body
    });
  }

  try {
    const { name, email, password } = req.body;

    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(400).render('register', {
        title: 'Register',
        errors: [{ msg: 'That email is already registered.' }],
        oldData: req.body
      });
    }

    // Password hashing (requisito del W05)
    const passwordHash = await bcrypt.hash(password, 10);
    await insertUser(name, email, passwordHash, 'user');

    req.session.message = {
      type: 'success',
      text: 'Account created. You can log in now.'
    };
    res.redirect('/login');
  } catch (error) {
    next(error);
  }
}

// ---------- LOGIN ----------
export function loginForm(req, res) {
  res.render('login', {
    title: 'Login',
    errors: null,
    oldData: { email: '' }
  });
}

export async function login(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('login', {
      title: 'Login',
      errors: errors.array(),
      oldData: req.body
    });
  }

  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);

    // Mensaje genérico: no revelamos si el email existe o no
    const invalid = [{ msg: 'Invalid email or password.' }];

    if (!user) {
      return res.status(400).render('login', {
        title: 'Login',
        errors: invalid,
        oldData: req.body
      });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).render('login', {
        title: 'Login',
        errors: invalid,
        oldData: req.body
      });
    }

    // Nunca guardamos el hash en la sesión
    req.session.user = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    req.session.message = { type: 'success', text: `Welcome back, ${user.name}!` };
    res.redirect('/dashboard');
  } catch (error) {
    next(error);
  }
}

// ---------- LOGOUT ----------
export function logout(req, res) {
  req.session.destroy(() => {
    res.redirect('/');
  });
}

// ---------- DASHBOARD (requireLogin) ----------
export async function dashboard(req, res, next) {
  try {
    const volunteeredProjects = await getVolunteeredProjectsByUser(req.session.user.user_id);
    res.render('dashboard', {
      title: 'Dashboard',
      volunteeredProjects: volunteeredProjects || []
    });
  } catch (error) {
    next(error);
  }
}

// ---------- USERS PAGE (requireRole('admin')) ----------
export async function usersList(req, res, next) {
  try {
    const users = await getAllUsers();
    res.render('users', { title: 'Registered Users', users: users || [] });
  } catch (error) {
    next(error);
  }
}
export { requireLogin, requireRole } from '../middleware/auth.js';