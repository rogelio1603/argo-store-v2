const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  logging: {
    fetches: { fullUrl: true },
  },

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
        pathname: "/**",
      },

      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },

      {
        protocol: "https",
        hostname: "argoshop-strapi-reluss-199545-31-97-146-102.traefik.me",
        pathname: "/uploads/**",
      },
    ],
  },
}

module.exports = nextConfig
