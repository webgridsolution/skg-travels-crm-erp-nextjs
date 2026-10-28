import 'server-only';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';
import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from './db';
import { getCurrentUser, hasPermission, databaseConfigured, type SessionUser } from './auth';
import { areaDefaults, slugify } from '@/lib/domain/slug';

/* ---------- types ---------- */
export type AreaSeoListRow = {
  id: number; area_name: string; city_name: string; slug: string; seo_title: string;
  is_active: number; is_published: number; updated_at: string;
};
export type AreaSeoFull = AreaSeoListRow & {
  h1_title: string; meta_description: string | null; keywords: string | null; canonical_url: string | null;
  hero_image_path: string | null; intro_html: string | null; body_html: string | null; faq_html: string | null; head_scripts: string | null;
};

export const PAGE_SIZE = 10;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

/* ---------- request helpers ---------- */
export function originOk(req: NextRequest) {
  try {
    const o = req.headers.get('origin');
    const h = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
    return !!o && new URL(o).host === h;
  } catch { return false; }
}

export async function guard(req: NextRequest, permission: string, mutating = true): Promise<{ user: SessionUser } | { response: NextResponse }> {
  if (mutating && !originOk(req)) return { response: NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 }) };
  const user = await getCurrentUser();
  if (!user) return { response: NextResponse.json({ error: 'Please sign in.' }, { status: 401 }) };
  if (!hasPermission(user, permission)) return { response: NextResponse.json({ error: 'You do not have permission for this action.' }, { status: 403 }) };
  if (mutating && !databaseConfigured()) return { response: NextResponse.json({ error: 'Preview mode is read-only.' }, { status: 503 }) };
  return { user };
}

export function refreshPublicPages() {
  try { revalidatePath('/area/[slug]', 'page'); revalidatePath('/sitemap.xml'); } catch { /* not fatal */ }
}

/* ---------- validation ---------- */
const bool = z.preprocess((v) => v === 'on' || v === '1' || v === 'true' || v === true, z.boolean());
const text = (max: number) => z.string().trim().max(max).optional().transform((v) => v ?? '');
const schema = z.object({
  area_name: z.string().trim().min(2, 'Area name is required.').max(120),
  city_name: z.string().trim().min(2, 'City name is required.').max(100),
  slug: text(190),
  h1_title: text(255),
  seo_title: text(255),
  meta_description: text(500),
  keywords: text(2000),
  canonical_url: text(500).refine((v) => v === '' || /^https?:\/\/[^\s]+$/i.test(v), 'Canonical URL must start with http:// or https://'),
  intro_html: text(200_000),
  body_html: text(500_000),
  faq_html: text(200_000),
  head_scripts: text(50_000),
  is_active: bool,
  is_published: bool,
  remove_image: bool,
});

export function sanitizeCmsHtml(html: string): string {
  if (!html.trim()) return '';
  return sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags.filter((t) => t !== 'h1'),
      'img', 'figure', 'figcaption', 'span', 'div', 'section', 'details', 'summary', 'u', 's', 'mark', 'small', 'iframe', 'h2', 'h3', 'h4', 'h5', 'h6',
    ],
    allowedAttributes: {
      '*': ['class', 'id', 'style', 'title', 'lang', 'dir'],
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
      iframe: ['src', 'width', 'height', 'allowfullscreen', 'loading', 'title'],
      td: ['colspan', 'rowspan'], th: ['colspan', 'rowspan', 'scope'],
      details: ['open'],
    },
    allowedStyles: {
      '*': {
        'text-align': [/^(left|right|center|justify)$/],
        color: [/^[#(),.\w\s%-]+$/], 'background-color': [/^[#(),.\w\s%-]+$/],
        'font-size': [/^[\d.]+(px|em|rem|%)$/], 'font-weight': [/^(\d{3}|bold|normal)$/], 'font-style': [/^(italic|normal)$/],
        'text-decoration': [/^(underline|line-through|none)$/], width: [/^[\d.]+(px|%|em|rem)$/], height: [/^[\d.]+(px|%|em|rem)$/],
      },
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https', 'data'] },
    allowedIframeHostnames: ['www.youtube.com', 'www.youtube-nocookie.com', 'www.google.com', 'maps.google.com'],
    transformTags: {
      a: (tag, attribs) => (attribs.target === '_blank' ? { tagName: tag, attribs: { ...attribs, rel: 'noopener' } } : { tagName: tag, attribs }),
    },
  });
}

