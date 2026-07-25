import { getProjectById } from '../models/projects.js'; 
import { getCategoriesByProject } from '../models/categories.js'; 

// 1. Mostrar la lista de todos los proyectos de servicio (/projects)
export async function getAllProjects(req, res, next) {
    try {
        // Datos de prueba estáticos estables para asegurar que Render no falle
        const projectsMock = [
            { project_id: 1, name: "Community Garden Cleanup", date: "2026-03-15", organization_name: "Green Earth Eco" },
            { project_id: 2, name: "Food Drive Distribution", date: "2026-03-10", organization_name: "Helping Hands" },
            { project_id: 3, name: "A neat service project", date: "2026-03-01", organization_name: "A great organization" }
        ];
        
        res.render('projects', { 
            title: 'Service Projects', 
            projects: projectsMock 
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
        const project = projectRows ? projectRows[0] : null; 

        if (!project) { 
            const err = new Error('Proyecto no encontrado'); 
            err.status = 404; 
            return next(err); 
        } 

        const categories = await getCategoriesByProject(projectId); 

        res.render('project-detail', { 
            title: project.title || "Project Detail", 
            project: project, 
            categories: categories || [] 
        }); 
    } catch (error) { 
        console.error("Error en getProjectDetails controller: ", error); 
        next(error); 
    } 
}

