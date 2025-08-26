// src/components/global/video-transcript/index.tsx
"use client";

import { TabsContent } from "@/components/ui/tabs";
import React from "react";
import { EditableTextarea } from "@/components/ui/editable-textarea";
import { useMutationData } from "@/hooks/useMutationData";
import { updateTranscript } from "@/actions/ai";

type Props = {
  transcript: string;
  videoId: string; // We need the videoId to save changes
};

const VideoTranscript = ({ transcript, videoId }: Props) => {
  const { mutate, isPending } = useMutationData(
    ["update-transcript"],
    (data: { newTranscript: string }) =>
      updateTranscript(videoId, data.newTranscript),
    "preview-video" // This will refetch the video data after saving
  );

  const handleSave = async (newTranscript: string) => {
    mutate({ newTranscript });
  };

  return (
    <TabsContent
      value="Transcript"
      className="rounded-xl flex flex-col gap-y-6"
    >
      <EditableTextarea
        initialValue={transcript}
        onSave={handleSave}
        isSaving={isPending}
      />
    </TabsContent>
  );
};

export default VideoTranscript;
