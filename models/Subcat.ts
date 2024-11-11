import { TypeSubCategoryModel } from "@/types/models";
import mongoose, { Schema, model, Model } from "mongoose";

//2. type model
type SubCategoryModel = Model<TypeSubCategoryModel>;

// 3. Create schema
const schema = new Schema<TypeSubCategoryModel, SubCategoryModel>(
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
    status: {
      type: String,
      enum: ["draft", "publish", "archive"],
      default: "draft",
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

// 4. create the model
const SubCategory: SubCategoryModel = mongoose.models.SubCategory ||
  model<TypeSubCategoryModel, SubCategoryModel>("SubCategory", schema);

export default SubCategory;
