import { Router } from 'express';
import { check } from 'express-validator';
import { addProduct, getProducts, searchProduct, getOutOfStockProducts,getBestSellingProducts, searchProductsByName, deleteProduct} from './product.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { tieneRole } from '../middlewares/role-validator.js';

const router = Router();

const validarAdmin = [validarJWT, tieneRole('Admin')];
const validarAdminCliente = [validarJWT, tieneRole('Admin', 'Client')];

router.post('/', [validarJWT, check('category', 'No es una categoría válida.').isMongoId(), validarCampos, ...validarAdmin], addProduct);
router.get('/', validarAdmin, getProducts);
router.get('/agotados', validarAdmin, getOutOfStockProducts);
router.get('/ventas', validarAdmin, getBestSellingProducts);
router.get('/nombre', validarAdminCliente, searchProductsByName);
router.get('/:id', validarAdmin, searchProduct);
router.delete('/:id', validarAdmin, deleteProduct);

export default router;
