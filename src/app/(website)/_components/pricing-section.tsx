"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SubSelectToggle, { MenuItem } from "@/components/ui/sub-select-toggle";
import { useSubscription } from "@/hooks/useSubscription";
import Loader from "@/components/global/loader";
import Squishy3DButton from "@/components/ui/squishy-3d-button";
const TABS: [MenuItem, MenuItem] = [
  { label: "Free", value: "free" },
  { label: "Premium", value: "premium" },
];

const SUB_TABS: [MenuItem, MenuItem] = [
  { label: "Monthly", value: "monthly" },
  { label: "Annually", value: "annually" },
];

const features = {
  free: [
    { name: "Single workspace", included: true },
    { name: "5-minute video recording limit", included: true },
    { name: "720p video quality", included: true },
    { name: "AI-powered transcripts", included: false },
    { name: "Invite user in workspace", included: false },
  ],
  premium: [
    { name: "Unlimited workspaces", included: true },
    { name: "Unlimited recording length", included: true },
    { name: "1080p video quality", included: true },
    { name: "AI-powered transcripts", included: true },
    { name: "Invite user in workspace", included: true },
  ],
};

const prices = {
  monthly: 15,
  annually: 100,
};

export default function PricingSection() {
  const [activeTab, setActiveTab] = useState<MenuItem>(TABS[0]);
  const [subTab, setSubTab] = useState<MenuItem>(SUB_TABS[0]);
  const { onSubscribe, isProcessing } = useSubscription();

  const isPremium = activeTab.value === "premium";
  const currentPrice = isPremium
    ? prices[subTab.value as "monthly" | "annually"]
    : 0;
  const featureList = isPremium ? features.premium : features.free;

  return (
    <section className="py-20 dark:bg-black" id="pricing">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-4 text-center text-white">
          Choose Your Plan
        </h2>
        <p className="text-center text-gray-400 mb-10">
          Switch to annual billing and save over 40%.
        </p>

        <div className="flex justify-center mb-12">
          <SubSelectToggle
            tabs={TABS}
            subTabs={SUB_TABS}
            tab={activeTab}
            setTab={setActiveTab}
            subTab={subTab}
            setSubTab={setSubTab}
          />
        </div>

        <div className="max-w-md mx-auto">
          <motion.div
            key={activeTab.value + subTab.value} // Key changes on any selection to re-trigger animation
            className="bg-neutral-900/50 rounded-lg p-8 shadow-lg border border-white/10 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-semibold mb-4 text-white capitalize">
              {activeTab.value}
            </h3>
            <div className="mb-6">
              <span className="text-5xl font-bold text-white">
                ${currentPrice}
              </span>
              <span className="text-gray-400 ml-2">
                {isPremium
                  ? `/${subTab.value === "monthly" ? "month" : "year"}`
                  : ""}
              </span>
            </div>
            <ul className="space-y-3 mb-8">
              {featureList.map((feature, featureIndex) => (
                <motion.li
                  key={featureIndex}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: featureIndex * 0.05 }}
                >
                  {feature.included ? (
                    <Check className="text-green-500 mr-2 flex-shrink-0" />
                  ) : (
                    <X className="text-red-500 mr-2 flex-shrink-0" />
                  )}
                  <span
                    className={
                      feature.included ? "text-gray-200" : "text-gray-400"
                    }
                  >
                    {feature.name}
                  </span>
                </motion.li>
              ))}
            </ul>
            {isPremium ? (
              <Squishy3DButton
                className="w-full bg-white text-black font-bold"
                onClick={() =>
                  onSubscribe(subTab.value as "monthly" | "annually")
                }
              >
                <Loader state={isProcessing}>Upgrade to Pro</Loader>
              </Squishy3DButton>
            ) : (
              <Link href="/auth/sign-up" passHref>
                <Squishy3DButton className="w-full border border-white/20">
                  Get Started
                </Squishy3DButton>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
