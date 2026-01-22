/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Enable static export if needed
  // output: 'export',
}

module.exports = nextConfig
