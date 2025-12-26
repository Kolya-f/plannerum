/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // ТИМЧАСОВО для деплою
  },
  experimental: {
    turbo: {
      resolveAlias: {
        '@/lib/prisma': './src/lib/prisma.ts',
      }
    }
  }
}

module.exports = nextConfig
