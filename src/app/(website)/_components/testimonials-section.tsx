// src/app/(website)/_components/testimonials-section.tsx

"use client";

import React from "react";
import  AnimatedBlurTestimonials  from "@/components/ui/animated-blur-testimonials";

// Example testimonials for VEMO
const testimonials = [
  {
    message: (
      <p>
        "VEMO has completely changed how our team collaborates. The real-time
        screen sharing and AI summaries are a game-changer for our
        productivity."
      </p>
    ),
    avatar: {
      fallback: "SS", // Initials for the name
    },
    name: "Sarah Smith",
    title: "Project Manager, TechCorp",
  },
  {
    message: (
      <p>
        "As a freelance designer, sending video feedback with VEMO is so much
        faster than writing long emails. My clients love it!"
      </p>
    ),
    avatar: {
      fallback: "JD",
    },
    name: "John Doe",
    title: "Freelance Designer",
  },
  {
    message: (
      <p>
        "The best part is the seamless integration. I record on the desktop app,
        and the video is instantly available in our shared workspace. It's
        magic."
      </p>
    ),
    avatar: {
      fallback: "EM",
    },
    name: "Emily Myers",
    title: "Marketing Lead, Innovate Co.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 dark:bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center text-white">
          Loved by Teams Worldwide
        </h2>
        <AnimatedBlurTestimonials data={testimonials} />
      </div>
    </section>
  );
};

export default TestimonialsSection;
