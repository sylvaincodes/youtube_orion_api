import { dbConnect } from "@/lib/dbConnect";
import Store from "@/models/Store";
import Subscription from "@/models/Subscription";
import { storeValidationSchema } from "@/types/schemas";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");
  const userId = searchParams.get("userId");
  const _id = searchParams.get("_id");
  const action = searchParams.get("action");

  try {
    let data = [];

    if (action && action === "getsellers") {
      data = await Store.find({});
      return NextResponse.json({ data }, { status: 200 });
    }
    if (storeId && userId) {
      data = await Store.findOne({
        $and: [
          {
            _id: storeId,
            status: { $ne: "suspended" },
          },
          {
            user_id: userId,
          },
        ],
      });
      return NextResponse.json({ data }, { status: 200 });
    }

    if (userId) {
      const data = await Store.find({
        $and: [
          {
            status: { $ne: "suspended" },
          },
          {
            user_id: userId,
          },
        ],
      });
      return NextResponse.json({ data }, { status: 200 });
    }

    if (userId) {
      data = await Store.find({
        $and: [
          { status: { $ne: "suspended" } },
          {
            user_id: userId,
          },
        ],
      })
        .sort({ createdAt: -1 })
        .lean();
    }

    if (_id) {
      const data = await Store.findOne({
        $and: [{ _id: _id }, { status: { $ne: "suspended" } }],
      }).exec();

      // const response = await clerkClient.users.getUser(store?.user_id);
      return NextResponse.json({ data }, { status: 200 });
    }
    data = await Store.find({
      $and: [{ status: { $ne: "suspended" } }],
    })
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
    const validatedFields = storeValidationSchema.safeParse(body);
    if (!validatedFields.success) {
      return Response.json(
        {
          message: "validation error",
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 200 }
      );
    }

    //check subscription
    const checkSub = await Subscription.findOne({
      user_id: body.user_id,
    }).lean();

    if (checkSub) {
      //so user has already one store

      //check if user has an active subscription
      if (checkSub.type === "free" || checkSub.status !== "active") {
        return NextResponse.json(
          { message: "Upgrade to Pro to create more store✔️", success: false },
          { status: 200 }
        );
      }
    }

    // else this is the first time he create an store

    // Save data to db
    const data = await new Store(body).save();

    // Create subscription
    const subs = {
      store: data._id,
      startDate: new Date(),
      user_id: body.user_id,
      type: "free",
    };
    await new Subscription(subs).save();

    return NextResponse.json(
      { message: "Store created ✔️", data, success: true },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get("storeId");
  try {
    //check if _id exist
    if (!_id) {
      return NextResponse.json({ message: "_id is missing" }, { status: 200 });
    }

    //Get request values
    const body = await req.json();

    // Server side validation
    const validatedFields = storeValidationSchema.safeParse(body);
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
    const data = await Store.findByIdAndUpdate(_id, body);

    //delete the last data cached for this specific url and add this data
    revalidatePath("/stores/" + _id + "/settings", "page");
    revalidatePath("/admin/stores", "page");

    return NextResponse.json(
      { message: "Store updated ✔️", data },
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
    const storeId = searchParams.get("storeId");

    if (!storeId) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    await Store.findByIdAndUpdate(storeId, {
      status: "suspended",
    });

    return Response.json(
      {
        message: "Your store has been deleted ✔️",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
