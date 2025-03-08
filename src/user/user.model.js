import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre es obligatorio.'],
            maxLength: [25, 'El nombre no puede superar los 25 caracteres.']
        },
        username: {
            type: String,
            unique: true 
        },
        email: {
            type: String,
            required: [true, 'El correo electrónico es obligatorio.'],
            unique: true 
        },
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria.'],
            minLength: [8, 'La contraseña debe tener al menos 8 caracteres.']
        },
        role: {
            type: String,
            enum: ['Admin', 'Client'],
            default: 'Client'
        },
        estado: {
            type: Boolean,
            default: true 
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);
UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
};

export default model('User', UserSchema);