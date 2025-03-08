import User from './user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../helpers/generate-token.js';

// Obtener perfil del usuario
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el perfil', error: error.message });
    }
};

// Actualizar perfil del usuario
export const updateUserProfile = async (req, res) => {
    const { firstName, lastName, email } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Actualizar los campos del perfil
        user.profile.firstName = firstName || user.profile.firstName;
        user.profile.lastName = lastName || user.profile.lastName;
        user.profile.email = email || user.profile.email;

        // Guardar los cambios
        const updatedUser = await user.save();

        // Responder con el usuario actualizado
        res.status(200).json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.profile.email,
            role: updatedUser.role,
            profile: updatedUser.profile
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message });
    }
};

// Eliminar cuenta de usuario
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Eliminar el usuario
        await user.remove();
        res.status(200).json({ message: 'Cuenta eliminada correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la cuenta', error: error.message });
    }
};

// Obtener todos los usuarios (solo para administradores)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    }
};