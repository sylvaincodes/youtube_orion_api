import { TypeTrackActivityModel } from "../types/models";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type TrackActivityModel = Model<TypeTrackActivityModel>;

// 3. Create schema
const schema = new Schema<TypeTrackActivityModel, TrackActivityModel>(
  {
    trackorder: {
      type: Schema.Types.ObjectId,
      ref: "Trackorder",
      required: true
    },
    activity: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 4. create the model
const TrackActivity: TrackActivityModel =
  mongoose.models.TrackActivity ||
  model<TypeTrackActivityModel, TrackActivityModel>("TrackActivity", schema);

export default TrackActivity;
