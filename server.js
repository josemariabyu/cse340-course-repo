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

// 3. Configurar EJS como el motor de plantillas de la aplicación (¡Ruta dentro de src!)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));


// ==========================================
// 4. RUTAS DE LA APLICACIÓN (Bajo patrón MVC)
// ==========================================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 1º Las rutas fijas de proyectos van primero
app.use('/projects', projectRoutes);

// 2º Las rutas de categorías van después
app.use('/', categoryRoutes);

// ==========================================
// 5. INICIAR EL SERVIDOR LOCAL
// ==========================================
app.listen(port, () => {
  console.log(`Servidor backend corriendo en el puerto ${port}`);
});

