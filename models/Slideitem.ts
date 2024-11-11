import { TypeSlideItemModel } from "@/types/models";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type SlideItemModel = Model<TypeSlideItemModel>;

// 3. Create schema
const schema = new Schema<TypeSlideItemModel, SlideItemModel>(
  {
    name: {
      type: String,
      required: true,
      maxLength: 255,
      unique: true,
      lowercase: true,
    },
    title: {
      type: String,
      maxLength: 255,
      lowercase: true,
    },
    subtitle: {
      type: String,
      maxLength: 255,
      lowercase: true,
    },
    textColor: {
      type: String,
      maxLength: 255,
    },
    btn: {
      type: String,
      maxLength: 255,
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
      enum: ["draft", "publish", "approve", "reject", "archive"],
      default: "draft",
    },
    slide: {
      type: Schema.Types.ObjectId,
      ref: "Slide",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// 4. create the model
const SlideItem: SlideItemModel =
  mongoose.models.SlideItem ||
  model<TypeSlideItemModel, SlideItemModel>("SlideItem", schema);

export default SlideItem;
