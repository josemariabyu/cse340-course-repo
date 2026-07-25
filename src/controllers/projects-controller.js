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

        res.render('projects', { 
            title: 'Upcoming Service Projects', 
            projects: viewsProjects 
        });
    } catch (error) {
        console.error("Error en getAllProjects controller: ", error);
        next(error);
    }
}

// 2. Mostrar la página de detalle de un proyecto específico (/project/:id)
export async function getProjectDetails(req, res, next) { 
    try { 
        const projectId = req.params.id; 
        const projectRows = await getProjectById(projectId); 
        
        // CORRECCIÓN CRÍTICA: Extraemos la primera fila [0]
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

        res.render('project-detail', { 
            title: project.title, 
            project: project, 
            categories: categories || [] 
        }); 
    } catch (error) { 
        console.error("Error en getProjectDetails controller: ", error); 
        next(error); 
    } 
}

           
