/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "randomuser.me", "avatar.iran.liara.run"],
    unoptimized: true,
  },
};

export default nextConfig;
