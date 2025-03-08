// middlewares/role.js
export const checkRole = (roles) => {
  return (req, res, next) => {
      const userRole = req.user.role; // Asume que el rol del usuario está en req.user

      if (!roles.includes(userRole)) {
          return res.status(403).json({ message: 'Acceso denegado. No tienes permisos suficientes.' });
      }

      next(); // Continuar si el rol es válido
  };
};