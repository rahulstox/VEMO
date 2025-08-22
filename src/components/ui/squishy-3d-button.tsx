"use client";

import { motion, MotionConfig, Transition } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface Props {
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// A type for our particle state
type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
};

const Squishy3DButton = ({ disabled, children, className, onClick }: Props) => {
  const [active, setActive] = useState(false);
  // State to hold the particles
  const [particles, setParticles] = useState<Particle[]>([]);

  const playSound = () => {
    new Audio("/assets/click.mp3").play();
  };

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSound();
    if (onClick) {
      onClick(e);
    }

    // --- Particle Effect Logic ---
    const buttonRect = e.currentTarget.getBoundingClientRect();
    const newParticles: Particle[] = [];
    const colors = ["#FFFFFF", "#F0F0F0", "#E0E0E0"];

    // Create 15 new particles at the click position
    for (let i = 0; i < 15; i++) {
      const id = Date.now() + i;
      newParticles.push({
        id: id,
        x: e.clientX - buttonRect.left,
        y: e.clientY - buttonRect.top,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);

    // Remove particles after animation
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.some((np) => np.id === p.id))
      );
    }, 1000); // Animation duration is 1 second
  };

  return (
    <MotionConfig transition={{ type: "spring", duration: 0.3, bounce: 0.5 }}>
      <motion.button
        disabled={disabled}
        onClick={handleOnClick}
        onHoverStart={() => setActive(true)}
        onHoverEnd={() => setActive(false)}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors overflow-hidden", // Added overflow-hidden
          "bg-transparent text-white",
          className
        )}
      >
        {/* Render particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
            }}
            initial={{ scale: 1, opacity: 1 }}
            animate={{
              scale: 0,
              opacity: 0,
              x: (Math.random() - 0.5) * 150, // Move randomly outwards
              y: (Math.random() - 0.5) * 150,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        ))}

        <motion.div
          className="absolute inset-0 rounded-lg bg-white/10 opacity-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 1 : 0 }}
        />
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: active ? -2 : 0 }}
          className="relative z-10 flex items-center justify-center" // Added flex for centering
        >
          {children}
        </motion.div>
      </motion.button>
    </MotionConfig>
  );
};

export default Squishy3DButton;
