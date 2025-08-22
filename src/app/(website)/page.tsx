"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import VideoShowcase from "./_components/video-showcase";
import { FeatureSection } from "./_components/feature-section";
import PricingSection from "./_components/pricing-section";
import LandingPageNavBar from "./_components/navbar";
import ThreeDScene from "@/components/global/3d-scene";
import { motion } from "framer-motion";
import { LaunchIcon } from "@/components/icons/launch-icon";
import LampDemo from "@/components/ui/lamp";

// Custom CSS imports for buttons
import "./custom-buttons.css";

export default function Home() {
  return (
    <div className="min-h-screen text-white bg-transparent">
      {/* Layer 1: 3D Scene (Sabse Peeche) */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <ThreeDScene />
      </div>

      <LandingPageNavBar />

      {/* Layer 2: Saara Content (Sabse Upar) */}
      <div className="relative z-10">
        <main>
          {/* --- HERO SECTION --- */}
          <div className="relative h-screen w-full flex flex-col items-center justify-center">
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 z-0 bg-black/40" />

            <div className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
                  Record, Share, Collaborate
                </h1>
                <p className="max-w-2xl mx-auto mt-4 text-lg text-neutral-300">
                  VEMO is your all-in-one solution for video recording and
                  sharing, designed for seamless collaboration.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
                className="flex flex-row gap-4 mt-8 justify-center"
              >
                <Link href="/auth/sign-up">
                  <button className="button-85" role="button">
                    Start for Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </Link>
                <Link href="#video">
                  <button className="button-launch" role="button">
                    <LaunchIcon />
                    <span>Watch Demo</span>
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>

          <LampDemo />
          <VideoShowcase />
          <FeatureSection />
          <PricingSection />
        </main>

        <footer className="container mx-auto px-4 py-8 text-center text-gray-400">
          <p>&copy; 2024 VEMO. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
