/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["img.logo.dev"], // Add the domain you want to allow
  },
  output: "standalone",
}

export default nextConfig
