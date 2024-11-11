import { dbConnect } from "@/lib/dbConnect";
import Tag from "@/models/Tag";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");

  await dbConnect();
  try {
    if (_id) {
      const data = await Tag.findById(_id).lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    const data = await Tag.find({ status: "publish" })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
