// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // simply allow these hosts unconditionally
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "unsplash.com",
      "picsum.photos",
    ],
  },
};

export default nextConfig;
