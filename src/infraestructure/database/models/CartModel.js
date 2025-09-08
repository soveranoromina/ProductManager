import { Schema, model } from "mongoose";

const CartSchema = new Schema({
    products: [
        {
            id: {
          type: Schema.Types.ObjectId,
          ref: "products"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
})

export const CartModel = model('cart', CartSchema) 