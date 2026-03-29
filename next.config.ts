import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/modalidades/clases",
        destination: "/modalidades/classes",
      },
      {
        source: "/admin/clases",
        destination: "/admin/classes",
      },
      {
        source: "/admin/clases/nueva",
        destination: "/admin/classes/new",
      },
      {
        source: "/nosotros",
        destination: "/us",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
