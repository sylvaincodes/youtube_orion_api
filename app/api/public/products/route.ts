// @ts-nocheck
import { isValidObjectId } from "mongoose";
import { dbConnect } from "@/lib/dbConnect";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import Category from "@/models/Category";
import SubCategory from "@/models/Subcat";
import ProductVariant from "@/models/Productvariant";
import Brand from "@/models/Brand";
import Size from "@/models/Size";
import Color from "@/models/Color";
import Review from "@/models/Review";
import Collection from "@/models/Collection";
import { TypeProductModel } from "@/types/models";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get("_id");
  const brand = searchParams.get("brand");
  const category = searchParams.get("category");
  const slug = searchParams.get("slug");
  const storeId = searchParams.get("storeId");
  const style = searchParams.get("style");
  const search = searchParams.get("search");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const filter = searchParams.get("filter");

  await dbConnect();
  try {
    if (style) {
      const product: TypeProductModel[] = await Product.find({
        $and: [
          {
            $or: [
              {
                brand: brand ? brand : { $ne: null },
              },
              // {
              //   tag: tag ? { $in: [tag] } : { $ne: null },
              // },
            ],
          },
          {
            price: { $gte: minPrice, $lte: maxPrice },
          },
          {
            category: category ? category : { $ne: null },
          },
          {
            status: "publish",
          },
        ],
      })
        .populate({ path: "reviews", model: Review })
        .sort({ name: 1 });

      if (filter) {
        if (filter === "alphabetic") {
          const data = product.sort((a: any, b: any) => {
            return b.name - a.name;
          });
          return Response.json({ data }, { status: 200 });
        }

        if (filter === "latest") {
          const data = product.sort((a: any, b: any) => {
            return b.createdAt - a.createdAt;
          });
          return Response.json({ data }, { status: 200 });
        }

        if (filter === "priceHighToLow") {
          const data = product.sort((a: any, b: any) => {
            return b.price - a.price;
          });
          return Response.json({ data }, { status: 200 });
        }

        if (filter === "priceLowToHigh") {
          const data = product.sort((a: any, b: any) => {
            return a.price - b.price;
          });
          return Response.json({ data }, { status: 200 });
        }
      }

      return Response.json({ product }, { status: 200 });
    }
    if (search) {
      const products = await Product.find({
        $and: [
          {
            name: { $regex: ".*" + search, $options: "is" },
          },
          {
            status: "publish",
          },
        ],
      })
        .limit(10)
        .lean();

      return Response.json({ success: true, data: products }, { status: 200 });
    }

    if (_id) {
      if (!isValidObjectId(_id)) {
        return NextResponse.json(
          { message: "This Id is not valid", success: false },
          { status: 404 }
        );
      }
      await Product.findByIdAndUpdate(_id, {
        $inc: { views: +1 },
      });
      const data = await Product.findById(_id).lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    if (slug) {
      await Product.findByIdAndUpdate(_id, {
        $inc: { views: +1 },
      });
      const data = await Product.findOne({
        $and: [
          { slug: slug },
          {
            status: "publish",
          },
        ],
      })
        .populate({ path: "category", model: Category })
        .populate({ path: "brand", model: Brand })
        .populate({ path: "collections", model: Collection })
        .populate({ path: "reviews", model: Review })
        .populate({
          path: "productVariants",
          model: ProductVariant,
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
        .populate({ path: "subCategories", model: SubCategory })
        .lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    if (storeId) {
      if (!isValidObjectId(storeId)) {
        return NextResponse.json(
          { message: "This Id is not valid", success: false },
          { status: 404 }
        );
      }

      const data = await Product.find({
        $and: [
          { store: storeId },
          {
            status: "publish",
          },
        ],
      }).exec();
      return NextResponse.json({ data }, { status: 200 });
    }
    const data = await Product.find({
      $and: [
        {
          status: "publish",
        },
      ],
    })
      .populate({
        path: "collections",
        model: Collection,
      })
      .sort({ createdAt: 1 })
      .lean();
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
