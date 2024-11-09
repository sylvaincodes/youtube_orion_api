import Address from "@/models/Address";
import ProductVariant from "@/models/Productvariant";
import { dbConnect } from "@/lib/dbConnect";
import { OrderValidationSchema } from "@/types/schemas";
import { NextResponse } from "next/server";
import Order from "@/models/Order";
import OrderItem from "@/models/Orderitem";
import Store from "@/models/Store";
import TrackOrder from "@/models/Trackorder";
import Stripe from "stripe";
import { formatAmountForStripe } from "@/lib/utils";
import Payment from "@/models/Payment";
import CartItem from "@/models/CartItem";
import Productvariant from "@/models/Productvariant";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2024-06-20",
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");
  const storeId = searchParams.get("storeId");
  const user_id = searchParams.get("user_id");

  await dbConnect();
  try {
    if (user_id) {
      const data = await Order.find({ customer: user_id }).lean();
      return NextResponse.json({ data }, { status: 200 });
    }

    if (_id) {
      const data = await Order.findById(_id)
        .populate({
          path: "orderitems",
          model: OrderItem,
          populate: [
            {
              path: "cartItem",
              model: CartItem,
              populate: [
                {
                  path: "variant",
                  model: Productvariant,
                },
              ],
            },
            {
              path: "store",
              model: Store,
            },

            {
              path: "trackorder",
              model: TrackOrder,
            },
            {
              path: "address",
              model: Address,
            },
          ],
        })
        .lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    const data = await Order.find({ store: storeId }, { url: 1, _id: 0 })
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
    // Get request values
    const body = await req.json();

    // Server side validation
    const validatedFields = OrderValidationSchema.safeParse(body);
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
    const order = await new Order({
      subTotal: body.subTotal,
      pmethod: body.pmethod,
      total: body.total,
      discount: body.discount,
      shipping: body.shipping,
      tax: body.tax,
      customer: body.user_id,
    }).save();

    // create Order items

    // format lineitems
    const lineItems = [];
    for (let index = 0; index < body.cartItems.length; index++) {
      const element = body.cartItems[index];
      const orderitem = await new OrderItem({
        cartItem: element._id,
        shipping: element.shipping,
        address: body.address,
        shippingAmount: element.shippingAmount,
        store: element.store,
        order: order._id,
      }).save();

      //push to order
      const newOrderItem = {
        _id: orderitem._id,
      };
      await Order.findByIdAndUpdate(order._id, {
        $push: { orderitems: newOrderItem },
      });

      //push to store
      await Store.findByIdAndUpdate(element.store, {
        $push: { orderitems: orderitem._id },
      });

      // create track order
      const track = await new TrackOrder({
        orderitem: orderitem._id,
      }).save();

      //push to order item
      await OrderItem.findByIdAndUpdate(orderitem, {
        trackorder: track._id,
      });
    }

    const allOrderItems = await OrderItem.find({ order: order._id }).populate({
      path: "cartItem",
      model: CartItem,
      populate: [
        {
          path: "variant",
          model: ProductVariant,
        },
      ],
    });

    for (let index = 0; index < allOrderItems.length; index++) {
      const element = allOrderItems[index];

      lineItems.push({
        quantity: element.cartItem.qty,
        price_data: {
          currency: "usd",
          unit_amount: formatAmountForStripe(
            (element.cartItem.variant.price *
              (100 - element.cartItem.variant.discount)) /
              100,
            "usd"
          ),
          product_data: {
            name: element.cartItem.productName,
            description: element.cartItem.variant.name,
            images: [element.cartItem.productImage],
          },
        },
      });
    }

    const discounts: { coupon: string }[] = [];
    // create discount
    // if (order.discount > 0) {
    //   const coupon = await stripe.coupons.create({
    //     // percent_off: order.discount,
    //     amount_off: order.discount,
    //     currency: "usd",
    //     duration: "once",
    //     id: "order-3",
    //   });
    //   discounts = [
    //     {
    //       coupon: coupon.id,
    //     },
    //   ];
    // }

    //shipping
    // const coupon = await stripe.shi

    // Create Checkout Sessions from body params.
    const params: Stripe.Checkout.SessionCreateParams = {
      submit_type: "auto",
      payment_method_types: ["card"],
      line_items: lineItems,
      discounts: discounts,
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: formatAmountForStripe(order.shipping, "usd"),
              currency: "usd",
            },
            display_name: "Order shipping",
            delivery_estimate: {
              maximum: {
                unit: "business_day",
                value: 30,
              },
            },
          },
        },
      ],
      // automatic_tax: {
      //   enabled: true,
      // },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/payments?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/customer/orders`,
      // shipping_address_collection: {
      //   allowed_countries: [
      //     "US",
      //     "CA",
      //     "FR",
      //     "CH",
      //     "IN",
      //     "BR",
      //     "PK",
      //     "GH",
      //     "SN",
      //   ],
      // },
    };
    const session: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create(params);

    //if session created create a new payment
    await new Payment({
      order: order._id,
      checkout_id: session.id,
      checkout_status: "open",
    }).save();

    return NextResponse.json(
      { id: session.id, message: "New Order created, redirecting..." },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
