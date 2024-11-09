import { formatAmountForStripe } from "@/lib/utils";
import Payment from "@/models/Payment";
import Subscription from "@/models/Subscription";
import { NextResponse } from "next/server";
import { addDays } from "date-fns";
import Stripe from "stripe";
import { checkRole } from "@/lib/roles";
import { revalidatePath } from "next/cache";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2024-06-20",
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");
  const user_id = searchParams.get("user_id");

  try {
    if (user_id) {
      const data = await Subscription.findOne({ user_id: user_id })
        .populate("payments")
        .lean();

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

    if (session_id && session_id.startsWith("cs_")) {
      //Get payment intent info
      const data: Stripe.Checkout.Session =
        await stripe.checkout.sessions.retrieve(session_id, {
          expand: ["payment_intent"],
        });

      //Update payment checkout
      const payment = await Payment.findOneAndUpdate(
        { checkout_id: session_id },
        {
          checkout_status: data.status,
          payment_intent: data.payment_intent,
          payment_status: data.payment_status,
          amount_subtotal: data.amount_subtotal,
          amount_total: data.amount_total,
          amount_discount: data.total_details?.amount_discount,
          amount_tax: data.total_details?.amount_shipping,
          amount_shipping: data.total_details?.amount_shipping,
        }
      );

      // Update subscription to pro
      const endDate = addDays(new Date(Date.now()), 30);
      if (payment && data?.payment_status === "paid") {
        await Subscription.findByIdAndUpdate(payment.subscription, {
          type: "pro",
          startDate: new Date(),
          endDate: endDate,
          status: "active",
        });
      } else {
        return NextResponse.json(
          { message: "Your payment failed. Check Stripe log" },
          { status: 500 }
        );
      }

      return NextResponse.json({ data }, { status: 200 });
    }

    return NextResponse.json({}, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
export async function POST(req: Request) {
  const body = await req.json();

  try {
    const data = await Subscription.findOne({ user_id: body.user_id }).lean();

    // check role

    if (await checkRole("admin")) {
      return NextResponse.json(
        { message: "you are an admin. create a seller account" },
        { status: 200 }
      );
    }
    // check subscription
    if (data) {
      //check he has an active sub
      const now = new Date(Date.now());
      if (data.endDate && data.endDate > now) {
        return NextResponse.json(
          { message: "you have an active subscription" },
          { status: 200 }
        );
      }
    }

    // Create Checkout Sessions from body params.
    const params: Stripe.Checkout.SessionCreateParams = {
      submit_type: "auto",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: formatAmountForStripe(body.amount, "usd"),
            product_data: {
              name: "Orion Store - Subscription Pro 1 Month",
              // description: single.description.slice(0, 50),
              images: [
                "https://cdn-icons-png.flaticon.com/128/11282/11282345.png",
              ],
              metadata: {
                user_id: body.user_id,
              },
            },
          },
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/result`,
      shipping_address_collection: {
        allowed_countries: [
          "US",
          "CA",
          "FR",
          "CH",
          "IN",
          "BR",
          "PK",
          "GH",
          "SN",
        ],
      },
    };
    const session: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create(params);

    //if session created creat a new payment
    const sub = await Subscription.findOne({ user_id: body.user_id }).lean();
    await new Payment({
      subscription: sub?._id,
      checkout_id: session.id,
      checkout_status: "open",
    }).save();

    return NextResponse.json(
      { id: session.id, message: "Checkout success, redirecting..." },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
