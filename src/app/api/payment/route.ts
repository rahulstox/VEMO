// src/app/api/payment/route.ts

import { client } from "@/lib/prisma"; // Prisma client import karein
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
    if (!user)
      return NextResponse.json({ status: 404, message: "User not found" });

    // Step 1: Clerk ID se user ka database ID get karein
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

    // Step 2: User ID ko subscription ke notes mein add karein
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID!,
      customer_notify: 1,
      total_count: 12,
      notes: {
        userId: dbUser.id, // User ka database ID yahan add karein
        clerkId: user.id, // Clerk ID bhi save kar sakte hain
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
