import { TypeNewsletterModel } from "@/types/models";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type NewsletterModel = Model<TypeNewsletterModel>;

// 3. Create schema
const newsletterSchema = new Schema<TypeNewsletterModel, NewsletterModel>(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

// 4. create the model
const Newsletter: NewsletterModel =
  mongoose.models.Newsletter ||
  model<TypeNewsletterModel, NewsletterModel>("Newsletter", newsletterSchema);

export default Newsletter;
