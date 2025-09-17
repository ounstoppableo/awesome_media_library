import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [],
  async rewrites() {
    return [
      {
        source: "/ws/:path*",
        destination: "http://localhost:10000/:path*", // 代理到后端 WS
      },
    ];
  },
  publicRuntimeConfig: {
    HOST_NAME: process.env.HOST_NAME,
  },
};

export default nextConfig;
