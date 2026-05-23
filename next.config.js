/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**",
      },
      {
        protocol: "https",
        hostname: "videos.pexels.com",
        pathname: "/video-files/**",
      },
    ],
  },
};

module.exports = nextConfig;
