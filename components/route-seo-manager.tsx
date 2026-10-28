'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { faArrowUpRightFromSquare, faMagnifyingGlass, faPen, faTrash, faRoute } from '@fortawesome/free-solid-svg-icons';
import { Icon } from './icon';
import { HtmlEditor } from './html-editor';
import { routeDefaults, slugify } from '@/lib/domain/slug';
import type { RouteSeoFull, RouteSeoListRow } from '@/lib/server/route-seo';

type EditRecord = RouteSeoFull & { hero_image_url: string | null };
type Props = {
  rows: RouteSeoListRow[]; total: number; page: number; pages: number; q: string; siteUrl: string;
  canCreate: boolean; canUpdate: boolean; canDelete: boolean; demo: boolean;
};

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(iso));

export function RouteSeoManager({ rows, total, page, pages, q, siteUrl, canCreate, canUpdate, canDelete, demo }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<EditRecord | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [city, setCity] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const canSave = editing ? canUpdate : canCreate;
  const d = routeDefaults(from, to);
  const citySlug = slugify(city);

  function resetForm() {
    setEditing(null); setCity(''); setFrom(''); setTo(''); setError(''); setFormKey((k) => k + 1);
  }

  async function startEdit(id: number) {
    setError(''); setNotice('');
    try {
      const r = await fetch(`/api/route-seo-pages/${id}`);
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Could not load page.');
      const rec = data.page as EditRecord;
      setEditing(rec); setCity(rec.city_name); setFrom(rec.from_city); setTo(rec.to_city); setFormKey((k) => k + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not load page.'); }
  }

  async function remove(row: RouteSeoListRow) {
    if (!window.confirm(`Delete the page "${row.from_city} to ${row.to_city}"? This cannot be undone.`)) return;
    setError(''); setNotice('');
    const r = await fetch(`/api/route-seo-pages/${row.id}`, { method: 'DELETE' });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) { setError(data.error || 'Page could not be deleted.'); return; }
    if (editing?.id === row.id) resetForm();
    setNotice('Page deleted.');
    router.refresh();
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = new FormData(e.currentTarget); // read before disabling the fieldset
    setBusy(true); setError(''); setNotice('');
    try {
      const r = await fetch(editing ? `/api/route-seo-pages/${editing.id}` : '/api/route-seo-pages', { method: editing ? 'PATCH' : 'POST', body });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || 'Page could not be saved.');
      setNotice(editing ? 'Page updated.' : 'Page created.');
      resetForm();
      router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : 'Page could not be saved.'); }
    finally { setBusy(false); }
  }

  const href = (p: number) => `/route-seo-pages?${new URLSearchParams({ ...(q ? { q } : {}), page: String(p) }).toString()}`;
  const from_ = total === 0 ? 0 : (page - 1) * 10 + 1;
  const to_ = Math.min(total, page * 10);
  const pageList = Array.from({ length: pages }, (_, i) => i + 1).filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1);

  return (
    <div className="area-seo-grid">
      {/* ---------- form ---------- */}
      <section className="surface-card area-seo-form">
        <div className="card-header"><div>
          <h2>{editing ? `Edit: ${editing.from_city} → ${editing.to_city}` : 'Add Route SEO Page'}</h2>
          <p>Create pages like Mumbai to Pune Cab that publish straight to skgtravels.com.</p>
        </div></div>
        <form key={formKey} onSubmit={submit} className="area-seo-fields">
          <fieldset disabled={busy || !canSave || demo} className="area-seo-fieldset">
            <label className="form-label">City *
              <input className="form-control mt-1" name="city_name" required minLength={2} maxLength={100} placeholder="Mumbai" value={city} onChange={(e) => setCity(e.target.value)} />
              <small className="field-hint">The city that owns this page. Its name becomes the folder in the public URL{citySlug ? ` (/${citySlug}/…)` : ''}.</small>
            </label>
            <div className="two">
              <label className="form-label">From city *
                <input className="form-control mt-1" name="from_city" required minLength={2} maxLength={100} placeholder="Mumbai" value={from} onChange={(e) => setFrom(e.target.value)} />
              </label>
              <label className="form-label">To city *
                <input className="form-control mt-1" name="to_city" required minLength={2} maxLength={100} placeholder="Pune" value={to} onChange={(e) => setTo(e.target.value)} />
              </label>
            </div>
            <label className="form-label">Slug
              <input className="form-control mt-1" name="slug" maxLength={190} placeholder={d.slug || 'mumbai-to-pune-cab'} defaultValue={editing?.slug ?? ''} />
              <small className="field-hint">Must stay unique inside the city. Public URL is city-slug/slug.html. Leave blank to auto-generate.</small>
            </label>
            <label className="form-label">H1 title
              <input className="form-control mt-1" name="h1_title" maxLength={255} placeholder={d.h1 || 'Mumbai to Pune Cab Service'} defaultValue={editing?.h1_title ?? ''} />
            </label>
            <label className="form-label">SEO title
              <input className="form-control mt-1" name="seo_title" maxLength={255} placeholder={d.seoTitle || 'Mumbai to Pune Cab Booking | SKG Travels'} defaultValue={editing?.seo_title ?? ''} />
            </label>
            <label className="form-label">Meta description
              <textarea className="form-control mt-1" name="meta_description" rows={3} maxLength={500} placeholder={d.metaDescription || 'Book a one way or round trip Mumbai to Pune cab with SKG Travels.'} defaultValue={editing?.meta_description ?? ''} />
            </label>
            <label className="form-label">Keywords
              <input className="form-control mt-1" name="keywords" maxLength={2000} placeholder={d.keywords || 'mumbai to pune cab, mumbai pune taxi fare, one way cab pune'} defaultValue={editing?.keywords ?? ''} />
            </label>
            <div className="three">
              <label className="form-label">Distance
                <input className="form-control mt-1" name="distance" maxLength={60} placeholder="150 km" defaultValue={editing?.distance ?? ''} />
              </label>
              <label className="form-label">Travel time
                <input className="form-control mt-1" name="travel_time" maxLength={60} placeholder="3 hrs 30 mins" defaultValue={editing?.travel_time ?? ''} />
              </label>
              <label className="form-label">Starting fare
                <input className="form-control mt-1" name="starting_fare" maxLength={60} placeholder="Rs. 2,500" defaultValue={editing?.starting_fare ?? ''} />
              </label>
            </div>
            <div className="two">
              <label className="form-label">Canonical URL
                <input className="form-control mt-1" name="canonical_url" type="url" maxLength={500} placeholder={`${siteUrl}/${citySlug || 'mumbai'}/${d.slug || 'mumbai-to-pune-cab'}.html`} defaultValue={editing?.canonical_url ?? ''} />
                <small className="field-hint">Optional. Defaults to the page&rsquo;s own URL.</small>
              </label>
              <div className="form-label">Hero image upload
                <input className="form-control mt-1" name="hero_image" type="file" accept="image/jpeg,image/png,image/webp" />
                <small className="field-hint">Optional JPG/PNG/WebP up to 2 MB. Without an image the public page starts straight at the content.</small>
                {editing?.hero_image_url ? (
                  <span className="hero-current">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={editing.hero_image_url} alt="Current hero" />
                    <label className="form-check"><input type="checkbox" name="remove_image" /> Remove image</label>
                  </span>
                ) : <small className="field-hint">No image uploaded yet.</small>}
              </div>
            </div>
            <div className="form-label">Intro HTML
              <HtmlEditor key={`i${formKey}`} name="intro_html" defaultValue={editing?.intro_html ?? ''} minHeight={140} hint="Short opening paragraph below the hero image." />
            </div>
            <div className="form-label">Body HTML
              <HtmlEditor key={`b${formKey}`} name="body_html" defaultValue={editing?.body_html ?? ''} minHeight={320} hint="Main content. Generated HTML can be pasted via the </> code view." />
            </div>
            <div className="form-label">Fare table HTML
              <HtmlEditor key={`t${formKey}`} name="fare_table_html" defaultValue={editing?.fare_table_html ?? ''} minHeight={160} hint="Vehicle wise fare table. Plain HTML tables are styled automatically." />
            </div>
            <div className="form-label">FAQ HTML
              <HtmlEditor key={`f${formKey}`} name="faq_html" defaultValue={editing?.faq_html ?? ''} minHeight={160} />
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
          {demo && <div className="alert alert-warning mt-3 mb-0">Preview mode is read-only — configure MySQL to save pages.</div>}
          <div className="modal-actions">
            <button type="button" className="btn btn-light" onClick={resetForm} disabled={busy}>Cancel</button>
            <button className="btn btn-primary" disabled={busy || !canSave || demo}>{busy ? 'Saving…' : editing ? 'Update Page' : 'Save Page'}</button>
          </div>
        </form>
      </section>

      {/* ---------- list ---------- */}
      <section className="surface-card">
        <div className="card-header resource-header">
          <div><h2>Saved Route Pages</h2><p>{total} page{total === 1 ? '' : 's'}</p></div>
          <form action="/route-seo-pages" method="get" className="area-seo-search">
            <Icon icon={faMagnifyingGlass} />
            <input className="form-control" name="q" defaultValue={q} placeholder="Search route, city, slug…" aria-label="Search pages" />
          </form>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Route</th><th>City</th><th>Page URL</th><th>SEO title</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.from_city} → {r.to_city}</td>
                  <td className="fw-normal">{r.city_name}</td>
                  <td><code className="slug-chip">{r.city_slug}/{r.slug}.html</code></td>
                  <td className="fw-normal">{r.seo_title}</td>
                  <td>
                    <span className={`status-pill ${r.is_active ? 'green' : 'red'}`}>{r.is_active ? 'Active' : 'Inactive'}</span>{' '}
                    <span className={`status-pill ${r.is_published ? 'green' : 'amber'}`}>{r.is_published ? 'Published' : 'Draft'}</span>
                  </td>
                  <td className="fw-normal text-nowrap">{fmtDate(r.updated_at)}</td>
                  <td className="text-nowrap">
                    {r.is_published && r.is_active ? <a className="icon-button" href={`/${r.city_slug}/${r.slug}.html`} target="_blank" rel="noopener" title="View page" aria-label="View page"><Icon icon={faArrowUpRightFromSquare} /></a> : null}
                    {canUpdate && <button className="icon-button" onClick={() => startEdit(r.id)} title="Edit" aria-label={`Edit ${r.from_city} to ${r.to_city}`}><Icon icon={faPen} /></button>}
                    {canDelete && !demo && <button className="icon-button danger" onClick={() => remove(r)} title="Delete" aria-label={`Delete ${r.from_city} to ${r.to_city}`}><Icon icon={faTrash} /></button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <div className="empty-state"><Icon icon={faRoute} /><strong>{q ? 'No pages match your search' : 'No route pages yet'}</strong><span>{q ? 'Try a different keyword.' : 'Create the first page with the form.'}</span></div>}
        </div>
        <div className="area-seo-pager">
          <span>Showing {from_} to {to_} of {total} entries</span>
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
