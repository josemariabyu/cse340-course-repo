// 1. Importaciones de módulos y rutas (requisito del curso)
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import categoryRoutes from './src/routes/categories-routes.js';
import projectRoutes from './src/routes/projects-routes.js';

// Configurar variables de entorno desde el archivo .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configurar rutas para archivos estáticos (para que funcionen ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Middleware para servir archivos estáticos (CSS e imágenes desde /public)
app.use(express.static(path.join(__dirname, 'public')));

// 3. Configurar EJS como el motor de plantillas de la aplicación
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ==========================================
// 4. RUTAS DE LA APLICACIÓN
// ==========================================

// Ruta para la página de Inicio (Home)
app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

// Ruta para Organizaciones
app.get('/organizations', (req, res) => {
  res.render('organizations', { title: 'Organizations' });
});

// Ruta para Proyectos (Actividad en Equipo) - Conexión Real a Base de Datos
// Nota: En la próxima semana podrías mover esto a un controlador para MVC estricto, por ahora lo dejamos limpio.
import db from './src/config/db-connect.js'; 
app.get('/projects', async (req, res) => {
  try {
    const query = `
      SELECT p.*, o.name as organization_name 
      FROM service_projects p 
      JOIN organizations o ON p.organization_id = o.organization_id 
      ORDER BY p.date DESC
    `;
    const result = await db.query(query);
    res.render('projects', { title: 'Service Projects', projects: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar proyectos");
  }
});

// MONTAJE DE NUESTRAS NUEVAS RUTAS (¡Ahora arriba del app.listen!)
app.use('/categories', categoryRoutes);
app.use('/category', categoryRoutes); // Acepta singular por si las moscas
app.use('/project', projectRoutes);

// ==========================================
// 5. INICIAR EL SERVIDOR LOCAL (Siempre al final)
// ==========================================
app.listen(port, () => {
  console.log(`Servidor backend corriendo localmente en http://localhost:${port}`);
});
