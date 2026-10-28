/** Pure helpers shared by the admin form (live placeholders) and the API (defaults on save). */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
}

export function areaDefaults(area: string, city: string) {
  const a = area.trim();
  const c = city.trim();
  return {
    slug: a && c ? slugify(`taxi service in ${a} ${c}`) : a ? slugify(`taxi service in ${a}`) : '',
    h1: a ? `Taxi Service in ${a}` : '',
    seoTitle: a ? `Taxi Service in ${a}${c ? ` ${c}` : ''} | SKG Travels` : '',
    metaDescription: a ? `Book clean cabs, tempo travellers and outstation taxis in ${a} with SKG Travels.` : '',
    keywords: a
      ? [`taxi service in ${a.toLowerCase()}`, `cab booking ${a.toLowerCase()}`, `car rental ${a.toLowerCase()}`, ...(c ? [`outstation taxi from ${a.toLowerCase()} ${c.toLowerCase()}`] : [])].join(', ')
      : '',
  };
}
