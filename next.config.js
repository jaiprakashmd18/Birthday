/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
  transpilePackages: ['three'],
}

module.exports = nextConfig
