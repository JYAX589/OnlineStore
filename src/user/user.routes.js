import express from 'express';
import { getUserProfile, updateUserProfile, deleteUser, getAllUsers } from './user.controller.js';
import { validateJWT } from '../helpers/validate-jwt.js';
import { checkRole } from '../middlewares/role.js';

const router = express.Router();

// Obtener perfil del usuario
router.get('/profile', validateJWT, getUserProfile);

// Actualizar perfil del usuario
router.put('/profile', validateJWT, updateUserProfile);

// Eliminar cuenta de usuario
router.delete('/profile', validateJWT, deleteUser);

// Obtener todos los usuarios (solo administradores)
router.get('/', validateJWT, checkRole(['admin']), getAllUsers);

export default router;