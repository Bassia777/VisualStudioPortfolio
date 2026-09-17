import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Optional sub-path deployment (e.g. NEXT_PUBLIC_BASE_PATH=/portfolio).
  // Unset locally, so development stays at http://localhost:3000/.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    remotePatterns: [
      { hostname: 'res.cloudinary.com', protocol: 'https' },
      { hostname: 'avatars.githubusercontent.com', protocol: 'https' },
      { hostname: 'imgur.com', protocol: 'https' },
      { hostname: 'media2.dev.to', protocol: 'https' },
    ],
  },
};

export default nextConfig;
