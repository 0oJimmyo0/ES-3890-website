import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/api/assistant": ["./docs/academic-assistant-system-prompt.txt"],
  },
};

export default nextConfig;
