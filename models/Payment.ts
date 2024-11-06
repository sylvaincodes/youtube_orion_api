import { TypePaymentModel } from "@/types/models";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type PaymentModel = Model<TypePaymentModel>;

// 3. Create schema
const schema = new Schema<TypePaymentModel, PaymentModel>(
  {
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: false,
    },
    type: {
      type: String,
    },
    checkout_id: {
      type: String,
      required: false,
    },
    checkout_status: {
      type: String,
      required: false,
    },
    payment_intent: {
      id: {
        type: String,
        required: false,
      },
      amount: {
        type: String,
        required: false,
      },
      amount_received: {
        type: String,
        required: false,
      },
      client_secret: {
        type: String,
        required: false,
      },
      created: {
        type: String,
        required: false,
      },
      currency: {
        type: String,
        required: false,
      },
      shipping: {
        address: {
          city: {
            type: String,
            required: false,
          },
          country: { type: String, required: false },
          line1: { type: String, required: false },
          line2: { type: String, required: false },
          postal_code: { type: String, required: false },
          state: { type: String, required: false },
        },
      },
    },
    payment_status: {
      type: String,
      required: false,
    },
    amount_subtotal: {
      type: Number,
      required: false,
    },
    amount_total: {
      type: Number,
      required: false,
    },

    amount_discount: {
      type: Number,
      required: false,
      default: 0,
    },
    amount_tax: {
      type: Number,
      required: false,
      default: 0,
    },
    amount_shipping: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true }
);

// 4. create the model
const Payment: PaymentModel =
  mongoose.models.Payment ||
  model<TypePaymentModel, PaymentModel>("Payment", schema);

export default Payment;
