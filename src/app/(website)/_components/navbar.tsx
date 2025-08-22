"use client";

import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import PillNavigation from "@/components/ui/pill-navigation";

// Import the new CSS file
import "../custom-components.css";

const LandingPageNavBar = () => {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsHidden(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isHidden ? "-100%" : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="container flex w-full justify-between items-center py-4">
        <Link href="/">
          <Image
            alt="VEMO Logo"
            src="/vemo-logo-static.png"
            width={150}
            height={45}
          />
        </Link>

        <div className="flex items-center gap-x-4">
          <div className="hidden lg:block">
            <PillNavigation />
          </div>

          {/* --- NEW SIGN IN BUTTON --- */}
          <Link href="/auth/sign-in">
            <button className="user-profile" role="button">
              <div className="user-profile-inner">
                <User />
                <span>Login</span>
              </div>
            </button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default LandingPageNavBar;
