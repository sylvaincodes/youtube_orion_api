import { dbConnect } from "@/lib/dbConnect";
import Category from "@/models/Category";
import { SubcategoryValidationSchema } from "@/types/schemas";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import Subcat from "@/models/Subcat";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");

  await dbConnect();
  try {
    if (_id) {
      const data = await Subcat.findById(_id).lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    const data = await Subcat.find().sort({ createdAt: -1 }).lean();
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
    const validatedFields = SubcategoryValidationSchema.safeParse(body);
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
    const data = await new Subcat(body).save();

    //delete the last data cached for this specific url and add this data
    revalidatePath("/admin/subcategories", "page");

    // Add sub category id to category
    if (data) {
      const newSubcate = {
        _id: data._id,
      };
      await Category.findByIdAndUpdate(body.category, {
        $push: { subCategory: newSubcate },
      });
    }

    return NextResponse.json(
      { message: "Subcat created.", data },
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
    const validatedFields = SubcategoryValidationSchema.safeParse(body);
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
    const data = await Subcat.findByIdAndUpdate(_id, body);

    //delete the last data cached for this specific url and add this data
    revalidatePath("/admin/subcategories", "page");
    revalidatePath("/admin/subcategories/" + data?._id, "page");

    return NextResponse.json(
      { message: "Subcat updated.", data },
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

    await Subcat.findByIdAndUpdate(_id, {
      status: "suspended",
    });

    return Response.json(
      {
        message: "Your Subcat has been deleted ✔️",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
