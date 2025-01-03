import { dbConnect } from "@/lib/dbConnect";
import Product from "@/models/Product";
import Slide from "@/models/Slide";
import Collection from "@/models/Collection";
import SlideItem from "@/models/Slideitem";
import { NextResponse } from "next/server";
import Productvariant from "@/models/Productvariant";
import { isValidObjectId } from "mongoose";
import Review from "@/models/Review";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const _id = searchParams.get("_id");
    const slug = searchParams.get("slug");

    if (_id) {
      if (!isValidObjectId(_id)) {
        return NextResponse.json(
          { message: "This Id is not valid", success: false },
          { status: 404 }
        );
      }
      const data = await Slide.findById(_id).lean();
      return NextResponse.json({ data }, { status: 200 });
    }

    if (slug) {
      const data = await Slide.find({
        $and: [
          {
            status: "publish",
          },
          { slug: slug },
        ],
      })
        .populate({
          path: "slideItem",
          model: SlideItem,
          match: { status: "approve" },
          populate: [
            {
              path: "product",
              model: Product,
              populate: [
                {
                  path: "collections",
                  model: Collection,
                },
                {
                  path: "reviews",
                  model: Review,
                },
                {
                  path: "productVariants",
                  model: Productvariant,
                  populate: [
                    {
                      path: "productId",
                      model: Product,
                    },
                  ],
                },
              ],
            },
          ],
        })
        .lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    const data = await Slide.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
