import Order from './order.model.js';
import User from '../user/user.model.js';
import Product from '../product/product.model.js';

// Crear una nueva orden
export const createOrder = async (req, res) => {
    const { userId, products } = req.body;

    try {
        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Verificar y calcular el total de la orden
        let total = 0;
        const orderProducts = [];

        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Producto con ID ${item.productId} no encontrado.` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Stock insuficiente para el producto ${product.name}.` });
            }

            total += product.price * item.quantity;
            orderProducts.push({ product: item.productId, quantity: item.quantity });

            // Actualizar el stock del producto
            product.stock -= item.quantity;
            product.soldOut = product.stock === 0;
            await product.save();
        }

        // Crear la nueva orden
        const newOrder = new Order({
            user: userId,
            products: orderProducts,
            total,
            date: new Date()
        });

        // Guardar la orden en la base de datos
        await newOrder.save();

        // Responder con la orden creada
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la orden', error: error.message });
    }
};

// Obtener todas las órdenes
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'username').populate('products.product', 'name price');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las órdenes', error: error.message });
    }
};

// Obtener una orden por ID
export const getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id).populate('user', 'username').populate('products.product', 'name price');
        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada.' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la orden', error: error.message });
    }
};

// Actualizar una orden
export const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { products } = req.body;

    try {
        // Verificar si la orden existe
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada.' });
        }

        // Verificar y calcular el nuevo total de la orden
        let total = 0;
        const updatedProducts = [];

        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Producto con ID ${item.productId} no encontrado.` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Stock insuficiente para el producto ${product.name}.` });
            }

            total += product.price * item.quantity;
            updatedProducts.push({ product: item.productId, quantity: item.quantity });

            // Actualizar el stock del producto
            product.stock -= item.quantity;
            product.soldOut = product.stock === 0;
            await product.save();
        }

        // Actualizar la orden
        order.products = updatedProducts;
        order.total = total;
        order.date = new Date();

        // Guardar los cambios
        const updatedOrder = await order.save();

        // Responder con la orden actualizada
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la orden', error: error.message });
    }
};

// Eliminar una orden
export const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada.' });
        }

        // Eliminar la orden
        await order.remove();
        res.status(200).json({ message: 'Orden eliminada correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la orden', error: error.message });
    }
};

// Obtener órdenes por usuario
export const getOrdersByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await Order.find({ user: userId }).populate('products.product', 'name price');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las órdenes del usuario', error: error.message });
    }
};