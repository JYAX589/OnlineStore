import Invoice from './invoice.model.js';
import Product from '../product/product.model.js';
import Cart from '../cart/cart.model.js';

// Obtener todas las facturas de un usuario
export const getInvoicesByUser = async (req, res) => {
    try {
        const userId = req.usuario._id;
        const invoices = await Invoice.find({ user: userId }).populate('products.product');

        res.status(200).json({
            success: true,
            invoices
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener las facturas.',
            error: error.message
        });
    }
};

// Realizar una compra (crear una factura)
export const purchase = async (req, res) => {
    try {
        const userId = req.usuario._id;

        // Buscar el carrito del usuario
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({
                success: false,
                msg: 'El carrito está vacío.'
            });
        }

        // Calcular el total y verificar el stock de los productos
        let total = 0;
        for (const item of cart.products) {
            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    msg: `Stock insuficiente para el producto ${item.product.name}.`
                });
            }
            total += item.product.price * item.quantity;
        }

        // Crear la factura
        const invoice = new Invoice({
            user: userId,
            products: cart.products,
            status: 'PAID',
            total
        });
        await invoice.save();

        // Actualizar el stock y las ventas de los productos
        for (const item of cart.products) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity, sold: item.quantity }
            });
        }

        // Eliminar el carrito después de la compra
        await Cart.findByIdAndDelete(cart._id);

        res.status(200).json({
            success: true,
            msg: 'Compra realizada con éxito.',
            invoice
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al realizar la compra.',
            error: error.message
        });
    }
};

// Actualizar una factura existente
export const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { products, status } = req.body;

        // Buscar la factura por su ID
        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return res.status(404).json({
                success: false,
                msg: 'Factura no encontrada.'
            });
        }

        // Revertir el stock y las ventas de los productos de la factura original
        for (const item of invoice.products) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity, sold: -item.quantity }
            });
        }

        // Calcular el nuevo total y verificar el stock de los productos actualizados
        let total = 0;
        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    msg: `Stock insuficiente para el producto ${product.name}.`
                });
            }
            total += product.price * item.quantity;
        }

        // Actualizar el stock y las ventas de los productos nuevos
        for (const item of products) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity, sold: item.quantity }
            });
        }

        // Actualizar la factura con los nuevos datos
        invoice.products = products;
        invoice.total = total;
        invoice.status = status;
        await invoice.save();

        res.status(200).json({
            success: true,
            msg: 'Factura actualizada con éxito.',
            invoice
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar la factura.',
            error: error.message
        });
    }
};