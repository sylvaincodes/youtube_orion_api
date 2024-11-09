import { dbConnect } from "@/lib/dbConnect";
import { discountValidationSchema } from "@/types/schemas";
import { NextResponse } from "next/server";
import Discount from "@/models/Discount";

export async function POST(req: Request) {
  await dbConnect();
  try {
    // Get request values
    const body = await req.json();

    // Server side validation
    const validatedFields = discountValidationSchema.safeParse(body);
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

    const dates = Date.now();
    const couponCheck = await Discount.findOne({
      code: body.discount,
      status: "available",
      endDate: { $gte: dates },
    });

    if (couponCheck === null) {
      return Response.json(
        {
          message: "this coupon code is expired or is not found",
          data: couponCheck,
          success: false
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        message: "Discount applied!",
        data: couponCheck,
        success: true
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
