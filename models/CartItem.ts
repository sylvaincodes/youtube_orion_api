import { TypeCartItemModel } from "@/types/models";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type CartItemModel = Model<TypeCartItemModel>;

// 3. Create schema
const schema = new Schema<TypeCartItemModel, CartItemModel>(
  {
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    variant: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
    },

    qty: {
      type: Number,
      default: 1,
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    productImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 4. create the model
const CartItem: CartItemModel =
  mongoose.models.CartItem ||
  model<TypeCartItemModel, CartItemModel>("CartItem", schema);

export default CartItem;
