import 'server-only';
import type { ReactNode } from 'react';

/**
 * Turns the admin-supplied "Head scripts" string (<script>, <meta>, <link>, <style> tags) into React elements.
 * React 19 hoists <meta>/<link>/<style precedence> into <head>; inline scripts are emitted verbatim in the server HTML.
 * Only those four tag types are honoured and `on*` event-handler attributes are dropped.
 */
const ATTR_MAP: Record<string, string> = { class: 'className', charset: 'charSet', 'http-equiv': 'httpEquiv', crossorigin: 'crossOrigin', referrerpolicy: 'referrerPolicy', fetchpriority: 'fetchPriority', nomodule: 'noModule' };
const BOOL = new Set(['async', 'defer', 'nomodule']);

function parseAttrs(src: string): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  const re = /([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const name = m[1].toLowerCase();
    if (name.startsWith('on')) continue;
    const key = ATTR_MAP[name] ?? name;
    const val = m[2] ?? m[3] ?? m[4];
    if (BOOL.has(name)) out[key] = true;
    else if (val !== undefined) out[key] = val;
  }
  return out;
}

export function renderHeadTags(raw: string | null | undefined): ReactNode[] {
  if (!raw) return [];
  const nodes: ReactNode[] = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>|<style\b([^>]*)>([\s\S]*?)<\/style\s*>|<(meta|link)\b([^>]*?)\/?>/gi;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(raw))) {
    const key = `ht-${i++}`;
    if (m[0].toLowerCase().startsWith('<script')) {
      const attrs = parseAttrs(m[1]);
      if (attrs.src) nodes.push(<script key={key} {...(attrs as object)} />);
      else nodes.push(<script key={key} {...(attrs as object)} dangerouslySetInnerHTML={{ __html: m[2] }} />);
    } else if (m[0].toLowerCase().startsWith('<style')) {
      nodes.push(<style key={key} {...(parseAttrs(m[3]) as object)} dangerouslySetInnerHTML={{ __html: m[4] }} />);
    } else if (m[5]?.toLowerCase() === 'meta') {
      nodes.push(<meta key={key} {...(parseAttrs(m[6]) as object)} />);
    } else if (m[5]) {
      nodes.push(<link key={key} {...(parseAttrs(m[6]) as object)} />);
    }
  }
  return nodes;
}
