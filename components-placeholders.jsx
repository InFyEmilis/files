// Module placeholder screens — Home, Calendar, Admin, Procurement, Files, etc.
// Each placeholder shows a thoughtful preview of what will live in that module,
// not just generic "coming soon" filler.

const { useState: _phS } = React;

// Reuse the topnav icons by re-declaring small inline SVGs locally so
// placeholders don't depend on the topnav module's internals.
const _PhIc = ({ d, size = 18, stroke = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const PhI = {
  home:     p => <_PhIc {...p} d={<><path d="m3 11 9-8 9 8"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/></>} />,
  calendar: p => <_PhIc {...p} d={<><rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9.5h18"/><path d="M8 2.5v4M16 2.5v4"/></>} />,
  admin:    p => <_PhIc {...p} d={<><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/><path d="m9 12 2 2 4-4"/></>} />,
  procure:  p => <_PhIc {...p} d={<><path d="M2 3h2l3 12h13l3-9H6.5"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></>} />,
  files:    p => <_PhIc {...p} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>} />,
  reports:  p => <_PhIc {...p} d={<><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 5-6"/></>} />,
  inventory:p => <_PhIc {...p} d={<><path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/><path d="m3 8 9 5 9-5"/></>} />,
  vendors:  p => <_PhIc {...p} d={<><path d="M3 7h18l-1 11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2L3 7Z"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></>} />,
  inspect:  p => <_PhIc {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="m8 11 2 2 4-4"/></>} />,
  arrow:    p => <_PhIc {...p} d={<><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>} />,
  spark:    p => <_PhIc {...p} d={<><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></>} />,
};

// ── Shared placeholder shell ────────────────────────────────────────────────
function PlaceholderShell({ icon: Icon, label, eyebrow, headline, sub, children, accentHue }) {
  return (
    <div className="mc-placeholder" style={accentHue ? { '--mc-ph-h': accentHue } : null}>
      <div className="mc-placeholder__inner">
        <div className="mc-placeholder__head">
          <div className="mc-placeholder__icon"><Icon size={26} stroke={1.6} /></div>
          <div className="mc-placeholder__heading">
            <div className="mc-placeholder__eyebrow">
              <span>{eyebrow || label}</span>
              <span className="mc-placeholder__tag">Coming soon</span>
            </div>
            <h1 className="mc-placeholder__title">{headline}</h1>
            <p className="mc-placeholder__sub">{sub}</p>
          </div>
        </div>
        <div className="mc-placeholder__body">{children}</div>
        <div className="mc-placeholder__foot">
          <button className="mc-placeholder__btn mc-placeholder__btn--primary">
            <PhI.spark size={14} stroke={1.8} />
            <span>Notify me when ready</span>
          </button>
          <button className="mc-placeholder__btn">Give feedback</button>
        </div>
      </div>
    </div>
  );
}

// ── Module bodies ───────────────────────────────────────────────────────────
function HomePreview() {
  const cards = [
    { tag: 'My day',     n: '7',  sub: 'tasks · 3 due today' },
    { tag: 'Inbox',      n: '12', sub: 'unread across 4 projects' },
    { tag: 'Approvals',  n: '3',  sub: 'awaiting your sign-off' },
    { tag: 'Site visits',n: '2',  sub: 'on the schedule this week' },
  ];
  return (
    <div className="mc-ph-home">
      <div className="mc-ph-home__grid">
        {cards.map(c => (
          <div key={c.tag} className="mc-ph-card">
            <div className="mc-ph-card__tag">{c.tag}</div>
            <div className="mc-ph-card__n">{c.n}</div>
            <div className="mc-ph-card__sub">{c.sub}</div>
          </div>
        ))}
      </div>
      <div className="mc-ph-home__feed">
        <div className="mc-ph-feed-head">
          <span>Recent activity</span>
          <span className="mc-ph-feed-link">View all</span>
        </div>
        {[
          { who: 'Mike R.',   what: 'flagged a water leak',   where: 'MH HQ',          t: '4m' },
          { who: 'David K.',  what: 'submitted 3 quotes',     where: 'MH HQ',          t: '18m' },
          { who: 'Sarah C.',  what: 'updated permit status',  where: 'Downtown Retail',t: '46m' },
          { who: 'Emily J.',  what: 'uploaded L3 framing v4', where: 'MH HQ',          t: '3h' },
        ].map((r, i) => (
          <div key={i} className="mc-ph-feed-row">
            <div className="mc-ph-feed-dot" />
            <div className="mc-ph-feed-text">
              <b>{r.who}</b> {r.what} · <span>{r.where}</span>
            </div>
            <div className="mc-ph-feed-time">{r.t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarPreview() {
  // A tiny month grid skeleton (5 weeks × 7 days)
  const days = Array.from({ length: 35 }, (_, i) => i - 2);
  const events = { 6:2, 9:1, 11:3, 14:1, 17:2, 19:1, 22:2, 24:1, 27:1 };
  return (
    <div className="mc-ph-cal">
      <div className="mc-ph-cal__head">
        <span className="mc-ph-cal__month">November 2026</span>
        <span className="mc-ph-cal__legend">
          <span className="mc-ph-cal__pill" style={{ '--h': 25 }}>Site visits</span>
          <span className="mc-ph-cal__pill" style={{ '--h': 220 }}>Meetings</span>
          <span className="mc-ph-cal__pill" style={{ '--h': 155 }}>Deliveries</span>
        </span>
      </div>
      <div className="mc-ph-cal__dow">
        {['S','M','T','W','T','F','S'].map((d, i) => <span key={i}>{d}</span>)}
      </div>
      <div className="mc-ph-cal__grid">
        {days.map(d => {
          const inMonth = d > 0 && d <= 30;
          const n = events[d] || 0;
          return (
            <div key={d} className={'mc-ph-cal__cell' + (inMonth ? '' : ' is-muted') + (d === 14 ? ' is-today' : '')}>
              <span className="mc-ph-cal__num">{inMonth ? d : ''}</span>
              {n > 0 && (
                <div className="mc-ph-cal__events">
                  {Array.from({ length: n }).map((_, i) => (
                    <span key={i} className="mc-ph-cal__bar" style={{ '--h': [25, 220, 155][i % 3] }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminPreview() {
  const rows = [
    { kind: 'Permit',     name: 'L3 mechanical rough-in',   status: 'Approved',    when: 'Nov 8' },
    { kind: 'Insurance',  name: 'GC umbrella · renewal',    status: 'In review',   when: 'Nov 12' },
    { kind: 'Contract',   name: 'Acme Electric — change #4',status: 'Awaiting sig',when: 'Nov 14' },
    { kind: 'License',    name: 'Crane operator · Rodriguez',status: 'Expires soon',when: 'Nov 22' },
  ];
  const statusHue = { 'Approved': 155, 'In review': 220, 'Awaiting sig': 70, 'Expires soon': 25 };
  return (
    <div className="mc-ph-admin">
      <div className="mc-ph-admin__head">
        <span>Compliance & paperwork</span>
        <span className="mc-ph-admin__count">4 items · 1 urgent</span>
      </div>
      <div className="mc-ph-admin__table">
        {rows.map((r, i) => (
          <div key={i} className="mc-ph-admin__row">
            <span className="mc-ph-admin__kind">{r.kind}</span>
            <span className="mc-ph-admin__name">{r.name}</span>
            <span className="mc-ph-admin__status" style={{ '--h': statusHue[r.status] }}>{r.status}</span>
            <span className="mc-ph-admin__when">{r.when}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProcurePreview() {
  const items = [
    { name: 'Lighting fixtures — Level 3', qty: '42 units', vendor: '3 quotes',  total: '$24,800', status: 'Ready to award', hue: 70 },
    { name: 'Rebar #5 grade 60',           qty: '8.2 tons',  vendor: 'Sole-source',total: '$11,200', status: 'PO drafted',     hue: 220 },
    { name: 'HVAC rooftop unit',           qty: '1 unit',    vendor: 'Awarded',   total: '$48,500', status: 'Ships Nov 18',   hue: 155 },
  ];
  return (
    <div className="mc-ph-proc">
      <div className="mc-ph-proc__stats">
        <div className="mc-ph-proc__stat"><span>Open POs</span><b>14</b></div>
        <div className="mc-ph-proc__stat"><span>Committed</span><b>$1.84M</b></div>
        <div className="mc-ph-proc__stat"><span>Pending approval</span><b>3</b></div>
      </div>
      <div className="mc-ph-proc__list">
        {items.map((it, i) => (
          <div key={i} className="mc-ph-proc__item">
            <div className="mc-ph-proc__main">
              <div className="mc-ph-proc__name">{it.name}</div>
              <div className="mc-ph-proc__meta">{it.qty} · {it.vendor}</div>
            </div>
            <div className="mc-ph-proc__total">{it.total}</div>
            <div className="mc-ph-proc__status" style={{ '--h': it.hue }}>{it.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilesPreview() {
  const files = [
    { name: 'L3-framing-plan-v4.pdf', size: '4.2 MB', who: 'Emily J.', t: '3h' },
    { name: 'MEP-coordination.dwg',   size: '12.8 MB',who: 'Lisa P.',  t: '1d' },
    { name: 'Site-photos · Nov 14',   size: '218 MB', who: 'Mike R.',  t: '2d' },
    { name: 'Submittals — lighting',  size: '6.1 MB', who: 'David K.', t: '3d' },
  ];
  return (
    <div className="mc-ph-files">
      <div className="mc-ph-files__tabs">
        <span className="is-active">Recent</span>
        <span>Drawings</span>
        <span>Submittals</span>
        <span>RFIs</span>
        <span>Photos</span>
      </div>
      <div className="mc-ph-files__grid">
        {files.map((f, i) => (
          <div key={i} className="mc-ph-file">
            <div className="mc-ph-file__thumb">
              <PhI.files size={22} stroke={1.4} />
            </div>
            <div className="mc-ph-file__name">{f.name}</div>
            <div className="mc-ph-file__meta">{f.size} · {f.who} · {f.t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericPreview({ items }) {
  return (
    <div className="mc-ph-generic">
      {items.map((it, i) => (
        <div key={i} className="mc-ph-generic__row">
          <span className="mc-ph-generic__dot" />
          <span className="mc-ph-generic__txt">{it}</span>
        </div>
      ))}
    </div>
  );
}

// ── Module registry ─────────────────────────────────────────────────────────
const MODULE_DEFS = {
  home: {
    icon: PhI.home, label: 'Home', hue: 220,
    headline: 'Your day across every project',
    sub: 'A personal dashboard that brings together what needs your attention today — tasks, approvals, mentions and site visits — across all the projects you touch.',
    body: <HomePreview />,
  },
  calendar: {
    icon: PhI.calendar, label: 'Calendar', hue: 252,
    headline: 'One calendar for every project',
    sub: 'Site visits, meetings, deliveries and milestones overlaid on a single calendar. Switch between day, week, month and Gantt views, and filter by project, team or event type.',
    body: <CalendarPreview />,
  },
  admin: {
    icon: PhI.admin, label: 'Admin', hue: 155,
    headline: 'Compliance, contracts & paperwork',
    sub: 'Centralized home for permits, insurance, licenses and contracts. Get reminders before things lapse and see who needs to sign what.',
    body: <AdminPreview />,
  },
  procure: {
    icon: PhI.procure, label: 'Procurement', hue: 70,
    headline: 'Purchase orders, quotes & vendors',
    sub: 'Track quotes across vendors, draft POs, and watch committed spend roll up by project. Approvals route straight to the right person without leaving the platform.',
    body: <ProcurePreview />,
  },
  files: {
    icon: PhI.files, label: 'Files', hue: 295,
    headline: 'Every drawing, RFI and submittal',
    sub: 'A unified file workspace across all projects — drawings, submittals, RFIs, photos and field reports. Versioned, searchable, and linked back to the conversations that produced them.',
    body: <FilesPreview />,
  },
  reports: {
    icon: PhI.reports, label: 'Reports', hue: 200,
    headline: 'Roll-ups across your portfolio',
    sub: 'Schedule health, budget variance, RFI age and safety incidents — across every project — with weekly digests sent to your owners and execs.',
    body: <GenericPreview items={[
      'Schedule performance index — by project',
      'Cost-to-complete vs. budget forecast',
      'RFI aging & response time SLAs',
      'Safety incidents · trailing 30 days',
      'Weekly owner digest — auto-generated',
    ]} />,
  },
  inventory: {
    icon: PhI.inventory, label: 'Inventory', hue: 130,
    headline: 'Track what you own, where it is',
    sub: 'Tools, equipment, lay-down materials and rentals — tagged, located and assigned. Know what\'s on which site, what\'s due back, and what needs maintenance.',
    body: <GenericPreview items={[
      'Equipment register with QR labels',
      'Rental returns · due in next 7 days',
      'Material lay-down by site & zone',
      'Maintenance schedule & service log',
      'Lost / damaged · with claim tracking',
    ]} />,
  },
  vendors: {
    icon: PhI.vendors, label: 'Vendors', hue: 35,
    headline: 'Your vendor and sub directory',
    sub: 'Pre-qualified subs and vendors with contacts, insurance certs, performance scores and rate history. Filter by trade, region and availability.',
    body: <GenericPreview items={[
      '184 active subs across 12 trades',
      'COI tracking with auto-reminders',
      'Performance scoring · on-time, quality, safety',
      'Rate history & bid comparisons',
      'Diversity & local-hire reporting',
    ]} />,
  },
  inspections: {
    icon: PhI.inspect, label: 'Inspections', hue: 0,
    headline: 'Punch lists & quality control',
    sub: 'Field-friendly inspections and punch lists. Pin issues on drawings, assign owners, and close the loop with photo evidence.',
    body: <GenericPreview items={[
      'Mobile-first inspection forms',
      'Drawing pin-drop with photo capture',
      'Auto-assigned to responsible sub',
      'Re-inspection workflow & sign-off',
      'Daily QA reports to PM and superintendent',
    ]} />,
  },
};

// ── Public entry ────────────────────────────────────────────────────────────
function ModulePlaceholder({ moduleId }) {
  const def = MODULE_DEFS[moduleId];
  if (!def) {
    return (
      <PlaceholderShell
        icon={PhI.spark}
        label="Module"
        headline="This module isn't built yet"
        sub="Pick another module from the top navigation to see what's available."
      >
        <GenericPreview items={['Browse the top nav to switch modules.']} />
      </PlaceholderShell>
    );
  }
  return (
    <PlaceholderShell
      icon={def.icon}
      label={def.label}
      headline={def.headline}
      sub={def.sub}
      accentHue={def.hue}
    >
      {def.body}
    </PlaceholderShell>
  );
}

window.MC = window.MC || {};
window.MC.ModulePlaceholder = ModulePlaceholder;
