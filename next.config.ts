// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org", // TMDB image CDN
        pathname: "/t/p/**",       // allow all TMDB image paths
      },
    ],
  },
};

module.exports = nextConfig;
