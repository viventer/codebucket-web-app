import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

module.exports = {
  allowedDevOrigins: ["eb98-185-172-86-155.ngrok-free.app"],
};

export default nextConfig;
