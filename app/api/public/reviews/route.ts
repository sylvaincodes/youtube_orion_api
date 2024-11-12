import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Review from "@/models/Review";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product = searchParams.get("product");
  await dbConnect();
  try {
    if (product) {
      const data = await Review.find({ product: product }).exec();
      return NextResponse.json({ data }, { status: 200 });
    }
    const data = await Review.find().sort({ createdAt: 1 }).lean();
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
