
/** 
 * Pure helpers shared by the admin form (live placeholders)
 * and the API (defaults on save).
 */

/**
 * Convert text into a URL-friendly slug.
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180)
    .replace(/-+$/g, '');
}

/**
 * Default SEO fields for taxi service area pages.
 */
export function areaDefaults(area: string, city: string) {
  const a = area.trim();
  const c = city.trim();

  const areaLower = a.toLowerCase();
  const cityLower = c.toLowerCase();

  return {
    slug: a
      ? slugify(`taxi service in ${a}${c ? ` ${c}` : ''}`)
      : '',

    h1: a
      ? `Taxi Service in ${a}`
      : '',

    seoTitle: a
      ? `Taxi Service in ${a}${c ? ` ${c}` : ''} | SKG Travels`
      : '',

    metaDescription: a
      ? `Book clean cabs, tempo travellers and outstation taxis in ${a}${c ? `, ${c}` : ''} with SKG Travels.`
      : '',

    keywords: a
      ? [
          `taxi service in ${areaLower}`,
          `cab booking ${areaLower}`,
          `car rental ${areaLower}`,
          ...(c
            ? [
                `outstation taxi from ${areaLower} ${cityLower}`,
                `taxi service in ${cityLower}`,
              ]
            : []),
        ].join(', ')
      : '',
  };
}

/**
 * Default SEO fields for route pages.
 */
export function routeDefaults(from: string, to: string) {
  const f = from.trim();
  const t = to.trim();

  const both = Boolean(f && t);
  const fl = f.toLowerCase();
  const tl = t.toLowerCase();

  return {
    slug: both
      ? slugify(`${f} to ${t} cab`)
      : '',

    h1: both
      ? `${f} to ${t} Cab Service`
      : '',

    seoTitle: both
      ? `${f} to ${t} Cab Booking | SKG Travels`
      : '',

    metaDescription: both
      ? `Book a one way or round trip ${f} to ${t} cab with SKG Travels. Enjoy comfortable rides, reliable service and convenient booking.`
      : '',

    keywords: both
      ? [
          `${fl} to ${tl} cab`,
          `${fl} ${tl} taxi fare`,
          `one way cab ${fl} to ${tl}`,
          `round trip taxi ${fl} to ${tl}`,
          `${fl} to ${tl} car rental`,
        ].join(', ')
      : '',
  };
}

/**
 * Default SEO fields for blog posts.
 */
export function blogDefaults(title: string) {
  const t = title.trim();

  return {
    slug: slugify(t),

    seoTitle: t
      ? `${t} | SKG Travels`
      : '',
  };
}
