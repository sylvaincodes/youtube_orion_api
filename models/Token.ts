import { TypeTokenModel } from "@/types/models";
import mongoose, { model, Model, Schema } from "mongoose";

// type model
type TokenModel = Model<TypeTokenModel>;

// schema
const schema = new Schema<TypeTokenModel, TokenModel>({
  // properties
  template: {
    type: String,
    required: true,
  },

  token: {
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
});

const token = mongoose.models.Token || model("Token", schema);

export default token;
