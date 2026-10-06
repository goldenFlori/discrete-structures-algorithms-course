/**
 * <plotly-figure data-src="...json">
 *
 * Re-renders a figure that the notebook already produced, keeping it
 * interactive instead of flattening it to a screenshot.
 *
 * plotly.js is ~3.5 MB, so it is fetched only when a figure actually scrolls
 * into view, and only once per page. A page with no figures downloads nothing.
 */

let plotlyPromise: Promise<any> | null = null;

function loadPlotly(): Promise<any> {
  if (plotlyPromise) return plotlyPromise;
  plotlyPromise = new Promise((resolve, reject) => {
    if ((window as any).Plotly) return resolve((window as any).Plotly);
    const s = document.createElement('script');
    s.src = `${(document.documentElement.dataset.base || '/')}vendor/plotly.min.js`;
    s.async = true;
    s.onload = () => resolve((window as any).Plotly);
    s.onerror = () => reject(new Error('plotly load failed'));
    document.head.appendChild(s);
  });
  return plotlyPromise;
}

class PlotlyFigure extends HTMLElement {
  private loaded = false;
  host: HTMLElement | null = null;
  spec: any = null;

  connectedCallback() {
    const status = document.createElement('div');
    status.className = 'pf-status';
    status.textContent = 'Grafiku ngarkohet kur të shfaqet…';
    this.appendChild(status);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !this.loaded) {
            this.loaded = true;
            io.disconnect();
            void this.render(status);
          }
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(this);
  }

  private async render(status: HTMLElement) {
    const src = this.dataset.src;
    if (!src) return;
    status.textContent = 'Duke ngarkuar grafikun…';
    try {
      const [Plotly, spec] = await Promise.all([
        loadPlotly(),
        fetch(src).then((r) => {
          if (!r.ok) throw new Error(String(r.status));
          return r.json();
        }),
      ]);

      const host = document.createElement('div');
      host.className = 'pf-plot';
      this.replaceChildren(host);

      const layout = { ...(spec.layout || {}), autosize: true, margin: { l: 55, r: 25, t: 45, b: 50, ...(spec.layout?.margin || {}) }, ...themed(spec.layout || {}) };
      this.host = host;
      this.spec = spec;

      await Plotly.newPlot(host, spec.data || [], layout, {
        responsive: true,
        displaylogo: false,
        // No image export button: it would need extra bundles we do not ship.
        modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
      });
    } catch {
      status.className = 'pf-status pf-error';
      status.textContent =
        'Grafiku nuk u ngarkua dot. Shkarkoni fletoren më poshtë për ta parë lokalisht.';
    }
  }
}

/** Colours that follow the site theme; the notebook's own choices are kept. */
function themed(base: any) {
  const dark = document.documentElement.classList.contains('dark');
  const grid = dark ? 'rgba(255,255,255,0.09)' : 'rgba(30,30,60,0.09)';
  const out: any = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Inter Variable, ui-sans-serif, system-ui', ...(base.font || {}), color: dark ? '#cfcfe0' : '#3a3a4c' },
  };
  const axes = Object.keys(base).filter((k) => /^[xy]axis\d*$/.test(k));
  for (const k of axes.length ? axes : ['xaxis', 'yaxis']) {
    out[k] = { ...(base[k] || {}), gridcolor: grid, zerolinecolor: grid, linecolor: grid };
  }
  return out;
}

window.addEventListener('themechange', () => {
  const Plotly = (window as any).Plotly;
  if (!Plotly) return;
  document.querySelectorAll<PlotlyFigure>('plotly-figure').forEach((el) => {
    if (el.host && el.spec) void Plotly.relayout(el.host, themed(el.spec.layout || {}));
  });
});

if (!customElements.get('plotly-figure')) {
  customElements.define('plotly-figure', PlotlyFigure);
}
