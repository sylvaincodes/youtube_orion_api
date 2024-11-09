import { dbConnect } from "@/lib/dbConnect";
import { ImageValidationSchema } from "@/types/schemas";
import { NextResponse } from "next/server";
import Image from "@/models/Image";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");
  const storeId = searchParams.get("storeId");

  await dbConnect();
  try {
    if (_id) {
      const data = await Image.findById(_id).lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    const data = await Image.find({ store: storeId }, { url: 1, _id: 0 })
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
    // Get request values
    const body = await req.json();

    // Server side validation
    const validatedFields = ImageValidationSchema.safeParse(body);
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
    const data = await new Image(body).save();

    return NextResponse.json(
      { message: "New image created.", data, success: true },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
