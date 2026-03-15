/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // 성능 최적화
  compress: true,
  poweredByHeader: false,
  // 컴파일러 최적화
  swcMinify: true,
}

module.exports = nextConfig


 