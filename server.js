// server.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import staticRoutes from './src/routes/static-routes.js';
import organizationRoutes from './src/routes/organizations-routes.js';
import projectRoutes from './src/routes/projects-routes.js';
import categoryRoutes from './src/routes/categories-routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Rutas (todas definidas en sus propios archivos de routes)
app.use('/', staticRoutes);
app.use('/', organizationRoutes);
app.use('/', projectRoutes);
app.use('/', categoryRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: 'Sorry, the page you are looking for does not exist.'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).render('error', {
    title: 'Server Error',
    message: err.message || 'Something went wrong.'
  });
});

app.listen(port, () => {
  console.log(`Servidor backend corriendo en el puerto ${port}`);
});