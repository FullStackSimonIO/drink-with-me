// next.config.js
import MiniCssExtractPlugin from "mini-css-extract-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["img.clerk.com"],
  },
  // ... sonstige Next.js-Config
  webpack(config, { dev, isServer }) {
    // nur im Client-Build (production) das Plugin hinzufügen
    if (!dev && !isServer) {
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: "static/css/[name].[contenthash:8].css",
          chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
        })
      );

      // dafür sorgen, dass CSS-Lader den Extract-Loader nutzen
      for (const rule of config.module.rules) {
        if (rule.oneOf) {
          for (const loaderRule of rule.oneOf) {
            if (
              loaderRule.use &&
              Array.isArray(loaderRule.use) &&
              loaderRule.use.find((u) => u.loader?.includes("css-loader"))
            ) {
              loaderRule.use = loaderRule.use.map((u) =>
                u.loader?.includes("css-loader")
                  ? { loader: MiniCssExtractPlugin.loader }
                  : u
              );
            }
          }
        }
      }
    }
    return config;
  },
};

export default nextConfig;
