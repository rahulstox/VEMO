import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function GET() {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  try {
    const plan = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: "Starter Plan",
        description: "Basic monthly subscription",
        amount: 49900, // 499.00 INR in paise
        currency: "INR",
      },
    });

    return NextResponse.json({
      status: 200,
      plan_id: plan.id,
      message: "Plan created successfully",
    });
  } catch (error: any) {
    console.error("Plan creation error:", error);
    return NextResponse.json({
      status: 500,
      error: error.error?.description || error.message,
    });
  }
}
