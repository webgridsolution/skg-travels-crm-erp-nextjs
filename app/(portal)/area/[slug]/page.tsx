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
    openGraph: { title: page.seo_title, description: page.meta_description ?? undefined, url: canonical, type: 'website', siteName: 'SKG Travels', images: image ? [`${siteUrl()}${image}`] : undefined },
  };
}

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
        <section className="area-hero">
          <div className="wrap">
            <p className="area-crumb">{page.city_name} · {page.area_name}</p>
            <h1>{page.h1_title}</h1>
          </div>
          {hero && (
            <div className="wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="area-hero-img" src={hero} alt={page.h1_title} width={1100} height={420} fetchPriority="high" />
            </div>
          )}
        </section>

        {page.intro_html && <section className="wrap area-intro"><div className="area-rich" dangerouslySetInnerHTML={{ __html: page.intro_html }} /></section>}
        {page.body_html && <section className="wrap area-body"><div className="area-rich" dangerouslySetInnerHTML={{ __html: page.body_html }} /></section>}
        {page.faq_html && (
          <section className="wrap area-faq">
            <h2>Frequently Asked Questions</h2>
            <div className="area-rich" dangerouslySetInnerHTML={{ __html: page.faq_html }} />
          </section>
        )}

        <section className="wrap area-cta">
          <h2>Book a cab in {page.area_name}</h2>
          <p>Clean cars, verified drivers and 24x7 booking support.</p>
          <a className="btn btn-green" href="https://wa.me/917506222999" target="_blank" rel="noopener noreferrer">Book on WhatsApp</a>
        </section>

        {related.length > 0 && (
          <section className="wrap area-related">
            <h2>Other areas we serve in {page.city_name}</h2>
            <ul>
              {related.map((r) => <li key={r.slug}><a href={publicPath(r.slug)}>Taxi service in {r.area_name}</a></li>)}
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
