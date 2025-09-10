import { Schema, model } from "mongoose";

const CartSchema = new Schema({
  products: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "products",
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
});

CartSchema.pre("findOne", function () {
  this.populate("products.id");
});

export const CartModel = model('cart', CartSchema);
