import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development" && process.env.ENABLE_PWA !== "true",
  workboxOptions: {
    maximumFileSizeToCacheInBytes: 15 * 1024 * 1024, // 15MB to cache high-res photos and full romantic songs
  },
  fallbacks: {
    document: "/~offline",
  },
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: false,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
};

export default withPWA(nextConfig);