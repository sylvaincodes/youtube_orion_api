import Payment from "@/models/Payment";
import Subscription from "@/models/Subscription";
import { NextResponse } from "next/server";
import { addDays } from "date-fns";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2024-06-20",
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");

  try {
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
