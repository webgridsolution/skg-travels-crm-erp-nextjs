import '../../area/area.css';
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

export default async function BlogPost({ params }: Params) {
  const post = await load((await params).slug);
  if (!post) notFound();
  const hero = heroUrl(post.hero_image_path);

  return (
    <div className={`skg area-page ${font.className}`}>
      {renderHeadTags(post.head_scripts)}
      <Header />
      <main>
        <section className="area-hero">
          <div className="wrap">
            <p className="area-crumb"><Link href="/blogs">Travel Blog</Link></p>
            <h1>{post.title}</h1>
            {post.published_at && <p className="blog-meta">Published {fmt(post.published_at)}</p>}
          </div>
          {hero && (
            <div className="wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="area-hero-img" src={hero} alt={post.title} width={1100} height={420} fetchPriority="high" />
            </div>
          )}
        </section>

        {post.body_html && <section className="wrap area-body"><div className="area-rich" dangerouslySetInnerHTML={{ __html: post.body_html }} /></section>}
        {post.closing_html && <section className="wrap blog-closing"><div className="area-rich" dangerouslySetInnerHTML={{ __html: post.closing_html }} /></section>}

        <section className="wrap area-cta">
          <h2>Planning a trip?</h2>
          <p>Clean cars, verified drivers and 24x7 booking support.</p>
          <a className="btn btn-green" href="https://wa.me/917506222999" target="_blank" rel="noopener noreferrer">Book on WhatsApp</a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
