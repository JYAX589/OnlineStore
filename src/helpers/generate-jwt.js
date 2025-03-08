import jwt from 'jsonwebtoken';

export const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Asegurar que la variable está bien cargada
            {
                expiresIn: '4h'
            },
            (err, token) => {
                if (err) {
                    console.log('Error al generar el JWT:', err);
                    reject('No se pudo generar el token');
                } else {
                    resolve(token);
                }
            }
        );
    });
};

console.log('JWT_SECRET:', process.env.JWT_SECRET);
