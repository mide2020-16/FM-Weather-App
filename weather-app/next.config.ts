/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // any experimental features can stay here
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '/**', // Matches all nested image sub-paths
      },
      {
        protocol: 'https',
        hostname: 'api.openweathermap.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets10.lottiefiles.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;