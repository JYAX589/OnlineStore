import express from 'express';
import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } from './category.controller.js';
import { validateJWT } from '../helpers/validate-jwt.js';
import { checkRole } from '../middlewares/role.js';

const router = express.Router();

// Crear una nueva categoría (solo administradores)
router.post('/', validateJWT, checkRole(['admin']), createCategory);

// Obtener todas las categorías
router.get('/', getAllCategories);

// Obtener una categoría por ID
router.get('/:id', getCategoryById);

// Actualizar una categoría (solo administradores)
router.put('/:id', validateJWT, checkRole(['admin']), updateCategory);

// Eliminar una categoría (solo administradores)
router.delete('/:id', validateJWT, checkRole(['admin']), deleteCategory);

export default router;