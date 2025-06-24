/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "<YOUR-STORE-ID>.public.blob.vercel-storage.com",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
