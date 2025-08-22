import AnimatedLoader from "@/components/global/loader/animated-loader";
import React from "react";
import "@/app/(website)/custom-components.css"; // Import CSS

const Loading = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <AnimatedLoader text="Processing..." />
    </div>
  );
};

export default Loading;
