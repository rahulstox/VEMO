// src/components/ui/pill-navigation.tsx
"use client";

import React, { useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
];

const PillNavigation = () => {
  const [activeTab, setActiveTab] = useState(navItems[0].label);

  return (
    <MotionConfig transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}>
      <div className="flex h-10 items-center space-x-2 rounded-full bg-white/10 p-1">
        {navItems.map((item) => (
          <motion.div
            key={item.label}
            className="relative"
            onHoverStart={() => setActiveTab(item.label)}
          >
            <Link
              href={item.href}
              className="relative z-10 block px-4 py-1.5 text-sm text-white"
            >
              {item.label}
            </Link>
            {activeTab === item.label && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 rounded-full bg-white"
                style={{ originY: "0px" }}
              />
            )}
            {/* The text inside needs to be black when the pill is behind it */}
            <span className="absolute inset-0 z-20 flex items-center justify-center text-sm text-black pointer-events-none">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: activeTab === item.label ? 1 : 0 }}
              >
                {item.label}
              </motion.span>
            </span>
          </motion.div>
        ))}
      </div>
    </MotionConfig>
  );
};

export default PillNavigation;
