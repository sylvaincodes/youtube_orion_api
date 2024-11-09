import { dbConnect } from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";
import { brandValidationSchema } from "@/types/schemas";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");
  const user_id = searchParams.get("user_id");
  const type = searchParams.get("type");

  await dbConnect();
  try {
    if (type && type === "paid") {
      const data = await Subscription.find({
        type: "paid",
      });
      return NextResponse.json({ data }, { status: 200 });
    }
    if (user_id) {
      const data = await Subscription.findOne({ user_id: user_id }).lean();

      if (data) {
        //check he has an active sub
        const now = new Date(Date.now());
        if (data.endDate && data.endDate < now) {
          //update the subscription
          const news = await Subscription.findByIdAndUpdate(data._id, {
            type: "free",
            status: "ended",
          });
          revalidatePath("/"); //rebuild all the website
          return NextResponse.json({ data: news }, { status: 200 });
        }
      }
      return NextResponse.json({ data }, { status: 200 });
    }

    if (_id) {
      const data = await Subscription.findById(_id).populate("store").exec();
      return NextResponse.json({ data }, { status: 200 });
    }
    const data = await Subscription.find()
      .populate("store")

      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    //Get request values
    const body = await req.json();

    // Server side validation
    const validatedFields = brandValidationSchema.safeParse(body);
    if (!validatedFields.success) {
      return Response.json(
        {
          message: "validation error",
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 200 }
      );
    }

    // Save data to db
    const data = await new Subscription(body).save();

    return NextResponse.json(
      { message: "Subscription created.", data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get("_id");
  try {
    //check if _id exist
    if (!_id) {
      return NextResponse.json({ message: "_id is missing" }, { status: 200 });
    }

    //Get request values
    const body = await req.json();

    // Server side validation
    const validatedFields = brandValidationSchema.safeParse(body);
    if (!validatedFields.success) {
      return Response.json(
        {
          message: "validation error",
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 200 }
      );
    }

    // Update data to db
    const data = await Subscription.findByIdAndUpdate(_id, body);

    return NextResponse.json(
      { message: "Subscription updated.", data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");

    if (!_id) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    await Subscription.findByIdAndUpdate(_id, {
      status: "suspended",
    });

    return Response.json(
      {
        message: "Your Subscription has been deleted ✔️",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
