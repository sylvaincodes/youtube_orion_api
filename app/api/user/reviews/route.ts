import { dbConnect } from "@/lib/dbConnect";
import Review from "@/models/Review";
import { reviewValidationSchema } from "@/types/schemas";
import { NextResponse } from "next/server";
import Store from "@/models/Store";
import Product from "@/models/Product";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");
  const storeId = searchParams.get("storeId");
  await dbConnect();
  try {
    if (storeId) {
      const data = await Review.find({ store: storeId })
        .populate("store")
        .exec();
      return NextResponse.json({ data }, { status: 200 });
    }
    if (_id) {
      const data = await Review.findById(_id).lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    const data = await Review.find({ status: "publish" })
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
    const validatedFields = reviewValidationSchema.safeParse(body);
    if (!validatedFields.success) {
      return Response.json(
        {
          message: "validation error",
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 200 }
      );
    }

    //check duplication
    // const checkDuplicate = await Review.findOne({
    //   $and: [
    //     {
    //       product: body.product,
    //     },

    //     {
    //       "user._id": body.user._id,
    //     },
    //   ],
    // }).lean();

    // if (checkDuplicate) {
    //   //update review
    //   const data = Review.findByIdAndUpdate(checkDuplicate._id, body);
    //   return NextResponse.json(
    //     { message: "Review updated.", data, success: true },
    //     { status: 200 }
    //   );
    // }

    // Save data to db
    const data = await new Review(body).save();

    // Add review id to store and to product
    if (data) {
      const newReview = {
        _id: data._id,
      };
      await Store.findByIdAndUpdate(body.store, {
        $push: { reviews: newReview },
      });

      await Product.findByIdAndUpdate(body.product, {
        $push: { reviews: newReview },
      });
    }

    return NextResponse.json(
      { message: "New review created.", data, success: true },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
