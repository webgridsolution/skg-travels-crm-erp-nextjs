import { NextRequest, NextResponse } from 'next/server';
import { transaction } from '@/lib/server/db';
import { deleteHeroImage, getAreaPage, guard, heroUrl, parseForm, refreshPublicPages, saveHeroImage } from '@/lib/server/area-seo';

type Ctx = { params: Promise<{ id: string }> };
const idOf = async (ctx: Ctx) => { const n = Number((await ctx.params).id); return Number.isSafeInteger(n) && n > 0 ? n : null; };

export async function GET(req: NextRequest, ctx: Ctx) {
  const g = await guard(req, 'area_seo.update', false);
  if ('response' in g) return g.response;
  const id = await idOf(ctx);
  if (!id) return NextResponse.json({ error: 'Invalid page id.' }, { status: 400 });
  const row = await getAreaPage(id, g.user.companyId);
  if (!row) return NextResponse.json({ error: 'Page not found.' }, { status: 404 });
  return NextResponse.json({ page: { ...row, hero_image_url: heroUrl(row.hero_image_path) } });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const g = await guard(req, 'area_seo.update');
  if ('response' in g) return g.response;
  const id = await idOf(ctx);
  if (!id) return NextResponse.json({ error: 'Invalid page id.' }, { status: 400 });
  const parsed = await parseForm(req);
  if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { data, image } = parsed;

  let newImage: string | null = null;
  let oldImage: string | null = null;
  try {
    if (image) newImage = await saveHeroImage(image);
    const found = await transaction(async (conn) => {
      const [rows] = await conn.execute<any[]>('SELECT hero_image_path FROM area_seo_pages WHERE id=? AND company_id=? FOR UPDATE', [id, g.user.companyId]);
      if (!rows.length) return false;
      oldImage = rows[0].hero_image_path ?? null;
      const finalImage = newImage ?? (data.remove_image ? null : oldImage);
      await conn.execute(
        `UPDATE area_seo_pages SET area_name=?,city_name=?,slug=?,h1_title=?,seo_title=?,meta_description=?,keywords=?,canonical_url=?,hero_image_path=?,intro_html=?,body_html=?,faq_html=?,head_scripts=?,is_active=?,is_published=?,updated_by=? WHERE id=? AND company_id=?`,
        [data.area_name, data.city_name, data.slug, data.h1_title, data.seo_title, data.meta_description, data.keywords, data.canonical_url, finalImage,
         data.intro_html, data.body_html, data.faq_html, data.head_scripts, data.is_active, data.is_published, g.user.id, id, g.user.companyId]);
      await conn.execute('INSERT INTO audit_logs(company_id,user_id,event,subject_type,subject_id,after_values) VALUES(?,?,?,?,?,?)',
        [g.user.companyId, g.user.id, 'area_seo_page.updated', 'area_seo_page', id, JSON.stringify({ slug: data.slug, area: data.area_name, published: data.is_published, active: data.is_active })]);
      return true;
    });
    if (!found) { await deleteHeroImage(newImage); return NextResponse.json({ error: 'Page not found.' }, { status: 404 }); }
    if (newImage || data.remove_image) await deleteHeroImage(oldImage);
    refreshPublicPages();
    return NextResponse.json({ ok: true });
  } catch (e) {
    await deleteHeroImage(newImage);
    const code = (e as { code?: string })?.code;
    if (code === 'ER_DUP_ENTRY') return NextResponse.json({ error: 'That slug is already used by another page.' }, { status: 409 });
    return NextResponse.json({ error: e instanceof Error && /Hero image/.test(e.message) ? e.message : 'Page could not be updated.' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const g = await guard(req, 'area_seo.delete');
  if ('response' in g) return g.response;
  const id = await idOf(ctx);
  if (!id) return NextResponse.json({ error: 'Invalid page id.' }, { status: 400 });
  try {
    const image = await transaction(async (conn) => {
      const [rows] = await conn.execute<any[]>('SELECT slug,area_name,hero_image_path FROM area_seo_pages WHERE id=? AND company_id=? FOR UPDATE', [id, g.user.companyId]);
      if (!rows.length) return undefined;
      await conn.execute('DELETE FROM area_seo_pages WHERE id=? AND company_id=?', [id, g.user.companyId]);
      await conn.execute('INSERT INTO audit_logs(company_id,user_id,event,subject_type,subject_id,before_values) VALUES(?,?,?,?,?,?)',
        [g.user.companyId, g.user.id, 'area_seo_page.deleted', 'area_seo_page', id, JSON.stringify({ slug: rows[0].slug, area: rows[0].area_name })]);
      return (rows[0].hero_image_path as string | null) ?? null;
    });
    if (image === undefined) return NextResponse.json({ error: 'Page not found.' }, { status: 404 });
    await deleteHeroImage(image);
    refreshPublicPages();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Page could not be deleted.' }, { status: 400 });
  }
}
