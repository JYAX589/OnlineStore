import { response, request } from 'express';
import { hash } from 'argon2';
import User from './user.model.js';

// Crea al admin por defecto
export const defaultAdmin = async () => {
    try {
        const defaultAdmin = {
            name: "Josue",
            username: "yax",
            password: "12345678",
            email: "jyax@gmail.com",
            role: "Admin",
            estado: true
        };

        const adminExists = await User.findOne({ email: defaultAdmin.email });

        if (adminExists) {
            return console.log('El administrador por defecto ya existe.');
        }

        defaultAdmin.password = await hash(defaultAdmin.password);
        const user = new User(defaultAdmin);
        await user.save();

        console.log('Administrador por defecto creado.');
    } catch (error) {
        console.log('Error al crear el administrador.', error.message);
    }
};

// Obtener todos los usuarios
export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 6, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener usuarios',
            error
        });
    }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener el usuario'
        });
    }
};

// Actualizar un usuario
export const updateUser = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, password, email, role, ...data } = req.body;
        const authenticatedUser = req.usuario;

        if (authenticatedUser._id.toString() !== id && authenticatedUser.role !== 'Admin') {
            return res.status(403).json({
                success: false,
                msg: 'No tienes permiso para modificar los datos de este usuario.'
            });
        }

        if (email) {
            return res.status(400).json({
                success: false,
                msg: 'No puedes modificar el correo.'
            });
        }

        if (role && authenticatedUser.role !== 'Admin') {
            return res.status(403).json({
                success: false,
                msg: 'Solamente un administrador puede modificar el rol.'
            });
        }

        if (password) {
            data.password = await hash(password);
        }

        const user = await User.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Usuario actualizado',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el usuario.',
            error
        });
    }
};

// Eliminar (desactivar) un usuario
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { confirm } = req.body;
        const authenticatedUser = req.usuario;

        if (authenticatedUser._id.toString() !== id && authenticatedUser.role !== 'Admin') {
            return res.status(403).json({
                success: false,
                msg: 'No tienes permiso para desactivar esta cuenta.'
            });
        }

        if (!confirm) {
            return res.status(400).json({
                success: false,
                msg: 'Se requiere confirmación para desactivar la cuenta.'
            });
        }

        const user = await User.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Usuario desactivado',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al desactivar usuario',
            error
        });
    }
};