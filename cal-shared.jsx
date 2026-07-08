// iPad Calendar — Modern redesign
// Three views: Month · Gantt · Agenda

const { useState, useMemo } = React;

// ── Event data ───────────────────────────────────────────────────────────
// Each event: { id, title, start, end, cat, project, priority, status, time, duration }
// Dates are day-of-month for March 2026 (Sun Mar 1 = first day shown row 1 col 6 mapping)
// We use full Date objects for math.
const D = (d) => new Date(2026, 2, d); // March 2026, day d

const EVENTS = [
  // Multi-day events that span the grid
  { id: 'e1', title: 'Print Out Plans', start: D(-3), end: D(1), cat: 'rose', project: 'Kushmart, Lackawanna', projectColor: 'rose', priority: 'medium', status: 'in-progress' },
  { id: 'e2', title: 'hhh', start: D(2), end: D(30), cat: 'rose', project: 'Kushmart, Lackawanna', projectColor: 'rose', priority: 'medium', status: 'completed' },
  { id: 'e3', title: 'jgjg', start: D(2), end: D(13), cat: 'emerald', project: 'Final', projectColor: 'emerald', priority: 'medium', status: 'completed' },
  { id: 'e4', title: 'Site Issue Report — Mar 2', start: D(2), end: D(3), cat: 'emerald', project: 'Final', projectColor: 'emerald', priority: 'high', status: 'completed', time: '8:42 PM' },
  { id: 'e5', title: 'Clean vestibule', start: D(5), end: D(5), cat: 'emerald', project: 'Naujas Testing', projectColor: 'violet', priority: 'low', status: 'scheduled' },
  { id: 'e6', title: 'Surenderink kurva tas duris', start: D(3), end: D(4), cat: 'violet', project: 'Final', projectColor: 'emerald', priority: 'medium', status: 'in-progress' },
  { id: 'e7', title: 'test', start: D(5), end: D(11), cat: 'emerald', project: 'Final', projectColor: 'emerald', priority: 'high', status: 'completed', time: '10:24 AM' },
  { id: 'e8', title: 'Site Issue Report — Mar 4', start: D(4), end: D(5), cat: 'emerald', project: 'KushMart Harvestraw', projectColor: 'amber', priority: 'high', status: 'in-progress', time: '11:40 PM' },
  { id: 'e9', title: 'gvgvt', start: D(7), end: D(14), cat: 'emerald', project: 'Final', projectColor: 'emerald', priority: 'medium', status: 'completed' },
  { id: 'e10', title: 'Framing', start: D(12), end: D(12), cat: 'violet', project: 'Bayfront Hotel', projectColor: 'blue', priority: 'medium', status: 'scheduled' },
  { id: 'e11', title: 'Beer', start: D(13), end: D(13), cat: 'violet', project: 'Mecca HQ', projectColor: 'violet', priority: 'low', status: 'scheduled' },
  { id: 'e12', title: 'Foundation pour — Block A', start: D(9), end: D(18), cat: 'cyan', project: 'Bayfront Hotel', projectColor: 'blue', priority: 'high', status: 'in-progress' },
  { id: 'e13', title: 'HVAC rough-in', start: D(11), end: D(15), cat: 'amber', project: 'Mecca HQ', projectColor: 'violet', priority: 'medium', status: 'scheduled' },
  { id: 'e14', title: 'yyyy', start: D(19), end: D(28), cat: 'blue', project: 'Lorain CuraLeaf', projectColor: 'blue', priority: 'medium', status: 'scheduled' },
  { id: 'e15', title: 'Electrical inspection', start: D(23), end: D(27), cat: 'violet', project: 'Downtown Retail', projectColor: 'violet', priority: 'high', status: 'scheduled' },
  { id: 'e16', title: 'Drywall delivery', start: D(20), end: D(26), cat: 'rose', project: 'Warehouse Conv.', projectColor: 'rose', priority: 'medium', status: 'scheduled' },
  { id: 'e17', title: 'Punch list walkthrough', start: D(29), end: D(32), cat: 'emerald', project: 'North Miami', projectColor: 'emerald', priority: 'medium', status: 'scheduled' },
];

