import { dbConnect } from "@/lib/dbConnect";
import Withdrawal from "@/models/Withdrawal";
import { withdrawalValidationSchema } from "@/types/schemas";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const store = searchParams.get("store");
  const _id = searchParams.get("_id");

  try {
    if (store) {
      const data = await Withdrawal.find({ store: store })
        .sort({ createdAt: -1 })
        .lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    if (_id) {
      const data = await Withdrawal.findById(_id).lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    const data = await Withdrawal.find({ status: { $ne: "draft" } })
      .sort({ createdAt: -1 })
      .lean();
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
    const validatedFields = withdrawalValidationSchema.safeParse(body);
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
    const saveData = await new Withdrawal(body).save();

    return NextResponse.json(
      { message: "New request added ✔️", saveData, success: true },
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
    const validatedFields = withdrawalValidationSchema.safeParse(body);
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
    const data = await Withdrawal.findByIdAndUpdate(_id, body);

    return NextResponse.json(
      { message: "Withdrawal updated.", data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
