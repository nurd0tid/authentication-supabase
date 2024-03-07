/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  trailingSlash: false,
  swcMinify: true,
  basePath: "",
  assetPrefix: "",
  images: {
    loader: 'akamai',
    path: ''
  },
};

export default nextConfig;
