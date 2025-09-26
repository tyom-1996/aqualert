/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/pro/profile/orders',
        destination: '/pro/profile/services',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
