import { dbConnect } from "@/lib/dbConnect";
import Slideitem from "@/models/Slideitem";
import Slide from "@/models/Slide";
import {
  slideValidationSchema,
  SlideitemValidationSchema,
} from "@/types/schemas";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import Subscription from "@/models/Subscription";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const _id = searchParams.get("_id");
    const storeId = searchParams.get("storeId");

    if (storeId) {
      const data = await Slideitem.find({ store: storeId }).exec();
      return NextResponse.json({ data }, { status: 200 });
    }
    if (_id) {
      const data = await Slideitem.findById(_id).lean();
      return NextResponse.json({ data }, { status: 200 });
    }

    const data = await Slideitem.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    // Get request values
    const body = await req.json();

    // Server side validation
    const validatedFields = SlideitemValidationSchema.safeParse(body);
    if (!validatedFields.success) {
      return Response.json(
        {
          message: "validation error",
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 200 }
      );
    }

    // if he wants to publish
    if (body.status === "publish") {
      //check subscription
      const checkSub = await Subscription.findOne({
        user_id: body.user_id,
      }).lean();

      if (checkSub) {
        //so user has already one store

        //check if user has an active subscription
        if (checkSub.type === "free" || checkSub.status !== "active") {
          return NextResponse.json(
            {
              message: "Upgrade to Pro to publish your campaign",
              success: false,
            },
            { status: 200 }
          );
        }
      }
    }

    // Save data to db
    const data = await new Slideitem(body).save();

    // Delete the last data cached for this specific url and add this data
    revalidatePath("/stores/" + body.store + "/campaigns", "page");
    revalidatePath("/stores/" + body.store + "/campaigns/" + data._id, "page");

    // Add sub slide id to slide
    if (data) {
      const newSubcate = {
        _id: data._id,
      };
      await Slide.findByIdAndUpdate(body.slide, {
        $push: { slideItem: newSubcate },
      });
    }

    return NextResponse.json(
      { message: "New campaign created.", data, success: true },
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

    // Server side validation
    const validatedFields = slideValidationSchema.safeParse(body);
    if (!validatedFields.success) {
      return Response.json(
        {
          message: "validation error",
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 200 }
      );
    }

    // if he wants to publish
    if (body.status === "publish") {
      //check subscription
      const checkSub = await Subscription.findOne({
        user_id: body.user_id,
      }).lean();

      if (checkSub) {
        //so user has already one store

        //check if user has an active subscription
        if (checkSub.type === "free" || checkSub.status !== "active") {
          return NextResponse.json(
            {
              message: "Upgrade to Pro to publish your campaign",
              success: false,
            },
            { status: 200 }
          );
        } else {
          // Update data to db
          const data = await Slideitem.findByIdAndUpdate(_id, body);

          return NextResponse.json(
            { message: "Campaign updated.", data },
            { status: 200 }
          );
        }
      } else {
        return NextResponse.json(
          {
            message: "Error no subscription found",
            success: false,
          },
          { status: 200 }
        );
      }
    }

    // Update data to db
    const data = await Slideitem.findByIdAndUpdate(_id, body);

    // Delete the last data cached for this specific url and add this data
    revalidatePath("/stores/" + body.store + "/campaigns", "page");
    revalidatePath("/stores/" + body.store + "/campaigns/" + data?._id, "page");

    return NextResponse.json(
      { message: "Campaign updated.", data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
