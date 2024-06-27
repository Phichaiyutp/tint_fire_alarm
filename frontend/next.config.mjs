/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: false,
  basePath: process.env.NEXT_PUBLIC_BASEPATH,
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: `/`,
        destination: `/dashboard/site/1`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
