import { TypeTagModel } from "@/types/models";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type TagModel = Model<TypeTagModel>;

// 3. Create schema
const schema = new Schema<TypeTagModel, TagModel>(
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
      required: true,
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
const Tag: TagModel =
  mongoose.models.Tag || model<TypeTagModel, TagModel>("Tag", schema);

export default Tag;
