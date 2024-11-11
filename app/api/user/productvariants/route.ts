import { dbConnect } from "@/lib/dbConnect";
import Product from "@/models/Product";
import Productvariant from "@/models/Productvariant";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");
  const storeId = searchParams.get("storeId");
  await dbConnect();
  try {
    if (storeId) {
      const data = await Productvariant.find({ store: storeId })
        .populate("category")
        .populate("Productvariant")
        .exec();
      return NextResponse.json({ data }, { status: 200 });
    }
    if (_id) {
      const data = await Productvariant.findById(_id).lean();
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

    // Save data to db
    for (let index = 0; index < body.length; index++) {
      const element = body[index];
      const data = await new Productvariant(element).save();
      // Add sub product id to product
      if (data) {
        const newData = {
          _id: data._id,
        };

        await Product.findByIdAndUpdate(element.productId, {
          $push: { productVariants: newData },
        });
      } else {
        return NextResponse.json(
          { message: "Error.", data, success: false },
          { status: 200 }
        );
      }
    }

    return NextResponse.json(
      { message: "Product variant created..", body, success: true },
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
    const productId = searchParams.get("productId");

    if (!productId) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    /**Delete all Pvariants */

    const variants = await Productvariant.find({ productId: productId });
    for (let index = 0; index < variants.length; index++) {
      const variant = variants[index];

      await Productvariant.findByIdAndDelete(variant._id);
      await Product.findByIdAndUpdate(productId, {
        $pullAll: {
          productVariants: [variant._id],
        },
      });
    }

    return Response.json(
      {
        message: "Your variant has been deleted ✔️",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
