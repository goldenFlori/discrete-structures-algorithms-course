import { Input, Kbd, Modal, Spinner } from '@heroui/react';
import { CornerDownLeft, FileText, Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

/* =====================================================================
 *  ⌘K / Ctrl K search palette over the Pagefind index (built by `npm run build`;
 *  during `npm run dev` it is served from memory by scripts/dev-extras.mjs).
 * ===================================================================== */

interface Hit {
  url: string;
  title: string;
  excerpt: string;
  sub?: { title: string; url: string } | null;
}

const isTyping = (t: EventTarget | null) => {
  const el = t as HTMLElement | null;
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
};

export default function SearchPalette({ base }: { base: string }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'unavailable'>('idle');
  const [active, setActive] = useState(0);
  const pf = useRef<any>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === '/' && !isTyping(e.target)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.('[data-open-search]')) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, []);

  const load = useCallback(async () => {
    if (pf.current) return pf.current;
    try {
      setStatus('loading');
      const mod = await import(/* @vite-ignore */ `${base}pagefind/pagefind.js`);
      await mod.options?.({ excerptLength: 22 });
      pf.current = mod;
      setStatus('ready');
      return mod;
    } catch {
      setStatus('unavailable');
      return null;
    }
  }, [base]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  useEffect(() => {
    if (!q.trim()) {
      setHits([]);
      return;
    }
    let cancelled = false;
    void (async () => {
      const m = await load();
      if (!m) return;
      const res = m.debouncedSearch ? await m.debouncedSearch(q, {}, 160) : await m.search(q);
      if (!res || cancelled) return;
      const data = await Promise.all(res.results.slice(0, 8).map((r: any) => r.data()));
      if (cancelled) return;
      setHits(
        data.map((d: any) => {
          const sub = (d.sub_results || []).find((s: any) => s.url !== d.url) ?? null;
          return { url: d.url, title: d.meta?.title || d.url, excerpt: d.excerpt, sub: sub ? { title: sub.title, url: sub.url } : null };
        }),
      );
      setActive(0);
    })();
    return () => {
      cancelled = true;
    };
  }, [q, load]);

  const go = (h: Hit | undefined) => {
    if (h) window.location.href = h.sub?.url ?? h.url;
  };

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={setOpen} variant="blur">
      <Modal.Container placement="top" size="lg" className="mt-[10vh]">
        <Modal.Dialog aria-label="Kërko në laboratorë" className="overflow-hidden p-0">
          <div className="flex items-center gap-3 border-b border-separator px-4 py-3">
            <Search className="size-5 shrink-0 text-muted" />
            <Input
              autoFocus
              aria-label="Kërko"
              placeholder="Kërko: Dijkstra, Merge Sort, prerja min…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setActive((a) => Math.min(a + 1, hits.length - 1));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setActive((a) => Math.max(a - 1, 0));
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  go(hits[active]);
                }
              }}
              className="flex-1 border-0 bg-transparent text-base shadow-none focus:ring-0"
            />
            {status === 'loading' && <Spinner size="sm" />}
            <Kbd className="hidden sm:inline-flex">Esc</Kbd>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {status === 'unavailable' && <p className="px-3 py-6 text-center text-sm text-muted">Kërkimi nuk u ngarkua. Rifreskoni faqen dhe provoni sërish.</p>}
            {status !== 'unavailable' && q.trim() === '' && (
              <p className="px-3 py-6 text-center text-sm text-muted">Shkruani një algoritëm, një koncept ose numrin e laboratorit.</p>
            )}
            {q.trim() !== '' && hits.length === 0 && status === 'ready' && <p className="px-3 py-6 text-center text-sm text-muted">Asnjë rezultat për “{q}”.</p>}
            <ul role="listbox" aria-label="Rezultatet">
              {hits.map((h, i) => (
                <li key={h.url + i} role="option" aria-selected={i === active}>
                  <a
                    href={h.sub?.url ?? h.url}
                    onMouseEnter={() => setActive(i)}
                    className={`flex gap-3 rounded-2xl px-3 py-2.5 transition-colors ${i === active ? 'bg-accent-soft' : 'hover:bg-default'}`}
                  >
                    <FileText className={`mt-0.5 size-4 shrink-0 ${i === active ? 'text-accent' : 'text-muted'}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {h.title}
                        {h.sub && <span className="font-normal text-muted"> · {h.sub.title}</span>}
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-xs text-muted [&_mark]:rounded [&_mark]:bg-accent-soft [&_mark]:px-0.5 [&_mark]:text-accent" dangerouslySetInnerHTML={{ __html: h.excerpt }} />
                    </span>
                    {i === active && <CornerDownLeft className="mt-0.5 size-4 shrink-0 text-accent" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
