import { dbConnect } from "@/lib/dbConnect";
import Pmethod from "@/models/Pmethod";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const data = await Pmethod.find({ status: "publish" })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
