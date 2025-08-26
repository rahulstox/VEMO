"use client";

import { motion, MotionConfig, Transition } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";

export interface ToggleTab {
  label: string;
  value: string;
}

interface Props {
  tabs: ToggleTab[];
  tab: string;
  setTab: (value: string) => void;
  transition?: Transition;
}

const BillingToggle = ({
  tabs,
  tab,
  setTab,
  transition = { type: "spring", duration: 0.7, bounce: 0.2 },
}: Props) => {
  return (
    <div>
      <MotionConfig transition={transition}>
        <div className="flex items-center h-12 rounded-full bg-white/10 p-1 text-sm shadow-lg backdrop-blur-md">
          {tabs.map((t) => (
            <motion.button
              type="button" // This prevents accidental form submissions
              onClick={() => setTab(t.value)}
              key={t.value}
              className={cn(
                "relative px-4 sm:px-6 py-2 cursor-pointer font-bold text-sm",
                tab === t.value ? "text-black" : "text-white/70"
              )}
              whileHover={{
                color: tab === t.value ? "#000000" : "#FFFFFF",
              }}
            >
              <span className="relative z-10">{t.label}</span>
              {t.value === tab && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-white"
                />
              )}
            </motion.button>
          ))}
        </div>
      </MotionConfig>
    </div>
  );
};

export default BillingToggle;
