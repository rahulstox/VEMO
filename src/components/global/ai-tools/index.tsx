"use client";

import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Bot, FileTextIcon, Pencil, StarsIcon } from "lucide-react";
import React, { useState } from "react";
import Loader from "../loader";
import { useMutationData } from "@/hooks/useMutationData";
// Import both AI actions
import { runAiTool, transcribeVideo } from "@/actions/ai";
import { VideoProps } from "@/types/index.type";
import { useQueryData } from "@/hooks/useQueryData";
import { getPreviewVideo } from "@/actions/workspace";
import Link from "next/link";
import Squishy3DButton from "@/components/ui/squishy-3d-button";
import { usePathname } from "next/navigation";

type Props = {
  videoId: string;
};

// Define the types for our AI tasks
type AiTask = "summarize" | "transcribe";

const AiTools = ({ videoId }: Props) => {
  const pathname = usePathname();
  const { data } = useQueryData(["preview-video"], () =>
    getPreviewVideo(videoId)
  );
  const { data: videoData } = (data as VideoProps) || {};

  const [currentTask, setCurrentTask] = useState<AiTask | null>(null);

  // A single mutation hook to handle both AI tasks
  const { mutate, isPending } = useMutationData(
    ["run-ai-tool"],
    (data: { task: AiTask }) => {
      if (data.task === "transcribe") {
        return transcribeVideo(videoId);
      }
      return runAiTool(videoId, data.task);
    },
    "preview-video", // Refetch video data on success for both tasks
    () => setCurrentTask(null)
  );

  const onRunTool = (task: AiTask) => {
    setCurrentTask(task);
    mutate({ task });
  };

  const credits = videoData?.User?.aiCredits ?? 0;
  const plan = videoData?.User?.subscription?.plan ?? "FREE";
  const hasCredits = credits > 0;
  const workspaceId = pathname.split("/")[2];

  // Check if the video already has a transcript
  const hasTranscript = !!videoData?.summery;

  return (
    <TabsContent value="Ai tools">
      <div className="p-4 sm:p-5 bg-[#1D1D1D] rounded-xl flex flex-col gap-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-full">
            <h2 className="text-2xl sm:text-3xl font-bold">AI Tools</h2>
            <p className="text-[#BDBDBD] text-sm sm:text-base">
              {plan === "PRO"
                ? "You have unlimited AI credits."
                : hasCredits
                ? `You have ${credits} free AI credits remaining.`
                : "You've used all your free trials."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4 w-full justify-start sm:justify-end mt-2 sm:mt-0">
            {plan === "FREE" && (
              <Link href={`/dashboard/${workspaceId}/billing`}>
                <Squishy3DButton className="bg-white text-black font-bold">
                  Upgrade to Pro
                </Squishy3DButton>
              </Link>
            )}
          </div>
        </div>
        <div className="border-[1px] rounded-xl p-3 sm:p-4 gap-3 sm:gap-4 flex flex-col bg-[#1b0f1b7f]">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#a22fe0]">
              Opal AI
            </h2>
            <StarsIcon color="#a22fe0" fill="#a22fe0" />
          </div>

          {/* AI Transcript Tool */}
          <div className="flex gap-2 items-center">
            <div className="p-1.5 sm:p-2 rounded-full border-[#2d2d2d] border-[2px] bg-[#2b2b2b]">
              <FileTextIcon color="#a22fe0" size={16} />
            </div>
            <div className="flex flex-col flex-1">
              <h3 className="text-sm sm:text-base font-medium">Transcript</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Generate a full transcript for your video.
              </p>
            </div>
            <Button
              size="sm"
              // The only disabling conditions are credits and processing status
              disabled={(plan === "FREE" && !hasCredits) || isPending}
              onClick={() => onRunTool("transcribe")}
            >
              <Loader
                state={isPending && currentTask === "transcribe"}
                color="#000"
              >
                {/* The text is now smarter */}
                {hasTranscript ? "Re-transcribe" : "Try now"}
              </Loader>
            </Button>
          </div>

          {/* AI Summary Tool */}
          <div className="flex gap-2 items-center">
            <div className="p-1.5 sm:p-2 rounded-full border-[#2d2d2d] border-[2px] bg-[#2b2b2b]">
              <Pencil color="#a22fe0" size={16} />
            </div>
            <div className="flex flex-col flex-1">
              <h3 className="text-sm sm:text-base font-medium">Summary</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Generate a new title and description for your video.
              </p>
            </div>
            <Button
              size="sm"
              disabled={(plan === "FREE" && !hasCredits) || isPending}
              onClick={() => onRunTool("summarize")}
            >
              <Loader
                state={isPending && currentTask === "summarize"}
                color="#000"
              >
                {hasTranscript ? "Try now" : "Transcribe First"}
              </Loader>
            </Button>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default AiTools;
