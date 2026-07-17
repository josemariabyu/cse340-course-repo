import { getCategoryById, getProjectsByCategory, getAllCategories } from '../models/categories.js';

// Controlador para la página de detalle de una categoría (/category/[id])
export async function getCategoryDetails(req, res, next) {
  try {
    const categoryId = req.params.id;
    
    // Llamamos al modelo para obtener los datos de la base de datos
    const categoryRows = await getCategoryById(categoryId);
    const projects = await getProjectsByCategory(categoryId);

    // Si la categoría no existe, pasamos un error 404 al manejador de errores
    if (!categoryRows || categoryRows.length === 0) {
      const err = new Error('Categoría no encontrada');
      err.status = 404;
      return next(err);
    }

    const category = categoryRows[0];

    // Renderizamos la vista pasándole los datos necesarios
    res.render('category-detail', {
      title: category.name,
      category: category,
      projects: projects
    });
  } catch (error) {
    console.error("Error en getCategoryDetails controller: ", error);
    next(error); // Pasa el error al manejador 500
  }
}
// Nuevo controlador para la lista general de categorías (/categories)
export async function getCategoriesList(req, res, next) {
  try {
    const categories = await getAllCategories();
    res.render('categories', {
      title: 'Categorías de Proyectos',
      categories: categories
    });
  } catch (error) {
    console.error("Error en getCategoriesList controller: ", error);
    next(error);
  }
}
