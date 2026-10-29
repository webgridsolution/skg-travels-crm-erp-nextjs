// import '../blog-post.css';
import '../../cms-public.css';
import '@/app/site.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Poppins } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { heroUrl, siteUrl } from '@/lib/server/area-seo';
import { blogPublicPath, getPublicBlog } from '@/lib/server/blogs';
import { renderHeadTags } from '@/lib/server/head-tags';
import { databaseConfigured } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';
const font = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

type Params = { params: Promise<{ slug: string }> };
const load = async (slug: string) => (databaseConfigured() ? getPublicBlog(slug) : null);
const fmt = (iso: string) => new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(iso));

const WA = 'https://wa.me/917506222999';
const PHONE = 'tel:+917506222999';

/* ---------- helpers ---------- */
const stripTags = (s: string) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'section';

type TocItem = { id: string; text: string };

/** Adds ids to h2/h3 so the table of contents can link to them. */
function prepare(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const out = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level: string, attrs: string, inner: string) => {
    const text = stripTags(inner);
    if (!text) return match;
    let id = slugify(text);
    let n = 2;
    while (used.has(id)) id = `${slugify(text)}-${n++}`;
    used.add(id);
    if (level === '2') toc.push({ id, text });
    return `<h${level}${attrs.replace(/\sid=("[^"]*"|'[^']*')/i, '')} id="${id}">${inner}</h${level}>`;
  });
  return { html: out, toc };
}

/* ---------- icons ---------- */
const Chevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
);
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
);
const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
);
const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12 0 12 12 0 0 0 1.6 17.9L0 24l6.3-1.6A12 12 0 0 0 12 24a12 12 0 0 0 8.5-20.5ZM12 21.9a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.3-.4A9.9 9.9 0 1 1 12 21.9Zm5.4-7.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.3.2-.6.1a8 8 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.6.7.6-.1 1.8-.7 2-1.5.3-.7.3-1.3.2-1.5l-.7-.3Z" /></svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" /></svg>
);

/* ---------- metadata ---------- */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await load((await params).slug);
  if (!post) return { title: 'Article not found', robots: { index: false } };
  const canonical = post.canonical_url || `${siteUrl()}${blogPublicPath(post.slug)}`;
  const image = heroUrl(post.hero_image_path);
  return {
    title: post.seo_title,
    description: post.meta_description ?? undefined,
    keywords: post.keywords ?? undefined,
    alternates: { canonical },
    openGraph: { title: post.seo_title, description: post.meta_description ?? undefined, url: canonical, type: 'article', siteName: 'SKG Travels', images: image ? [`${siteUrl()}${image}`] : undefined },
  };
}

/* ---------- page ---------- */
export default async function BlogPost({ params }: Params) {
  const post = await load((await params).slug);
  if (!post) notFound();

  const hero = heroUrl(post.hero_image_path);
  const canonical = post.canonical_url || `${siteUrl()}${blogPublicPath(post.slug)}`;
  const body = post.body_html ? prepare(post.body_html) : null;
  const closing = post.closing_html ? prepare(post.closing_html) : null;
  const words = stripTags(`${post.body_html ?? ''} ${post.closing_html ?? ''}`).split(' ').filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  const shareText = encodeURIComponent(`${post.title} ${canonical}`);
  const shareUrl = encodeURIComponent(canonical);

  return (
    <div className={`skg bp-page ${font.className}`}>
      {renderHeadTags(post.head_scripts)}
      <div className="bp-progress" aria-hidden="true" />
      <Header />
      <main>
        {/* Hero */}
        <section className={`bp-hero${hero ? '' : ' bp-hero--plain'}`}>
          <div className="bp-wrap bp-hero-inner">
            <nav className="bp-crumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <Chevron />
              <Link href="/blogs">Travel blog</Link>
              <Chevron />
              <span aria-current="page">Article</span>
            </nav>
            <h1>{post.title}</h1>
            <ul className="bp-meta">
              {post.published_at && (
                <li><CalendarIcon />Published {fmt(post.published_at)}</li>
              )}
              <li><ClockIcon />{minutes} min read</li>
            </ul>
          </div>

          {hero && (
            <div className="bp-wrap bp-hero-bottom">
              <figure className="bp-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hero} alt={post.title} width={1100} height={420} fetchPriority="high" />
              </figure>
            </div>
          )}
        </section>

        {/* Article */}
        <div className={`bp-main${hero ? ' bp-main--overlap' : ''}`}>
          <div className="bp-wrap bp-grid">
            <div className="bp-content">
              {body && (
                <article className="bp-card">
                  <div className="bp-rich" dangerouslySetInnerHTML={{ __html: body.html }} />
                  <div className="bp-share">
                    <span>Share this article</span>
                    <a href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer">Facebook</a>
                    <a href={`https://twitter.com/intent/tweet?text=${shareText}`} target="_blank" rel="noopener noreferrer">X</a>
                  </div>
                </article>
              )}

              {closing && (
                <section className="bp-card bp-card--mint">
                  <div className="bp-rich" dangerouslySetInnerHTML={{ __html: closing.html }} />
                </section>
              )}

              <section className="bp-cta" aria-label="Book a cab">
                <div>
                  <h2>Planning a trip?</h2>
                  <p>Clean cars, verified drivers and 24x7 booking support.</p>
                </div>
                <div className="bp-cta-actions">
                  <a className="bp-btn bp-btn--green" href={WA} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />Book on WhatsApp</a>
                  <a className="bp-btn bp-btn--ghost" href={PHONE}><PhoneIcon />Call us</a>
                </div>
              </section>
            </div>

            <aside className="bp-aside">
              {body && body.toc.length >= 2 && (
                <nav className="bp-toc" aria-label="In this article">
                  <h2>In this article</h2>
                  <ol>
                    {body.toc.map((t) => (
                      <li key={t.id}><a href={`#${t.id}`}>{t.text}</a></li>
                    ))}
                  </ol>
                </nav>
              )}

              <div className="bp-book">
                <h2>Book your cab today</h2>
                <p>Tell us where you are going and we will confirm your fare and car on WhatsApp.</p>
                <ul className="bp-checks">
                  <li><CheckIcon />Clean, well-maintained cars</li>
                  <li><CheckIcon />Verified, experienced drivers</li>
                  <li><CheckIcon />Clear pricing with no hidden charges</li>
                  <li><CheckIcon />Support available 24x7</li>
                </ul>
                <a className="bp-btn bp-btn--green bp-btn--block" href={WA} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />Book on WhatsApp</a>
                <a className="bp-btn bp-btn--outline bp-btn--block" href={PHONE}><PhoneIcon />+91 750 6222 999</a>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Mobile action bar */}
      <div className="bp-mobilebar">
        <a className="bp-btn bp-btn--green" href={WA} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />WhatsApp</a>
        <a className="bp-btn bp-btn--outline" href={PHONE}><PhoneIcon />Call</a>
      </div>

      <Footer />
    </div>
  );
}