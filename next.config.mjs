/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "randomuser.me", "avatar.iran.liara.run", "i.pravatar.cc"],
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/job-search",
        destination: "/job-search/all",
        permanent: true,
      },
      {
        source: "/paywall",
        destination: "/job-search/all",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
