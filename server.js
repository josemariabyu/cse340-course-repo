// 1. Importar módulos usando sintaxis ESM (requisito del curso)
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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
// 4. RUTAS DE LA APLICACIÓN (Usa variables camelCase para los títulos)
// ==========================================

// Ruta para la página de Inicio (Home)
app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

// Ruta para Organizaciones
app.get('/organizations', (req, res) => {
    res.render('organizations', { title: 'Organizations' });
});

// Ruta para Proyectos de Servicio
app.get('/projects', (req, res) => {
    res.render('projects', { title: 'Service Projects' });
});

// NUEVA RUTA: Categorías (Requisito de la entrega W01)
app.get('/categories', (req, res) => {
    res.render('categories', { title: 'Service Project Categories' });
});

// 5. Iniciar el servidor local
app.listen(port, () => {
    console.log(`Servidor backend corriendo localmente en http://localhost:${port}`);
});
