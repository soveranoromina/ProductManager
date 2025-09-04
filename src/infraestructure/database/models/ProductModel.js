import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true,
        max: 50
    },
    description: {
        type: String,
        max: 200
    },
    code: {
        type: String,
        max: 200,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: [{
        type: String
    }]
})

export const ProductModel = model('products', ProductSchema) 