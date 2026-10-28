import { NextRequest, NextResponse } from 'next/server';
import { transaction } from '@/lib/server/db';
import { deleteHeroImage, guard, heroUrl, saveHeroImage } from '@/lib/server/area-seo';
import { getBlog, parseBlogForm, refreshBlogPages } from '@/lib/server/blogs';

type Ctx = { params: Promise<{ id: string }> };
const idOf = async (ctx: Ctx) => { const n = Number((await ctx.params).id); return Number.isSafeInteger(n) && n > 0 ? n : null; };

export async function GET(req: NextRequest, ctx: Ctx) {
  const g = await guard(req, 'blog.update', false);
  if ('response' in g) return g.response;
  const id = await idOf(ctx);
  if (!id) return NextResponse.json({ error: 'Invalid article id.' }, { status: 400 });
  const row = await getBlog(id, g.user.companyId);
  if (!row) return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
  return NextResponse.json({ page: { ...row, hero_image_url: heroUrl(row.hero_image_path) } });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const g = await guard(req, 'blog.update');
  if ('response' in g) return g.response;
  const id = await idOf(ctx);
  if (!id) return NextResponse.json({ error: 'Invalid article id.' }, { status: 400 });
  const parsed = await parseBlogForm(req);
  if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { data, image } = parsed;

  let newImage: string | null = null;
  let oldImage: string | null = null;
  try {
    if (image) newImage = await saveHeroImage(image);
    const found = await transaction(async (conn) => {
      const [rows] = await conn.execute<any[]>('SELECT hero_image_path FROM blog_articles WHERE id=? AND company_id=? FOR UPDATE', [id, g.user.companyId]);
      if (!rows.length) return false;
      oldImage = rows[0].hero_image_path ?? null;
      const finalImage = newImage ?? (data.remove_image ? null : oldImage);
      // published_at is stamped the first time an article goes live and kept afterwards; unpublishing clears nothing so re-publishing keeps the original date.
      await conn.execute(
        `UPDATE blog_articles SET title=?,slug=?,seo_title=?,meta_description=?,keywords=?,canonical_url=?,hero_image_path=?,body_html=?,closing_html=?,head_scripts=?,is_active=?,is_published=?,published_at=IF(? = 1 AND published_at IS NULL, UTC_TIMESTAMP(), published_at),updated_by=? WHERE id=? AND company_id=?`,
        [data.title, data.slug, data.seo_title, data.meta_description, data.keywords, data.canonical_url, finalImage,
         data.body_html, data.closing_html, data.head_scripts, data.is_active, data.is_published, data.is_published, g.user.id, id, g.user.companyId]);
      await conn.execute('INSERT INTO audit_logs(company_id,user_id,event,subject_type,subject_id,after_values) VALUES(?,?,?,?,?,?)',
        [g.user.companyId, g.user.id, 'blog_article.updated', 'blog_article', id, JSON.stringify({ slug: data.slug, title: data.title, published: data.is_published, active: data.is_active })]);
      return true;
    });
    if (!found) { await deleteHeroImage(newImage); return NextResponse.json({ error: 'Article not found.' }, { status: 404 }); }
    if (newImage || data.remove_image) await deleteHeroImage(oldImage);
    refreshBlogPages();
    return NextResponse.json({ ok: true });
  } catch (e) {
    await deleteHeroImage(newImage);
    const code = (e as { code?: string })?.code;
    if (code === 'ER_DUP_ENTRY') return NextResponse.json({ error: 'That slug is already used by another article.' }, { status: 409 });
    return NextResponse.json({ error: e instanceof Error && /Hero image/.test(e.message) ? e.message : 'Article could not be updated.' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const g = await guard(req, 'blog.delete');
  if ('response' in g) return g.response;
  const id = await idOf(ctx);
  if (!id) return NextResponse.json({ error: 'Invalid article id.' }, { status: 400 });
  try {
    const image = await transaction(async (conn) => {
      const [rows] = await conn.execute<any[]>('SELECT slug,title,hero_image_path FROM blog_articles WHERE id=? AND company_id=? FOR UPDATE', [id, g.user.companyId]);
      if (!rows.length) return undefined;
      await conn.execute('DELETE FROM blog_articles WHERE id=? AND company_id=?', [id, g.user.companyId]);
      await conn.execute('INSERT INTO audit_logs(company_id,user_id,event,subject_type,subject_id,before_values) VALUES(?,?,?,?,?,?)',
        [g.user.companyId, g.user.id, 'blog_article.deleted', 'blog_article', id, JSON.stringify({ slug: rows[0].slug, title: rows[0].title })]);
      return (rows[0].hero_image_path as string | null) ?? null;
    });
    if (image === undefined) return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
    await deleteHeroImage(image);
    refreshBlogPages();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Article could not be deleted.' }, { status: 400 });
  }
}