// ── Helpers ──────────────────────────────────────────────────────────────
const DOW_LONG = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DOW_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Generate the 6-week grid for March 2026 (Mar 1 2026 = Sunday)
// First week starts Sunday Feb 22 (-6). Last week ends Sat Apr 4 (+35)
function getMonthGrid() {
  // Row 0: Feb 22 (-7) ... Feb 28 (-1)  -> let's use Feb 22 = -7? Let me recompute.
  // March 1, 2026 is a Sunday. So row 0 col 0 = Feb 22, 2026... wait, Mar 1 Sunday means row 0 col 0 = Feb 22.
  // Actually if Mar 1 = Sunday, then Feb 22 = previous Sunday. Row 0: Feb 22-28, Row 1: Mar 1-7, etc.
  // But screenshots show: Row 0: 23-1 (Feb 23 → Mar 1), so Mar 1 in column 6 (Sat). That means Mar 1 = Saturday in their data? Let me trust the screenshots.
  // Screenshot row 0: Sun=23, Mon=24, Tue=25, Wed=26, Thu=27, Fri=28, Sat=1
  // So row 0 = Feb 23 (Sun) → Mar 1 (Sat). Mar 1 was actually a Sunday in 2026 but screenshots show it differently. Match screenshots.
  const days = [];
  // Start at Feb 23 = day -6 (since Mar 1 = day 1, Feb 28 = day 0, Feb 23 = day -5).
  // Actually Feb 28 = day 0, Feb 27 = -1, ..., Feb 23 = -5. So start at -5? But screenshot shows 23-1 = 7 days, so 23,24,25,26,27,28,1 = -5,-4,-3,-2,-1,0,1. Yes.
  for (let i = -5; i <= 36; i++) {
    days.push(i);
  }
  // 6 weeks x 7 = 42 days. Check: -5 to 36 = 42. Yes.
  const weeks = [];
  for (let w = 0; w < 6; w++) {
    weeks.push(days.slice(w * 7, (w + 1) * 7));
  }
  return weeks;
}

function dayLabel(d) {
  if (d <= 0) return 28 + d; // Feb days
  if (d > 31) return d - 31; // April days
  return d;
}
function isOtherMonth(d) { return d <= 0 || d > 31; }

