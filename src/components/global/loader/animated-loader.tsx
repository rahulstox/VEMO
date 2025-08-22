// src/components/global/loader/animated-loader.tsx
"use client";

import React from "react";

type Props = {
  text: string;
};

const AnimatedLoader = ({ text }: Props) => {
  return (
    <div className="loader-wrapper">
      <div className="loader"></div>
      <div className="loader-text">
        {text.split("").map((letter, index) => (
          <span key={index} className="loader-letter">
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnimatedLoader;
