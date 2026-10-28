'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { faArrowUpRightFromSquare, faMagnifyingGlass, faPen, faTrash, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { Icon } from './icon';
import { HtmlEditor } from './html-editor';
import { blogDefaults } from '@/lib/domain/slug';
import type { BlogFull, BlogListRow } from '@/lib/server/blogs';

type EditRecord = BlogFull & { hero_image_url: string | null };
type Props = {
  rows: BlogListRow[]; total: number; page: number; pages: number; q: string; siteUrl: string;
  canCreate: boolean; canUpdate: boolean; canDelete: boolean; demo: boolean;
};

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(iso));

export function BlogManager({ rows, total, page, pages, q, siteUrl, canCreate, canUpdate, canDelete, demo }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<EditRecord | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const canSave = editing ? canUpdate : canCreate;
  const d = blogDefaults(title);

  function resetForm() {
    setEditing(null); setTitle(''); setError(''); setFormKey((k) => k + 1);
  }

  async function startEdit(id: number) {
    setError(''); setNotice('');
    try {
      const r = await fetch(`/api/blog-articles/${id}`);
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Could not load article.');
      const rec = data.page as EditRecord;
      setEditing(rec); setTitle(rec.title); setFormKey((k) => k + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not load article.'); }
  }

  async function remove(row: BlogListRow) {
    if (!window.confirm(`Delete the article "${row.title}"? This cannot be undone.`)) return;
    setError(''); setNotice('');
    const r = await fetch(`/api/blog-articles/${row.id}`, { method: 'DELETE' });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) { setError(data.error || 'Article could not be deleted.'); return; }
    if (editing?.id === row.id) resetForm();
    setNotice('Article deleted.');
    router.refresh();
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = new FormData(e.currentTarget); // read before disabling the fieldset
    setBusy(true); setError(''); setNotice('');
    try {
      const r = await fetch(editing ? `/api/blog-articles/${editing.id}` : '/api/blog-articles', { method: editing ? 'PATCH' : 'POST', body });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || 'Article could not be saved.');
      setNotice(editing ? 'Article updated.' : 'Article created.');
      resetForm();
      router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : 'Article could not be saved.'); }
    finally { setBusy(false); }
  }

  const href = (p: number) => `/blog-articles?${new URLSearchParams({ ...(q ? { q } : {}), page: String(p) }).toString()}`;
  const from = total === 0 ? 0 : (page - 1) * 10 + 1;
  const to = Math.min(total, page * 10);
  const pageList = Array.from({ length: pages }, (_, i) => i + 1).filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1);

  return (
    <div className="area-seo-grid">
      {/* ---------- form ---------- */}
      <section className="surface-card area-seo-form">
        <div className="card-header"><div>
          <h2>{editing ? `Edit: ${editing.title}` : 'Add Blog Article'}</h2>
          <p>Saving republishes the article to skgtravels.com/blogs/.</p>
        </div></div>
        <form key={formKey} onSubmit={submit} className="area-seo-fields">
          <fieldset disabled={busy || !canSave || demo} className="area-seo-fieldset">
            <label className="form-label">Blog title *
              <input className="form-control mt-1" name="title" required minLength={3} maxLength={255} placeholder="Mumbai to Pune Cab Services: The Ultimate Convenience" value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label className="form-label">Slug
              <input className="form-control mt-1" name="slug" maxLength={190} placeholder={d.slug || 'mumbai-to-pune-cab-services-the-ultimate-convenience'} defaultValue={editing?.slug ?? ''} />
              <small className="field-hint">Becomes the public URL (blogs/slug.html) and must stay unique. Leave blank to auto-generate.</small>
            </label>
            <label className="form-label">SEO title
              <input className="form-control mt-1" name="seo_title" maxLength={255} placeholder={d.seoTitle} defaultValue={editing?.seo_title ?? ''} />
            </label>
            <label className="form-label">Meta description
              <textarea className="form-control mt-1" name="meta_description" rows={3} maxLength={500} defaultValue={editing?.meta_description ?? ''} />
              <small className="field-hint">Also used as the summary shown on the blog index.</small>
            </label>
            <label className="form-label">Keywords
              <input className="form-control mt-1" name="keywords" maxLength={2000} defaultValue={editing?.keywords ?? ''} />
            </label>
            <div className="two">
              <label className="form-label">Canonical URL
                <input className="form-control mt-1" name="canonical_url" type="url" maxLength={500} placeholder={`${siteUrl}/blogs/${d.slug || 'your-article'}.html`} defaultValue={editing?.canonical_url ?? ''} />
              </label>
              <div className="form-label">Hero image upload
                <input className="form-control mt-1" name="hero_image" type="file" accept="image/jpeg,image/png,image/webp" />
                {editing?.hero_image_url ? (
                  <span className="hero-current">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={editing.hero_image_url} alt="Current hero" />
                    <label className="form-check"><input type="checkbox" name="remove_image" /> Remove image</label>
                  </span>
                ) : <small className="field-hint">No image uploaded yet.</small>}
              </div>
            </div>
            <div className="form-label">Blog body HTML
              <HtmlEditor key={`b${formKey}`} name="body_html" defaultValue={editing?.body_html ?? ''} minHeight={420} hint="Article content. Generated HTML can be pasted via the </> code view." />
            </div>
            <div className="form-label">Closing / CTA HTML
              <HtmlEditor key={`c${formKey}`} name="closing_html" defaultValue={editing?.closing_html ?? ''} minHeight={200} />
            </div>
            <label className="form-label">Head scripts
              <textarea className="form-control mt-1 mono" name="head_scripts" rows={4} spellCheck={false} placeholder="<script> … </script>" defaultValue={editing?.head_scripts ?? ''} />
              <small className="field-hint">Written verbatim into the &lt;head&gt; of the published page — verification meta tags, tracking pixels, JSON-LD schema. Paste the complete tags. Leave blank if the page needs none.</small>
            </label>
            <div className="area-seo-flags">
              <label className="form-check"><input type="checkbox" name="is_active" defaultChecked={editing ? !!editing.is_active : true} /> ACTIVE</label>
              <label className="form-check"><input type="checkbox" name="is_published" defaultChecked={editing ? !!editing.is_published : false} /> PUBLISHED</label>
            </div>
          </fieldset>
          {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
          {notice && <div className="alert alert-success mt-3 mb-0">{notice}</div>}
          {demo && <div className="alert alert-warning mt-3 mb-0">Preview mode is read-only — configure MySQL to save articles.</div>}
          <div className="modal-actions">
            <button type="button" className="btn btn-light" onClick={resetForm} disabled={busy}>Cancel</button>
            <button className="btn btn-primary" disabled={busy || !canSave || demo}>{busy ? 'Saving…' : 'Save Article'}</button>
          </div>
        </form>
      </section>

      {/* ---------- list ---------- */}
      <section className="surface-card">
        <div className="card-header resource-header">
          <div><h2>Saved Articles</h2><p>{total} article{total === 1 ? '' : 's'}</p></div>
          <form action="/blog-articles" method="get" className="area-seo-search">
            <Icon icon={faMagnifyingGlass} />
            <input className="form-control" name="q" defaultValue={q} placeholder="Search title, slug…" aria-label="Search articles" />
          </form>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Title</th><th>Slug</th><th>SEO title</th><th>Status</th><th>Updated</th><th>Edit</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.title}</td>
                  <td><code className="slug-chip">{r.slug}</code></td>
                  <td className="fw-normal">{r.seo_title}</td>
                  <td>
                    <span className={`status-pill ${r.is_active ? 'green' : 'red'}`}>{r.is_active ? 'Active' : 'Inactive'}</span>{' '}
                    <span className={`status-pill ${r.is_published ? 'green' : 'amber'}`}>{r.is_published ? 'Published' : 'Draft'}</span>
                  </td>
                  <td className="fw-normal text-nowrap">{fmtDate(r.updated_at)}</td>
                  <td className="text-nowrap">
                    {r.is_published && r.is_active ? <a className="icon-button" href={`/blogs/${r.slug}.html`} target="_blank" rel="noopener" title="View article" aria-label="View article"><Icon icon={faArrowUpRightFromSquare} /></a> : null}
                    {canUpdate && <button className="icon-button" onClick={() => startEdit(r.id)} title="Edit" aria-label={`Edit ${r.title}`}><Icon icon={faPen} /></button>}
                    {canDelete && !demo && <button className="icon-button danger" onClick={() => remove(r)} title="Delete" aria-label={`Delete ${r.title}`}><Icon icon={faTrash} /></button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <div className="empty-state"><Icon icon={faNewspaper} /><strong>{q ? 'No articles match your search' : 'No articles yet'}</strong><span>{q ? 'Try a different keyword.' : 'Create the first article with the form.'}</span></div>}
        </div>
        <div className="area-seo-pager">
          <span>Showing {from} to {to} of {total} entries</span>
          {pages > 1 && (
            <nav aria-label="Pages">
              {page > 1 && <Link className="btn btn-light btn-sm" href={href(page - 1)}>Previous</Link>}
              {pageList.map((p, i) => (
                <span key={p}>
                  {i > 0 && p - pageList[i - 1] > 1 && <span className="gap">…</span>}
                  <Link className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-light'}`} href={href(p)}>{p}</Link>
                </span>
              ))}
              {page < pages && <Link className="btn btn-light btn-sm" href={href(page + 1)}>Next</Link>}
            </nav>
          )}
        </div>
      </section>
    </div>
  );
}
