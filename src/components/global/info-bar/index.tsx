"use client"; // Add this if not present

import VideoRecorderIcon from "@/components/icons/video-recorder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/nextjs";
import { Search, UploadIcon } from "lucide-react";
import React, { useRef, useState } from "react"; // Import useRef and useState
import axios from "axios"; // Import axios
import { useQueryClient } from "@tanstack/react-query"; // Import useQueryClient
import { toast } from "sonner"; // For notifications
import { usePathname } from "next/navigation"; // To get workspaceId

type Props = {};

const InfoBar = (props: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const workspaceId = pathname.split("/")[2]; // Extract workspaceId from URL

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("video", file);
    formData.append("workspaceId", workspaceId); // Send workspaceId to the API

    try {
      toast.info("Uploading...", {
        description: "Your video is being uploaded.",
      });
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Upload complete!", {
          description: "Your video is now processing.",
        });
        // Invalidate queries to refresh the video list
        queryClient.invalidateQueries({ queryKey: ["user-videos"] });
        queryClient.invalidateQueries({ queryKey: ["workspace-folders"] });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload Failed", {
        description: "Something went wrong while uploading your video.",
      });
    } finally {
      setIsUploading(false);
      // Reset the input value to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <header className="pl-20 md:pl-[265px] fixed p-4 w-full flex items-center justify-between gap-4">
      <div className="flex gap-4 justify-center items-center border-2 rounded-full px-4 w-full max-w-lg">
        <Search size={25} className="text-[#707070]" />
        <Input
          className="bg-transparent border-none !placeholder-neutral-500"
          placeholder="Search for people, projects, tags & folders"
        />
      </div>
      <div className="flex items-center gap-4">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="video/*" // Only accepts video files
        />

        {/* Modified Upload Button */}
        <Button
          onClick={handleUploadClick}
          disabled={isUploading}
          className="bg-[#9D9D9D] flex items-center gap-2"
        >
          <UploadIcon size={20} />
          <span>{isUploading ? "Uploading..." : "Upload"}</span>
        </Button>
        <Button className="bg-[#9D9D9D] flex items-center gap-2">
          <VideoRecorderIcon />
          <span className="flex items-center gap-2">Record</span>
        </Button>
        <UserButton />
      </div>
    </header>
  );
};

export default InfoBar;
