import { TypeCartModel } from "@/types/models";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type CartModel = Model<TypeCartModel>;

// 3. Create schema
const schema = new Schema<TypeCartModel, CartModel>(
  {
    status: {
      type: String,
      enum: ["draft", "abandoned", "completed"],
      default: "draft",
    },
    cartItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "CartItem",
        required: false,
      },
    ],

    subTotal: {
      type: Number,
      default: 0,
    },

    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 4. create the model
const Cart: CartModel =
  mongoose.models.Cart || model<TypeCartModel, CartModel>("Cart", schema);

export default Cart;
