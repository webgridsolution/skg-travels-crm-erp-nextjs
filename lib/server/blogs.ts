import 'server-only';
import { z } from 'zod';
import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from './db';
import { PAGE_SIZE, sanitizeCmsHtml } from './area-seo';
import { blogDefaults, slugify } from '@/lib/domain/slug';

/* Guards, image storage and the HTML sanitiser are shared with Area SEO pages (see ./area-seo). */

export type BlogListRow = {
  id: number; title: string; slug: string; seo_title: string; is_active: number; is_published: number; updated_at: string;
};
export type BlogFull = BlogListRow & {
  meta_description: string | null; keywords: string | null; canonical_url: string | null; hero_image_path: string | null;
  body_html: string | null; closing_html: string | null; head_scripts: string | null; published_at: string | null;
};
export type BlogCard = { title: string; slug: string; meta_description: string | null; hero_image_path: string | null; published_at: string };

export const blogPublicPath = (slug: string) => `/blogs/${slug}.html`;

export function refreshBlogPages() {
  try { revalidatePath('/blogs', 'page'); revalidatePath('/blogs/[slug]', 'page'); revalidatePath('/sitemap.xml'); } catch { /* not fatal */ }
}

const bool = z.preprocess((v) => v === 'on' || v === '1' || v === 'true' || v === true, z.boolean());
const text = (max: number) => z.string().trim().max(max).optional().transform((v) => v ?? '');
const schema = z.object({
  title: z.string().trim().min(3, 'Blog title is required.').max(255),
  slug: text(190),
  seo_title: text(255),
  meta_description: text(500),
  keywords: text(2000),
  canonical_url: text(500).refine((v) => v === '' || /^https?:\/\/[^\s]+$/i.test(v), 'Canonical URL must start with http:// or https://'),
  body_html: text(800_000),
  closing_html: text(200_000),
  head_scripts: text(50_000),
  is_active: bool,
  is_published: bool,
  remove_image: bool,
});

export type BlogParsed = ReturnType<typeof normalise>;
function normalise(raw: z.infer<typeof schema>) {
  const d = blogDefaults(raw.title);
  const slug = slugify(raw.slug.replace(/\.html?$/i, '')) || d.slug;
  return {
    title: raw.title,
    slug,
    seo_title: raw.seo_title || d.seoTitle,
    meta_description: raw.meta_description || null,
    keywords: raw.keywords || null,
    canonical_url: raw.canonical_url || null,
    body_html: sanitizeCmsHtml(raw.body_html),
    closing_html: sanitizeCmsHtml(raw.closing_html),
    // Head scripts are intentionally NOT sanitised (verification tags, pixels, JSON-LD). Only users with blog.create/update can set them.
    head_scripts: raw.head_scripts || null,
    is_active: raw.is_active ? 1 : 0,
    is_published: raw.is_published ? 1 : 0,
    remove_image: raw.remove_image,
  };
}

export async function parseBlogForm(req: NextRequest): Promise<{ data: BlogParsed; image: File | null } | { error: string }> {
  let fd: FormData;
  try { fd = await req.formData(); } catch { return { error: 'Invalid form submission.' }; }
  const obj: Record<string, unknown> = {};
  for (const [k, v] of fd.entries()) if (typeof v === 'string') obj[k] = v;
  const parsed = schema.safeParse(obj);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the form fields.' };
  const data = normalise(parsed.data);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) return { error: 'Slug may only contain lowercase letters, numbers and hyphens.' };
  const file = fd.get('hero_image');
  const image = file instanceof File && file.size > 0 ? file : null;
  return { data, image };
}

const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : String(v));

export async function listBlogs(companyId: number, q: string, page: number) {
  const like = `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
  const where = q ? 'AND (title LIKE ? OR slug LIKE ? OR seo_title LIKE ?)' : '';
  const params: (string | number)[] = q ? [companyId, like, like, like] : [companyId];
  const [[count]] = await db().execute<any[]>(`SELECT COUNT(*) n FROM blog_articles WHERE company_id=? ${where}`, params);
  const total = Number(count.n);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, Math.floor(page) || 1), pages);
  const offset = (safePage - 1) * PAGE_SIZE;
  const [rows] = await db().execute<any[]>(
    `SELECT id,title,slug,seo_title,is_active,is_published,updated_at FROM blog_articles WHERE company_id=? ${where} ORDER BY updated_at DESC, id DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`, params);
  return { rows: rows.map((r) => ({ ...r, updated_at: iso(r.updated_at) })) as BlogListRow[], total, page: safePage, pages };
}

export async function getBlog(id: number, companyId: number): Promise<BlogFull | null> {
  const [rows] = await db().execute<any[]>('SELECT * FROM blog_articles WHERE id=? AND company_id=? LIMIT 1', [id, companyId]);
  const r = rows[0];
  return r ? ({ ...r, updated_at: iso(r.updated_at), published_at: r.published_at ? iso(r.published_at) : null } as BlogFull) : null;
}

export async function getPublicBlog(slug: string): Promise<BlogFull | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const [rows] = await db().execute<any[]>('SELECT * FROM blog_articles WHERE slug=? AND is_active=1 AND is_published=1 LIMIT 1', [slug]);
  const r = rows[0];
  return r ? ({ ...r, updated_at: iso(r.updated_at), published_at: r.published_at ? iso(r.published_at) : null } as BlogFull) : null;
}

export async function listPublicBlogs(limit = 60): Promise<BlogCard[]> {
  const n = Math.min(Math.max(1, Math.floor(limit)), 200);
  const [rows] = await db().execute<any[]>(
    `SELECT title,slug,meta_description,hero_image_path,COALESCE(published_at,created_at) published_at FROM blog_articles WHERE is_active=1 AND is_published=1 ORDER BY COALESCE(published_at,created_at) DESC, id DESC LIMIT ${n}`);
  return rows.map((r) => ({ ...r, published_at: iso(r.published_at) })) as BlogCard[];
}

export async function listBlogsForSitemap() {
  const [rows] = await db().execute<any[]>('SELECT slug,updated_at FROM blog_articles WHERE is_active=1 AND is_published=1 ORDER BY id');
  return rows.map((r) => ({ slug: String(r.slug), updated_at: r.updated_at as Date }));
}
