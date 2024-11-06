import { TypeWithdrawalModel } from "@/types/models";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type WithdrawalModel = Model<TypeWithdrawalModel>;

// 3. Create schema
const schema = new Schema<TypeWithdrawalModel, WithdrawalModel>(
  {
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "paid", "publish", "draft"],
      default: "pending",
    },
    paypal: {
      type: String,
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "store",
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 4. create the model
const Withdrawal: WithdrawalModel =
  mongoose.models.Withdrawal ||
  model<TypeWithdrawalModel, WithdrawalModel>("Withdrawal", schema);

export default Withdrawal;
