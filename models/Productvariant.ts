import { TypeProductVariantModel } from "@/types/models";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//type model
type ProductVariantModel = Model<TypeProductVariantModel>;

//Create schema
const schema = new Schema<TypeProductVariantModel, ProductVariantModel>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "ProductId",
    },

    name: {
      type: String,
      required: true,
    },
    color: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Color",
    },
    colorImages: [
      {
        url: {
          type: String,
          required: false,
        },
      },
    ],

    size: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Size",
    },

    sizeImages: [
      {
        url: {
          type: String,
          required: false,
        },
      },
    ],

    weight: {
      type: Number,
      required: false,
      default: 0,
    },
    inventory: {
      type: String,
      enum: ["instock", "outstock"],
      default: "instock",
    },

    sku: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
      default: 0,
    },

    discount: {
      type: Number,
      required: false,
      default: 0,
    },

    colorValue: {
      type: String,
      required: false,
    },
    
    status: {
      type: String,
      enum: ["publish", "draft", "archive"],
      default: "draft",
    },
  },
  { timestamps: true }
);

//create the model
const Productvariant =
  mongoose.models.ProductVariant ||
  model<TypeProductVariantModel, ProductVariantModel>("ProductVariant", schema);

export default Productvariant;
