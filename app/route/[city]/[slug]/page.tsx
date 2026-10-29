import '../../../cms-public.css';
import '@/app/site.css';
import type { Metadata } from 'next';
import Link from 'next/link';
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

const PHONE = '+917506222999';
const PHONE_LABEL = '+91 750 622 2999';
const WA_NUMBER = '917506222999';

type Params = { params: Promise<{ city: string; slug: string }> };
const load = async (city: string, slug: string) => (databaseConfigured() ? getPublicRoutePage(city, slug) : null);

/* "150" -> "150 km", "6000" -> "₹6,000"; anything already formatted is left alone. */
const fmtDistance = (v?: string | null) => {
  const s = (v ?? '').trim();
  return /^\d+(\.\d+)?$/.test(s) ? `${s} km` : s;
};
const fmtFare = (v?: string | null) => {
  const s = (v ?? '').trim();
  return /^\d[\d,]*$/.test(s) ? `₹${Number(s.replace(/,/g, '')).toLocaleString('en-IN')}` : s;
};

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

const Icon = {
  route: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="19" r="2.2" /><circle cx="18" cy="5" r="2.2" /><path d="M8.2 19H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.8" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  ),
  fare: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 5h10M7 9h10M7 5c4 0 6 1.5 6 4s-2 4-6 4l6 6" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.25-1.38A9.9 9.9 0 1 0 12.04 2zm0 1.8a8.1 8.1 0 1 1-4.3 15l-.3-.2-3.1.8.83-3-.2-.32A8.1 8.1 0 0 1 12.04 3.8zm-3 3.6c-.2 0-.5.07-.75.35-.26.28-1 .98-1 2.4s1.03 2.8 1.17 3c.15.2 2 3.2 4.9 4.35 2.4.95 2.9.76 3.4.7.52-.05 1.7-.7 1.93-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.2-.55-.34-.28-.15-1.7-.84-1.96-.93-.26-.1-.45-.15-.64.14-.2.28-.74.93-.9 1.12-.17.2-.33.22-.62.07-.28-.14-1.2-.44-2.28-1.4-.85-.76-1.42-1.7-1.58-1.98-.17-.28-.02-.44.12-.58.13-.13.28-.33.43-.5.14-.17.2-.28.28-.47.1-.2.05-.36-.02-.5-.07-.15-.64-1.58-.89-2.15-.23-.55-.47-.48-.64-.49z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  ),
  chevron: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  ),
};

