import SubCategory from "@/models/Subcat";
import { dbConnect } from "@/lib/dbConnect";
import Category from "@/models/Category";
import { categoryValidationSchema } from "@/types/schemas";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");
  const aggregate = searchParams.get("aggregate");

  await dbConnect();
  try {
    if (_id) {
      const data = await Category.findById(_id).lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    if (aggregate && _id) {
      const data = await Category.aggregate([
        {
          $lookup: {
            from: "subcategories",
            localField: "_id",
            foreignField: "category",
            as: "inventory_docs",
          },
        },
      ]);
      return NextResponse.json({ data }, { status: 200 });
    }
    const data = await Category.find()
      .populate({
        path: "subCategory",
        model: SubCategory,
      })
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
    const data = await new Category(body).save();

    //delete the last data cached for this specific url and add this data
    revalidatePath("/admin/categories", "page");

    return NextResponse.json(
      { message: "Category created.", data },
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
      await Category.findByIdAndUpdate(_id, {
        subCategory: body.subCategory,
      });

      return NextResponse.json(
        { message: "Category updated." },
        { status: 200 }
      );
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
    const data = await Category.findByIdAndUpdate(_id, body);

    //delete the last data cached for this specific url and add this data
    revalidatePath("/admin/categories", "page");
    revalidatePath("/admin/categories/" + data?._id, "page");

    return NextResponse.json(
      { message: "Category updated.", data },
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

    await Category.findByIdAndUpdate(_id, {
      status: "suspended",
    });

    return Response.json(
      {
        message: "Your Category has been deleted ✔️",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
