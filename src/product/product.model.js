import { Schema, model } from 'mongoose';

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre del producto es obligatorio.'],
            maxLength: [30, 'El nombre no puede superar los 30 caracteres.']
        },
        description: {
            type: String,
            required: [true, 'La descripción del producto es obligatoria.'],
            maxLength: [150, 'La descripción no puede superar los 150 caracteres.']
        },
        price: {
            type: Number,
            required: [true, 'El precio del producto es obligatorio.'],
            min: [0, 'El precio debe ser mayor o igual a 0.']
        },
        stock: {
            type: Number,
            required: [true, 'El stock del producto es obligatorio.'],
            min: [0, 'El stock debe ser mayor o igual a 0.']
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'La categoría del producto es obligatoria.']
        },
        sold: {
            type: Number,
            default: 0,
            min: [0, 'El número de productos vendidos debe ser mayor o igual a 0.']
        },
        status: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true, 
        versionKey: false
    }
);

export default model('Product', ProductSchema);