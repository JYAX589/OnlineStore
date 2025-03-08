import Category from './category.model.js';

// Crear una nueva categoría
export const createCategory = async (req, res) => {
    const { name } = req.body;

    try {
        // Verificar si la categoría ya existe
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'La categoría ya existe.' });
        }

        // Crear la nueva categoría
        const newCategory = new Category({ name });

        // Guardar la categoría en la base de datos
        await newCategory.save();

        // Responder con la categoría creada
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la categoría', error: error.message });
    }
};

// Obtener todas las categorías
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las categorías', error: error.message });
    }
};

// Obtener una categoría por ID
export const getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada.' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la categoría', error: error.message });
    }
};

// Actualizar una categoría
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        // Verificar si la categoría existe
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada.' });
        }

        // Verificar si el nuevo nombre ya existe
        const existingCategory = await Category.findOne({ name });
        if (existingCategory && existingCategory._id.toString() !== id) {
            return res.status(400).json({ message: 'El nombre de la categoría ya está en uso.' });
        }

        // Actualizar el nombre de la categoría
        category.name = name;

        // Guardar los cambios
        const updatedCategory = await category.save();

        // Responder con la categoría actualizada
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la categoría', error: error.message });
    }
};

// Eliminar una categoría
export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada.' });
        }

        // Eliminar la categoría
        await category.remove();
        res.status(200).json({ message: 'Categoría eliminada correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la categoría', error: error.message });
    }
};