import { TypeDiscountModel } from "@/types/models";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type DiscountModel = Model<TypeDiscountModel>;

// 3. Create schema
const couponSchema = new Schema<TypeDiscountModel, DiscountModel>(
  {
    code: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: true,
      minLength: 4,
      maxLength: 10,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    discount: {
      type: Number,
      required: true,
    },

    slug: {
      type: String,
    },

    status: {
      type: String,
      enum: ["available", "expired"],
      default: "available",
    },
  },
  { timestamps: true }
);

// 4. create the model
const Discount: DiscountModel =
  mongoose.models.Discount ||
  model<TypeDiscountModel, DiscountModel>("Discount", couponSchema);

export default Discount;
