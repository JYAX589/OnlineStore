import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import authRoutes from '../src/auth/auth.routes.js'; // Ruta corregida
import cartRoutes from '../src/cart/cart.routes.js'; // Ruta corregida
import categoryRoutes from '../src/category/category.routes.js'; // Ruta corregida
import orderRoutes from '../src/order/order.routes.js'; // Ruta corregida
import productRoutes from '../src/product/product.routes.js'; // Ruta corregida
import userRoutes from '../src/user/user.routes.js'; // Ruta corregida

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
};

const routes = (app) => {
    // Prefijo para todas las rutas: /onlineSale/v1
    const router = express.Router();

    // Middleware para el prefijo /onlineSale/v1
    app.use('/onlineSale/v1', router);

    // Rutas de autenticación
    router.use('/auth', authRoutes);

    // Rutas del carrito
    router.use('/cart', cartRoutes);

    // Rutas de categorías
    router.use('/categories', categoryRoutes);

    // Rutas de órdenes
    router.use('/orders', orderRoutes);

    // Rutas de productos
    router.use('/products', productRoutes);

    // Rutas de usuarios
    router.use('/users', userRoutes);

    // Ruta de prueba para verificar que el servidor está funcionando
    router.get('/', (req, res) => {
        res.json({ message: 'Bienvenido a la API de OnlineSale v1' });
    });
};

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log("Conexión a la base de datos exitosa");
    } catch (error) {
        console.error('Error conectando a la base de datos', error);
        process.exit(1);
    }
};

export const iniciarServidor = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        await conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port: ${port}`);
    } catch (err) {
        console.log(`Server init failed: ${err}`);
    }
};