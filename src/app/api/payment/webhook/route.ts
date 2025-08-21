// src/app/api/payment/webhook/route.ts

import { client } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  // Step 1: Signature aur raw body ko get karein
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const signature = req.headers.get("x-razorpay-signature");
  const rawBody = await req.text();

  // Step 2: Signature ko verify karein
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json(
      { status: 401, message: "Invalid signature" },
      { status: 401 }
    );
  }

  // Step 3: Event data ko parse karein
  const event = JSON.parse(rawBody);

  // Step 4: Sirf 'subscription.charged' event ko handle karein
  if (event.event === "subscription.charged") {
    const subscription = event.payload.subscription.entity;
    const userId = subscription.notes.userId; // Jo humne Step A mein save kiya tha

    if (!userId) {
      console.error("🔴 Webhook Error: userId not found in subscription notes");
      return NextResponse.json(
        { status: 400, message: "User ID missing" },
        { status: 400 }
      );
    }

    try {
      // Step 5: Database mein user ka plan 'PRO' mein update karein
      await client.user.update({
        where: {
          id: userId,
        },
        data: {
          subscription: {
            update: {
              plan: "PRO",
              customerId: subscription.customer_id, // Customer ID save karein
            },
          },
        },
      });
      console.log(`✅ Subscription for user ${userId} upgraded to PRO.`);
    } catch (error) {
      console.error("🔴 Webhook Error: Failed to update database", error);
      return NextResponse.json(
        { status: 500, message: "Database update failed" },
        { status: 500 }
      );
    }
  }

  // Step 6: Razorpay ko success response bhejein
  return NextResponse.json({ status: 200, message: "Webhook received" });
}
