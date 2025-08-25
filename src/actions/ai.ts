// src/actions/ai.ts
"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const runAiTool = async (videoId: string, task: "summarize") => {
  console.log("--- 🚀 AI Action Started! ---");
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 401, message: "Unauthorized" };
    }

    const dbUser = await client.user.findUnique({
      where: { clerkid: user.id },
    });

    if (!dbUser) {
      return { status: 404, message: "User not found" };
    }

    // Check for AI credits
    if (dbUser.aiCredits <= 0) {
      return { status: 402, message: "Please upgrade to Pro to use AI tools." };
    }

    const video = await client.video.findUnique({
      where: { id: videoId },
    });

    // The 'summery' field in your schema holds the transcript
    if (!video || !video.summery) {
      return {
        status: 404,
        message:
          "A transcript is required to generate a summary. Please transcribe the video first.",
      };
    }

    let aiResponseContent = "";

    if (task === "summarize") {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are an expert video assistant. Based on the following transcript, generate a concise and compelling title (max 10 words) and a summary (max 50 words). Format your response as a valid JSON object with two keys: "title" and "description". Do not include any other text or markdown formatting. Transcript: "${video.summery}"`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonString = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      aiResponseContent = jsonString;
    } else {
      return { status: 400, message: "Invalid AI task specified." };
    }

    if (!aiResponseContent) {
      return { status: 500, message: "AI failed to generate a response." };
    }

    const { title, description } = JSON.parse(aiResponseContent);

    // Use a transaction to update the video and decrement credits together
    await client.$transaction([
      client.video.update({
        where: { id: videoId },
        data: {
          title: title,
          description: description,
          processing: false,
        },
      }),
      client.user.update({
        where: { id: dbUser.id },
        data: {
          aiCredits: {
            decrement: 1,
          },
        },
      }),
    ]);

    return { status: 200, message: "AI task completed successfully!" };
  } catch (error) {
    console.error("AI Action Error:", error);
    return { status: 500, message: "An internal error occurred." };
  }
};
