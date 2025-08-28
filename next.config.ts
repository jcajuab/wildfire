import type { NextConfig } from "next"

const nextConfig: NextConfig = {
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
  typedRoutes: true,
}

export default nextConfig
