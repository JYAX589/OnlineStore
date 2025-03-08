import rateLimit from 'express-rate-limit';

// Configuración del límite de tasa
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, 
    message: {
        success: false,
        msg: 'Has excedido el límite de solicitudes. Por favor, intenta de nuevo en 15 minutos.'
    }
});

export default limiter;