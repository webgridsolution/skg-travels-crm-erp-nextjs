import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ['mysql2'],
  devIndicators: false,
  async rewrites() {
    return {
      // Public SEO pages are served from beforeFiles so they win
      // over the catch-all portal route /[module].
      // ORDER MATTERS: the first matching rule wins, so the specific
      // blog rules must stay above the generic area and route rules.
      beforeFiles: [
        // Blog listing: /blogs.html or /blog.html -> app/blog
        // (change '/blog' to '/blogs' if your folder is app/blogs)
        { source: '/blogs.html', destination: '/blogs' },
        { source: '/blog.html', destination: '/blogs' },

        // Blog articles: /blogs/<slug>.html or /blog/<slug>.html -> app/blog/[slug]
        // (change '/blog/:slug' to '/blogs/:slug' if your folder is app/blogs/[slug])
        {
          source: '/blogs/:slug([a-z0-9-]+)\\.html',
          destination: '/blogs/:slug',
        },
        {
          source: '/blogs/:slug([a-z0-9-]+)\\.html',
          destination: '/blogs/:slug',
        },

        // Area SEO pages: /<slug>.html -> app/area/[slug]
        {
          source: '/:slug([a-z0-9-]+)\\.html',
          destination: '/area/:slug',
        },

        // Route SEO pages: /<city>/<slug>.html -> app/route/[city]/[slug]
        // Example: /mumbai/mumbai-to-varanasi-cab.html
        {
          source: '/:city([a-z0-9-]+)/:slug([a-z0-9-]+)\\.html',
          destination: '/route/:city/:slug',
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;