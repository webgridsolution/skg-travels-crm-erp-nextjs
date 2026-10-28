import type { MetadataRoute } from 'next';
import { databaseConfigured } from '@/lib/server/auth';
import { listPublishedForSitemap, publicPath, siteUrl } from '@/lib/server/area-seo';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const entries: MetadataRoute.Sitemap = [{ url: `${base}/`, changeFrequency: 'weekly', priority: 1 }];
  if (databaseConfigured()) {
    try {
      for (const p of await listPublishedForSitemap()) entries.push({ url: `${base}${publicPath(p.slug)}`, lastModified: p.updated_at, changeFrequency: 'monthly', priority: 0.7 });
    } catch { /* DB unavailable: return the static entries only */ }
  }
  return entries;
}
