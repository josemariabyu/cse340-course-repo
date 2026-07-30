import { getProjectById } from '../models/projects.js'; 
import { getCategoriesByProject } from '../models/categories.js'; 
import db from '../config/db-connect.js'; 

// 1. Mostrar la lista de los próximos 5 proyectos de servicio (/projects) 
export async function getAllProjects(req, res, next) { 
    try { 
        const query = ` 
            SELECT p.*, o.name as organization_name 
            FROM service_projects p 
            JOIN organizations o ON p.organization_id = o.organization_id 
            ORDER BY p.date DESC 
            LIMIT 5 
        `; 
        const result = await db.query(query); 
        const viewsProjects = result.rows.map(proj => ({ 
            project_id: proj.project_id, 
            name: proj.title, 
            date: proj.date, 
            organization_name: proj.organization_name 
        })); 
        res.render('projects', { title: 'Upcoming Service Projects', projects: viewsProjects }); 
    } catch (error) { 
        console.error("Error en getAllProjects controller: ", error); 
        next(error); 
    } 
} 

// 2. Mostrar la página de detalle de un proyecto específico (/project/:id) 
export async function getProjectDetails(req, res, next) { 
    try { 
        const projectId = req.params.id; 

        // 🛡️ ESCUDO DE SEGURIDAD: Si el ID NO es un número válido (ej. "new-project"), 
        // pasamos al siguiente manejador de rutas para que no rompa la base de datos relacional.
        if (isNaN(projectId) || isNaN(parseInt(projectId))) {
            return next(); 
        }
        const projectRows = await getProjectById(projectId); 
        const rawProject = projectRows && projectRows.length > 0 ? projectRows[0] : null; 

        if (!rawProject) { 
            const err = new Error('Service project not found'); 
            err.status = 404; 
            return next(err); 
        } 

        const project = { 
            title: rawProject.title, 
            description: rawProject.description, 
            location: rawProject.location, 
            organization_name: rawProject.organization_name 
        }; 

        const categories = await getCategoriesByProject(projectId); 
        res.render('project-detail', { title: project.title, project: project, categories: categories || [] }); 
    } catch (error) { 
        console.error("Error en getProjectDetails controller: ", error); 
        next(error); 
    } 
} 

// ========================================== 
// ➕ ---------- W04: CREATE ---------- 
// ========================================== 

// Mostrar el formulario para crear un nuevo proyecto 
export async function newProjectForm(req, res, next) { 
    try { 
        // Traemos las organizaciones para cargarlas en un <select> del formulario 
        const orgsResult = await db.query('SELECT organization_id, name FROM organizations ORDER BY name ASC'); 
        res.render('new-project', { 
            title: 'New Service Project', 
            errors: null, 
            organizations: orgsResult.rows, 
            oldData: { title: '', description: '', location: '', organization_id: '' } 
        }); 
    } catch (error) { 
        next(error); 
    } 
} 

// Procesar el envío del formulario de creación 
export async function createProject(req, res, next) { 
    const { title, description, location, organization_id } = req.body; 
    try { 
        // En caso de error de validación, volvemos a renderizar el formulario con las orgs 
        const orgsResult = await db.query('SELECT organization_id, name FROM organizations ORDER BY name ASC'); 
        
        // Si hay campos vacíos básicos (control rápido manual complementario) 
        if (!title || !description || !organization_id) { 
            return res.render('new-project', { 
                title: 'New Service Project', 
                errors: [{ msg: 'Title, description and organization are required.' }], 
                organizations: orgsResult.rows, 
                oldData: req.body 
            }); 
        } 

        const query = ` 
            INSERT INTO service_projects (title, description, location, organization_id, date) 
            VALUES ($1, $2, $3, $4, NOW()) 
            RETURNING * 
        `; 
        await db.query(query, [title, description, location || '', organization_id]); 
        res.redirect('/projects'); 
    } catch (error) { 
        next(error); 
    } 
} 

// ========================================== 
// ✏️ ---------- W04: EDIT ---------- 
// ========================================== 

// Mostrar el formulario para editar un proyecto existente 
export async function editProjectForm(req, res, next) { 
    const projectId = req.params.id; 
    try { 
        const projectResult = await db.query('SELECT * FROM service_projects WHERE project_id = $1', [projectId]); 
        const project = projectResult.rows && projectResult.rows.length > 0 ? projectResult.rows[0] : null; 

        if (!project) { 
            const err = new Error('Project not found'); 
            err.status = 404; 
            return next(err); 
        } 

        const orgsResult = await db.query('SELECT organization_id, name FROM organizations ORDER BY name ASC'); 
        res.render('edit-project', { 
            title: 'Edit Service Project', 
            errors: null, 
            project, 
            organizations: orgsResult.rows 
        }); 
    } catch (error) { 
        next(error); 
    } 
} 

// Procesar la actualización del proyecto 
export async function editProject(req, res, next) { 
    const projectId = req.params.id; 
    const { title, description, location, organization_id } = req.body; 
    try { 
        const query = ` 
            UPDATE service_projects 
            SET title = $1, description = $2, location = $3, organization_id = $4 
            WHERE project_id = $5 
        `; 
        await db.query(query, [title, description, location || '', organization_id, projectId]); 
        res.redirect('/projects'); 
    } catch (error) { 
        const orgsResult = await db.query('SELECT organization_id, name FROM organizations ORDER BY name ASC'); 
        res.render('edit-project', { 
            title: 'Edit Service Project', 
            errors: [{ msg: 'Failed to update project. Please verify inputs.' }], 
            project: { project_id: projectId, title, description, location, organization_id }, 
            organizations: orgsResult.rows 
        }); 
    } 
}
