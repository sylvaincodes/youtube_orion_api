import { TypeImageModel } from "@/types/models";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type ImageModel = Model<TypeImageModel>;

// 3. Create schema
const schema = new Schema<TypeImageModel, ImageModel>(
  {
    url: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 4. create the model
const Image: ImageModel =
  mongoose.models.Image || model<TypeImageModel, ImageModel>("Image", schema);

export default Image;
