"use client";

import { getPreviewVideo, sendemailForFirstView } from "@/actions/workspace";
import { useQueryData } from "@/hooks/useQueryData";
import { VideoProps } from "@/types/index.type";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react"; // Make sure useEffect is imported
import CopyLink from "../copy-link";
import RichLink from "../rich-link";
import { truncateString } from "@/lib/utils";
import { Download } from "lucide-react";
import TabMenu from "../../tabs";
import AiTools from "../../ai-tools";
import VideoTranscript from "../../video-transcript";
import Activities from "../../activities";
import EditVideo from "../edit";
import { Spinner } from "@/components/global/loader/spinner"; // Import the Spinner

type Props = {
  videoId: string;
};

const VideoPreview = ({ videoId }: Props) => {
  const router = useRouter();

  // --- FIX #1: Add isPending to handle the loading state ---
  const { data, isPending } = useQueryData(["preview-video"], () =>
    getPreviewVideo(videoId)
  );

  // --- FIX #2: Move the redirect logic into a useEffect ---
  useEffect(() => {
    // This code will run AFTER the component renders
    if (!isPending && data) {
      const { status, data: video } = data as VideoProps;

      // If the video is not found, redirect safely
      if (status !== 200) {
        router.push("/");
        return;
      }

      // Also, handle the first view notification here
      if (video && video.views === 0) {
        sendemailForFirstView(videoId);
      }
    }
  }, [data, isPending, router, videoId]); // Dependencies for the effect

  // Show a loading spinner while data is being fetched
  if (isPending || !data) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const { data: video, author } = data as VideoProps;

  // We can safely calculate this now because we know `video` exists
  const daysAgo = Math.floor(
    (new Date().getTime() - new Date(video.createdAt).getTime()) /
      (24 * 60 * 60 * 1000)
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 lg:py-10 py-5 overflow-y-auto gap-5 px-4 lg:px-0">
      <div className="flex flex-col lg:col-span-2 gap-y-6 lg:gap-y-10">
        <div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-x-5 items-start justify-between">
            <h2 className="text-white text-2xl sm:text-4xl font-bold">
              {video.title}
            </h2>
            {author ? (
              <EditVideo
                videoId={videoId}
                title={video.title as string}
                description={video.description as string}
              />
            ) : null}
          </div>
          <span className="flex gap-x-3 mt-2 text-sm sm:text-base">
            <p className="text-[#9D9D9D] capitalize">
              {video.User?.firstname} {video.User?.lastname}
            </p>
            <p className="text-[#707070]">
              {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
            </p>
          </span>
        </div>
        <video
          preload="metadata"
          className="w-full aspect-video rounded-xl"
          controls
          // Add autoPlay and muted for a better user experience
          autoPlay
          muted
          loop
        >
          <source
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}.mp4`}
          />
        </video>
        <div className="flex flex-col text-xl sm:text-2xl gap-y-4">
          <div className="flex gap-x-5 items-center justify-between">
            <p className="text-[#BDBDBD] font-semibold">Description</p>
            {author ? (
              <EditVideo
                videoId={videoId}
                title={video.title as string}
                description={video.description as string}
              />
            ) : null}
          </div>
          <p className="text-[#9D9D9D] text-base sm:text-lg font-medium">
            {video.description}
          </p>
        </div>
      </div>
      <div className="lg:col-span-1 flex flex-col gap-y-8 lg:gap-y-16">
        <div className="flex flex-wrap justify-center sm:justify-end gap-3 items-center">
          <CopyLink
            variant="outline"
            className="rounded-full bg-transparent px-4 sm:px-10 text-sm"
            videoId={videoId}
          />
          <RichLink
            description={truncateString(video.description as string, 150)}
            id={videoId}
            source={video.source}
            title={video.title as string}
          />
          <Download className="text-[#4d4c4c]" />
        </div>
        <div>
          <TabMenu
            defaultValue="Ai tools"
            triggers={["Ai tools", "Transcript", "Activity"]}
            className="w-full"
          >
            <AiTools videoId={videoId} />
            <VideoTranscript transcript={video.summery!} videoId={videoId} />
            <Activities
              author={video.User?.firstname as string}
              videoId={videoId}
            />
          </TabMenu>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
