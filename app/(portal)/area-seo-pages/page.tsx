import { notFound } from 'next/navigation';
import { databaseConfigured, getCurrentUser, hasPermission } from '@/lib/server/auth';
import { listAreaPages, siteUrl, type AreaSeoListRow } from '@/lib/server/area-seo';
import { AreaSeoManager } from '@/components/area-seo-manager';
import './area-seo.css';

export const dynamic = 'force-dynamic';

const DEMO_ROWS: AreaSeoListRow[] = [
  { id: 1, area_name: 'Thane', city_name: 'Mumbai', slug: 'taxi-service-in-thane-mumbai', seo_title: 'Taxi Service in Thane Mumbai | SKG Travels - 24x7 Booking', is_active: 1, is_published: 1, updated_at: '2026-09-09T00:00:00.000Z' },
  { id: 2, area_name: 'Karol Bagh', city_name: 'Delhi', slug: 'cab-service-in-karol-bagh-delhi', seo_title: 'Cab Service in Karol Bagh Delhi | SKG Travels', is_active: 1, is_published: 1, updated_at: '2026-09-09T00:00:00.000Z' },
];

export default async function AreaSeoPages({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const u = await getCurrentUser();
  if (!u || !hasPermission(u, 'area_seo.view')) notFound();
  const sp = await searchParams;
  const q = (sp.q ?? '').trim().slice(0, 100);
  const pageNo = Number(sp.page) || 1;

  let data = { rows: [] as AreaSeoListRow[], total: 0, page: 1, pages: 1 };
  const live = databaseConfigured();
  if (live) data = await listAreaPages(u.companyId, q, pageNo);
  else data = { rows: DEMO_ROWS, total: DEMO_ROWS.length, page: 1, pages: 1 };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">WEBSITE CMS / SEO</div>
          <h1>Area SEO Pages</h1>
          <p>Landing pages such as “Taxi Service in Andheri” that are published on the public website.</p>
        </div>
      </div>
      <AreaSeoManager
        {...data}
        q={q}
        siteUrl={siteUrl()}
        demo={!live}
        canCreate={hasPermission(u, 'area_seo.create')}
        canUpdate={hasPermission(u, 'area_seo.update')}
        canDelete={hasPermission(u, 'area_seo.delete')}
      />
    </>
  );
}
