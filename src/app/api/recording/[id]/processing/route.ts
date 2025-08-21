// src/app/api/recording/[id]/processing/route.ts (Corrected)

import { client } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { id } = params;

    // Step 1: Request body se `workspaceId` get karein.
    // Yeh desktop app se bheja jaana chahiye.
    const { filename, workspaceId } = body;

    if (!filename || !workspaceId) {
      return NextResponse.json({
        status: 400,
        message: "Filename and workspaceId are required.",
      });
    }

    // Step 2: Hamesha personal workspace find karne ke bajaaye,
    // seedha provide ki gayi workspaceId ka istemaal karein.
    const startProcessingVideo = await client.workSpace.update({
      where: {
        id: workspaceId, // Yahan seedha workspaceId ka istemaal karein
      },
      data: {
        videos: {
          create: {
            source: filename,
            userId: id,
          },
        },
      },
      select: {
        User: {
          select: {
            subscription: {
              select: {
                plan: true,
              },
            },
          },
        },
      },
    });

    if (startProcessingVideo) {
      return NextResponse.json({
        status: 200,
        plan: startProcessingVideo.User?.subscription?.plan,
      });
    }

    return NextResponse.json({
      status: 400,
      message: "Failed to create video record in the specified workspace.",
    });
  } catch (error) {
    console.error("🔴 Error in processing video", error);
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}
