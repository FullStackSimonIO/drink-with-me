/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["img.clerk.com"],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com", // Clerk’s CDN-Domain
        port: "",
        pathname: "/**", // alle Pfade darunter erlauben
      },
      // falls noch weitere Domains (z.B. assets.website.com), hier hinzufügen
      {
        protocol: "https",
        hostname: "assets.example.com",
        port: "",
        pathname: "/account123/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/path/to/uploaded/**",
      },
    ],
  },
};

export default nextConfig;
