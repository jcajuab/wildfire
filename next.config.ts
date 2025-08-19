import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  devIndicators: false, // Temporarily disabling because it's annoying
  typedRoutes: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/displays",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
