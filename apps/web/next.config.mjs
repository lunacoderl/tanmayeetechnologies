/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@tanmayee/config',
    '@tanmayee/types',
    '@tanmayee/database',
    '@tanmayee/validation',
    '@tanmayee/seo',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

export default nextConfig;
