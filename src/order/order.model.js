import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId, ref: 'Product'
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        total: {
            type: Number
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true // Opcional: agrega campos `createdAt` y `updatedAt`
    }
);

export default mongoose.model('Order', orderSchema);