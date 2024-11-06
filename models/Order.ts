import { TypeOrderModel } from "@/types/models";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type OrderModel = Model<TypeOrderModel>;

// 3. Create schema
const schema = new Schema<TypeOrderModel, OrderModel>(
  {
    subTotal: {
      type: Number,
      default: 0,
    },

    pmethod: {
      type: Schema.Types.ObjectId,
      ref: "Pmethod",
      required: true,
    },
    discountItem: {
      type: Schema.Types.ObjectId,
      ref: "Discount",
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    earning: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },

    shipping: {
      type: Number,
      default: 0,
    },

    tax: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "onhold",
        "completed",
        "refunded",
        "failed",
      ],
      default: "pending",
    },
    orderitems: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderItem",
        required: false,
      },
    ],

    customer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 4. create the model
const Order: OrderModel =
  mongoose.models.Order || model<TypeOrderModel, OrderModel>("Order", schema);

export default Order;
