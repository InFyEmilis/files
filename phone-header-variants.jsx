// Phone header experiments — three variants in one DesignCanvas.
// Renders the same Procurement module body under each header so the only
// changing variable is the header treatment.

const { useState: hUseState, useEffect: hUseEffect, useRef: hUseRef } = React;

// ── Icons (reused module-bar style) ──────────────────────────────────────
const _HXIc = ({ size = 22, stroke = 1.7, d, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={stroke}
    strokeLinecap="round" strokeLinejoin="round" {...rest}>{d}</svg>
);
const HXI = {
  home:     p => <_HXIc {...p} d={<><path d="m3 11 9-8 9 8"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/></>} />,
  cal:      p => <_HXIc {...p} d={<><rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9.5h18"/><path d="M8 2.5v4M16 2.5v4"/></>} />,
  procure:  p => <_HXIc {...p} d={<><path d="M2 3h2l3 12h13l3-9H6.5"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></>} />,
  chat:     p => <_HXIc {...p} d={<><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"/></>} />,
  more:     p => <_HXIc {...p} d={<><circle cx="5"  cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></>} />,
};

// ── Demo orders (same as the live Procurement module) ───────────────────
const HX_ORDERS = [
  { n: 'Lighting fixtures',    sub: '3 quotes · waiting approval', amt: '$24,800', warn: true,  hue: 35  },
  { n: 'Steel beams (W12×26)', sub: 'Quote pending · 1 vendor',    amt: '$112k',   warn: false, hue: 200 },
  { n: 'HVAC unit',            sub: 'Approval needed',             amt: '$48k',    warn: true,  hue: 35  },
  { n: 'Lumber resupply',      sub: 'Ordered · ETA Friday',        amt: '$8,200',  warn: false, hue: 50  },
  { n: 'Plumbing rough-in',    sub: 'Quote received',              amt: '$15,400', warn: false, hue: 160 },
  { n: 'Concrete pour mix',    sub: 'Scheduled · Tuesday',         amt: '$6,400',  warn: false, hue: 270 },
  { n: 'Window glazing',       sub: 'Final quote in review',       amt: '$72k',    warn: false, hue: 220 },
];

function HXBody() {
  return (
    <>
      <div className="hex__chips">
        <span className="hex__chip is-active">All · 7</span>
        <span className="hex__chip">Pending · 3</span>
        <span className="hex__chip">Approved</span>
      </div>
      <div className="hex__list">
        {HX_ORDERS.map((o, i) => (
          <button key={i} className="hex__row">
            <div className="hex__poicon" style={{
              background: `oklch(0.32 0.08 ${o.hue})`,
              color:      `oklch(0.92 0.10 ${o.hue})`,
            }}>$</div>
            <div className="hex__body">
              <div className="hex__top">
                <span className="hex__name">{o.n}</span>
                <span className="hex__amt">{o.amt}</span>
              </div>
              <div className={'hex__sub' + (o.warn ? ' is-warn' : '')}>{o.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

// Fake floating modbar so all 4 phones balance the same way visually.
function HXFakeBar() {
  return (
    <div className="hex__fakebar">
      <span className="hex__fakebar__btn"><HXI.home size={18}/></span>
      <span className="hex__fakebar__btn"><HXI.cal size={18}/></span>
      <span className="hex__fakebar__btn is-active"><HXI.procure size={18}/></span>
      <span className="hex__fakebar__btn"><HXI.chat size={18}/></span>
      <span className="hex__fakebar__btn"><HXI.more size={18}/></span>
    </div>
  );
}

// ── A. Original ─────────────────────────────────────────────────────────
function HXVariantOriginal() {
  return (
    <div className="hex">
      <div className="hex__safe">
        <div className="hex-h-original">
          <div>
            <h1 className="hex-h-original__title">Procurement</h1>
            <div className="hex-h-original__sub">3 waiting approval</div>
          </div>
        </div>
        <HXBody />
      </div>
      <HXFakeBar />
    </div>
  );
}

// ── B. Collapsing (iOS native) ──────────────────────────────────────────
// Scrolling shrinks the large title and fades the inline title in.
// Uses requestAnimationFrame to interpolate CSS vars driven by scrollTop.
function HXVariantCollapsing({ initialScroll = 0 }) {
  const scrollerRef = hUseRef(null);
  const largeRef    = hUseRef(null);
  const headerRef   = hUseRef(null);

  hUseEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (initialScroll) el.scrollTop = initialScroll;

    let raf = 0;
    const COLLAPSE_END = 56; // px of scroll over which we interpolate

    const update = () => {
      raf = 0;
      const y = el.scrollTop;
      const t = Math.min(1, Math.max(0, y / COLLAPSE_END));
      // Large title shrinks to ~0.62 and fades out
      const scale   = 1 - t * 0.38;
      const opacity = 1 - t;
      const large = largeRef.current;
      if (large) {
        large.style.setProperty('--hex-scale', scale.toFixed(3));
        large.style.setProperty('--hex-opacity', opacity.toFixed(3));
      }
      // Toggle the sticky bg + inline title past midpoint
      const head = headerRef.current;
      if (head) {
        if (t > 0.5) head.classList.add('hex-h-collapse--stuck');
        else head.classList.remove('hex-h-collapse--stuck');
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [initialScroll]);

  return (
    <div className="hex" ref={scrollerRef}>
      <div className="hex-h-collapse" ref={headerRef}>
        <div className="hex-h-collapse__bar">
          <span className="hex-h-collapse__inline">Procurement</span>
        </div>
        <div className="hex-h-collapse__large" ref={largeRef}>
          <h1 className="hex-h-collapse__title">Procurement</h1>
          <div className="hex-h-collapse__sub">3 waiting approval</div>
        </div>
      </div>
      <HXBody />
      <HXFakeBar />
    </div>
  );
}

// ── C. Compact (subtitle-only eyebrow) ──────────────────────────────────
function HXVariantCompact() {
  return (
    <div className="hex">
      <div className="hex__safe">
        <div className="hex-h-compact">
          <div className="hex-h-compact__lbl">Procurement · <strong>7</strong></div>
          <span className="hex-h-compact__count">
            <span className="hex-h-compact__dot" />
            3 waiting
          </span>
        </div>
        <HXBody />
      </div>
      <HXFakeBar />
    </div>
  );
}

window.HXVariantOriginal    = HXVariantOriginal;
window.HXVariantCollapsing  = HXVariantCollapsing;
window.HXVariantCompact     = HXVariantCompact;
