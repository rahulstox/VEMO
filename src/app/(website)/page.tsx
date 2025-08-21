import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, CheckCircle } from "lucide-react"; // Import PlayCircle
import VideoShowcase from "./_components/video-showcase";
import { FeatureSection } from "./_components/feature-section";
import PricingSection from "./_components/pricing-section";
import LandingPageNavBar from "./_components/navbar";
import LampDemo from "@/components/ui/lamp";
import { BackgroundLinesDemo } from "@/components/global/backgorundlines/BackgroundLines";

export default function Home() {
  return (
    <div className="min-h-screen dark:bg-neutral-950 text-white">
      {/* The z-50 and relative classes on the container are important for stacking context */}
      <LandingPageNavBar />

      <main>
        {/* We are removing the container from the main sections to allow them to be full width */}
        <div className="relative z-10">
          <BackgroundLinesDemo />
        </div>

        <LampDemo />

        {/* These sections already have their own containers, so they will look good full-width */}
        <VideoShowcase />

        <section className="container mx-auto px-4 py-20 dark:bg-neutral-950">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Why Choose Opal?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              "Web & Desktop Recording",
              "Workspace Collaboration",
              "Folder Organization",
              "Secure Video Sharing",
              "View Notifications",
              "AI-Powered Features",
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="text-green-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </section>

        <FeatureSection />

        <PricingSection />
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-gray-400">
        <p>&copy; 2024 Opal. All rights reserved.</p>
      </footer>
    </div>
  );
}
