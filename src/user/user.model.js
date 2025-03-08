import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Usar bcryptjs para hashear contraseñas

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: 'client'
        },
        profile: {
            firstName: String,
            lastName: String,
            email: {
                type: String,
                required: true,
                unique: true
            }
        }
    },
    {
        timestamps: true
    }
);

// Middleware para hashear la contraseña antes de guardar el usuario
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

export default mongoose.model('User', userSchema);