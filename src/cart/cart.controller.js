import Cart from './cart.model.js';
import User from '../user/user.model.js';
import Product from '../product/product.model.js';

// Obtener el carrito de un usuario
export const getCartByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Obtener el carrito del usuario
        const cart = await Cart.findOne({ user: userId }).populate('products.product', 'name price');
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado.' });
        }

        // Responder con el carrito
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
    }
};

// Agregar un producto al carrito
export const addProductToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Verificar si el producto existe
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        // Verificar si hay suficiente stock
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Stock insuficiente para este producto.' });
        }

        // Buscar el carrito del usuario
        let cart = await Cart.findOne({ user: userId });

        // Si el carrito no existe, crearlo
        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }

        // Verificar si el producto ya está en el carrito
        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

        if (productIndex !== -1) {
            // Si el producto ya está en el carrito, actualizar la cantidad
            cart.products[productIndex].quantity += quantity;
        } else {
            // Si el producto no está en el carrito, agregarlo
            cart.products.push({ product: productId, quantity });
        }

        // Guardar los cambios en el carrito
        await cart.save();

        // Responder con el carrito actualizado
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el producto al carrito', error: error.message });
    }
};

// Actualizar la cantidad de un producto en el carrito
export const updateProductQuantity = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Verificar si el producto existe
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        // Verificar si hay suficiente stock
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Stock insuficiente para este producto.' });
        }

        // Buscar el carrito del usuario
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado.' });
        }

        // Verificar si el producto está en el carrito
        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito.' });
        }

        // Actualizar la cantidad del producto
        cart.products[productIndex].quantity = quantity;

        // Guardar los cambios en el carrito
        await cart.save();

        // Responder con el carrito actualizado
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la cantidad del producto', error: error.message });
    }
};

// Eliminar un producto del carrito
export const removeProductFromCart = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Buscar el carrito del usuario
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado.' });
        }

        // Verificar si el producto está en el carrito
        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito.' });
        }

        // Eliminar el producto del carrito
        cart.products.splice(productIndex, 1);

        // Guardar los cambios en el carrito
        await cart.save();

        // Responder con el carrito actualizado
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto del carrito', error: error.message });
    }
};

// Vaciar el carrito
export const clearCart = async (req, res) => {
    const { userId } = req.body;

    try {
        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Buscar el carrito del usuario
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado.' });
        }

        // Vaciar el carrito
        cart.products = [];

        // Guardar los cambios en el carrito
        await cart.save();

        // Responder con el carrito vacío
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al vaciar el carrito', error: error.message });
    }
};