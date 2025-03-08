import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductsByCategory, updateProductStock } from './product.controller.js';
import { validateJWT } from '../helpers/validate-jwt.js';
import { checkRole } from '../middlewares/role.js';

const router = express.Router();

// Crear un nuevo producto (solo administradores)
router.post('/', validateJWT, checkRole(['admin']), createProduct);

// Obtener todos los productos
router.get('/', getAllProducts);

// Obtener un producto por ID
router.get('/:id', getProductById);

// Actualizar un producto (solo administradores)
router.put('/:id', validateJWT, checkRole(['admin']), updateProduct);

// Eliminar un producto (solo administradores)
router.delete('/:id', validateJWT, checkRole(['admin']), deleteProduct);

// Obtener productos por categoría
router.get('/category/:categoryId', getProductsByCategory);

// Actualizar el stock de un producto (solo administradores)
router.put('/:id/stock', validateJWT, checkRole(['admin']), updateProductStock);

export default router;