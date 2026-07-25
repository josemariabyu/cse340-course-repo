// 1. Mostrar la lista general de categorías o organizaciones (/categories)
export async function getCategoriesList(req, res, next) {
    try {
        const categoriesMock = [
            { category_id: 1, name: "Environment", description: "Projects focusing on nature and cleanup." },
            { category_id: 2, name: "Food Assistance", description: "Food drives and distribution centers." },
            { category_id: 3, name: "Education", description: "Tutoring and mentoring programs." }
        ];

        res.render('categories', {
            title: 'Categories & Organizations',
            categories: categoriesMock
        });
    } catch (error) {
        console.error("Error en getCategoriesList controller: ", error);
        next(error);
    }
}

// 2. Mostrar el detalle de una categoría específica (/category/:id)
export async function getCategoryDetails(req, res, next) {
    try {
        const categoryId = req.params.id;
        
        // Simulación de objeto recuperado por id
        const categoryMock = {
            category_id: categoryId,
            name: "Selected Organization Category",
            description: "Detailed description of the services provided by this entity."
        };

        res.render('category-detail', {
            title: 'Category Details',
            category: categoryMock
        });
    } catch (error) {
        console.error("Error en getCategoryDetails controller: ", error);
        next(error);
    }
}
