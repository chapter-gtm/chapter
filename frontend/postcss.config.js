module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/account123/**",
      },
    ],
  },
}
