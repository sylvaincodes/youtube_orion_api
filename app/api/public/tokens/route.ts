import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Token from "@/models/Token";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const template = searchParams.get("template");

    if (!template) {
      return NextResponse.json(
        {
          message: "template is empty",
        },
        {
          status: 401,
        }
      );
    }

    const data = await Token.findOne(
      {
        $and: [
          {
            template: template,
          },
          {
            status: "draft",
          },
        ],
      },
      {
        token: 1, //select properties
      }
    );

    if (!data) {
      return NextResponse.json(
        {
          message: "template is not found",
        },
        {
          status: 401,
        }
      );
    }
    return NextResponse.json(
      {
        data,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error,
      },
      {
        status: 500,
      }
    );
  }
}
