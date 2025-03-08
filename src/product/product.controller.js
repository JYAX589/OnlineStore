import Product from './product.model.js';
import Category from '../category/category.model.js';

// Crear un nuevo producto
export const createProduct = async (req, res) => {
    const { name, price, category, stock } = req.body;

    try {
        // Verificar si la categoría existe
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            return res.status(404).json({ message: 'Categoría no encontrada.' });
        }

        // Crear el nuevo producto
        const newProduct = new Product({
            name,
            price,
            category,
            stock,
            soldOut: stock === 0 // Marcar como agotado si el stock es 0
        });

        // Guardar el producto en la base de datos
        await newProduct.save();

        // Responder con el producto creado
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto', error: error.message });
    }
};

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate('category', 'name');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
    }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
    }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, category, stock } = req.body;

    try {
        // Verificar si el producto existe
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        // Verificar si la categoría existe
        if (category) {
            const existingCategory = await Category.findById(category);
            if (!existingCategory) {
                return res.status(404).json({ message: 'Categoría no encontrada.' });
            }
        }

        // Actualizar los campos del producto
        product.name = name || product.name;
        product.price = price || product.price;
        product.category = category || product.category;
        product.stock = stock || product.stock;
        product.soldOut = stock === 0; // Actualizar el estado de agotado

        // Guardar los cambios
        const updatedProduct = await product.save();

        // Responder con el producto actualizado
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
    }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        // Eliminar el producto
        await product.remove();
        res.status(200).json({ message: 'Producto eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
    }
};

// Obtener productos por categoría
export const getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const products = await Product.find({ category: categoryId }).populate('category', 'name');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos por categoría', error: error.message });
    }
};

// Actualizar el stock de un producto
export const updateProductStock = async (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        // Actualizar el stock y el estado de agotado
        product.stock = stock;
        product.soldOut = stock === 0;

        // Guardar los cambios
        const updatedProduct = await product.save();

        // Responder con el producto actualizado
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el stock del producto', error: error.message });
    }
};