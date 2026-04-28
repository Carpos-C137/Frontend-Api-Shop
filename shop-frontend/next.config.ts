import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
    return [
      { source: "/api/auth/:path*",       destination: `${backendUrl}/auth/:path*` },
      { source: "/api/users/:path*",      destination: `${backendUrl}/users/:path*` },
      { source: "/api/products/:path*",   destination: `${backendUrl}/products/:path*` },
      { source: "/api/categories/:path*", destination: `${backendUrl}/categories/:path*` },
      { source: "/api/cart/:path*",       destination: `${backendUrl}/cart/:path*` },
      { source: "/api/orders/:path*",     destination: `${backendUrl}/orders/:path*` },
    ];
  },
};

export default nextConfig;
