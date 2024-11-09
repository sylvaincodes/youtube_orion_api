import { dbConnect } from "@/lib/dbConnect";
import Page from "@/models/Page";
import { pageValidationSchema } from "@/types/schemas";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get("_id");
  await dbConnect();
  try {
    if (_id) {
      const data = await Page.findById(_id).lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    const data = await Page.find().sort({ createdAt: -1 }).lean();
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
    const validatedFields = pageValidationSchema.safeParse(body);
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
    const data = await new Page(body).save();

    //delete the last data cached for this specific url and add this data within next 300ms
    revalidatePath("/admin/pages", "page");

    return NextResponse.json(
      { message: "Page created.", data },
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
    if (action && action === "pageAddSub") {
      await Page.findByIdAndUpdate(_id, {
        subCategory: body.subCategory,
      });

      return NextResponse.json({ message: "Page updated." }, { status: 200 });
    }

    // Server side validation
    const validatedFields = pageValidationSchema.safeParse(body);
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
    const data = await Page.findByIdAndUpdate(_id, body);

    //delete the last data cached for this specific url and add this data
    revalidatePath("/admin/pages", "page"); //update the data cached for page list
    revalidatePath("/admin/pages/" + data?._id, "page"); // update data cached for this page/id

    return NextResponse.json(
      { message: "Page updated.", data },
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

    await Page.findByIdAndUpdate(_id, {
      status: "suspended",
    });

    return Response.json(
      {
        message: "Your Page has been deleted ✔️",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
