import { Schema, model } from 'mongoose';

const InvoiceSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'El usuario asociado a la factura es obligatorio.']
        },
        products: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: [true, 'El producto es obligatorio.']
            },
            quantity: {
                type: Number,
                required: [true, 'La cantidad del producto es obligatoria.'],
                min: [1, 'La cantidad mínima de un producto es 1.']
            }
        }],
        total: {
            type: Number,
            required: [true, 'El total de la factura es obligatorio.']
        },
        status: {
            type: String,
            enum: ['PENDING', 'PAID', 'CANCELLED'],
            default: 'PENDING'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Invoice', InvoiceSchema);