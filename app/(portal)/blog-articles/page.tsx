import './../cms.css';
import { notFound } from 'next/navigation';
import { getCurrentUser, hasPermission, databaseConfigured } from '@/lib/server/auth';
import { siteUrl } from '@/lib/server/area-seo';
import { listBlogs } from '@/lib/server/blogs';
import { BlogManager } from '@/components/blog-manager';

export const dynamic = 'force-dynamic';

export default async function BlogArticlesPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q = '', page = '1' } = await searchParams;
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, 'blog.view')) notFound();
  const demo = !databaseConfigured();
  const data = demo ? { rows: [], total: 0, page: 1, pages: 1 } : await listBlogs(user.companyId, q.trim().slice(0, 100), Number(page));
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">WEBSITE CMS</div>
          <h1>Blog Articles</h1>
          <p>Travel blog posts that publish to the public /blogs section.</p>
        </div>
      </div>
      <BlogManager
        {...data}
        q={q.trim().slice(0, 100)}
        siteUrl={siteUrl()}
        canCreate={hasPermission(user, 'blog.create')}
        canUpdate={hasPermission(user, 'blog.update')}
        canDelete={hasPermission(user, 'blog.delete')}
        demo={demo}
      />
    </>
  );
}
