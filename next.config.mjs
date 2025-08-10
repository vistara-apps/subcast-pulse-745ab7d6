
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['res.cloudinary.com', 'imagedelivery.net', 'i.imgur.com'],
  },
};

export default nextConfig;
