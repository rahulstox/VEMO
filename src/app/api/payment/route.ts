import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

// GET se POST mein badla gaya
export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ status: 404, message: "User not found" });

    const { plan } = await req.json(); // Frontend se plan get karein
    let planId = "";

    if (plan === "monthly") {
      planId = process.env.RAZORPAY_MONTHLY_PLAN_ID!;
    } else if (plan === "annually") {
      planId = process.env.RAZORPAY_ANNUAL_PLAN_ID!;
    } else {
      return NextResponse.json({
        status: 400,
        message: "Invalid plan specified",
      });
    }

    const dbUser = await client.user.findUnique({
      where: { clerkid: user.id },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json({
        status: 404,
        message: "Database user not found",
      });
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId, // Dynamic planId
      customer_notify: 1,
      total_count: 12,
      notes: {
        userId: dbUser.id,
        clerkId: user.id,
      },
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
