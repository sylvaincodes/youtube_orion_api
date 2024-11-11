import { dbConnect } from "@/lib/dbConnect";
import Slideitem from "@/models/Slideitem";
import {
  SlideitemValidationSchema,
} from "@/types/schemas";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");
  const storeId = searchParams.get("storeId");
  await dbConnect();
  try {
    if (storeId) {
      const data = await Slideitem.find({ store: storeId })
        .populate("slide")
        .populate("store")
        .exec();
      return NextResponse.json({ data }, { status: 200 });
    }
    if (_id) {
      const data = await Slideitem.findById(_id).lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    const data = await Slideitem.find({ status: "publish" })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ data }, { status: 200 });
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

    // if he wants to approv
    if (body.status === "approve") {
      // Update data to db
      const data = await Slideitem.findByIdAndUpdate(_id, {
        approvedAt: new Date(Date.now()),
        status: "approve",
      });
      return NextResponse.json(
        { message: "Campaign approved.", data },
        { status: 200 }
      );
    }

    const data = await Slideitem.findByIdAndUpdate(_id, body);

    //delete the last data cached for this specific url and add this data
    revalidatePath("/admin/slideitems", "page");
    revalidatePath("/admin/slideitems/" + data?._id, "page");

    return NextResponse.json(
      { message: "Slideitem updated.", data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
