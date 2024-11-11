import { dbConnect } from "@/lib/dbConnect";
import Brand from "@/models/Brand";
import { brandValidationSchema } from "@/types/schemas";
import { isValidObjectId } from "mongoose";

// create brand
export async function POST(req: Request) {
  try {
    await dbConnect();

    //get request
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

    // save data
    const data = await new Brand(body).save();

    return Response.json(
      {
        message: "New brand added",
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
    const data = await Brand.findByIdAndUpdate(_id, body);

    return Response.json(
      { message: "Brand updated", data },
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
    await Brand.findByIdAndUpdate(_id, {
      status: "archive",
    });

    return Response.json(
      {
        message: "Brand deleted",
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
