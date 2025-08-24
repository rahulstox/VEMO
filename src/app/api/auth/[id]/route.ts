// src/app/api/auth/[id]/route.ts (Corrected & Secured)

import { client } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } } // <-- Sirf 'params' yahan rakhein
) {
  const { id } = await params; // <-- 'await params' ko function ke andar le aayein

  // Step 1: Request header se API Key nikalein
  const authHeader = req.headers.get("Authorization");
  const apiKey = authHeader?.split(" ")[1]; // Format "Bearer <key>" se key nikalein

  // Step 2: API Key ko server ke secret key se compare karein
  if (apiKey !== process.env.DESKTOP_APP_API_KEY) {
    // Agar key match nahi hoti, to access deny karein
    return NextResponse.json(
      { status: 401, message: "Unauthorized" },
      { status: 401 }
    );
  }

  // Agar key sahi hai, tabhi aage ka code chalega
  console.log("Endpoint hit ✅ - Authorized");

  try {
    const userProfile = await client.user.findUnique({
      where: {
        clerkid: id,
      },
      include: {
        studio: true,
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (userProfile) {
      return NextResponse.json({ status: 200, user: userProfile });
    }

    const clerkclient = await clerkClient();
    const clerkUserInstance = await clerkclient.users.getUser(id);
    const createUser = await client.user.create({
      data: {
        clerkid: id,
        email: clerkUserInstance.emailAddresses[0].emailAddress,
        firstname: clerkUserInstance.firstName,
        lastname: clerkUserInstance.lastName,
        studio: { create: {} },
        workspace: {
          create: {
            name: `${clerkUserInstance.firstName}'s Workspace`,
            type: "PERSONAL",
          },
        },
        subscription: { create: {} },
      },
      include: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (createUser) {
      return NextResponse.json({ status: 201, user: createUser });
    }

    return NextResponse.json({ status: 400 });
  } catch (error) {
    console.log("🔴 ERROR", error);
    return NextResponse.json(
      { status: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
