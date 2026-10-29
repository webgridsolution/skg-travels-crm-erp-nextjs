// import './blog-index.css';
import '../cms-public.css';
import '@/app/site.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { heroUrl, siteUrl } from '@/lib/server/area-seo';
import { blogPublicPath, listPublicBlogs, type BlogCard } from '@/lib/server/blogs';
import { databaseConfigured } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';
const font = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'Travel Blog | SKG Travels',
  description: 'Travel guides, outstation trip ideas and cab booking tips from SKG Travels.',
  alternates: { canonical: `${siteUrl()}/blogs` },
};

const fmt = (iso: string) => new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(iso));

const WA = 'https://wa.me/917506222999';
const PHONE = 'tel:+917506222999';

/* ---------- icons ---------- */
const Chevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
);
const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const CarIcon = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 17H3v-5l2-5h14l2 5v5h-2M5 17a2 2 0 1 0 4 0m6 0a2 2 0 1 0 4 0M9 17h6M3 12h18" /></svg>
);
const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12 0 12 12 0 0 0 1.6 17.9L0 24l6.3-1.6A12 12 0 0 0 12 24a12 12 0 0 0 8.5-20.5ZM12 21.9a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.3-.4A9.9 9.9 0 1 1 12 21.9Zm5.4-7.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.3.2-.6.1a8 8 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.6.7.6-.1 1.8-.7 2-1.5.3-.7.3-1.3.2-1.5l-.7-.3Z" /></svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" /></svg>
);

export default async function BlogIndex() {
  let posts: BlogCard[] = [];
  if (databaseConfigured()) { try { posts = await listPublicBlogs(); } catch { posts = []; } }

  const [latest, ...rest] = posts;
  const latestImg = latest ? heroUrl(latest.hero_image_path) : null;

  return (
    <div className={`skg bl-page ${font.className}`}>
      <Header />
      <main>
        {/* Hero */}
        <section className="bl-hero">
          <div className="bl-wrap">
            <nav className="bl-crumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <Chevron />
              <span aria-current="page">Travel blog</span>
            </nav>
            <h1>Travel guides and cab booking tips</h1>
            <p className="bl-lead">Route guides, outstation trip ideas and practical advice to help you plan a comfortable ride anywhere in India.</p>
          </div>
        </section>

        <div className="bl-main">
          <div className="bl-wrap">
            {posts.length === 0 ? (
              <div className="bl-empty">
                <CarIcon />
                <h2>No articles yet</h2>
                <p>We are writing new travel guides. In the meantime, you can book a cab directly with our team.</p>
                <a className="bl-btn bl-btn--green" href={WA} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />Book on WhatsApp</a>
              </div>
            ) : (
              <>
                {/* Latest article */}
                <a className="bl-feature" href={blogPublicPath(latest.slug)}>
                  <div className="bl-feature-media">
                    {latestImg ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={latestImg} alt={latest.title} fetchPriority="high" />
                    ) : <div className="bl-ph"><CarIcon /></div>}
                  </div>
                  <div className="bl-feature-body">
                    <span className="bl-tag">Latest article</span>
                    <time dateTime={latest.published_at}>{fmt(latest.published_at)}</time>
                    <h2>{latest.title}</h2>
                    {latest.meta_description && <p>{latest.meta_description}</p>}
                    <span className="bl-more">Read article <Arrow /></span>
                  </div>
                </a>

                {/* More articles */}
                {rest.length > 0 && (
                  <>
                    <div className="bl-section-head">
                      <h2>More articles</h2>
                      <span>{rest.length} {rest.length === 1 ? 'article' : 'articles'}</span>
                    </div>
                    <div className="bl-grid">
                      {rest.map((p) => {
                        const img = heroUrl(p.hero_image_path);
                        return (
                          <a key={p.slug} className="bl-card" href={blogPublicPath(p.slug)}>
                            <div className="bl-card-media">
                              {img ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={img} alt={p.title} loading="lazy" />
                              ) : <div className="bl-ph"><CarIcon /></div>}
                            </div>
                            <div className="bl-card-body">
                              <time dateTime={p.published_at}>{fmt(p.published_at)}</time>
                              <h2>{p.title}</h2>
                              {p.meta_description && <p>{p.meta_description}</p>}
                              <span className="bl-more">Read article <Arrow /></span>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            )}

            {/* Call to action */}
            <section className="bl-cta" aria-label="Book a cab">
              <div>
                <h2>Planning a trip?</h2>
                <p>Clean cars, verified drivers and 24x7 booking support.</p>
              </div>
              <div className="bl-cta-actions">
                <a className="bl-btn bl-btn--green" href={WA} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />Book on WhatsApp</a>
                <a className="bl-btn bl-btn--ghost" href={PHONE}><PhoneIcon />Call us</a>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}