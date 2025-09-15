// src/app/api/transcript/webhook/route.ts
import { client } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // --- NEW SECURITY CHECK ---
  const secret = req.headers.get("x-webhook-secret");
  if (secret !== process.env.ASSEMBLYAI_WEBHOOK_SECRET) {
    console.warn("🔴 Unauthenticated webhook received.");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  // --- END OF SECURITY CHECK ---

  try {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");
    const userId = searchParams.get("userId");

    if (body.status === "completed") {
      if (!videoId || !userId) {
        throw new Error("Missing videoId or userId from webhook URL");
      }

      await client.video.update({
        where: { id: videoId },
        data: {
          summary: body.text,
          processing: false,
        },
      });

      await client.user.update({
        where: { id: userId },
        data: {
          aiCredits: {
            decrement: 1,
          },
        },
      });

      console.log(`✅ Webhook: Successfully processed video ${videoId}`);
    } else {
      console.warn(
        `Webhook received status: ${body.status} for video ${videoId}`
      );
    }

    return NextResponse.json({ status: 200, message: "Webhook received" });
  } catch (error: any) {
    console.error("🔴 Webhook Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
