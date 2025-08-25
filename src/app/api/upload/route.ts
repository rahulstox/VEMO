import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, // Make sure you have this in your .env
  api_secret: process.env.CLOUDINARY_API_SECRET, // and this one too
});

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("video") as File;
    const workspaceId = formData.get("workspaceId") as string;

    if (!file || !workspaceId) {
      return NextResponse.json(
        { message: "Video file and workspaceId are required" },
        { status: 400 }
      );
    }

    // Convert file to buffer to upload
    const fileBuffer = await file.arrayBuffer();
    const mime = file.type;
    const encoding = "base64";
    const base64Data = Buffer.from(fileBuffer).toString("base64");
    const fileUri = "data:" + mime + ";" + encoding + "," + base64Data;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileUri, {
      resource_type: "video",
      folder: "opal", // Optional: saves videos in a specific folder in Cloudinary
    });

    // Create a record in your database
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

    const newVideo = await client.video.create({
      data: {
        title: file.name, // Default title to the filename
        description: "No description provided.",
        source: uploadResponse.public_id, // This is the unique ID from Cloudinary
        userId: dbUser.id,
        workSpaceId: workspaceId,
        processing: true, // Set to true initially
      },
    });

    console.log("New video created in DB:", newVideo);

    return NextResponse.json(
      { message: "Upload successful", video: newVideo },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
