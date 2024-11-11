import { TypeStoreModel } from "@/types/models";
import mongoose, { model, Model, Schema } from "mongoose";

//Type model
type StoreModel = Model<TypeStoreModel>;

//Schema
const schema = new Schema<TypeStoreModel, StoreModel>(
  {
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: false,
    },

    user_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      maxlength: 255,
    },
    description: {
      type: String,
      lowercase: true,
      required: true,
      maxlength: 1000,
    },
    logo: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/128/126/126122.png",
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    orderitems: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderItem",
      },
    ],

    status: {
      type: String,
      enum: ["online", "pending", "suspended"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

//Model
const Store =
  mongoose.models.Store || model<TypeStoreModel, StoreModel>("Store", schema);

export default Store;
