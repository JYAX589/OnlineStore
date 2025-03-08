import { Router } from 'express';
import { check } from 'express-validator';
import { getUsers, getUserById, updateUser, deleteUser } from './user.controller.js';
import { existeUsuarioById } from '../helpers/db-validator.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

const validarId = [
    check('id', 'No es un id válido.').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampos
];

router.get('/', getUsers);
router.get('/findUser/:id', validarId, getUserById);
router.put('/:id', [validarJWT, ...validarId], updateUser);
router.delete('/:id', [validarJWT, ...validarId], deleteUser);

export default router;
