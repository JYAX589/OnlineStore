import express from 'express';
import { register, login } from './auth.controller.js';
import { body } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields.js';

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', [
    body('username', 'El nombre de usuario es obligatorio').notEmpty(),
    body('email', 'El correo electrónico no es válido').isEmail(),
    body('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    validateFields
], register);

// Ruta para iniciar sesión
router.post('/login', [
    body('email', 'El correo electrónico no es válido').isEmail(),
    body('password', 'La contraseña es obligatoria').notEmpty(),
    validateFields
], login);

export default router;