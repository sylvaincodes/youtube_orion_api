import { dbConnect } from "@/lib/dbConnect";
import TrackOrder from "@/models/Trackorder";
import { NextResponse } from "next/server";
import Order from "@/models/Order";
import OrderItem from "@/models/Orderitem";
import CartItem from "@/models/CartItem";
import Productvariant from "@/models/Productvariant";
import Address from "@/models/Address";
import Store from "@/models/Store";
import { trackOrderValidationSchema } from "@/types/schemas";
import Shipping from "@/models/Shipping";
import Subscription from "@/models/Subscription";
import TrackActivity from "@/models/Trackactivity";
import { isValidObjectId } from "mongoose";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");
  const storeId = searchParams.get("storeId");

  await dbConnect();
  try {
    if (_id) {
      if (!isValidObjectId(_id)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Your ID is invalid. Try again or reach the support client",
          },
          { status: 200 }
        );
      }

      const data = await TrackOrder.findById(_id)
        .populate({
          path: "orderitem",
          model: OrderItem,
          populate: [
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
              path: "store",
              model: Store,
              populate: [
                {
                  path: "subscription",
                  model: Subscription,
                },
              ],
            },
          ],
        })
        .populate({
          path: "trackactivity",
          model: TrackActivity,
        })
        .lean();

      if (data) {
        return NextResponse.json({ data, success: true }, { status: 200 });
      } else {
        return NextResponse.json({ success: false }, { status: 200 });
      }
    }

    if (storeId) {
      const data = await TrackOrder.find({ store: storeId }, { url: 1, _id: 0 })
        .sort({ createdAt: -1 })
        .lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    //Get request values
    const body = await req.json();

    // Server side validation
    const validatedFields = trackOrderValidationSchema.safeParse(body);
    if (!validatedFields.success) {
      return Response.json(
        {
          message: "validation error",
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 200 }
      );
    }

    //check order
    const checkOrderId = await Order.findById(body.order).lean();
    if (!checkOrderId) {
      return NextResponse.json(
        { message: "Invalid Order ID", success: false },
        { status: 200 }
      );
    }

    const checkTrackExist = await TrackOrder.findOne({
      order: body.order,
    }).lean();
    if (checkTrackExist) {
      return NextResponse.json(
        { message: "Redirecting", checkTrackExist, success: true },
        { status: 200 }
      );
    }

    // Save data to db
    const saveData = await new TrackOrder(body).save();

    return NextResponse.json(
      { message: "Track order created ✔️", saveData, success: true },
      { status: 200 }
    );
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
    const data = await TrackOrder.findByIdAndUpdate(_id, body);

    return NextResponse.json(
      { message: "Tracking updated.", data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
