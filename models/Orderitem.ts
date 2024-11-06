import { TypeOrderItemModel } from "@/types/models";
import mongoose, { Schema, model, Model } from "mongoose";

//2. type model
type OrderItemModel = Model<TypeOrderItemModel>;

// 3. Create schema
const schema = new Schema<TypeOrderItemModel, OrderItemModel>(
  {
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

    delivered: {
      type: Boolean,
      default: false,
    },
    earning: {
      type: Number,
      default: 0,
    },

    cartItem: {
      type: Schema.Types.ObjectId,
      ref: "CartItem",
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    shipping: {
      type: Schema.Types.ObjectId,
      ref: "Shipping",
      required: true,
    },

    address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    shippingAmount: {
      type: Number,
      default: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },

    trackorder: {
      type: Schema.Types.ObjectId,
      ref: "Trackorder",
      required: false,
    },
  },
  { timestamps: true }
);

// 4. create the model
const OrderItem: OrderItemModel =
  mongoose.models.OrderItem ||
  model<TypeOrderItemModel, OrderItemModel>("OrderItem", schema);

export default OrderItem;
