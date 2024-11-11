import { TypeTrackOrderModel } from "@/types/models";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type TrackOrderModel = Model<TypeTrackOrderModel>;

// 3. Create schema
const schema = new Schema<TypeTrackOrderModel, TrackOrderModel>(
  {
    orderitem: {
      type: Schema.Types.ObjectId,
      ref: "OrderItem",
    },

    trackactivity: [
      {
        type: Schema.Types.ObjectId,
        ref: "TrackActivity",
      },
    ],

    status: {
      type: String,
      enum: ["open", "packaging", "onroad", "delivered", "failed"],
      default: "open",
    },
  },
  { timestamps: true }
);

// 4. create the model
const TrackOrder: TrackOrderModel =
  mongoose.models.TrackOrder ||
  model<TypeTrackOrderModel, TrackOrderModel>("TrackOrder", schema);

export default TrackOrder;
