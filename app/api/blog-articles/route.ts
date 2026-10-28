import { NextRequest, NextResponse } from 'next/server';
import { transaction } from '@/lib/server/db';
import { deleteHeroImage, guard, saveHeroImage } from '@/lib/server/area-seo';
import { parseBlogForm, refreshBlogPages } from '@/lib/server/blogs';

export async function POST(req: NextRequest) {
  const g = await guard(req, 'blog.create');
  if ('response' in g) return g.response;
  const parsed = await parseBlogForm(req);
  if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { data, image } = parsed;

  let imageName: string | null = null;
  try {
    if (image) imageName = await saveHeroImage(image);
    const id = await transaction(async (conn) => {
      const [r] = await conn.execute<any>(
        `INSERT INTO blog_articles(company_id,title,slug,seo_title,meta_description,keywords,canonical_url,hero_image_path,body_html,closing_html,head_scripts,is_active,is_published,published_at,created_by,updated_by)
         VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,${data.is_published ? 'UTC_TIMESTAMP()' : 'NULL'},?,?)`,
        [g.user.companyId, data.title, data.slug, data.seo_title, data.meta_description, data.keywords, data.canonical_url, imageName,
         data.body_html, data.closing_html, data.head_scripts, data.is_active, data.is_published, g.user.id, g.user.id]);
      await conn.execute('INSERT INTO audit_logs(company_id,user_id,event,subject_type,subject_id,after_values) VALUES(?,?,?,?,?,?)',
        [g.user.companyId, g.user.id, 'blog_article.created', 'blog_article', r.insertId, JSON.stringify({ slug: data.slug, title: data.title, published: data.is_published })]);
      return Number(r.insertId);
    });
    refreshBlogPages();
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (e) {
    await deleteHeroImage(imageName);
    const code = (e as { code?: string })?.code;
    if (code === 'ER_DUP_ENTRY') return NextResponse.json({ error: 'That slug is already used by another article.' }, { status: 409 });
    return NextResponse.json({ error: e instanceof Error && /Hero image/.test(e.message) ? e.message : 'Article could not be created.' }, { status: 400 });
  }
}
