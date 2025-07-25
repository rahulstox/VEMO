import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ status: 404 });

    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID!,
      customer_notify: 1,
      total_count: 12, // Optional: limit how many times to charge (e.g., 12 months)
    });

    return NextResponse.json({
      status: 200,
      subscription_id: subscription.id,
      user_email: user.emailAddresses[0]?.emailAddress,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: 500 });
  }
}
