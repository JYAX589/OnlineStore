import Category from './category.model.js';
import Product from '../product/product.model.js';

// Crear una categoría por defecto (si no existe)
export const defaultCategory = async () => {
    try {
        const defaultCategory = {
            name: 'General',
            status: true
        };

        const categoryExists = await Category.findOne({ name: defaultCategory.name });

        if (categoryExists) {
            return console.log('La categoría por defecto ya existe.');
        }

        const category = new Category(defaultCategory);
        await category.save();

        console.log('Categoría por defecto creada con éxito.');
    } catch (error) {
        console.log('Error al crear la categoría por defecto.', error.message);
    }
};

// Agregar una nueva categoría
export const addCategory = async (req, res) => {
    try {
        const data = req.body;

        const category = new Category({
            name: data.name,
            status: data.status
        });

        await category.save();

        res.status(200).json({
            success: true,
            msg: 'Categoría agregada exitosamente.',
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al agregar la categoría.',
            error: error.message
        });
    }
};

// Obtener todas las categorías activas
export const getCategories = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, categories] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener las categorías.',
            error: error.message
        });
    }
};

// Obtener productos por categoría
export const getProductsByCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const query = { status: true, category: id };

        const products = await Product.find(query);

        const productsWithCategories = await Promise.all(products.map(async (product) => {
            const productCategory = await Category.findById(product.category);
            return {
                ...product.toObject(),
                category: productCategory ? productCategory.name : 'Categoría no encontrada.'
            };
        }));

        res.status(200).json({
            success: true,
            products: productsWithCategories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al filtrar productos por categoría.',
            error: error.message
        });
    }
};

// Actualizar una categoría existente
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, ...data } = req.body;

        const category = await Category.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Categoría actualizada exitosamente.',
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar la categoría.',
            error: error.message
        });
    }
};

// Eliminar una categoría (cambiar su estado a false y mover productos a la categoría por defecto)
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const defaultCategory = await Category.findOne({ name: 'General' }); // Buscar la categoría por defecto

        if (!defaultCategory) {
            return res.status(404).json({
                success: false,
                msg: 'No se encontró la categoría por defecto.'
            });
        }

        // Mover productos de la categoría eliminada a la categoría por defecto
        await Product.updateMany({ category: id }, { category: defaultCategory._id });

        // Desactivar la categoría
        const category = await Category.findByIdAndUpdate(id, { status: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Categoría eliminada exitosamente.',
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al eliminar la categoría.',
            error: error.message
        });
    }
};