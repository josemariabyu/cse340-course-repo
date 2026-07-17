import { getProjectById } from '../models/projects.js';
import { getCategoriesByProject } from '../models/categories.js';

// Controlador para la página de detalle de un proyecto (/project/[id])
export async function getProjectDetails(req, res, next) {
  try {
    const projectId = req.params.id;

 // 1. Buscamos los detalles del proyecto en la base de datos (y extraemos el primer resultado)
    const projectRows = await getProjectById(projectId);
    const project = projectRows[0];

    // Si el proyecto no existe, disparamos un error 404
    if (!project) {
      const err = new Error('Proyecto no encontrado');
      err.status = 404;
      return next(err);
    }

    // 2. Traemos las categorías vinculadas a este proyecto para armar los tags
    const categories = await getCategoriesByProject(projectId);

    // 3. Renderizamos la vista enviándole el proyecto y sus categorías
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

