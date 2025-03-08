import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config'; // Importa dotenv de esta forma en ES Modules
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import authRoutes from '../src/auth/auth.routes.js';
import invoiceRoutes from '../src/invoice/invoice.routes.js';
import categoryRoutes from '../src/category/category.routes.js';
import productRoutes from '../src/product/product.routes.js';
import userRoutes from '../src/user/user.routes.js';
import cartRoutes from '../src/cart/cart.routes.js';


const configureMiddlewares = (app) => {
    app.use(express.urlencoded({ extended: false })); // Parsear datos de formularios
    app.use(express.json()); // Parsear JSON en las solicitudes
    app.use(cors());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
};

const configureRoutes = (app) => {
    app.use('/tienda/v1/auth', authRoutes); // Rutas de autenticación
    app.use('/tienda/v1/users', userRoutes); // Rutas de usuarios
    app.use('/tienda/v1/categories', categoryRoutes); // Rutas de categorías
    app.use('/tienda/v1/products', productRoutes); // Rutas de productos
    app.use('/tienda/v1/carts', cartRoutes); // Rutas de carritos
    app.use('/tienda/v1/invoices', invoiceRoutes); // Rutas de facturas
};

const connectToDatabase = async () => {
    try {
        await dbConnection(); // Establecer conexión con MongoDB
        console.log('Conexión exitosa con la base de datos.');
    } catch (error) {
        console.log('Error al conectar con la base de datos:', error);
    }
};

export const initServer = () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        configureMiddlewares(app); 
        connectToDatabase(); 
        configureRoutes(app); 
        app.listen(port); 
        console.log(`Servidor corriendo en el puerto ${port}`);
    } catch (err) {
        console.log(`Error al iniciar el servidor: ${err}`);
    }
};