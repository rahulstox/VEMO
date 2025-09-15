// src/actions/ai.ts
"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const assemblyai = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: process.env.ASSEMBLYAI_API_KEY,
    "content-type": "application/json",
  },
});

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

    // The 'summary' field in your schema holds the transcript
    if (!video || !video.summary) {
      return {
        status: 404,
        message:
          "A transcript is required to generate a summary. Please transcribe the video first.",
      };
    }

    let aiResponseContent = "";

    if (task === "summarize") {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are a creative assistant for a video platform called VEMO. Your task is to analyze the following video transcript and generate a compelling title and a concise, engaging summary.

**Instructions:**
1.  **Title:** Must be creative, relevant to the content, and no more than 6 words.
2.  **Description:** Must be a well-written summary of the transcript, no more than 50 words.
3.  **Format:** Your response MUST be a valid JSON object with ONLY two keys: "title" and "description". Do not include any other text, explanations, or markdown formatting like \`\`\`json.

**Transcript:**
"${video.summary}"`;

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

export const transcribeVideo = async (videoId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 401, message: "Unauthorized" };

    const dbUser = await client.user.findUnique({
      where: { clerkid: user.id },
    });
    if (!dbUser) return { status: 404, message: "User not found" };

    if (dbUser.aiCredits <= 0) {
      return {
        status: 402,
        message: "Please upgrade to use AI Transcription.",
      };
    }

    const video = await client.video.findUnique({ where: { id: videoId } });
    if (!video) return { status: 404, message: "Video not found." };

    // Construct the full Cloudinary URL for the video
    const videoUrl = `${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}`;

    // Step 1: Send the video URL to AssemblyAI to start transcription
    const transcriptResponse = await assemblyai.post("/transcript", {
      audio_url: videoUrl,
    });
    const transcriptId = transcriptResponse.data.id;

    // Step 2: Poll for the transcription result
    while (true) {
      const pollResponse = await assemblyai.get(`/transcript/${transcriptId}`);
      const transcriptData = pollResponse.data;

      if (transcriptData.status === "completed") {
        // Success! Update the database.
        await client.video.update({
          where: { id: videoId },
          data: {
            summary: transcriptData.text, // Save the transcript to the 'summary' field
            processing: false, // Mark the video as fully processed
          },
        });

        // Decrement AI credit
        await client.user.update({
          where: { id: dbUser.id },
          data: { aiCredits: { decrement: 1 } },
        });

        return { status: 200, message: "Transcription successful!" };
      } else if (transcriptData.status === "error") {
        return { status: 500, message: "Transcription failed." };
      }

      // Wait for 5 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  } catch (error: any) {
    console.error("Transcription Action Error:", error.response?.data || error);
    return {
      status: 500,
      message: "An error occurred during transcription.",
    };
  }
};

// src/actions/ai.ts

export const updateTranscript = async (
  videoId: string,
  newTranscript: string
) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 401, message: "Unauthorized" };
    }

    // We could add a check here to ensure only the video owner can edit,
    // but for now, we'll keep it simple.

    const updatedVideo = await client.video.update({
      where: { id: videoId },
      data: {
        summary: newTranscript, // Update the 'summary' field
      },
    });

    if (updatedVideo) {
      return { status: 200, message: "Transcript updated successfully." };
    }

    return { status: 404, message: "Video not found." };
  } catch (error) {
    console.error("Update Transcript Error:", error);
    return { status: 500, message: "An internal error occurred." };
  }
};
