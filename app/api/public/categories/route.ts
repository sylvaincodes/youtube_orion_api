import SubCategory from "@/models/Subcat";
import { dbConnect } from "@/lib/dbConnect";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const _id = searchParams.get("_id");
    const slug = searchParams.get("slug");
    const aggregate = searchParams.get("aggregate");

    if (_id) {
      if (!isValidObjectId(_id)) {
        return NextResponse.json(
          { message: "This Id is not valid", success: false },
          { status: 404 }
        );
      }
      const data = await Category.findById(_id).lean();
      return NextResponse.json({ data }, { status: 200 });
    }

    if (slug) {
      const data = await Category.findOne({
        $and: [
          {
            status: "publish",
          },
          { slug: slug },
        ],
      })
        .populate({
          path: "subCategory",
          model: SubCategory,
        })
        .lean();
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
    const data = await Category.find({
      $and: [
        {
          status: "publish",
        },
      ],
    })
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
