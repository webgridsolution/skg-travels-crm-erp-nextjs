import '../area/area.css';
import '../cms-public.css';
import '@/app/site.css';
import type { Metadata } from 'next';
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

export default async function BlogIndex() {
  let posts: BlogCard[] = [];
  if (databaseConfigured()) { try { posts = await listPublicBlogs(); } catch { posts = []; } }

  return (
    <div className={`skg area-page ${font.className}`}>
      <Header />
      <main>
        <section className="area-hero">
          <div className="wrap"><p className="area-crumb">SKG Travels</p><h1>Travel Blog</h1></div>
        </section>
        <section className="wrap">
          {posts.length === 0 ? (
            <div className="blog-empty">No articles have been published yet.</div>
          ) : (
            <div className="blog-grid">
              {posts.map((p) => {
                const img = heroUrl(p.hero_image_path);
                return (
                  <a key={p.slug} className="blog-card" href={blogPublicPath(p.slug)}>
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={p.title} loading="lazy" />
                    ) : <div className="blog-card-ph" />}
                    <div className="blog-card-body">
                      <time dateTime={p.published_at}>{fmt(p.published_at)}</time>
                      <h2>{p.title}</h2>
                      {p.meta_description && <p>{p.meta_description}</p>}
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
