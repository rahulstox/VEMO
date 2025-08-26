"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useSubscription } from "@/hooks/useSubscription";
import Loader from "@/components/global/loader";
import Squishy3DButton from "@/components/ui/squishy-3d-button";
import BillingToggle, { ToggleTab } from "@/components/ui/billing-toggle";

const TABS: [ToggleTab, ToggleTab] = [
  { label: "Monthly", value: "monthly" },
  { label: "Annually", value: "annually" },
];

const features = {
  free: [
    { name: "Single workspace", included: true },
    { name: "5-minute video recording limit", included: true },
    { name: "720p video quality", included: true },
    { name: "3 AI Tool Credits", included: true },
    { name: "AI-powered transcripts", included: false },
    { name: "Invite users to workspace", included: false },
  ],
  premium: [
    { name: "Unlimited workspaces", included: true },
    { name: "Unlimited recording length", included: true },
    { name: "4K video quality", included: true },
    { name: "Unlimited AI Tool Credits", included: true },
    { name: "AI-powered transcripts", included: true },
    { name: "Invite users to workspace", included: true },
  ],
};

const prices = {
  monthly: 15,
  annually: 120, // Corrected annual price for example
};

export default function PricingSection() {
  const [activeTab, setActiveTab] = useState(TABS[0].value);
  const { onSubscribe, isProcessing } = useSubscription();

  const isMonthly = activeTab === "monthly";
  const currentPrice = isMonthly ? prices.monthly : prices.annually;
  const billingCycle = isMonthly ? "month" : "year";

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
          <BillingToggle tabs={TABS} tab={activeTab} setTab={setActiveTab} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan Card */}
          <motion.div
            className="bg-neutral-900/50 rounded-lg p-8 shadow-lg border border-white/10 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold mb-4 text-white capitalize">
              Free
            </h3>
            <div className="mb-6">
              <span className="text-5xl font-bold text-white">$0</span>
            </div>
            <ul className="space-y-3 mb-8">
              {features.free.map((feature, index) => (
                <li key={index} className="flex items-center">
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
                </li>
              ))}
            </ul>
            <Link href="/auth/sign-up" passHref>
              <Squishy3DButton className="w-full border border-white/20">
                Get Started
              </Squishy3DButton>
            </Link>
          </motion.div>

          {/* Premium Plan Card */}
          <motion.div
            className="bg-neutral-900/50 rounded-lg p-8 shadow-lg border-2 border-purple-500 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="absolute top-0 right-0 m-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              BEST VALUE
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-white capitalize">
              Premium
            </h3>
            <div className="mb-6">
              <span className="text-5xl font-bold text-white">
                ${isMonthly ? prices.monthly : prices.annually / 12}
              </span>
              <span className="text-gray-400 ml-2">/ {billingCycle}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {features.premium.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-200">{feature.name}</span>
                </li>
              ))}
            </ul>
            <Squishy3DButton
              className="w-full bg-white text-black font-bold"
              onClick={() => onSubscribe(activeTab as "monthly" | "annually")}
            >
              <Loader state={isProcessing}>Upgrade to Pro</Loader>
            </Squishy3DButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
