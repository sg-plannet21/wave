/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['i.pravatar.cc'],
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    yourKey: 'your-value',
    tableDateFormat: 'ddd Do MMM YYYY, h:mm a',
    versionTableFormat: 'MMM Do YYYY, h:mm:ss a',
    dateFormat: 'DD-MM-YYYY HH:mm',
    timeFormat: 'HH:mm',
    serverTimeFormat: 'HH:mm:ss',
    fallbackRegionId: 52,
  },
};

module.exports = nextConfig;
