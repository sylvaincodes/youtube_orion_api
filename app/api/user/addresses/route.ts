import { dbConnect } from "@/lib/dbConnect";
import { addressValidationSchema } from "@/types/schemas";
import { NextResponse } from "next/server";
import Address from "@/models/Address";
import { isValidObjectId } from "mongoose";

export async function POST(req: Request) {
  try {
    await dbConnect();
    // Get request values
    const body = await req.json();

    // Server side validation
    const validatedFields = addressValidationSchema.safeParse(body);
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
    const data = await new Address(body).save();

    return NextResponse.json(
      { message: "New address created.", data, success: true },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");

    if (_id) {
      if (!isValidObjectId(_id)) {
        return NextResponse.json(
          { message: "This Id is not valid", success: false },
          { status: 404 }
        );
      }
    }

    await Address.findByIdAndUpdate(_id, {
      status: "archive",
    });

    return NextResponse.json(
      { message: "Address deleted.", success: true },
      { status: 204 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const _id = searchParams.get("_id");
    const user_id = searchParams.get("user_id");

    if (_id) {
      const data = await Address.findById(_id).lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    if (user_id) {
      const data = await Address.find({
        $and: [{ status: "draft" }, { user_id: user_id }],
      }).lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    // const data = await Address.find().sort({ createdAt: -1 }).lean();
    // return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
