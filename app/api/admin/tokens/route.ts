import { dbConnect } from "@/lib/dbConnect";
import token from "@/models/Token";
import { tokenValidationSchema } from "@/types/schemas";
import { NextResponse } from "next/server";

//save api token
export async function POST(req: Request) {
  try {
    //connect db
    await dbConnect();

    //get request body
    const body = await req.json();

    //Server side validation
    const validatedFields = tokenValidationSchema.safeParse(body);
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

    // save to db
    const data = await new token(body).save();

    return NextResponse.json(
      {
        message: "New token added",
        data,
      },
      {
        status: 201,
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
