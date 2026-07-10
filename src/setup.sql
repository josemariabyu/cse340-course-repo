-- =======================================================
-- 1. CREAR TABLA DE ORGANIZACIONES 
-- =======================================================
CREATE TABLE IF NOT EXISTS organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);

-- Insertar 3 organizaciones de prueba para que tengan IDs 1, 2 y 3
INSERT INTO organizations (name) VALUES 
('Organización Ecológica Alfa'), 
('Fundación Educativa Beta'), 
('Asociación Vecinal Gamma')
ON CONFLICT DO NOTHING;

-- =======================================================
-- 2. TABLA DE PROYECTOS (Actividad en Equipo)
-- =======================================================
CREATE TABLE IF NOT EXISTS service_projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_organization FOREIGN KEY (organization_id) 
        REFERENCES organizations(organization_id) ON DELETE CASCADE
);

-- =======================================================
-- 3. TABLA DE CATEGORÍAS (Tarea Individual)
-- =======================================================
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- =======================================================
-- 4. TABLA INTERMEDIA (Relación Muchos a Muchos)
-- =======================================================
CREATE TABLE IF NOT EXISTS project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES service_projects(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- =======================================================
-- 5. INSERTAR DATOS DE PRUEBA RESTANTES
-- =======================================================

-- Insertar 5 proyectos por cada organización
INSERT INTO service_projects (organization_id, title, description, location, date) VALUES
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
(3, 'Rehabilitación de Viviendas', 'Pintura y arreglos', 'Sector Oeste', '2026-04-08')
ON CONFLICT DO NOTHING;

-- Insertar las 3 categorías requeridas
INSERT INTO categories (name) VALUES 
('Medio Ambiente'), 
('Educación'), 
('Soporte Comunitario')
ON CONFLICT DO NOTHING;

-- Asociar cada proyecto con al menos una categoría
INSERT INTO project_categories (project_id, category_id) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1),
(6, 2), (7, 2), (8, 2), (9, 2), (10, 2),
(11, 3), (12, 3), (13, 3), (14, 3), (15, 3)
ON CONFLICT DO NOTHING;
