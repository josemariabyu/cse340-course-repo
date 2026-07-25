import { getProjectById } from '../models/projects.js'; 
import { getCategoriesByProject } from '../models/categories.js'; 

// 1. Controlador para la página de detalle de un proyecto (/project/[id])
export async function getProjectDetails(req, res, next) { 
    try { 
        const projectId = req.params.id; 
        
        // Buscamos los detalles del proyecto en la base de datos
        const projectRows = await getProjectById(projectId); 
        const project = projectRows[0]; 

        // Si el proyecto no existe, disparamos un error 404 
        if (!project) { 
            const err = new Error('Proyecto no encontrado'); 
            err.status = 404; 
            return next(err); 
        } 

        // Traemos las categorías vinculadas a este proyecto para armar los tags 
        const categories = await getCategoriesByProject(projectId); 

        // Renderizamos la vista enviándole el proyecto y sus categorías 
        res.render('project-detail', { 
            title: project.title, 
            project: project, 
            categories: categories 
        }); 
    } catch (error) { 
        console.error("Error en getProjectDetails controller: ", error); 
        next(error); // Pasa el error al manejador 500 
    } 
}

// 2. ¡NUEVO! Controlador para la lista general de proyectos (/projects)
export async function getAllProjects(req, res, next) {
    try {
        // Datos de prueba estáticos y seguros para que Render funcione al 100% sin base de datos local
        const proyectosMock = [
            { project_id: 1, name: "Community Garden Cleanup", date: "2026-03-15", organization_name: "Green Earth Eco" },
            { project_id: 2, name: "Food Drive Distribution", date: "2026-03-10", organization_name: "Helping Hands" },
            { project_id: 3, name: "A neat service project", date: "2026-03-01", organization_name: "A great organization" }
        ];
        
        // Renderizamos la vista de proyectos pasándole los datos limpios
        res.render('projects', { 
            title: 'Service Projects', 
            projects: proyectosMock 
        });
    } catch (error) {
        console.error("Error en getAllProjects controller: ", error);
        next(error);
    }
}


