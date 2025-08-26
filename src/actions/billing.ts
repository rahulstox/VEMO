// src/actions/billing.ts
"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createSubscription = async (plan: "monthly" | "annually") => {
  try {
    const user = await currentUser();
    if (!user) return { status: 401, message: "Unauthorized" };

    const dbUser = await client.user.findUnique({
      where: { clerkid: user.id },
      include: { subscription: true },
    });

    if (!dbUser || !dbUser.subscription) {
      return { status: 404, message: "User or subscription not found." };
    }

    const planId =
      plan === "monthly"
        ? process.env.RAZORPAY_MONTHLY_PLAN_ID!
        : process.env.RAZORPAY_ANNUAL_PLAN_ID!;

    let customerId = dbUser.subscription.customerId;

    // --- THE FINAL, ROBUST FIX ---
    if (!customerId) {
      // If we don't have a customerId, search for one on Razorpay by email
      const customerEmail = user.emailAddresses[0].emailAddress;
      const existingCustomers = await razorpay.customers.all({
        email: customerEmail,
      });

      if (existingCustomers.items.length > 0) {
        // If we find a customer, use their ID
        customerId = existingCustomers.items[0].id;
      } else {
        // If no customer is found, create a new one
        const newCustomer = await razorpay.customers.create({
          name: `${user.firstName} ${user.lastName}`,
          email: customerEmail,
        });
        customerId = newCustomer.id;
      }

      // Save the customerId to our database for future use
      await client.subscription.update({
        where: { userId: dbUser.id },
        data: { customerId: customerId },
      });
    }
    // --- END OF FIX ---

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_id: customerId, // We are now certain we have a valid customerId
      total_count: plan === "monthly" ? 12 : 1,
      quantity: 1,
      notes: { userId: dbUser.id },
    });

    await client.subscription.update({
      where: { userId: dbUser.id },
      data: {
        razorpaySubscriptionId: subscription.id,
        razorpayPlanId: planId,
      },
    });

    return {
      status: 200,
      data: {
        subscriptionId: subscription.id,
        razorpayKey: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, // Make sure this key is in .env
        userEmail: user.emailAddresses[0].emailAddress,
      },
    };
  } catch (error: any) {
    console.error("Billing Action Error:", error);
    return {
      status: 500,
      message:
        error.error?.description ||
        error.message ||
        "An internal error occurred",
    };
  }
};
