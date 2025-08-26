// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";

// We only need the AssemblyAI client here now
const assemblyai = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: process.env.ASSEMBLYAI_API_KEY,
    "content-type": "application/json",
  },
});

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // The frontend will now send JSON data instead of a file
    const body = await req.json();
    const { public_id, version, format, original_filename, workspaceId } = body;

    // Find the user in our database
    const dbUser = await client.user.findUnique({
      where: { clerkid: user.id },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json(
        { message: "User not found in DB" },
        { status: 404 }
      );
    }

    // Save the video details to our database
    const newVideo = await client.video.create({
      data: {
        title: original_filename,
        source: public_id, // The public_id from Cloudinary is our source
        userId: dbUser.id,
        workSpaceId: workspaceId,
        processing: true,
      },
    });

    // Construct the final, public video URL to send to AssemblyAI
    const videoUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/v${version}/${public_id}.${format}`;

    // Start the transcription process by calling the webhook
    await assemblyai.post("/transcript", {
      audio_url: videoUrl,
      webhook_url: `${process.env.HOST_URL}/api/transcript/webhook?videoId=${newVideo.id}&userId=${dbUser.id}`,
      webhook_auth_header_name: "x-webhook-secret",
      webhook_auth_header_value: process.env.ASSEMBLYAI_WEBHOOK_SECRET!,
      language_detection: true,
    });

    console.log(
      `✅ Direct upload successful. Transcription started for video: ${newVideo.id}`
    );

    return NextResponse.json(
      {
        message: "Upload successful, processing has started.",
        video: newVideo,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      "🔴 Save Upload API error:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
