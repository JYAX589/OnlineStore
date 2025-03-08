// helpers/generate-token.js
import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '1h' // El token expira en 1 hora
    });
};