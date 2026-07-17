import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const isProduction = process.env.RENDER || process.env.NODE_ENV === 'production';

const db = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

// SCRIPT AUTOMÁTICO: Crea las tablas y mete los datos si no existen al arrancar el servidor
const initDb = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS public.organizations (
        organization_id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL UNIQUE
    );
    INSERT INTO public.organizations (name) VALUES 
    ('Organización Ecológica Alfa'), ('Fundación Educativa Beta'), ('Asociación Vecinal Gamma') ON CONFLICT DO NOTHING;

    CREATE TABLE IF NOT EXISTS public.service_projects (
        project_id SERIAL PRIMARY KEY,
        organization_id INT NOT NULL,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        location VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        CONSTRAINT fk_organization FOREIGN KEY (organization_id) REFERENCES public.organizations(organization_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS public.categories (
        category_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS public.project_categories (
        project_id INT NOT NULL,
        category_id INT NOT NULL,
        PRIMARY KEY (project_id, category_id),
        CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.service_projects(project_id) ON DELETE CASCADE,
        CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE CASCADE
    );

    INSERT INTO public.service_projects (organization_id, title, description, location, date) VALUES 
    (1, 'Limpieza de Parque Central', 'Recogida de residuos', 'Parque Central', '2026-03-15'),
    (1, 'Siembra de Árboles Urbano', 'Reforestación', 'Avenida Norte', '2026-03-20'),
    (1, 'Taller de Reciclaje', 'Educación ecológica', 'Centro Vecinal', '2026-03-25'),
    (1, 'Recogida de Plásticos', 'Limpieza de río', 'Ribera del Río', '2026-04-02'),
    (1, 'Mantenimiento de Jardines', 'Cuidado de áreas verdes', 'Plaza Sur', '2026-04-10'),
    (2, 'Clases de Apoyo Escolar', 'Matemáticas y lenguaje', 'Biblioteca Municipal', '2026-03-12'),
    (2, 'Donación de Libros', 'Organización de biblioteca', 'Escuela Primaria', '2026-03-18'),
    (2, 'Curso de Computación Básica', 'Uso de herramientas', 'Aula Digital', '2026-03-22'),
    (2, 'Taller de Lectura Infantil', 'Cuentacuentos', 'Parque Infantil', '2026-03-29'),
    (2, 'Mentorías para Jóvenes', 'Orientación vocacional', 'Centro Juvenil', '2026-04-05'),
    (3, 'Comedor Comunitario Domingo', 'Preparación de almuerzos', 'Parroquia', '2026-03-14'),
    (3, 'Colecta de Ropa de Invierno', 'Clasificación de prendas', 'Almacén Central', '2026-03-19'),
    (3, 'Entrega de Alimentos', 'Distribución de canastas', 'Barrio San José', '2026-03-24'),
    (3, 'Campaña de Salud Visual', 'Exámenes gratuitos', 'Clínica Comunal', '2026-03-30'),
    (3, 'Rehabilitación de Viviendas', 'Pintura y arreglos', 'Sector Oeste', '2026-04-08') ON CONFLICT DO NOTHING;

    INSERT INTO public.categories (name) VALUES 
    ('Medio Ambiente'), ('Educación'), ('Soporte Comunitario') ON CONFLICT DO NOTHING;

    INSERT INTO public.project_categories (project_id, category_id) VALUES 
    (1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 2), (7, 2), (8, 2), (9, 2), (10, 2), (11, 3), (12, 3), (13, 3), (14, 3), (15, 3) ON CONFLICT DO NOTHING;
  `;
  try {
    await db.query(sql);
    console.log("Base de datos verificada e inicializada correctamente.");
  } catch (err) {
    console.error("Error al inicializar las tablas de la base de datos:", err);
  }
};

initDb();

export default db;

