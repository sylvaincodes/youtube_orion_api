import { dbConnect } from "@/lib/dbConnect";
import Withdrawal from "@/models/Withdrawal";
import { brandValidationSchema } from "@/types/schemas";
import { isValidObjectId } from "mongoose";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");

  await dbConnect();
  try {
    if (_id) {
      const data = await Withdrawal.findById(_id).lean();
      return Response.json({ data }, { status: 200 });
    }
    const data = await Withdrawal.find({
      $or: [
        {
          status: "publish",
        },
        {
          status: "pending",
        },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();
    return Response.json({ data }, { status: 200 });
  } catch (err) {
    return Response.json({ err }, { status: 500 });
  }
}

// update brand
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");

    if (!_id || !isValidObjectId(_id)) {
      return Response.json(
        {
          message: "id is not valid",
        },
        {
          status: 404,
        }
      );
    }

    const body = await req.json();

    //server side vvalidation
    const validatedFields = brandValidationSchema.safeParse(body);
    if (!validatedFields.success) {
      return Response.json(
        {
          message: "validation error",
          errors: validatedFields.error.flatten().fieldErrors,
        },
        {
          status: 200,
        }
      );
    }

    // update
    const data = await Withdrawal.findByIdAndUpdate(_id, body);

    return Response.json(
      { message: "Withdrawal updated", data },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      { error },
      {
        status: 500,
      }
    );
  }
}

// delete brand
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");

    if (!_id || !isValidObjectId(_id)) {
      return Response.json(
        {
          message: "id is not valid",
        },
        {
          status: 404,
        }
      );
    }

    //update status
    await Withdrawal.findByIdAndUpdate(_id, {
      status: "archive",
    });

    return Response.json(
      {
        message: "Withdrawal deleted",
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
