import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Tag from "@/models/Tag";

export async function GET() {
  await dbConnect();
  try {
    const data = await Tag.find().lean();
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
