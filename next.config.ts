
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ['mysql2'],
  devIndicators: false,
  async rewrites() {
    return {
      // Public SEO landing pages live at /<slug>.html and are served by app/area/[slug].
      // beforeFiles so it wins over the catch-all portal route /[module].
      beforeFiles: [{ source: '/:slug([a-z0-9-]+)\\.html', destination: '/area/:slug' }],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
