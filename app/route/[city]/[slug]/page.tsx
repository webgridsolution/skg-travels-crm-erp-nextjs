import '../../../area/area.css';
import '../../../cms-public.css';
import '@/app/site.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Poppins } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { heroUrl, siteUrl } from '@/lib/server/area-seo';
import { getPublicRoutePage, listRelatedRoutes, routePublicPath } from '@/lib/server/route-seo';
import { renderHeadTags } from '@/lib/server/head-tags';
import { databaseConfigured } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';
const font = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

type Params = { params: Promise<{ city: string; slug: string }> };
const load = async (city: string, slug: string) => (databaseConfigured() ? getPublicRoutePage(city, slug) : null);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { city, slug } = await params;
  const page = await load(city, slug);
  if (!page) return { title: 'Page not found', robots: { index: false } };
  const canonical = page.canonical_url || `${siteUrl()}${routePublicPath(page.city_slug, page.slug)}`;
  const image = heroUrl(page.hero_image_path);
  return {
    title: page.seo_title,
    description: page.meta_description ?? undefined,
    keywords: page.keywords ?? undefined,
    alternates: { canonical },
    openGraph: { title: page.seo_title, description: page.meta_description ?? undefined, url: canonical, type: 'website', siteName: 'SKG Travels', images: image ? [`${siteUrl()}${image}`] : undefined },
  };
}

export default async function RoutePage({ params }: Params) {
  const { city, slug } = await params;
  const page = await load(city, slug);
  if (!page) notFound();
  const related = await listRelatedRoutes(page.city_slug, page.id);
  const hero = heroUrl(page.hero_image_path);
  const facts = [['Distance', page.distance], ['Travel time', page.travel_time], ['Starting fare', page.starting_fare]].filter(([, v]) => v) as [string, string][];

  return (
    <div className={`skg area-page ${font.className}`}>
      {renderHeadTags(page.head_scripts)}
      <Header />
      <main>
        <section className="area-hero">
          <div className="wrap">
            <p className="area-crumb">{page.city_name} · {page.from_city} to {page.to_city}</p>
            <h1>{page.h1_title}</h1>
          </div>
          {hero && (
            <div className="wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="area-hero-img" src={hero} alt={page.h1_title} width={1100} height={420} fetchPriority="high" />
            </div>
          )}
        </section>

        {facts.length > 0 && (
          <section className="wrap">
            <dl className="route-facts">{facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </section>
        )}
        {page.intro_html && <section className="wrap area-intro"><div className="area-rich" dangerouslySetInnerHTML={{ __html: page.intro_html }} /></section>}
        {page.body_html && <section className="wrap area-body"><div className="area-rich" dangerouslySetInnerHTML={{ __html: page.body_html }} /></section>}
        {page.fare_table_html && (
          <section className="wrap route-fares">
            <h2>{page.from_city} to {page.to_city} Taxi Fare</h2>
            <div className="area-rich" dangerouslySetInnerHTML={{ __html: page.fare_table_html }} />
          </section>
        )}
        {page.faq_html && (
          <section className="wrap area-faq">
            <h2>Frequently Asked Questions</h2>
            <div className="area-rich" dangerouslySetInnerHTML={{ __html: page.faq_html }} />
          </section>
        )}

        <section className="wrap area-cta">
          <h2>Book your {page.from_city} to {page.to_city} cab</h2>
          <p>Clean cars, verified drivers and 24x7 booking support.</p>
          <a className="btn btn-green" href="https://wa.me/917506222999" target="_blank" rel="noopener noreferrer">Book on WhatsApp</a>
        </section>

        {related.length > 0 && (
          <section className="wrap area-related">
            <h2>More routes from {page.city_name}</h2>
            <ul>
              {related.map((r) => <li key={`${r.city_slug}/${r.slug}`}><a href={routePublicPath(r.city_slug, r.slug)}>{r.from_city} to {r.to_city} cab</a></li>)}
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
