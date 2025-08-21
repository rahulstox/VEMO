"use client"; // This is now a client component to track scroll

import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const LandingPageNavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // If user scrolls down more than 10px, set scrolled to true
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    // Cleanup function to remove the event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // We use Framer Motion for smooth animations
    // The navbar will be hidden initially and slide in when `scrolled` is true
    <motion.header
      initial={{ y: "-100%" }}
      animate={{ y: scrolled ? 0 : "-100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all",
        scrolled && "backdrop-blur-lg bg-black/30 shadow-lg"
      )}
    >
      <div className="container flex w-full justify-between items-center py-4">
        <Link href="/" className="flex items-center gap-x-2">
          <Image
            alt="VEMO Logo"
            src="/vemo-logo-static.svg"
            width={40}
            height={40}
          />
          <span className="font-bold text-2xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            VEMO
          </span>
        </Link>

        <nav className="hidden gap-x-8 items-center text-white lg:flex">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <Link
            href="#pricing"
            className="hover:text-gray-300 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#features"
            className="hover:text-gray-300 transition-colors"
          >
            Features
          </Link>
        </nav>

        <Link href="/auth/sign-in">
          <Button
            variant="outline"
            className="text-base flex gap-x-2 border-white/20 hover:bg-white/20 transition-all"
          >
            <User className="w-4 h-4" />
            Login
          </Button>
        </Link>
      </div>
    </motion.header>
  );
};

export default LandingPageNavBar;
