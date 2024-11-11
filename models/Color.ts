import { TypeColorModel } from "@/types/models";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type ColorModel = Model<TypeColorModel>;

// 3. Create schema
const schema = new Schema<TypeColorModel, ColorModel>(
  {
    name: {
      type: String,
      required: true,
      maxLength: 255,
      unique: true,
      lowercase: true,
    },
    images: [
      {
        url: {
          type: String,
          required: false,
        },
      },
    ],
    description: {
      type: String,
      required: true,
      maxLength: 255,
      lowercase: false,
    },
    slug: {
      type: String,
      required: false,
      maxLength: 255,
      unique: true,
      lowercase: true,
    },

    status: {
      type: String,
      enum: ["draft", "publish", "archive"],
      default: "publish",
    },
    user_id: {
      type: String,
      required: true,
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    value: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// 4. create the model
const Color: ColorModel =
  mongoose.models.Color || model<TypeColorModel, ColorModel>("Color", schema);

export default Color;
