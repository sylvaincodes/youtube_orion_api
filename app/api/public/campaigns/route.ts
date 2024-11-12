import { dbConnect } from "@/lib/dbConnect";
import SlideItem from "@/models/Slideitem";
import Slideitem from "@/models/Slideitem";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaignId");

    if (campaignId && !isValidObjectId(campaignId)) {
      return NextResponse.json(
        { message: "This Id is not valid", success: false },
        { status: 404 }
      );
    }

    //update view +1
    if (campaignId) {
      await Slideitem.findByIdAndUpdate(campaignId, {
        $inc: { views: +1 },
      });

      // update campaign list
      const one_day = 1000 * 60 * 60 * 24;
      const campaings = await SlideItem.find({ status: "approve" }).lean();
      const now = new Date();
      for (let index = 0; index < campaings.length; index++) {
        const campaign = campaings[index];
        if (campaign.views > 0 && campaign.approvedAt) {
          const days = Math.round(
            (now.getTime() - campaign.approvedAt.getTime()) / one_day
          );
          if (days >= 2) {
            //update the campain
            await SlideItem.findByIdAndUpdate(campaign._id, {
              status: "archive",
            });
          }
        }
      }
      return NextResponse.json({}, { status: 200 });
    }
    
    const data = await Slideitem.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
