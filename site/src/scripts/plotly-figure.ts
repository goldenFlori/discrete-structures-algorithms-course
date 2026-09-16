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

      const dark = matchMedia('(prefers-color-scheme: dark)').matches
        ? document.documentElement.dataset.theme !== 'light'
        : document.documentElement.dataset.theme === 'dark';

      const layout = {
        ...(spec.layout || {}),
        autosize: true,
        margin: { l: 55, r: 25, t: 45, b: 50, ...(spec.layout?.margin || {}) },
        // The notebooks set their own colours; only fill in what they leave open.
        paper_bgcolor: spec.layout?.paper_bgcolor ?? 'rgba(0,0,0,0)',
        plot_bgcolor: spec.layout?.plot_bgcolor ?? 'rgba(0,0,0,0)',
        font: { color: dark ? '#b9b7b1' : '#4a4945', ...(spec.layout?.font || {}) },
      };

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

if (!customElements.get('plotly-figure')) {
  customElements.define('plotly-figure', PlotlyFigure);
}
