import { Router } from 'express';
import { check } from 'express-validator';
import { addCategory, updateCategory, getCategories,getProductsByCategory, deleteCategory } from './category.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { tieneRole } from '../middlewares/role-validator.js';

const router = Router();

const validarAdmin = [validarJWT, tieneRole('Admin')];
const validarAdminCliente = [validarJWT, tieneRole('Admin', 'Client')];
const validarNombre = [check('name', 'El nombre es obligatorio.').not().isEmpty(), validarCampos];

router.post('/', [...validarAdmin, ...validarNombre], addCategory);
router.get('/', getCategories);
router.get('/products/:id', validarAdminCliente, getProductsByCategory);
router.put('/:id', [...validarAdmin, ...validarNombre], updateCategory);
router.delete('/:id', validarAdmin, deleteCategory);

export default router;
