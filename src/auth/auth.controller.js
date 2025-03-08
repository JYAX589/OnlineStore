import Usuario from '../user/user.model.js';
import { hash, verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';

// Función para registrar un nuevo usuario
export const register = async (req, res) => {
    try {
        const data = req.body;

        if (data.role === 'Admin') {
            return res.status(400).json({
                success: false,
                msg: 'No puedes registrarte con un rol de Administrador.'
            });
        }

        const encryptedPassword = await hash(data.password);

        const user = await Usuario.create({
            name: data.name,
            username: data.username,
            email: data.email,
            password: encryptedPassword,
            role: data.role
        });

        return res.status(201).json({
            message: 'Usuario registrado',
            userDetails: {
                user: user.email
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error al registrar el usuario',
            error
        });
    }
};

// Función para iniciar sesión
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Usuario.findOne({
            $or: [{ email }, { username }]
        });

        if (!user) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas, Correo no existe en la base de datos'
            });
        }

        if (!user.estado) {
            return res.status(400).json({
                msg: 'El usuario no existe en la DB'
            });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'La contraseña es incorrecta'
            });
        }

        const token = await generarJWT(user.id);

        return res.status(200).json({
            msg: 'Inicio de sesión exitoso!!',
            userDetails: {
                username: user.username,
                token: token,
            }
        });
    } catch (e) {
        return res.status(500).json({
            message: 'Error en el servidor',
            error: e.message
        });
    }
};

// Función para actualizar la contraseña
export const updatePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    try {
        const user = await Usuario.findOne({ email });

        if (!user) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }

        const validPassword = await verify(user.password, oldPassword);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'La contraseña actual es incorrecta'
            });
        }

        const encryptedPassword = await hash(newPassword);
        user.password = encryptedPassword;

        await user.save();

        return res.status(200).json({
            msg: 'Contraseña actualizada'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error al actualizar contraseña',
            error
        });
    }
};