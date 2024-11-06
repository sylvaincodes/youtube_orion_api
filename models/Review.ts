import { TypeReviewModel } from "@/types/models";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type ReviewModel = Model<TypeReviewModel>;

// 3. Create schema
const reviewSchema = new Schema<TypeReviewModel, ReviewModel>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
    },
    rating: {
      type: Number,
      default: 0,
    },

    review: {
      type: String,
      required: true,
    },

    likes: [
      {
        type: String,
      },
    ],

    user: {
      _id: {
        type: String,
      },
      imageUrl: {
        type: String,
      },
      fullName: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

// 4. create the model
const Review: ReviewModel =
  mongoose.models.Review ||
  model<TypeReviewModel, ReviewModel>("Review", reviewSchema);

export default Review;
