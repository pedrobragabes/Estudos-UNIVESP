import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: { root: process.cwd() },
  outputFileTracingRoot: process.cwd(),
  env: { NEXT_PUBLIC_STUDY_CLOUD: process.env.VERCEL ? "1" : "" },
};

export default async function configureNext(): Promise<NextConfig> {
  // The study workspace is portable. D1 is optional for the legacy organizer.
  if (process.env.ENABLE_CLOUDFLARE === "1") {
    const { initOpenNextCloudflareForDev } = await import("@opennextjs/cloudflare");
    initOpenNextCloudflareForDev();
  }
  return nextConfig;
}
