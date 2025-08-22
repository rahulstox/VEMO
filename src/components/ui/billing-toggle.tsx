"use client";

import { motion, MotionConfig, Transition } from "framer-motion";
import React from "react";

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
              onClick={() => setTab(t.value)}
              key={t.value}
              className="relative px-4 sm:px-6 py-2 cursor-pointer font-bold text-sm text-white/70"
            >
              <span className="relative z-10">{t.label}</span>
              {t.value === tab && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-white"
                />
              )}
              {/* This span ensures the text color changes correctly on the active pill */}
              <span className="absolute inset-0 z-20 flex items-center justify-center text-sm font-bold text-black pointer-events-none">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: t.value === tab ? 1 : 0 }}
                >
                  {t.label}
                </motion.span>
              </span>
            </motion.button>
          ))}
        </div>
      </MotionConfig>
    </div>
  );
};

export default BillingToggle;
