// import type { NextConfig } from "next";

const NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'assets.aceternity.com',
      port: '',
      pathname: '/**',
    },
  ],
},
};

export default NextConfig;
