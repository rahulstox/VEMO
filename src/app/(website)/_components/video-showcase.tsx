"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const videos = [
  {
    id: "workspace",
    title: "Quick Workspace Tour",
    description: "Learn how to set up and navigate your VEMO workspace.",
    src: "/workspace-tour.mp4",
  },
  {
    id: "recording",
    title: "Recording Your First Video",
    description:
      "Step-by-step guide to record and upload your first video with VEMO.",
    src: "/collaboration.mp4", // Note: You might want a different video here
  },
  {
    id: "collaborate",
    title: "Collaborating with Team",
    description:
      "Discover how to invite team members and collaborate on projects.",
    src: "/collaboration.mp4", // Note: You might want a different video here
  },
];

export default function VideoShowcase() {
  return (
    <section className="dark:bg-neutral-950 py-20" id="video">
      <div className="container mx-auto px-4">
        {/* HEADING SECTION HAS BEEN REMOVED */}

        <Tabs defaultValue="workspace" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="workspace">Workspace Tour</TabsTrigger>
            <TabsTrigger value="recording">First Recording</TabsTrigger>
            <TabsTrigger value="collaborate">Team Collaboration</TabsTrigger>
          </TabsList>
          {videos.map((video) => (
            <TabsContent key={video.id} value={video.id} className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-video rounded-lg overflow-hidden border border-white/10"
              >
                <video
                  src={video.src}
                  className="w-full h-full object-cover"
                  controls
                />
              </motion.div>
              <h3 className="text-xl font-semibold mt-4">{video.title}</h3>
              <p className="text-gray-300 mt-2">{video.description}</p>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
