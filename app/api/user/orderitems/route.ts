import { dbConnect } from "@/lib/dbConnect";
import Address from "@/models/Address";
import CartItem from "@/models/CartItem";
import Order from "@/models/Order";
import OrderItem from "@/models/Orderitem";
import Pmethod from "@/models/Pmethod";
import Productvariant from "@/models/Productvariant";
import Shipping from "@/models/Shipping";
import TrackOrder from "@/models/Trackorder";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");
  const storeId = searchParams.get("storeId");
  const action = searchParams.get("action");
  await dbConnect();
  try {
    if (action === "earning") {
      const data = await OrderItem.find({ store: storeId });
      return NextResponse.json({ data }, { status: 200 });
    }

    if (_id) {
      const data = await OrderItem.findById(_id)
        .populate([
          {
            path: "cartItem",
            model: CartItem,
            populate: [
              {
                path: "variant",
                model: Productvariant,
              },
            ],
          },
          {
            path: "trackorder",
            model: TrackOrder,
          },
          {
            path: "address",
            model: Address,
          },
          {
            path: "shipping",
            model: Shipping,
          },
          {
            path: "order",
            model: Order,
            populate: [
              {
                path: "pmethod",
                model: Pmethod,
              },
            ],
          },
        ])
        .lean();
      return NextResponse.json({ data }, { status: 200 });
    }

    if (storeId) {
      const data = await OrderItem.find({ store: storeId })
        .populate([
          {
            path: "cartItem",
            model: CartItem,
            populate: [
              {
                path: "variant",
                model: Productvariant,
              },
            ],
          },
          {
            path: "trackorder",
            model: TrackOrder,
          },
          {
            path: "address",
            model: Address,
          },
          {
            path: "shipping",
            model: Shipping,
          },
        ])
        .lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get("_id");

  try {
    //check if _id exist
    if (!_id) {
      return NextResponse.json({ message: "_id is missing" }, { status: 200 });
    }

    //Get request values
    const body = await req.json();

    // Update data to db
    const data = await OrderItem.findByIdAndUpdate(_id, body);

    return NextResponse.json(
      { message: "Order updated successfully.", data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
