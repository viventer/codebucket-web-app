import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

module.exports = {
  allowedDevOrigins: ["ec72-185-172-86-155.ngrok-free.app"],
};

export default nextConfig;
