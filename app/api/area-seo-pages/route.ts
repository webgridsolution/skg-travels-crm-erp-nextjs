import { NextRequest, NextResponse } from 'next/server';
import { transaction } from '@/lib/server/db';
import { deleteHeroImage, guard, parseForm, refreshPublicPages, saveHeroImage } from '@/lib/server/area-seo';

export async function POST(req: NextRequest) {
  const g = await guard(req, 'area_seo.create');
  if ('response' in g) return g.response;
  const parsed = await parseForm(req);
  if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { data, image } = parsed;

  let imageName: string | null = null;
  try {
    if (image) imageName = await saveHeroImage(image);
    const id = await transaction(async (conn) => {
      const [r] = await conn.execute<any>(
        `INSERT INTO area_seo_pages(company_id,area_name,city_name,slug,h1_title,seo_title,meta_description,keywords,canonical_url,hero_image_path,intro_html,body_html,faq_html,head_scripts,is_active,is_published,created_by,updated_by)
         VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [g.user.companyId, data.area_name, data.city_name, data.slug, data.h1_title, data.seo_title, data.meta_description, data.keywords, data.canonical_url, imageName,
         data.intro_html, data.body_html, data.faq_html, data.head_scripts, data.is_active, data.is_published, g.user.id, g.user.id]);
      await conn.execute('INSERT INTO audit_logs(company_id,user_id,event,subject_type,subject_id,after_values) VALUES(?,?,?,?,?,?)',
        [g.user.companyId, g.user.id, 'area_seo_page.created', 'area_seo_page', r.insertId, JSON.stringify({ slug: data.slug, area: data.area_name, published: data.is_published })]);
      return Number(r.insertId);
    });
    refreshPublicPages();
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (e) {
    await deleteHeroImage(imageName);
    const code = (e as { code?: string })?.code;
    if (code === 'ER_DUP_ENTRY') return NextResponse.json({ error: 'That slug is already used by another page.' }, { status: 409 });
    return NextResponse.json({ error: e instanceof Error && /Hero image/.test(e.message) ? e.message : 'Page could not be created.' }, { status: 400 });
  }
}
