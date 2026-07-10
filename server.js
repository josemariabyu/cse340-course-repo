// 1. Importar módulos usando sintaxis ESM (requisito del curso)
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg'; // Importamos la librería de PostgreSQL directamente

// Configurar variables de entorno desde el archivo .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configurar la conexión directa a la base de datos usando tu archivo .env
const { Pool } = pg;
const db = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
});

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

// Ruta para Categorías (Tarea Individual) - Conexión Real a Base de Datos
app.get('/categories', async (req, res) => {
    try {
        const query = 'SELECT * FROM categories ORDER BY name ASC';
        const result = await db.query(query);
        res.render('categories', { title: 'Service Project Categories', categories: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar categorías");
    }
});

// 5. Iniciar el servidor local
app.listen(port, () => {
    console.log(`Servidor backend corriendo localmente en http://localhost:${port}`);
});
