import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            required: [true, 'El nombre del rol es obligatorio.']
        }
    },
    {
        versionKey: false
    }
);

export default mongoose.model('Role', RoleSchema);