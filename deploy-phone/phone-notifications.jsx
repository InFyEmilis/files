// Phone notifications sheet — bottom sheet that opens when the bell is tapped.
// Three variants (selectable via Tweaks):
//   A — Grouped by time (Today / Yesterday / Earlier)
//   B — Two tabs (Unread / All)
//   C — Activity-feed style (rich preview + more breathing room)
//
// Variant is read from `window.__TWEAKS?.notifVariant` so the Tweaks panel
// can flip between them at runtime.

const { useState: nUseState, useEffect: nUseEffect, useMemo: nUseMemo, useRef: nUseRef } = React;

// ── Local icon set ─────────────────────────────────────────────────────────
const _NIc = ({ d, size = 16, stroke = 1.7, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const NI = {
  at:        p => <_NIc {...p} d={<><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></>} />,
  task:      p => <_NIc {...p} d={<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m8 12 3 3 5-6"/></>} />,
  cart:      p => <_NIc {...p} d={<><path d="M2 3h2l3 12h13l3-9H6.5"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></>} />,
  warn:      p => <_NIc {...p} d={<><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>} />,
  reply:     p => <_NIc {...p} d={<><path d="M9 17 4 12l5-5"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></>} />,
  check:     p => <_NIc {...p} d={<><path d="m5 12 5 5L20 7"/></>} />,
  cog:       p => <_NIc {...p} d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>} />,
  ban:       p => <_NIc {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6 18.4 18.4"/></>} />,
  filter:    p => <_NIc {...p} d={<><path d="M3 6h18M7 12h10M11 18h2"/></>} />,
  msg:       p => <_NIc {...p} d={<><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"/></>} />,
};

// ── Mock notifications data ────────────────────────────────────────────────
// Times are computed relative to "now" each render to feel fresh.
function buildMockNotifications(now = new Date()) {
  const t = (mins) => new Date(now.getTime() - mins * 60_000);
  return [
    // Today
    { id: 'n1', kind: 'mention', severity: 'critical', read: false,
      actor: { name: 'Mike Rodriguez', initials: 'MR', hue: 18 },
      verb: 'flagged you in',
      contextType: 'site-issue',
      contextTitle: 'Lumber delivery delayed again',
      contextProject: 'MH HQ',
      contextHue: 0,
      preview: '@you we need a call — TimberPro just pushed delivery a third time. This blocks framing.',
      ts: t(2),
      cta: 'View thread',
      target: { module: 'chat', screen: 'chat', projectName: 'MH HQ' },
    },
    { id: 'n2', kind: 'system', severity: 'warning', read: false,
      actor: null,
      verb: 'Compliance alert',
      contextType: 'permit',
      contextTitle: 'Permit C-2241 expires in 3 days',
      contextProject: 'Brickell Tower',
      contextHue: 35,
      preview: 'Renewal paperwork pending review from the City of Miami.',
      ts: t(58),
      cta: 'Open compliance',
      target: { module: 'admin' },
    },
    { id: 'n3', kind: 'task', severity: 'normal', read: false,
      actor: { name: 'Sarah Chen', initials: 'SC', hue: 280 },
      verb: 'completed your task',
      contextType: 'task',
      contextTitle: 'Submit revised L3 framing plan',
      contextProject: 'MH HQ',
      contextHue: 155,
      preview: 'Marked complete · v4 attached.',
      ts: t(95),
      cta: 'Review task',
      target: { module: 'chat', screen: 'projectInbox', projectName: 'MH HQ' },
    },
    { id: 'n4', kind: 'mention', severity: 'normal', read: false,
      actor: { name: 'David Kim', initials: 'DK', hue: 220 },
      verb: 'replied in',
      contextType: 'chat',
      contextTitle: 'Procurement · Steel beams',
      contextProject: 'Brickell Tower',
      contextHue: 35,
      preview: 'Got a quote from MetalWorks — 12% under TimberPro and they can deliver Friday.',
      ts: t(180),
      cta: 'Open thread',
      target: { module: 'chat', screen: 'chat', projectName: 'Brickell Tower' },
    },

    // Yesterday
    { id: 'n5', kind: 'procurement', severity: 'normal', read: true,
      actor: { name: 'Lena Park', initials: 'LP', hue: 200 },
      verb: 'approved PO',
      contextType: 'po',
      contextTitle: 'PO-1142 · Concrete batch · $48,200',
      contextProject: 'MH HQ',
      contextHue: 35,
      preview: 'Approved for delivery Tuesday 7AM.',
      ts: t(60 * 27),
      cta: 'View PO',
      target: { module: 'procure' },
    },
    { id: 'n6', kind: 'site-issue', severity: 'warning', read: true,
      actor: { name: 'Field Report', initials: 'FR', hue: 0 },
      verb: 'flagged site issue',
      contextType: 'site-issue',
      contextTitle: 'Water intrusion · L7 northwest',
      contextProject: 'Brickell Tower',
      contextHue: 0,
      preview: 'Photo attached. Recommended action: pause MEP rough-in on that face.',
      ts: t(60 * 30),
      cta: 'View report',
      target: { module: 'chat', screen: 'chat', projectName: 'Brickell Tower' },
    },
    { id: 'n7', kind: 'mention', severity: 'normal', read: true,
      actor: { name: 'Priya Shah', initials: 'PS', hue: 320 },
      verb: 'mentioned you in',
      contextType: 'chat',
      contextTitle: 'Daily standup · MH HQ',
      contextProject: 'MH HQ',
      contextHue: 220,
      preview: '@you can you confirm whether the inspector is coming Thursday or Friday?',
      ts: t(60 * 34),
      cta: 'Reply',
      target: { module: 'chat', screen: 'chat', projectName: 'MH HQ' },
    },

    // Earlier this week
    { id: 'n8', kind: 'task', severity: 'normal', read: true,
      actor: { name: 'Marcus T.', initials: 'MT', hue: 100 },
      verb: 'assigned you a task',
      contextType: 'task',
      contextTitle: 'Walk Level 5 with the inspector',
      contextProject: 'Brickell Tower',
      contextHue: 155,
      preview: 'Due Thursday, 9AM. Bring the as-built drawings.',
      ts: t(60 * 52),
      cta: 'Open task',
      target: { module: 'chat', screen: 'chat', projectName: 'Brickell Tower' },
    },
    { id: 'n9', kind: 'system', severity: 'normal', read: true,
      actor: null,
      verb: 'Weekly digest',
      contextType: 'digest',
      contextTitle: '11 conversations · 4 new tasks · 2 site issues',
      contextProject: 'Mecca',
      contextHue: 220,
      preview: 'Your week at a glance. 3 items still need a response.',
      ts: t(60 * 70),
      cta: 'View digest',
      target: { module: 'home' },
    },
  ];
}

// ── Time grouping helpers ──────────────────────────────────────────────────
function dayKey(d) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
function groupByDay(notifs, now = new Date()) {
  const today = dayKey(now);
  const yesterday = dayKey(new Date(now.getTime() - 86_400_000));
  const groups = { today: [], yesterday: [], earlier: [] };
  for (const n of notifs) {
    const k = dayKey(n.ts);
    if (k === today) groups.today.push(n);
    else if (k === yesterday) groups.yesterday.push(n);
    else groups.earlier.push(n);
  }
  return [
    { key: 'today',     label: 'Today',                items: groups.today },
    { key: 'yesterday', label: 'Yesterday',            items: groups.yesterday },
    { key: 'earlier',   label: 'Earlier this week',    items: groups.earlier },
  ].filter(g => g.items.length);
}
function fmtRelative(ts, now = new Date()) {
  const diffMs = now.getTime() - ts.getTime();
  const min = Math.floor(diffMs / 60_000);
  if (min < 1) return 'now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return ts.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// ── Kind icon (small icon shown when no actor avatar) ──────────────────────
function KindIcon({ kind, severity }) {
  const map = {
    'mention':     NI.at,
    'task':        NI.task,
    'procurement': NI.cart,
    'site-issue':  NI.warn,
    'system':      NI.cog,
  };
  const Glyph = map[kind] || NI.msg;
  return <Glyph size={14} stroke={2} />;
}

// ── Filter chips ───────────────────────────────────────────────────────────
const FILTERS = [
  { id: 'all',         label: 'All' },
  { id: 'mention',     label: 'Mentions' },
  { id: 'task',        label: 'Tasks' },
  { id: 'procurement', label: 'Procurement' },
  { id: 'site-issue',  label: 'Issues' },
];

function FilterChips({ value, onChange, counts }) {
  return (
    <div className="ph-notif__chips" role="tablist">
      {FILTERS.map(f => {
        const c = counts[f.id] || 0;
        const isActive = value === f.id;
        return (
          <button
            key={f.id}
            role="tab"
            aria-selected={isActive}
            className={'ph-notif__chip' + (isActive ? ' is-active' : '')}
            onClick={() => onChange(f.id)}
          >
            <span>{f.label}</span>
            {c > 0 && <span className="ph-notif__chip-count">{c}</span>}
          </button>
        );
      })}
    </div>
  );
}

// ── Avatar/icon for a notification row ─────────────────────────────────────
function NotifAvatar({ notif, size = 36 }) {
  const { actor, severity, kind, contextHue } = notif;
  if (!actor) {
    // System notification — show kind icon in a tinted bubble
    const hue = severity === 'critical' ? 0 : severity === 'warning' ? 35 : (contextHue || 220);
    return (
      <span className="ph-notif__icon" style={{
        width: size, height: size,
        background: `oklch(0.34 0.07 ${hue})`,
        color: `oklch(0.94 0.09 ${hue})`,
        boxShadow: `inset 0 0 0 1px oklch(0.55 0.12 ${hue} / 0.32)`,
      }}>
        <KindIcon kind={kind} severity={severity} />
      </span>
    );
  }
  const hue = actor.hue ?? 220;
  return (
    <span className="ph-notif__avatar" style={{
      width: size, height: size,
      background: `oklch(0.40 0.09 ${hue})`,
      color: `oklch(0.94 0.10 ${hue})`,
      boxShadow: `inset 0 0 0 1px oklch(0.58 0.13 ${hue} / 0.38)`,
    }}>
      {actor.initials}
      <span className={'ph-notif__avatar-badge ph-notif__avatar-badge--' + kind} aria-hidden="true">
        <KindIcon kind={kind} severity={severity} />
      </span>
    </span>
  );
}

// ── Severity stripe (left edge marker) ────────────────────────────────────
function SeverityStripe({ severity }) {
  if (severity !== 'critical' && severity !== 'warning') return null;
  return <span className={'ph-notif__stripe ph-notif__stripe--' + severity} aria-hidden="true" />;
}

// ── Notification row — variants A and B share this compact form ────────────
function NotifRow({ notif, onClick, variant = 'compact' }) {
  const showPreview = variant === 'rich';
  return (
    <button
      className={'ph-notif__row' + (notif.read ? '' : ' is-unread') +
        (variant === 'rich' ? ' ph-notif__row--rich' : '')}
      onClick={onClick}
    >
      <SeverityStripe severity={notif.severity} />
      <NotifAvatar notif={notif} size={variant === 'rich' ? 40 : 36} />
      <div className="ph-notif__body">
        <div className="ph-notif__line">
          {notif.actor ? (
            <>
              <span className="ph-notif__actor">{notif.actor.name}</span>
              <span className="ph-notif__verb"> {notif.verb} </span>
              <span className="ph-notif__ctx">{notif.contextTitle}</span>
            </>
          ) : (
            <>
              <span className="ph-notif__actor">{notif.verb}</span>
              <span className="ph-notif__verb">: </span>
              <span className="ph-notif__ctx">{notif.contextTitle}</span>
            </>
          )}
        </div>
        {showPreview && notif.preview && (
          <div className="ph-notif__preview">{notif.preview}</div>
        )}
        <div className="ph-notif__meta">
          <span className="ph-notif__proj" style={{ '--h': notif.contextHue }}>
            <span className="ph-notif__proj-dot" />
            {notif.contextProject}
          </span>
          <span className="ph-notif__dot-sep">·</span>
          <span className="ph-notif__time">{fmtRelative(notif.ts)}</span>
          {variant === 'rich' && notif.cta && (
            <>
              <span className="ph-notif__dot-sep">·</span>
              <span className="ph-notif__cta">{notif.cta}</span>
            </>
          )}
        </div>
      </div>
      {!notif.read && <span className="ph-notif__unread-dot" aria-label="Unread" />}
    </button>
  );
}

// ── Variants ───────────────────────────────────────────────────────────────
function VariantGrouped({ items, onActivate }) {
  const groups = nUseMemo(() => groupByDay(items), [items]);
  if (!groups.length) return <EmptyState />;
  return (
    <>
      {groups.map(g => (
        <div key={g.key} className="ph-notif__group">
          <div className="ph-notif__seclbl">{g.label}</div>
          <div className="ph-notif__list">
            {g.items.map(n => (
              <NotifRow key={n.id} notif={n} onClick={() => onActivate(n)} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function VariantTabbed({ items, onActivate, tab, onTabChange, unreadCount }) {
  const list = tab === 'unread' ? items.filter(n => !n.read) : items;
  return (
    <>
      <div className="ph-notif__tabs" role="tablist">
        <button
          role="tab" aria-selected={tab === 'unread'}
          className={'ph-notif__tab' + (tab === 'unread' ? ' is-active' : '')}
          onClick={() => onTabChange('unread')}
        >
          Unread {unreadCount > 0 && <span className="ph-notif__tab-count">{unreadCount}</span>}
        </button>
        <button
          role="tab" aria-selected={tab === 'all'}
          className={'ph-notif__tab' + (tab === 'all' ? ' is-active' : '')}
          onClick={() => onTabChange('all')}
        >
          All
        </button>
      </div>
      {!list.length ? <EmptyState tab={tab} /> : (
        <div className="ph-notif__list">
          {list.map(n => (
            <NotifRow key={n.id} notif={n} onClick={() => onActivate(n)} />
          ))}
        </div>
      )}
    </>
  );
}

function VariantRich({ items, onActivate }) {
  const groups = nUseMemo(() => groupByDay(items), [items]);
  if (!groups.length) return <EmptyState />;
  return (
    <>
      {groups.map(g => (
        <div key={g.key} className="ph-notif__group">
          <div className="ph-notif__seclbl">{g.label}</div>
          <div className="ph-notif__list ph-notif__list--rich">
            {g.items.map(n => (
              <NotifRow key={n.id} notif={n} variant="rich" onClick={() => onActivate(n)} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function EmptyState({ tab }) {
  const label = tab === 'unread' ? "You're all caught up" : 'No notifications yet';
  const sub = tab === 'unread'
    ? 'Nice. Anything new will show up here.'
    : 'Mentions, tasks, and site updates will land here.';
  return (
    <div className="ph-notif__empty">
      <div className="ph-notif__empty-icon"><NI.check size={22} stroke={2} /></div>
      <div className="ph-notif__empty-title">{label}</div>
      <div className="ph-notif__empty-sub">{sub}</div>
    </div>
  );
}

// ── Main sheet ─────────────────────────────────────────────────────────────
function PhoneNotificationsSheet({ onClose, onNavigate, variant = 'grouped' }) {
  const [filter, setFilter] = nUseState('all');
  const [tab, setTab] = nUseState('unread'); // for variant B
  const [readIds, setReadIds] = nUseState(() => new Set());

  // Build mock data once per mount.
  const allNotifs = nUseMemo(() => buildMockNotifications(), []);

  // Apply local "marked-as-read" state on top of seeded read flags.
  const notifs = nUseMemo(
    () => allNotifs.map(n => readIds.has(n.id) ? { ...n, read: true } : n),
    [allNotifs, readIds],
  );

  // Filtered by chip
  const filtered = nUseMemo(() => {
    if (filter === 'all') return notifs;
    return notifs.filter(n => n.kind === filter);
  }, [notifs, filter]);

  // Counts per chip — based on UNREAD only, so chips guide attention
  const counts = nUseMemo(() => {
    const c = { all: 0 };
    for (const n of notifs) {
      if (n.read) continue;
      c.all = (c.all || 0) + 1;
      c[n.kind] = (c[n.kind] || 0) + 1;
    }
    return c;
  }, [notifs]);

  const unreadCount = counts.all || 0;

  // Esc to close, body scroll-lock
  nUseEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleActivate = (n) => {
    setReadIds(prev => {
      const s = new Set(prev);
      s.add(n.id);
      return s;
    });
    if (onNavigate) onNavigate(n);
    onClose();
  };

  const markAllRead = () => {
    setReadIds(new Set(notifs.map(n => n.id)));
  };

  return (
    <>
      <div className="ph-notif__scrim" onClick={onClose} aria-hidden="true" />
      <div
        className={'ph-notif ph-notif--' + variant}
        role="dialog"
        aria-label="Notifications"
      >
        <div className="ph-notif__grabber" />

        <div className="ph-notif__head">
          <div className="ph-notif__head-left">
            <h2>Notifications</h2>
            {unreadCount > 0 && (
              <span className="ph-notif__head-count">{unreadCount} new</span>
            )}
          </div>
          <button className="ph-notif__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {variant !== 'tabbed' && (
          <FilterChips value={filter} onChange={setFilter} counts={counts} />
        )}

        <div className="ph-notif__scroll">
          {variant === 'tabbed' && (
            <VariantTabbed
              items={filtered}
              onActivate={handleActivate}
              tab={tab}
              onTabChange={setTab}
              unreadCount={unreadCount}
            />
          )}
          {variant === 'grouped' && (
            <VariantGrouped items={filtered} onActivate={handleActivate} />
          )}
          {variant === 'rich' && (
            <VariantRich items={filtered} onActivate={handleActivate} />
          )}
          <div style={{ height: 12 }} />
        </div>

        <div className="ph-notif__foot">
          <button
            className="ph-notif__foot-btn"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            <NI.check size={14} stroke={2} />
            <span>Mark all as read</span>
          </button>
          <button className="ph-notif__foot-btn ph-notif__foot-btn--icon" aria-label="Settings">
            <NI.cog size={14} stroke={1.7} />
          </button>
        </div>
      </div>
    </>
  );
}

window.PMC = window.PMC || {};
window.PMC.PhoneNotificationsSheet = PhoneNotificationsSheet;
