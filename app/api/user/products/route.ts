import { dbConnect } from "@/lib/dbConnect";
import Product from "@/models/Product";
import { productValidationSchema } from "@/types/schemas";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import Color from "@/models/Color";
import Size from "@/models/Size";
import Store from "@/models/Store";
import Productvariant from "@/models/Productvariant";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");
  const storeId = searchParams.get("storeId");
  await dbConnect();
  try {
    if (storeId) {
      const data = await Product.find({ store: storeId }).exec();
      return NextResponse.json({ data }, { status: 200 });
    }

    if (_id) {
      const data = await Product.findById(_id)
        // .populate("category")
        // .populate("brand")
        // .populate("subCategories")
        .populate({
          path: "productVariants",
          model: Productvariant,
          populate: [
            {
              path: "color",
              model: Color,
            },
            {
              path: "size",
              model: Size,
            },
          ],
        })
        .lean();
      return NextResponse.json({ data }, { status: 200 });
    }

    return NextResponse.json({}, { status: 200 });
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
    const validatedFields = productValidationSchema.safeParse(body);
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
    const data = await new Product(body).save();

    const newPro = {
      _id: data._id,
    };

    await Store.findByIdAndUpdate(body.store, {
      $push: { products: newPro },
    });

    // Delete the last data cached for this specific url and add this data
    revalidatePath("/stores/" + body.store + "/products", "page");
    revalidatePath("/stores/" + body.store + "/products/" + data?._id, "page");

    return NextResponse.json(
      { message: "New product created.", data, success: true },
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
    const validatedFields = productValidationSchema.safeParse(body);
    if (!validatedFields.success) {
      return Response.json(
        {
          message: "validation error",
          success: false,
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 200 }
      );
    }

    // Update data to db
    const data = await Product.findByIdAndUpdate(_id, body);

    // const newPro = {
    //   _id: data._id,
    // };

    // await Store.findByIdAndUpdate(body.store, {
    //   $push: { products: newPro },
    // });

    // Delete the last data cached for this specific url and add this data
    revalidatePath("/stores/" + body.store + "/products", "page");
    revalidatePath("/stores/" + body.store + "/products/" + data?._id, "page");

    return NextResponse.json(
      { message: "Product updated.", data, success: true },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
