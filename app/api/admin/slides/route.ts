import { dbConnect } from "@/lib/dbConnect";
import Slide from "@/models/Slide";
import { categoryValidationSchema } from "@/types/schemas";
import { isValidObjectId } from "mongoose";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");

  await dbConnect();
  try {
    if (_id) {
      if (!isValidObjectId(_id)) {
        return NextResponse.json(
          { message: "This Id is not valid", success: false },
          { status: 404 }
        );
      }

      const data = await Slide.findById(_id).lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    const data = await Slide.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data }, { status: 200 });
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
    const validatedFields = categoryValidationSchema.safeParse(body);
    if (!validatedFields.success) {
      return Response.json(
        {
          message: "validation error",
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 200 }
      );
    }

    // Save data to db
    const data = await new Slide(body).save();

    //delete the last data cached for this specific url and add this data
    revalidatePath("/admin/categories", "page");

    return NextResponse.json(
      { message: "Slide created.", data },
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
  const action = searchParams.get("action");
  try {
    //check if _id exist
    if (!_id) {
      return NextResponse.json({ message: "_id is missing" }, { status: 200 });
    }

    //Get request values
    const body = await req.json();

    //Add subs categories
    if (action && action === "categoryAddSub") {
      await Slide.findByIdAndUpdate(_id, {
        subSlide: body.subSlide,
      });

      return NextResponse.json({ message: "Slide updated." }, { status: 200 });
    }

    // Server side validation
    const validatedFields = categoryValidationSchema.safeParse(body);
    if (!validatedFields.success) {
      return Response.json(
        {
          message: "validation error",
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 200 }
      );
    }

    // Update data to db
    const data = await Slide.findByIdAndUpdate(_id, body);

    //delete the last data cached for this specific url and add this data
    revalidatePath("/admin/categories", "page");
    revalidatePath("/admin/categories/" + data?._id, "page");

    return NextResponse.json(
      { message: "Slide updated.", data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");

    if (!_id) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    await Slide.findByIdAndUpdate(_id, {
      status: "suspended",
    });

    return Response.json(
      {
        message: "Your Slide has been deleted ✔️",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