// ── Top status bar ───────────────────────────────────────────────────────
function StatusBar() {
  return (
    <div className="ipad-status">
      <span>9:41</span>
      <div className="status-icons">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="6.5" width="3" height="4.5" rx="0.7"/>
          <rect x="4.5" y="4.5" width="3" height="6.5" rx="0.7"/>
          <rect x="9" y="2" width="3" height="9" rx="0.7"/>
          <rect x="13.5" y="-0.5" width="3" height="11.5" rx="0.7"/>
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
          <path d="M7.5 3C9.5 3 11.3 3.7 12.7 5L13.6 4.1C12 2.5 9.9 1.5 7.5 1.5C5.1 1.5 3 2.5 1.4 4.1L2.3 5C3.7 3.7 5.5 3 7.5 3Z"/>
          <path d="M7.5 6.2C8.7 6.2 9.8 6.6 10.7 7.4L11.6 6.5C10.4 5.4 9 4.8 7.5 4.8C6 4.8 4.6 5.4 3.4 6.5L4.3 7.4C5.2 6.6 6.3 6.2 7.5 6.2Z"/>
          <circle cx="7.5" cy="9.5" r="1.3"/>
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" strokeOpacity="0.4"/>
          <rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor"/>
          <path d="M23 4V8C23.6 7.8 24 7.2 24 6C24 4.8 23.6 4.2 23 4Z" fill="currentColor" fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

// ── Left rail ────────────────────────────────────────────────────────────
function Rail() {
  const items = [
    { id: 'home', icon: <path d="m3 11 9-8 9 8M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/> },
    { id: 'calendar', active: true, badge: 5, icon: <g><rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/></g> },
    { id: 'admin', icon: <g><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/><path d="m9 12 2 2 4-4"/></g> },
    { id: 'procure', icon: <g><path d="M2 3h2l3 12h13l3-9H6.5"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></g> },
    { id: 'chat', icon: <path d="M21 12c0 4.4-4 8-9 8-1.4 0-2.7-.3-3.9-.8L3 21l1.4-4C3.5 15.6 3 13.9 3 12c0-4.4 4-8 9-8s9 3.6 9 8z"/> },
    { id: 'files', icon: <g><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></g> },
  ];
  return (
    <div className="cal-rail">
      <div className="rail-logo">M</div>
      {items.map(it => (
        <div key={it.id} className={`rail-item ${it.active ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            {it.icon}
          </svg>
          {it.badge && <span className="badge">{it.badge}</span>}
        </div>
      ))}
      <div className="rail-spacer" />
      <div className="rail-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </div>
      <div className="rail-avatar">JD</div>
    </div>
  );
}

// ── Header ───────────────────────────────────────────────────────────────
function Header({ view, setView, month, setMonth }) {
  return (
    <div className="cal-header">
      <div className="cal-titlebar">
        <div className="cal-title">
          <h1>Calendar</h1>
          <span className="subtitle">17 tasks · 5 projects this month</span>
        </div>
        <div className="cal-title-actions">
          <button className="btn ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-4.35-4.35"/><circle cx="11" cy="11" r="7"/></svg>
            Search
            <span className="kbd">⌘K</span>
          </button>
          <button className="btn">Today</button>
          <button className="btn primary">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            New event
          </button>
        </div>
      </div>

      <div className="cal-toolbar">
        <div className="view-tabs">
          <button className={`view-tab ${view === 'month' ? 'active' : ''}`} onClick={() => setView('month')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>
            </svg>
            Month
          </button>
          <button className={`view-tab ${view === 'gantt' ? 'active' : ''}`} onClick={() => setView('gantt')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 5h11M3 12h7M3 19h14M14 5v3M10 12v3M17 19v3"/>
            </svg>
            Gantt
          </button>
          <button className={`view-tab ${view === 'agenda' ? 'active' : ''}`} onClick={() => setView('agenda')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>
            </svg>
            Agenda
          </button>
        </div>

        <div className="date-nav">
          <button className="date-nav-arrow" onClick={() => setMonth(m => m - 1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h2>March 2026</h2>
          <button className="date-nav-arrow" onClick={() => setMonth(m => m + 1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>

        <div className="toolbar-right">
          <div className="items-pill">
            <span className="dot" />
            17 items
          </div>
          <button className="icon-btn ghost" title="Settings">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="cal-filters">
        <button className="btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
          Filter
        </button>
        <div className="chip active">
          <span className="swatch" style={{ background: 'oklch(0.65 0.13 155)' }}/>
          Final
          <span className="x">×</span>
        </div>
        <div className="chip active">
          <span className="swatch" style={{ background: 'oklch(0.65 0.14 20)' }}/>
          Kushmart
          <span className="x">×</span>
        </div>
        <div className="chip">
          <span className="swatch" style={{ background: 'oklch(0.65 0.14 245)' }}/>
          Bayfront
        </div>
        <div className="chip">
          <span className="swatch" style={{ background: 'oklch(0.65 0.16 295)' }}/>
          Mecca HQ
        </div>
        <div className="chip">
          High priority
        </div>
        <div className="chip">
          Mine only
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CalEvents: EVENTS, CalHelpers: { D, DOW_LONG, DOW_SHORT, getMonthGrid, dayLabel, isOtherMonth }, StatusBar, Rail, Header });
