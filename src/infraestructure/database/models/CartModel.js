import { Schema, model } from "mongoose";

const CartSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    products: [
        {
            id: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
})

export const CartModel = model('cart', CartSchema) 