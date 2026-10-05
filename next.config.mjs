/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: { "/api/video-guide/*": ["./private/video-guides/*.pdf"] },
  images: {
    // Tool images uploaded from /admin/tools live in Toti Room's public storage.
    remotePatterns: [
      { protocol: "https", hostname: "rndegttgwtpkbjtvjgnc.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
