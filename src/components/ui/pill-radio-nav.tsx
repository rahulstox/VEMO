"use client";

import React from "react";
import { motion, MotionConfig } from "framer-motion";

type NavItem = {
  id: string;
  label: string;
  value: string;
};

type Props = {
  items: NavItem[];
  activeValue: string;
  onChange: (value: string) => void;
};

const PillRadioNav = ({ items, activeValue, onChange }: Props) => {
  return (
    <MotionConfig transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}>
      <div className="flex items-center relative space-x-4 bg-[#1a1a1a] p-2 rounded-full shadow-inner">
        {items.map((item) => (
          <motion.button
            key={item.value}
            onClick={() => onChange(item.value)}
            className="relative px-4 py-2 text-sm font-medium focus:outline-none"
            animate={{
              color: activeValue === item.value ? "#ffffff" : "#a0a0a0",
            }}
            whileHover={{ color: "#ffffff" }}
          >
            <span className="relative z-10">{item.label}</span>

            {/* The Magic: This is the sliding indicator */}
            {activeValue === item.value && (
              <motion.div
                layoutId="pill-indicator"
                className="absolute bottom-1 left-0 right-0 mx-auto h-[4px] w-1/2 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>
    </MotionConfig>
  );
};

export default PillRadioNav;
