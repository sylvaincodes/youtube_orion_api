import { TypeSizeModel } from "@/types/models";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type SizeModel = Model<TypeSizeModel>;

// 3. Create schema
const schema = new Schema<TypeSizeModel, SizeModel>(
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
const Size: SizeModel =
  mongoose.models.Size || model<TypeSizeModel, SizeModel>("Size", schema);

export default Size;
