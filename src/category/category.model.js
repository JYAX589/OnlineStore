import mongoose, { model, Mongoose, Schema } from "mongoose";

const categorySchema = new Schema(
    {
        name:{
            type: String,
            required: true,
            unique: true
        }
    }
)

export default model('Categoria', categorySchema);