/** @type {import('next').NextConfig} */
const nextConfig = {
  // 2026-10-06: all personal training lives on the Build Profit AI Training Centre.
  async redirects() {
    return [
      { source: "/training", destination: "https://www.buildprofitai.com/training-center", permanent: false },
    ];
  },
  outputFileTracingIncludes: { "/api/video-guide/*": ["./private/video-guides/*.pdf"] },
  images: {
    // Tool images uploaded from /admin/tools live in Toti Room's public storage.
    remotePatterns: [
      { protocol: "https", hostname: "rndegttgwtpkbjtvjgnc.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
