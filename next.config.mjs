/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["lh3.googleusercontent.com"], // Add any other domains you need
  },
};

export default nextConfig;
