import express from 'express';
import { getCartByUser, addProductToCart, updateProductQuantity, removeProductFromCart, clearCart } from './cart.controller.js';
import { validateJWT } from '../helpers/validate-jwt.js';

const router = express.Router();

// Obtener el carrito de un usuario
router.get('/:userId', validateJWT, getCartByUser);

// Agregar un producto al carrito
router.post('/add', validateJWT, addProductToCart);

// Actualizar la cantidad de un producto en el carrito
router.put('/update', validateJWT, updateProductQuantity);

// Eliminar un producto del carrito
router.delete('/remove', validateJWT, removeProductFromCart);

// Vaciar el carrito
router.delete('/clear', validateJWT, clearCart);

export default router;