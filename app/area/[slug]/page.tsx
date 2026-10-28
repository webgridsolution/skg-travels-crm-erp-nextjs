import '../area.css';
import '../../site.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Poppins } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPublicAreaPage, heroUrl, listRelatedAreas, publicPath, siteUrl } from '@/lib/server/area-seo';
import { renderHeadTags } from '@/lib/server/head-tags';
import { databaseConfigured } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';
const font = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

type Params = { params: Promise<{ slug: string }> };
const load = async (slug: string) => (databaseConfigured() ? getPublicAreaPage(slug) : null);

const WA_LINK = 'https://wa.me/917506222999';
const TEL_LINK = 'tel:+917506222999';

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const page = await load((await params).slug);
  if (!page) return { title: 'Page not found', robots: { index: false } };
  const canonical = page.canonical_url || `${siteUrl()}${publicPath(page.slug)}`;
  const image = heroUrl(page.hero_image_path);
  return {
    title: page.seo_title,
    description: page.meta_description ?? undefined,
    keywords: page.keywords ?? undefined,
    alternates: { canonical },
    openGraph: {
      title: page.seo_title,
      description: page.meta_description ?? undefined,
      url: canonical,
      type: 'website',
      siteName: 'SKG Travels',
      images: image ? [`${siteUrl()}${image}`] : undefined,
    },
  };
}

const IconWhatsApp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2a9.9 9.9 0 0 0-8.48 15l-1.5 5.5 5.64-1.48A9.9 9.9 0 1 0 12.04 2Zm5.8 14.12c-.25.7-1.43 1.35-1.96 1.4-.5.05-1.13.07-1.82-.12a16.6 16.6 0 0 1-1.65-.61c-2.9-1.25-4.78-4.17-4.92-4.36-.14-.19-1.17-1.56-1.17-2.98 0-1.42.74-2.12 1-2.41.26-.29.57-.36.76-.36h.55c.18 0 .42-.07.65.5.25.6.84 2.05.91 2.2.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.37-.44.5-.15.15-.3.31-.13.6.17.3.77 1.27 1.65 2.06 1.13 1 2.09 1.32 2.39 1.47.3.15.47.12.65-.07.17-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.34.07.12.07.7-.18 1.4Z" />
  </svg>
);
const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m5 12 5 5L20 7" />
  </svg>
);
const IconPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const TRUST = ['24x7 Booking', 'Verified Drivers', 'Clean Cars', 'Transparent Pricing'];
const WHY = [
  'Local, outstation & airport transfers',
  'Sedan, SUV & premium cars available',
  'Professional, verified chauffeurs',
  'Instant confirmation on WhatsApp',
  'No hidden charges',
];

export default async function AreaPage({ params }: Params) {
  const { slug } = await params;
  const page = await load(slug);
  if (!page) notFound();
  const related = await listRelatedAreas(page.city_name, page.id);
  const hero = heroUrl(page.hero_image_path);

  return (
    <div className={`skg area-page ${font.className}`}>
      {renderHeadTags(page.head_scripts)}
      <Header />
      <main>
        {/* HERO */}
        <section className="area-hero">
          <div className="area-hero-glow" aria-hidden="true" />
          <div className="wrap area-hero-inner">
            <nav className="area-crumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span aria-hidden="true">/</span>
              <span>{page.city_name}</span>
              <span aria-hidden="true">/</span>
              <span className="is-current">{page.area_name}</span>
            </nav>
            <h1>{page.h1_title}</h1>
            <ul className="area-trust">
              {TRUST.map((t) => (
                <li key={t}>
                  <IconCheck /> {t}
                </li>
              ))}
            </ul>
            <div className="area-hero-actions">
              <a className="area-btn area-btn-green" href={WA_LINK} target="_blank" rel="noopener noreferrer">
                <IconWhatsApp /> Book on WhatsApp
              </a>
              <a className="area-btn area-btn-ghost" href={TEL_LINK}>
                <IconPhone /> Call +91 750 6222 999
              </a>
            </div>
          </div>
        </section>

        {hero && (
          <div className="wrap area-hero-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="area-hero-img" src={hero} alt={page.h1_title} width={1100} height={420} fetchPriority="high" />
          </div>
        )}

        {/* CONTENT */}
        <div className="wrap area-layout">
          <div className="area-main">
            {page.intro_html && (
              <section className="area-card area-intro">
                <div className="area-rich" dangerouslySetInnerHTML={{ __html: page.intro_html }} />
              </section>
            )}

            {page.body_html && (
              <section className="area-card area-body">
                <div className="area-rich" dangerouslySetInnerHTML={{ __html: page.body_html }} />
              </section>
            )}

            {page.faq_html && (
              <section className="area-card area-faq">
                <div className="area-section-head">
                  <span className="area-eyebrow">Got questions?</span>
                  <h2>Frequently Asked Questions</h2>
                </div>
                <div className="area-rich area-faq-body" dangerouslySetInnerHTML={{ __html: page.faq_html }} />
              </section>
            )}
          </div>

          <aside className="area-side">
            <div className="area-book">
              <span className="area-eyebrow">Instant booking</span>
              <h2>Book a cab in {page.area_name}</h2>
              <p>Clean cars, verified drivers and 24x7 booking support.</p>
              <a className="area-btn area-btn-green area-btn-block" href={WA_LINK} target="_blank" rel="noopener noreferrer">
                <IconWhatsApp /> Book on WhatsApp
              </a>
              <a className="area-btn area-btn-outline area-btn-block" href={TEL_LINK}>
                <IconPhone /> Call Now
              </a>
              <ul className="area-why">
                {WHY.map((w) => (
                  <li key={w}>
                    <IconCheck /> {w}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* CTA BAND */}
        <section className="wrap">
          <div className="area-cta">
            <div>
              <h2>Ready to ride in {page.area_name}?</h2>
              <p>Share your pickup and drop — we confirm your cab in minutes.</p>
            </div>
            <a className="area-btn area-btn-green" href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <IconWhatsApp /> Book on WhatsApp
            </a>
          </div>
        </section>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="wrap area-related">
            <div className="area-section-head">
              <span className="area-eyebrow">Coverage</span>
              <h2>Other areas we serve in {page.city_name}</h2>
            </div>
            <ul>
              {related.map((r) => (
                <li key={r.slug}>
                  <a href={publicPath(r.slug)}>
                    <IconPin />
                    <span>Taxi service in {r.area_name}</span>
                    <IconArrow />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      {/* Mobile sticky action bar */}
      <div className="area-mobile-bar">
        <a className="area-btn area-btn-outline" href={TEL_LINK}>
          <IconPhone /> Call
        </a>
        <a className="area-btn area-btn-green" href={WA_LINK} target="_blank" rel="noopener noreferrer">
          <IconWhatsApp /> WhatsApp
        </a>
      </div>

      <Footer />
    </div>
  );
}