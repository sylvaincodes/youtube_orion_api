import TrackActivity from "@/models/Store";
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");

  await dbConnect();
  try {
    if (user_id) {
      const data = await TrackActivity.find({ user_id: user_id }).lean();
      return NextResponse.json({ data }, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
