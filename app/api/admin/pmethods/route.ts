import { dbConnect } from "@/lib/dbConnect";
import Pmethod from "@/models/Pmethod";
import { pmethodValidationSchema } from "@/types/schemas";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");

  await dbConnect();
  try {
    if (_id) {
      const data = await Pmethod.findById(_id).lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    const data = await Pmethod.find().sort({ createdAt: -1 }).lean();
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
    const validatedFields = pmethodValidationSchema.safeParse(body);
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
    const data = await new Pmethod(body).save();

    //delete the last data cached for this specific url and add this data within next 300ms
    revalidatePath("/admin/pmethods", "page");

    return NextResponse.json(
      { message: "Pmethod created.", data },
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
    const validatedFields = pmethodValidationSchema.safeParse(body);
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
    const data = await Pmethod.findByIdAndUpdate(_id, body);

    //delete the last data cached for this specific url and add this data
    revalidatePath("/admin/pmethods", "page"); //update the data cached for pmethod list
    revalidatePath("/admin/pmethods/" + data?._id, "page"); // update data cached for this pmethod/id

    return NextResponse.json(
      { message: "Pmethod updated.", data },
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

    await Pmethod.findByIdAndUpdate(_id, {
      status: "suspended",
    });

    return Response.json(
      {
        message: "Your Pmethod has been deleted ✔️",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
