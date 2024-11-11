//get brands

import { dbConnect } from "@/lib/dbConnect";
import Brand from "@/models/Brand";
import { isValidObjectId } from "mongoose";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");

    if (_id) {
      if (!isValidObjectId(_id)) {
        return Response.json(
          {
            message: "_id is not valid",
          },
          {
            status: 404,
          }
        );
      } else {
        const data = Brand.findById(_id, {
          status: "publish",
        }).lean();

        return Response.json(
          {
            data,
          },
          {
            status: 200,
          }
        );
      }
    }

    const data = await Brand.find({
      status: "publish",
    }).lean();

    return Response.json(
      {
        data,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        error,
      },
      {
        status: 500,
      }
    );
  }
}
