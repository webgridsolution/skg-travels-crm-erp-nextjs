import '../area-seo-pages/area-seo.css';
import '../cms.css';
import { notFound } from 'next/navigation';
import { getCurrentUser, hasPermission, databaseConfigured } from '@/lib/server/auth';
import { siteUrl } from '@/lib/server/area-seo';
import { listRoutePages } from '@/lib/server/route-seo';
import { RouteSeoManager } from '@/components/route-seo-manager';

export const dynamic = 'force-dynamic';

export default async function RouteSeoPagesPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q = '', page = '1' } = await searchParams;
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, 'route_seo.view')) notFound();
  const demo = !databaseConfigured();
  const data = demo ? { rows: [], total: 0, page: 1, pages: 1 } : await listRoutePages(user.companyId, q.trim().slice(0, 100), Number(page));
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">WEBSITE CMS</div>
          <h1>Route SEO Pages</h1>
          <p>City-to-city cab pages such as Mumbai to Pune, published to the public website.</p>
        </div>
      </div>
      <RouteSeoManager
        {...data}
        q={q.trim().slice(0, 100)}
        siteUrl={siteUrl()}
        canCreate={hasPermission(user, 'route_seo.create')}
        canUpdate={hasPermission(user, 'route_seo.update')}
        canDelete={hasPermission(user, 'route_seo.delete')}
        demo={demo}
      />
    </>
  );
}
