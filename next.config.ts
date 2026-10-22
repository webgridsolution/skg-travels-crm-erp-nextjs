
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ['mysql2'],
  devIndicators: false,
};

export default nextConfig;
