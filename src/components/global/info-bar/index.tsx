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
    toast.info("Preparing to upload...", { description: "Please wait." });

    try {
      // 1. Get the signature from our new backend endpoint
      const signResponse = await axios.post("/api/upload/sign");
      const { signature, timestamp, folder, apiKey } = signResponse.data;

      // 2. Create FormData for the direct upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("folder", folder);

      // 3. Upload DIRECTLY to Cloudinary's API
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`;
      const cloudinaryResponse = await axios.post(cloudinaryUrl, formData);

      const videoData = cloudinaryResponse.data;

      // 4. Now, call our OWN backend to save the video details to the database
      // This reuses our existing upload endpoint, but without the file data
      const saveResponse = await axios.post("/api/upload", {
        public_id: videoData.public_id,
        version: videoData.version,
        signature: videoData.signature,
        format: videoData.format,
        original_filename: file.name,
        workspaceId: workspaceId,
      });

      if (saveResponse.status === 200) {
        toast.success("Upload complete!", {
          description: "Your video is now processing.",
        });
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
