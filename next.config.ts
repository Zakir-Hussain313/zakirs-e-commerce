import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
  allowedDevOrigins: [
    "http://local-origin.dev",
    "http://*.local-origin.dev",
    "http://192.168.1.16",
  ],
};

export default nextConfig;
