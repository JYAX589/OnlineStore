import User from "../user/user.model.js";
import { generarJWT } from '../helpers/generate-jwt.js';
import bcrypt from 'bcryptjs'; // Usar bcryptjs para hashear contraseñas

export const register = async (req, res) => {
    console.log('Datos recibidos:', req.body);

    const { username, email, password, profile } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'El correo electrónico ya está registrado.'
            });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const user = new User({
            username,
            profile: {
                firstName: profile.firstName,
                lastName: profile.lastName,
                email
            },
            password: hashedPassword,
            role: 'client' // Rol por defecto
        });

        // Guardar el usuario en la base de datos
        await user.save();

        // Generar token JWT
        const token = await generarJWT(user.id);

        // Responder con el usuario creado y el token
        res.status(201).json({
            message: 'Usuario registrado exitosamente.',
            user: {
                id: user.id,
                username: user.username,
                email: user.profile.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Error en el registro:', error); // Log detallado
    
        res.status(500).json({
            message: 'Error al registrar el usuario.',
            error: error.message || error // Asegurar que el error sea legible
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ 'profile.email': email }); // Buscar por email en profile

        if (!user) {
            return res.status(400).json({
                message: 'Email not found'
            });
        }

        const validatePassword = await bcrypt.compare(password, user.password); // Verificar con bcryptjs
        if (!validatePassword) {
            return res.status(400).json({
                message: 'Password incorrect'
            });
        }

        const token = await generarJWT(user.id);

        res.json({
            message: 'Login success',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.profile.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al iniciar sesión',
            error: error.message
        });
    }
};