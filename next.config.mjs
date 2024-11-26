/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
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
