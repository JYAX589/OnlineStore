import mongoose, { model, Mongoose, Schema } from "mongoose";

const productSchema = new Schema(
    {
        name:{
            type: String,
            required: true
        },
        price:{
            type: Number,
            required: true,
            category:{ type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
            stock:{
                type: Number,
                required: true
            }
        },
        category:{
            type: mongoose.Schema.Types.ObjectId,ref: 'Category'
        },
        stock:{
            type: Number,
            required: true
        },
        soldOut:{
            type: Boolean,
            default: false
        }
    }
);

export default model('Producto', productSchema);