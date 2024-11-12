import { dbConnect } from "@/lib/dbConnect";
import Page from "@/models/Page";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get("_id");
  await dbConnect();
  try {
    if (_id) {
      const data = await Page.findById({
        $and: [
          {
            status: "publish",
          },
          { _id: _id },
        ],
      }).lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    const data = await Page.find({
      status: "publish",
    })
      .sort({ createdAt: 1 })
      .lean();
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
