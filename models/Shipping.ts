import { TypeShippingModel } from "@/types/models";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type ShippingModel = Model<TypeShippingModel>;

// 3. Create schema
const schema = new Schema<TypeShippingModel, ShippingModel>(
  {
    name: {
      type: String,
      required: true,
      maxLength: 255,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: false,
      maxLength: 255,
      lowercase: true,
    },
    slug: {
      type: String,
      required: true,
      maxLength: 255,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "publish", "archive"],
      default: "draft",
    },
    user_id: {
      type: String,
      required: true,
    },

    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
    },

    region: [
      {
        type: String,
        default: "all",
      },
    ],
    delay: {
      type: Number,
      required: false,
      default: 0,
    },
    fixed_amount: {
      type: Number,
      default: 0,
    },
    fees: {
      type: Number,
      required: true,
      default: 0,
    },
    unit_price_weight: {
      type: Number,
      required: true,
      default: 0,
    },
    price_range_start: {
      type: Number,
      required: true,
      default: 0,
    },
    price_range_end: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

// 4. create the model
const Shipping: ShippingModel =
  mongoose.models.Shipping ||
  model<TypeShippingModel, ShippingModel>("Shipping", schema);

export default Shipping;
