export const tieneRole = (...roles) => {
    return (req, res, next) => {
        // Verifico si el usuario está autenticado
        if (!req.usuario) {
            return res.status(500).json({
                success: false,
                msg: 'Error: Se intentó verificar un rol sin validar el token primero.'
            });
        }

        // Verifico si el rol del usuario está incluido en los roles permitidos
        if (!roles.includes(req.usuario.role)) {
            return res.status(403).json({
                success: false,
                msg: `Acceso denegado. Tu rol es "${req.usuario.role}". Los roles permitidos son: ${roles.join(', ')}.`
            });
        }
        
        next();
    };
};