export type ParsedInput = ReturnType<typeof normalise>;
function normalise(raw: z.infer<typeof schema>) {
  const d = areaDefaults(raw.area_name, raw.city_name);
  const slug = slugify(raw.slug.replace(/\.html?$/i, '')) || d.slug;
  return {
    area_name: raw.area_name,
    city_name: raw.city_name,
    slug,
    h1_title: raw.h1_title || d.h1,
    seo_title: raw.seo_title || d.seoTitle,
    meta_description: raw.meta_description || d.metaDescription,
    keywords: raw.keywords || d.keywords,
    canonical_url: raw.canonical_url || null,
    intro_html: sanitizeCmsHtml(raw.intro_html),
    body_html: sanitizeCmsHtml(raw.body_html),
    faq_html: sanitizeCmsHtml(raw.faq_html),
    // Head scripts are intentionally NOT sanitised (verification tags, pixels, JSON-LD). Only users with area_seo.create/update can set them.
    head_scripts: raw.head_scripts || null,
    is_active: raw.is_active ? 1 : 0,
    is_published: raw.is_published ? 1 : 0,
    remove_image: raw.remove_image,
  };
}

export async function parseForm(req: NextRequest): Promise<{ data: ParsedInput; image: File | null } | { error: string }> {
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

/* ---------- hero image storage (kept outside /public so new uploads are served immediately in production) ---------- */
function uploadDir() { return path.join(process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'storage', 'uploads'), 'area-seo'); }
export function imageFilePath(name: string) {
  if (!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(name)) return null;
  return path.join(uploadDir(), name);
}
export async function saveHeroImage(file: File): Promise<string> {
  if (file.size > MAX_IMAGE_BYTES) throw new Error('Hero image must be 2 MB or smaller.');
  const buf = Buffer.from(await file.arrayBuffer());
  let ext: string | null = null;
  if (buf.length > 12 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) ext = 'jpg';
  else if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) ext = 'png';
  else if (buf.length > 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') ext = 'webp';
  if (!ext) throw new Error('Hero image must be a JPG, PNG or WebP file.');
  await fs.mkdir(uploadDir(), { recursive: true });
  const name = `${randomUUID()}.${ext}`;
  await fs.writeFile(path.join(uploadDir(), name), buf);
  return name;
}
export async function deleteHeroImage(name: string | null | undefined) {
  if (!name) return;
  const p = imageFilePath(name);
  if (p) await fs.unlink(p).catch(() => undefined);
}
export const heroUrl = (name: string | null | undefined) => (name ? `/media/area-seo/${name}` : null);

/* ---------- queries ---------- */
const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : String(v));

export async function listAreaPages(companyId: number, q: string, page: number) {
  const like = `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
  const where = q ? 'AND (area_name LIKE ? OR city_name LIKE ? OR slug LIKE ? OR seo_title LIKE ?)' : '';
  const params: (string | number)[] = q ? [companyId, like, like, like, like] : [companyId];
  const [[count]] = await db().execute<any[]>(`SELECT COUNT(*) n FROM area_seo_pages WHERE company_id=? ${where}`, params);
  const total = Number(count.n);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, Math.floor(page) || 1), pages);
  const offset = (safePage - 1) * PAGE_SIZE; // integers only → safe to inline (mysql2 prepared LIMIT ? is unreliable on MySQL 8)
  const [rows] = await db().execute<any[]>(
    `SELECT id,area_name,city_name,slug,seo_title,is_active,is_published,updated_at FROM area_seo_pages WHERE company_id=? ${where} ORDER BY updated_at DESC, id DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`, params);
  return { rows: rows.map((r) => ({ ...r, updated_at: iso(r.updated_at) })) as AreaSeoListRow[], total, page: safePage, pages };
}

export async function getAreaPage(id: number, companyId: number): Promise<AreaSeoFull | null> {
  const [rows] = await db().execute<any[]>('SELECT * FROM area_seo_pages WHERE id=? AND company_id=? LIMIT 1', [id, companyId]);
  return rows[0] ? ({ ...rows[0], updated_at: iso(rows[0].updated_at) } as AreaSeoFull) : null;
}

export async function getPublicAreaPage(slug: string): Promise<AreaSeoFull | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const [rows] = await db().execute<any[]>('SELECT * FROM area_seo_pages WHERE slug=? AND is_active=1 AND is_published=1 LIMIT 1', [slug]);
  return rows[0] ? ({ ...rows[0], updated_at: iso(rows[0].updated_at) } as AreaSeoFull) : null;
}

export async function listRelatedAreas(city: string, excludeId: number) {
  const [rows] = await db().execute<any[]>('SELECT area_name,slug FROM area_seo_pages WHERE is_active=1 AND is_published=1 AND city_name=? AND id<>? ORDER BY area_name LIMIT 24', [city, excludeId]);
  return rows as { area_name: string; slug: string }[];
}

export async function listPublishedForSitemap() {
  const [rows] = await db().execute<any[]>('SELECT slug,updated_at FROM area_seo_pages WHERE is_active=1 AND is_published=1 ORDER BY id');
  return rows.map((r) => ({ slug: String(r.slug), updated_at: r.updated_at as Date }));
}

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://skgtravels.com').replace(/\/+$/, '');
export const publicPath = (slug: string) => `/${slug}.html`;
