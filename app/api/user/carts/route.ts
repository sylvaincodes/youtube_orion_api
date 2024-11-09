import { dbConnect } from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import CartItem from "@/models/CartItem";
import { cartValidationSchema } from "@/types/schemas";
import { NextResponse } from "next/server";
import Productvariant from "@/models/Productvariant";
import Store from "@/models/Store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");

  await dbConnect();
  try {
    if (_id) {
      const data = await Cart.findById(_id)
        .populate({
          path: "cartItems",
          model: CartItem,
          populate: [
            {
              path: "variant",
              model: Productvariant,
            },
            {
              path: "store",
              model: Store,
            },
            {
              path: "cart",
              model: Cart,
            },
          ],
        })
        .lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    const data = await Cart.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    // Get request values
    const body = await req.json();

    // Server side validation
    const validatedFields = cartValidationSchema.safeParse(body);
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
    const cartData = await new Cart({
      user_id: body.user_id,
      subTotal: body.subTotal,
    }).save();

    //create each cart item
    // Save data to db
    for (let index = 0; index < body.cartItems.length; index++) {
      const element = body.cartItems[index];
      const cartItemData = await new CartItem({
        cart: cartData._id,
        variant: element.variant,
        store: element.store,
        qty: element.qty,
        productName: element.productName,
        productImage: element.productImage,
      }).save();
      // Add sub product id to product
      if (cartItemData) {
        const newData = {
          _id: cartItemData._id,
        };

        await Cart.findByIdAndUpdate(cartData._id, {
          $push: { cartItems: newData },
        });
      } else {
        return NextResponse.json(
          { message: "Error.", cartItemData, success: false },
          { status: 200 }
        );
      }
    }

    return NextResponse.json(
      { message: "New cart created.", data: cartData, success: true },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
