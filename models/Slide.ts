import { TypeSlideModel } from "@/types/models";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type SlideModel = Model<TypeSlideModel>;

// 3. Create schema
const schema = new Schema<TypeSlideModel, SlideModel>(
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
    slideItem: [
      {
        type: Schema.Types.ObjectId,
        ref: "SlideItem",
        required: false,
      },
    ],
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 4. create the model
const Slide: SlideModel =
  mongoose.models.Slide || model<TypeSlideModel, SlideModel>("Slide", schema);

export default Slide;