export default async function RoutePage({ params }: Params) {
  const { city, slug } = await params;
  const page = await load(city, slug);
  if (!page) notFound();
  const related = await listRelatedRoutes(page.city_slug, page.id);
  const hero = heroUrl(page.hero_image_path);
  const route = `${page.from_city} to ${page.to_city}`;

  const facts = [
    { label: 'Distance', value: fmtDistance(page.distance), icon: Icon.route },
    { label: 'Travel time', value: (page.travel_time ?? '').trim(), icon: Icon.clock },
    { label: 'Starting fare', value: fmtFare(page.starting_fare), icon: Icon.fare },
  ].filter((f) => f.value);

  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi SKG Travels, I would like to book a cab from ${page.from_city} to ${page.to_city}.`)}`;
  const base = siteUrl();
  const pageUrl = `${base}${routePublicPath(page.city_slug, page.slug)}`;
  const breadcrumbLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: base },
      { '@type': 'ListItem', position: 2, name: page.city_name },
      { '@type': 'ListItem', position: 3, name: route, item: pageUrl },
    ],
  }).replace(/</g, '\\u003c');

  const overlap = Boolean(hero) || facts.length > 0;
  const factsEl =
    facts.length > 0 ? (
      <dl className="rt-facts">
        {facts.map((f) => (
          <div className="rt-fact" key={f.label}>
            <span className="rt-fact-icon">{f.icon}</span>
            <div>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          </div>
        ))}
      </dl>
    ) : null;

  return (
    <div className={`skg rt-page ${font.className}`}>
      {renderHeadTags(page.head_scripts)}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLd }} />
      <Header />

      <section className={`rt-hero${overlap ? '' : ' rt-hero--plain'}`}>
        <div className="rt-wrap rt-hero-inner">
          <nav className="rt-crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            {Icon.chevron}
            <span>{page.city_name}</span>
            {Icon.chevron}
            <span aria-current="page">{route}</span>
          </nav>
          <h1>{page.h1_title}</h1>
          {page.meta_description && <p className="rt-lead">{page.meta_description}</p>}
          <div className="rt-hero-cta">
            <a className="rt-btn rt-btn--green" href={waLink} target="_blank" rel="noopener noreferrer">
              {Icon.whatsapp}
              <span>Book on WhatsApp</span>
            </a>
            <a className="rt-btn rt-btn--ghost" href={`tel:${PHONE}`}>
              {Icon.phone}
              <span>{PHONE_LABEL}</span>
            </a>
          </div>
        </div>

        {hero ? (
          <div className="rt-wrap rt-hero-bottom">
            <figure className="rt-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero} alt={page.h1_title} width={1100} height={420} fetchPriority="high" />
            </figure>
          </div>
        ) : (
          factsEl && <div className="rt-wrap rt-hero-bottom">{factsEl}</div>
        )}
      </section>

      <main className={`rt-main${overlap ? ' rt-main--overlap' : ''}`}>
        {hero && factsEl && <div className="rt-wrap rt-facts-row">{factsEl}</div>}

        <div className="rt-wrap rt-grid">
          <div className="rt-content">
            {page.intro_html && <div className="rt-intro rt-rich" dangerouslySetInnerHTML={{ __html: page.intro_html }} />}

            {page.body_html && (
              <article className="rt-card">
                <div className="rt-rich" dangerouslySetInnerHTML={{ __html: page.body_html }} />
              </article>
            )}

            {page.fare_table_html && (
              <section className="rt-card" aria-labelledby="rt-fare-h">
                <h2 id="rt-fare-h" className="rt-h2">{route} taxi fare</h2>
                <div className="rt-rich" dangerouslySetInnerHTML={{ __html: page.fare_table_html }} />
              </section>
            )}

            {page.faq_html && (
              <section className="rt-card rt-faq" aria-labelledby="rt-faq-h">
                <h2 id="rt-faq-h" className="rt-h2">Frequently asked questions</h2>
                <div className="rt-rich" dangerouslySetInnerHTML={{ __html: page.faq_html }} />
              </section>
            )}

            <section className="rt-cta" aria-labelledby="rt-cta-h">
              <div>
                <h2 id="rt-cta-h">Book your {route} cab</h2>
                <p>Clean cars, verified drivers and 24x7 booking support.</p>
              </div>
              <a className="rt-btn rt-btn--green" href={waLink} target="_blank" rel="noopener noreferrer">
                {Icon.whatsapp}
                <span>Book on WhatsApp</span>
              </a>
            </section>
          </div>

          <aside className="rt-aside">
            <div className="rt-book">
              <h2>Book {page.from_city} to {page.to_city}</h2>
              {fmtFare(page.starting_fare) && (
                <p className="rt-book-fare">
                  Starting from <strong>{fmtFare(page.starting_fare)}</strong>
                </p>
              )}
              <ul className="rt-checks">
                <li>{Icon.check}<span>Verified, experienced drivers</span></li>
                <li>{Icon.check}<span>Transparent pricing, no hidden charges</span></li>
                <li>{Icon.check}<span>Clean, well maintained cars</span></li>
                <li>{Icon.check}<span>24x7 booking support</span></li>
              </ul>
              <a className="rt-btn rt-btn--green rt-btn--block" href={waLink} target="_blank" rel="noopener noreferrer">
                {Icon.whatsapp}
                <span>Book on WhatsApp</span>
              </a>
              <a className="rt-btn rt-btn--outline rt-btn--block" href={`tel:${PHONE}`}>
                {Icon.phone}
                <span>Call {PHONE_LABEL}</span>
              </a>
            </div>

            {related.length > 0 && (
              <nav className="rt-related" aria-label={`More routes from ${page.city_name}`}>
                <h2>More routes from {page.city_name}</h2>
                <ul>
                  {related.map((r) => (
                    <li key={`${r.city_slug}/${r.slug}`}>
                      <a href={routePublicPath(r.city_slug, r.slug)}>
                        <span>{r.from_city} to {r.to_city} cab</span>
                        {Icon.chevron}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </aside>
        </div>
      </main>

      <div className="rt-mobilebar">
        <a className="rt-btn rt-btn--outline" href={`tel:${PHONE}`}>
          {Icon.phone}
          <span>Call</span>
        </a>
        <a className="rt-btn rt-btn--green" href={waLink} target="_blank" rel="noopener noreferrer">
          {Icon.whatsapp}
          <span>WhatsApp</span>
        </a>
      </div>

      <Footer />
    </div>
  );
}