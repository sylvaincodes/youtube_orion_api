import { dbConnect } from "@/lib/dbConnect";
import Shipping from "@/models/Shipping";
import { NextResponse } from "next/server";
import Store from "@/models/Store";

export async function GET() {
  await dbConnect();
  try {
    const data = await Shipping.find({ status: "publish" })
      .populate({ path: "store", model: Store })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
