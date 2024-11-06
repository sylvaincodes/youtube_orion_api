import { TypeAddressModel } from "@/types/models";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type AddressModel = Model<TypeAddressModel>;

// 3. Create schema
const schema = new Schema<TypeAddressModel, AddressModel>(
  {
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    phone: { type: String },
    country: { type: String },
    zipCode: { type: String },
    email: { type: String },
    user_id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "archive"],
      default: "draft",
      required: false,
    },
  },
  { timestamps: true }
);

// 4. create the model
const Address: AddressModel =
  mongoose.models.Address ||
  model<TypeAddressModel, AddressModel>("Address", schema);

export default Address;
