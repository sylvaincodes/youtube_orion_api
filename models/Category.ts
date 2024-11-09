import { TypeCategoryModel } from "@/types/models";
import mongoose, { model, Model, Schema } from "mongoose";

// model
type CategoryModel = Model<TypeCategoryModel>;

//schema
const schema = new Schema<TypeCategoryModel, CategoryModel>({
  // properties
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: false,
  },
  slug: {
    type: String,
    required: true,
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

  subCategory: [
    {
      type: String,
      required: true,
    },
  ],
});

const category = mongoose.models.Category || model("Category", schema);

export default category;
