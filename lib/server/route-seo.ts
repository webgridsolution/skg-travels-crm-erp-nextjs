import 'server-only';
import { z } from 'zod';
import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from './db';
import { PAGE_SIZE, sanitizeCmsHtml } from './area-seo';
import { routeDefaults, slugify } from '@/lib/domain/slug';

/* Guards, image storage and the HTML sanitiser are shared with Area SEO pages (see ./area-seo). */

export type RouteSeoListRow = {
  id: number; city_name: string; city_slug: string; from_city: string; to_city: string; slug: string; seo_title: string;
  is_active: number; is_published: number; updated_at: string;
};
export type RouteSeoFull = RouteSeoListRow & {
  h1_title: string; meta_description: string | null; keywords: string | null; distance: string | null; travel_time: string | null;
  starting_fare: string | null; canonical_url: string | null; hero_image_path: string | null;
  intro_html: string | null; body_html: string | null; fare_table_html: string | null; faq_html: string | null; head_scripts: string | null;
};

export const routePublicPath = (citySlug: string, slug: string) => `/${citySlug}/${slug}.html`;

export function refreshRoutePages() {
  try { revalidatePath('/route/[city]/[slug]', 'page'); revalidatePath('/sitemap.xml'); } catch { /* not fatal */ }
}

const bool = z.preprocess((v) => v === 'on' || v === '1' || v === 'true' || v === true, z.boolean());
const text = (max: number) => z.string().trim().max(max).optional().transform((v) => v ?? '');
const schema = z.object({
  city_name: z.string().trim().min(2, 'City is required.').max(100),
  from_city: z.string().trim().min(2, 'From city is required.').max(100),
  to_city: z.string().trim().min(2, 'To city is required.').max(100),
  slug: text(190),
  h1_title: text(255),
  seo_title: text(255),
  meta_description: text(500),
  keywords: text(2000),
  distance: text(60),
  travel_time: text(60),
  starting_fare: text(60),
  canonical_url: text(500).refine((v) => v === '' || /^https?:\/\/[^\s]+$/i.test(v), 'Canonical URL must start with http:// or https://'),
  intro_html: text(200_000),
  body_html: text(500_000),
  fare_table_html: text(200_000),
  faq_html: text(200_000),
  head_scripts: text(50_000),
  is_active: bool,
  is_published: bool,
  remove_image: bool,
});

export type RouteParsed = ReturnType<typeof normalise>;
function normalise(raw: z.infer<typeof schema>) {
  const d = routeDefaults(raw.from_city, raw.to_city);
  const slug = slugify(raw.slug.replace(/\.html?$/i, '')) || d.slug;
  return {
    city_name: raw.city_name,
    city_slug: slugify(raw.city_name),
    from_city: raw.from_city,
    to_city: raw.to_city,
    slug,
    h1_title: raw.h1_title || d.h1,
    seo_title: raw.seo_title || d.seoTitle,
    meta_description: raw.meta_description || d.metaDescription,
    keywords: raw.keywords || d.keywords,
    distance: raw.distance || null,
    travel_time: raw.travel_time || null,
    starting_fare: raw.starting_fare || null,
    canonical_url: raw.canonical_url || null,
    intro_html: sanitizeCmsHtml(raw.intro_html),
    body_html: sanitizeCmsHtml(raw.body_html),
    fare_table_html: sanitizeCmsHtml(raw.fare_table_html),
    faq_html: sanitizeCmsHtml(raw.faq_html),
    // Head scripts are intentionally NOT sanitised (verification tags, pixels, JSON-LD). Only users with route_seo.create/update can set them.
    head_scripts: raw.head_scripts || null,
    is_active: raw.is_active ? 1 : 0,
    is_published: raw.is_published ? 1 : 0,
    remove_image: raw.remove_image,
  };
}

export async function parseRouteForm(req: NextRequest): Promise<{ data: RouteParsed; image: File | null } | { error: string }> {
  let fd: FormData;
  try { fd = await req.formData(); } catch { return { error: 'Invalid form submission.' }; }
  const obj: Record<string, unknown> = {};
  for (const [k, v] of fd.entries()) if (typeof v === 'string') obj[k] = v;
  const parsed = schema.safeParse(obj);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the form fields.' };
  const data = normalise(parsed.data);
  if (!data.city_slug) return { error: 'City must contain letters or numbers.' };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) return { error: 'Slug may only contain lowercase letters, numbers and hyphens.' };
  const file = fd.get('hero_image');
  const image = file instanceof File && file.size > 0 ? file : null;
  return { data, image };
}

const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : String(v));

export async function listRoutePages(companyId: number, q: string, page: number) {
  const like = `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
  const where = q ? 'AND (from_city LIKE ? OR to_city LIKE ? OR city_name LIKE ? OR slug LIKE ? OR seo_title LIKE ?)' : '';
  const params: (string | number)[] = q ? [companyId, like, like, like, like, like] : [companyId];
  const [[count]] = await db().execute<any[]>(`SELECT COUNT(*) n FROM route_seo_pages WHERE company_id=? ${where}`, params);
  const total = Number(count.n);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, Math.floor(page) || 1), pages);
  const offset = (safePage - 1) * PAGE_SIZE; // integers only → safe to inline
  const [rows] = await db().execute<any[]>(
    `SELECT id,city_name,city_slug,from_city,to_city,slug,seo_title,is_active,is_published,updated_at FROM route_seo_pages WHERE company_id=? ${where} ORDER BY updated_at DESC, id DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`, params);
  return { rows: rows.map((r) => ({ ...r, updated_at: iso(r.updated_at) })) as RouteSeoListRow[], total, page: safePage, pages };
}

export async function getRoutePage(id: number, companyId: number): Promise<RouteSeoFull | null> {
  const [rows] = await db().execute<any[]>('SELECT * FROM route_seo_pages WHERE id=? AND company_id=? LIMIT 1', [id, companyId]);
  return rows[0] ? ({ ...rows[0], updated_at: iso(rows[0].updated_at) } as RouteSeoFull) : null;
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export async function getPublicRoutePage(citySlug: string, slug: string): Promise<RouteSeoFull | null> {
  if (!SLUG_RE.test(citySlug) || !SLUG_RE.test(slug)) return null;
  const [rows] = await db().execute<any[]>('SELECT * FROM route_seo_pages WHERE city_slug=? AND slug=? AND is_active=1 AND is_published=1 LIMIT 1', [citySlug, slug]);
  return rows[0] ? ({ ...rows[0], updated_at: iso(rows[0].updated_at) } as RouteSeoFull) : null;
}

export async function listRelatedRoutes(citySlug: string, excludeId: number) {
  const [rows] = await db().execute<any[]>('SELECT from_city,to_city,city_slug,slug FROM route_seo_pages WHERE is_active=1 AND is_published=1 AND city_slug=? AND id<>? ORDER BY from_city,to_city LIMIT 24', [citySlug, excludeId]);
  return rows as { from_city: string; to_city: string; city_slug: string; slug: string }[];
}

export async function listRoutesForSitemap() {
  const [rows] = await db().execute<any[]>('SELECT city_slug,slug,updated_at FROM route_seo_pages WHERE is_active=1 AND is_published=1 ORDER BY id');
  return rows.map((r) => ({ city_slug: String(r.city_slug), slug: String(r.slug), updated_at: r.updated_at as Date }));
}
