/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "latentexplorers-latentnavigation-flux.hf.space",
      },
    ],
  },
};

export default nextConfig;
