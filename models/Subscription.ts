import { TypeSubscriptionModel } from "@/types/models";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type SubscriptionModel = Model<TypeSubscriptionModel>;

// 3. Create schema
const schema = new Schema<TypeSubscriptionModel, SubscriptionModel>(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
    },
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
        required: false,
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: ["active", "ended", "cancelled"],
      default: "active",
    },
    type: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 4. create the model
const Subscription: SubscriptionModel =
  mongoose.models.Subscription ||
  model<TypeSubscriptionModel, SubscriptionModel>("Subscription", schema);

export default Subscription;
