import { dbConnect } from "@/lib/dbConnect";
import Newsletter from "@/models/Newsletter";
import { newsletterValidationSchema } from "@/types/schemas";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  try {
    if (email) {
      const newsletter = await Newsletter.findOne({ email }).lean();

      if (newsletter) {
        return NextResponse.json(
          { message: "you already subscribed!" },
          { status: 200 }
        );
      }
    }

    const newsletter = await Newsletter.find().lean();

    return NextResponse.json({ data: newsletter }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, subject, message } = body;

    // Server side validation
    const validatedFields = newsletterValidationSchema.safeParse({
      email: email,
      subject: subject,
      message: message,
    });
    if (!validatedFields.success) {
      return Response.json(
        {
          message: "validation error",
          success: false,
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 200 }
      );
    }

    // check duplicate
    const check = await Newsletter.findOne({ email });
    if (check) {
      return Response.json(
        { message: "This email already subscribed", success: false },
        { status: 200 }
      );
    }

    // Save to db
    await new Newsletter({ email }).save();
    return NextResponse.json(
      { message: "Thanks for you subscription.", success: true },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
