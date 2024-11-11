import Payment from "@/models/Payment";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  try {
    if (type) {
      const data = await Payment.aggregate([
        { $match: { type: type } },
        {
          $group: {
            _id: null,
            totalEarning: { $sum: "$amount_total" },
          },
        },
      ]);
      return NextResponse.json({ data }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
