'use client';
import { useEffect, useRef, useState } from 'react';
import {
  faAlignCenter, faAlignLeft, faAlignRight, faBold, faCode, faCompress, faEraser, faExpand,
  faImage, faItalic, faLink, faListOl, faListUl, faTable, faUnderline,
} from '@fortawesome/free-solid-svg-icons';
import { Icon } from './icon';

type Props = { name: string; defaultValue?: string; hint?: string; minHeight?: number };
type Popover = null | 'link' | 'image';

const TABLE_HTML =
  '<table class="table table-bordered"><thead><tr><th>Heading</th><th>Heading</th></tr></thead><tbody><tr><td>Cell</td><td>Cell</td></tr><tr><td>Cell</td><td>Cell</td></tr></tbody></table><p><br></p>';

type IconDef = Parameters<typeof Icon>[0]['icon'];
// buttons must not steal focus/selection from the editable area
function ToolBtn({ icon, title, onClick, active, disabled }: { icon: IconDef; title: string; onClick: () => void; active?: boolean; disabled?: boolean }) {
  return (
    <button type="button" className={`he-btn${active ? ' on' : ''}`} title={title} aria-label={title} disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={onClick}>
      <Icon icon={icon} />
    </button>
  );
}

/**
 * Small dependency-free rich text editor (contentEditable + code view).
 * The HTML is mirrored into a hidden input so it posts with the surrounding <form>.
 * The server sanitises everything again before saving, so this is a convenience, not a security boundary.
 */
export function HtmlEditor({ name, defaultValue = '', hint, minHeight = 220 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const saved = useRef<Range | null>(null);
  const [html, setHtml] = useState(defaultValue);
  const [code, setCode] = useState(false);
  const [full, setFull] = useState(false);
  const [pop, setPop] = useState<Popover>(null);
  const [url, setUrl] = useState('');

  useEffect(() => { if (ref.current) ref.current.innerHTML = defaultValue; }, [defaultValue]);
  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFull(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [full]);

  const sync = () => { if (ref.current) setHtml(ref.current.innerHTML); };
  const exec = (cmd: string, value?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, value);
    sync();
  };
  const rememberSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount && ref.current?.contains(sel.anchorNode)) saved.current = sel.getRangeAt(0).cloneRange();
  };
  const restoreSelection = () => {
    ref.current?.focus();
    const sel = window.getSelection();
    if (sel && saved.current) { sel.removeAllRanges(); sel.addRange(saved.current); }
  };
  const openPop = (kind: Exclude<Popover, null>) => { rememberSelection(); setUrl(''); setPop(kind); };
  const applyPop = () => {
    const u = url.trim();
    if (u && /^(https?:\/\/|mailto:|tel:|\/)/i.test(u)) {
      restoreSelection();
      if (pop === 'link') exec('createLink', u);
      if (pop === 'image') exec('insertImage', u);
    }
    setPop(null);
  };
  const toggleCode = () => {
    if (code && ref.current) ref.current.innerHTML = html; // textarea -> editor
    setCode(!code);
  };


  return (
    <div className={`html-editor${full ? ' he-full' : ''}`}>
      <input type="hidden" name={name} value={html} />
      <div className="he-toolbar">
        <select className="he-select" aria-label="Block style" disabled={code} defaultValue="" onChange={(e) => { if (e.target.value) exec('formatBlock', e.target.value); e.target.value = ''; }}>
          <option value="">Style</option>
          <option value="p">Paragraph</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
        </select>
        <ToolBtn icon={faBold} title="Bold" onClick={() => exec('bold')} disabled={code} />
        <ToolBtn icon={faItalic} title="Italic" onClick={() => exec('italic')} disabled={code} />
        <ToolBtn icon={faUnderline} title="Underline" onClick={() => exec('underline')} disabled={code} />
        <ToolBtn icon={faEraser} title="Clear formatting" onClick={() => exec('removeFormat')} disabled={code} />
        <span className="he-sep" />
        <ToolBtn icon={faListUl} title="Bullet list" onClick={() => exec('insertUnorderedList')} disabled={code} />
        <ToolBtn icon={faListOl} title="Numbered list" onClick={() => exec('insertOrderedList')} disabled={code} />
        <ToolBtn icon={faAlignLeft} title="Align left" onClick={() => exec('justifyLeft')} disabled={code} />
        <ToolBtn icon={faAlignCenter} title="Align center" onClick={() => exec('justifyCenter')} disabled={code} />
        <ToolBtn icon={faAlignRight} title="Align right" onClick={() => exec('justifyRight')} disabled={code} />
        <span className="he-sep" />
        <ToolBtn icon={faTable} title="Insert table" onClick={() => exec('insertHTML', TABLE_HTML)} disabled={code} />
        <ToolBtn icon={faLink} title="Insert link" onClick={() => openPop('link')} disabled={code} />
        <ToolBtn icon={faImage} title="Insert image" onClick={() => openPop('image')} disabled={code} />
        <span className="he-sep" />
        <ToolBtn icon={full ? faCompress : faExpand} title="Fullscreen" onClick={() => setFull(!full)} active={full} />
        <ToolBtn icon={faCode} title="Code view" onClick={toggleCode} active={code} />
      </div>
      {pop && (
        <div className="he-pop">
          <input
            autoFocus
            className="form-control form-control-sm"
            placeholder={pop === 'link' ? 'https://… (select text first)' : 'Image URL https://…'}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyPop(); } if (e.key === 'Escape') setPop(null); }}
          />
          <button type="button" className="btn btn-primary btn-sm" onClick={applyPop}>Insert</button>
          <button type="button" className="btn btn-light btn-sm" onClick={() => setPop(null)}>Cancel</button>
        </div>
      )}
      <div
        ref={ref}
        className="he-area"
        style={{ minHeight, display: code ? 'none' : undefined }}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        onBlur={() => { sync(); rememberSelection(); }}
      />
      {code && (
        <textarea className="he-code" style={{ minHeight }} spellCheck={false} value={html} onChange={(e) => setHtml(e.target.value)} />
      )}
      {hint && !full && <small className="field-hint">{hint}</small>}
    </div>
  );
}
