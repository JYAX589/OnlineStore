import express from 'express';
import { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder, getOrdersByUser } from './order.controller.js';
import { validateJWT } from '../helpers/validate-jwt.js';
import { checkRole } from '../middlewares/role.js';

const router = express.Router();

// Crear una nueva orden
router.post('/', validateJWT, createOrder);

// Obtener todas las órdenes (solo administradores)
router.get('/', validateJWT, checkRole(['admin']), getAllOrders);
// Obtener una orden por ID
router.get('/:id', validateJWT, getOrderById);

// Actualizar una orden
router.put('/:id', validateJWT, updateOrder);

// Eliminar una orden
router.delete('/:id', validateJWT, deleteOrder);

// Obtener órdenes por usuario
router.get('/user/:userId', validateJWT, getOrdersByUser);

export default router;