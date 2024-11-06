import { TypePageModel } from "@/types/models";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type PageModel = Model<TypePageModel>;

// 3. Create schema
const schema = new Schema<TypePageModel, PageModel>(
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
  },
  { timestamps: true }
);

// 4. create the model
const Page: PageModel =
  mongoose.models.Page || model<TypePageModel, PageModel>("Page", schema);

export default Page;
