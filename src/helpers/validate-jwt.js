// helpers/validate-jwt.js
import jwt from 'jsonwebtoken';

export const validateJWT = (req, res, next) => {
    const token = req.header('Authorization'); // Obtener el token del header

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Usa tu clave secreta
        req.user = decoded; // Agregar la información del usuario al request
        next(); // Continuar si el token es válido
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};