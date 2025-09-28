"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PillRadioNav from "@/components/ui/pill-radio-nav";
// Yahan hum 'StarBackground' ko import kar rahe hain, 'ThreeDScene' ko nahi
import StarBackground from "@/components/global/star-background";

const videos = [
  {
    id: "workspace",
    title: "Quick Workspace Tour",
    description: "Learn how to set up and navigate your VEMO workspace.",
    src: "/WorksSpace-Tour.mp4",
    thumbnail: "/thumbnail-workspace.jpg",
  },
  {
    id: "recording",
    title: "Recording Your First Video",
    description:
      "Step-by-step guide to record and upload your first video with VEMO.",
    src: "/recording.mp4",
    thumbnail: "/thumbnail-recording.jpg",
  },
  {
    id: "collaborate",
    title: "Collaborating with Team",
    description:
      "Discover how to invite team members and collaborate on projects.",
    src: "/collaboration.mp4",
    thumbnail: "/thumbnail-collaborate.jpg",
  },
];

const TABS = [
  { id: "pill-workspace", label: "Workspace Tour", value: "workspace" },
  { id: "pill-recording", label: "First Recording", value: "recording" },
  { id: "pill-collaborate", label: "Collaboration", value: "collaborate" },
];

export default function VideoShowcase() {
  const [activeTab, setActiveTab] = useState(TABS[0].value);
  const activeVideo = videos.find((v) => v.id === activeTab) || videos[0];

  return (
    <section className="py-20 relative overflow-hidden" id="video">
      {/* Yahan hum 'StarBackground' component ka istemaal kar rahe hain */}
      <StarBackground />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-center mb-12">
          <PillRadioNav
            items={TABS}
            activeValue={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <motion.div
          key={activeVideo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div
            className="video-container-ambient"
            style={{
              backgroundImage: `url(${activeVideo.thumbnail})`,
              backgroundSize: "cover",
            }}
          >
            <video
              key={activeVideo.src}
              src={activeVideo.src}
              className="w-full h-full object-cover rounded-lg border border-white/10 relative z-10"
              controls
              autoPlay
              muted
            />
          </div>
          <div className="text-center mt-6">
            <h3 className="text-2xl font-semibold text-white">
              {activeVideo.title}
            </h3>
            <p className="text-gray-400 mt-2">{activeVideo.description}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
