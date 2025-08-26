// src/app/api/billing/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSubscription } from "@/actions/billing";

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();

    if (!plan || (plan !== "monthly" && plan !== "annually")) {
      return NextResponse.json(
        { message: "Invalid plan specified" },
        { status: 400 }
      );
    }

    const result = await createSubscription(plan);

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error("API Billing Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
