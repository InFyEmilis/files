// Mecca top navigation bar — Approach A (modules on top, projects on left).
// Sits above .mc-shell. Modules: Home · Calendar · Admin · Procurement · Chat · Files.
// Right side: search, notifications, user.

const { useState: _tnS, useEffect: _tnE, useRef: _tnR } = React;

// ── Icons (local, so we don't depend on MC.I for new glyphs) ─────────────────
const _TIc = ({ d, size = 16, stroke = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const TI = {
  home:     p => <_TIc {...p} d={<><path d="m3 11 9-8 9 8"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/></>} />,
  calendar: p => <_TIc {...p} d={<><rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9.5h18"/><path d="M8 2.5v4M16 2.5v4"/></>} />,
  admin:    p => <_TIc {...p} d={<><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/><path d="m9 12 2 2 4-4"/></>} />,
  procure:  p => <_TIc {...p} d={<><path d="M2 3h2l3 12h13l3-9H6.5"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></>} />,
  chat:     p => <_TIc {...p} d={<><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"/></>} />,
  files:    p => <_TIc {...p} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>} />,
  search:   p => <_TIc {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>} />,
  bell:     p => <_TIc {...p} d={<><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9z"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>} />,
  check:    p => <_TIc {...p} d={<><path d="m5 12 5 5L20 7"/></>} />,
  settings: p => <_TIc {...p} d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>} />,
};

const MODULES = [
  { id: 'home',     label: 'Home',        Glyph: TI.home,     count: 0 },
  { id: 'calendar', label: 'Calendar',    Glyph: TI.calendar, count: 2 },
  { id: 'admin',    label: 'Admin',       Glyph: TI.admin,    count: 0 },
  { id: 'procure',  label: 'Procurement', Glyph: TI.procure,  count: 3 },
  { id: 'chat',     label: 'Chat',        Glyph: TI.chat,     count: 12 },
  { id: 'files',    label: 'Files',       Glyph: TI.files,    count: 0 },
];

// Overflow modules — sit behind the More button to demonstrate how the
// topnav holds up when modules grow past the visible bar.
const _MoreIc = ({ d, size = 16, stroke = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const MOREI = {
  reports:     p => <_MoreIc {...p} d={<><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 5-6"/></>} />,
  inventory:   p => <_MoreIc {...p} d={<><path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/><path d="m3 8 9 5 9-5"/></>} />,
  vendors:     p => <_MoreIc {...p} d={<><path d="M3 7h18l-1 11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2L3 7Z"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></>} />,
  inspections: p => <_MoreIc {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="m8 11 2 2 4-4"/></>} />,
  more:        p => <_MoreIc {...p} d={<><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></>} />,
  search:      p => <_MoreIc {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>} />,
  settings:    p => <_MoreIc {...p} d={<><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4.8a7 7 0 0 0-2.1-1.2L14 3h-4l-.4 2.4a7 7 0 0 0-2.1 1.2l-2.4-.8-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-.8a7 7 0 0 0 2.1 1.2L10 21h4l.4-2.4a7 7 0 0 0 2.1-1.2l2.4.8 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z"/></>} />,
  help:        p => <_MoreIc {...p} d={<><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></>} />,
  plus:        p => <_MoreIc {...p} d={<><path d="M12 5v14M5 12h14"/></>} />,
  taskCircle:  p => <_MoreIc {...p} d={<><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>} />,
  folderPlus:  p => <_MoreIc {...p} d={<><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 11v6M9 14h6"/></>} />,
  userPlus:    p => <_MoreIc {...p} d={<><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></>} />,
  boxPlus:     p => <_MoreIc {...p} d={<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l4-2.3"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/><path d="M19 17v6M22 20h-6"/></>} />,
};
// Modules list previously lived here — replaced with Create new actions.
// MORE_MODULES is kept as an empty array so the active-tab / count checks
// below (`MORE_MODULES.some(...)`, `MORE_MODULES.reduce(...)`) still work.
const MORE_MODULES = [];
const CREATE_ACTIONS = [
  { id: 'new-task',        label: 'New task',        Glyph: MOREI.taskCircle },
  { id: 'new-project',     label: 'New project',     Glyph: MOREI.folderPlus },
  { id: 'add-employee',    label: 'Add employee',    Glyph: MOREI.userPlus },
  { id: 'new-procurement', label: 'New procurement', Glyph: MOREI.boxPlus },
];

// ── Demo notifications ───────────────────────────────────────────────────────
const NOTIFS = [
  { id: 'n1', kind: 'mention',  who: 'Mike Rodriguez', what: 'mentioned you',  where: 'MH HQ · Project Chat', body: '@you can you confirm the rebar delivery for Level 3?', t: '4m', unread: true, hue: 25 },
  { id: 'n2', kind: 'approval', who: 'David Kim',      what: 'needs approval', where: 'MH HQ · Procurement',  body: 'Lighting fixtures — $24,800 · 3 quotes ready', t: '18m', unread: true, hue: 35 },
  { id: 'n3', kind: 'task',     who: 'Sarah Chen',     what: 'assigned a task',where: 'Downtown Retail · Tasks', body: 'Permit resubmission — zoning · due Friday', t: '46m', unread: true, hue: 220 },
  { id: 'n4', kind: 'issue',    who: 'Mike Rodriguez', what: 'flagged an issue', where: 'MH HQ · Site',          body: 'Water leak in storage — plumber on site, temp patch.', t: '1h', unread: false, hue: 0 },
  { id: 'n5', kind: 'message',  who: 'Lisa Park',      what: 'sent a message', where: 'Bayfront Hotel · DM',   body: 'MEP coordination meeting moved to Thursday 2pm.', t: '2h', unread: false, hue: 340 },
  { id: 'n6', kind: 'file',     who: 'Emily Johnson',  what: 'uploaded a file',where: 'MH HQ · Drawings',     body: 'L3-framing-plan-v4.pdf · 4.2 MB', t: '3h', unread: false, hue: 290 },
];

function KindBadge({ kind, hue }) {
  const map = {
    mention:  { ch: '@',  bg: hue },
    approval: { ch: '✓',  bg: hue },
    task:     { ch: '◫',  bg: hue },
    issue:    { ch: '!',  bg: hue },
    message:  { ch: '✦',  bg: hue },
    file:     { ch: '◳',  bg: hue },
  };
  const m = map[kind] || map.message;
  return (
    <div className="mc-top-notif__kind" style={{
      background: `oklch(0.32 0.08 ${m.bg})`,
      color: `oklch(0.92 0.10 ${m.bg})`,
      boxShadow: `inset 0 0 0 1px oklch(0.45 0.10 ${m.bg} / .35)`,
    }}>{m.ch}</div>
  );
}

// ── Notifications popover ───────────────────────────────────────────────────
function NotificationsPopover({ items, onClose, onMarkAllRead }) {
  const unreadCount = items.filter(n => n.unread).length;
  const [filter, setFilter] = _tnS('all'); // all | unread | mentions
  const filtered = items.filter(n => {
    if (filter === 'unread')   return n.unread;
    if (filter === 'mentions') return n.kind === 'mention';
    return true;
  });

  return (
    <div className="mc-top-notif" role="dialog" aria-label="Notifications">
      <header className="mc-top-notif__head">
        <div className="mc-top-notif__title">
          Notifications
          {unreadCount > 0 && <span className="mc-top-notif__count">{unreadCount} new</span>}
        </div>
        <button className="mc-top-notif__readall" onClick={onMarkAllRead} disabled={unreadCount === 0}>
          Mark all read
        </button>
      </header>
      <div className="mc-top-notif__tabs">
        {[
          { id: 'all', label: 'All',          count: items.length },
          { id: 'unread', label: 'Unread',    count: unreadCount },
          { id: 'mentions', label: 'Mentions',count: items.filter(n => n.kind==='mention').length },
        ].map(t => (
          <button
            key={t.id}
            className={'mc-top-notif__tab' + (filter === t.id ? ' is-active' : '')}
            onClick={() => setFilter(t.id)}
          >
            {t.label} <span>{t.count}</span>
          </button>
        ))}
      </div>
      <div className="mc-top-notif__list">
        {filtered.length === 0 && (
          <div className="mc-top-notif__empty">You're all caught up.</div>
        )}
        {filtered.map(n => (
          <button key={n.id} className={'mc-top-notif__item' + (n.unread ? ' is-unread' : '')}>
            <KindBadge kind={n.kind} hue={n.hue} />
            <div className="mc-top-notif__body">
              <div className="mc-top-notif__top">
                <span className="mc-top-notif__who">{n.who}</span>
                <span className="mc-top-notif__what"> {n.what}</span>
                <span className="mc-top-notif__time">{n.t}</span>
              </div>
              <div className="mc-top-notif__where">{n.where}</div>
              <div className="mc-top-notif__msg">{n.body}</div>
            </div>
            {n.unread && <span className="mc-top-notif__dot" />}
          </button>
        ))}
      </div>
      <footer className="mc-top-notif__foot">
        <button>View all notifications</button>
        <button className="mc-top-notif__settings" title="Notification settings">
          <TI.settings size={14} />
        </button>
      </footer>
    </div>
  );
}

// ── More dropdown (overflow modules + workspace utilities) ─────────────────
function MoreDropdown({ active, onSelect, onCreate, onClose }) {
  return (
    <div className="mc-topnav__more-pop" role="menu" aria-label="Create new">
      <div className="mc-topnav__more-sec">Create new</div>
      <div className="mc-topnav__more-list">
        {CREATE_ACTIONS.map(a => (
          <button
            key={a.id}
            className="mc-topnav__more-row"
            onClick={() => { if (onCreate) onCreate(a.id); onClose(); }}
            role="menuitem"
          >
            <a.Glyph size={16} />
            <span>{a.label}</span>
            <span className="mc-topnav__more-rowplus" aria-hidden="true">
              <MOREI.plus size={13} />
            </span>
          </button>
        ))}
      </div>
      <div className="mc-topnav__more-divider" />
      <div className="mc-topnav__more-list">
        <button className="mc-topnav__more-row" role="menuitem">
          <MOREI.search size={16} />
          <span>Search</span>
          <kbd className="mc-topnav__more-kbd">⌘ K</kbd>
        </button>
        <button className="mc-topnav__more-row" role="menuitem">
          <MOREI.settings size={16} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}

// ── Top nav ─────────────────────────────────────────────────────────────────
function TopNav({ active = 'chat', onSelect, onCreate, onOpenSearch }) {
  const [notifOpen, setNotifOpen] = _tnS(false);
  const [moreOpen, setMoreOpen] = _tnS(false);
  const [notifs, setNotifs] = _tnS(NOTIFS);
  const popRef = _tnR(null);
  const btnRef = _tnR(null);
  const morePopRef = _tnR(null);
  const moreBtnRef = _tnR(null);
  const unread = notifs.filter(n => n.unread).length;

  _tnE(() => {
    if (!notifOpen && !moreOpen) return;
    const onDoc = (e) => {
      if (notifOpen &&
          popRef.current && !popRef.current.contains(e.target) &&
          btnRef.current && !btnRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (moreOpen &&
          morePopRef.current && !morePopRef.current.contains(e.target) &&
          moreBtnRef.current && !moreBtnRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') { setNotifOpen(false); setMoreOpen(false); }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [notifOpen, moreOpen]);

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })));

  return (
    <header className="mc-topnav">
      <div className="mc-topnav__left">
        <div className="mc-topnav__brand">
          <div className="mc-topnav__logo">M</div>
          <span className="mc-topnav__brandname">Mecca</span>
        </div>

        <div className="mc-topnav__divider" />

        <nav className="mc-topnav__nav" aria-label="Modules">
          {MODULES.map((m, i) => {
            const isActive = m.id === active;
            return (
              <button
                key={m.id}
                className={'mc-topnav__tab' + (isActive ? ' is-active' : '')}
                onClick={() => onSelect && onSelect(m.id)}
                aria-current={isActive ? 'page' : undefined}
                title={`${m.label} ${i < 9 ? '· ⌘' + (i + 1) : ''}`}
              >
                <m.Glyph size={15} />
                <span>{m.label}</span>
                {m.count > 0 && (
                  <span className={'mc-topnav__count' + (isActive ? ' is-active' : '')}>
                    {m.count > 99 ? '99+' : m.count}
                  </span>
                )}
                {isActive && <span className="mc-topnav__active-bar" />}
              </button>
            );
          })}
          {/* Overflow — shows where additional sections go as modules grow */}
          <div className="mc-topnav__more-wrap">
            <button
              ref={moreBtnRef}
              className={'mc-topnav__tab mc-topnav__tab--more' + (moreOpen ? ' is-open' : '') + (MORE_MODULES.some(m => m.id === active) ? ' is-active' : '')}
              onClick={() => setMoreOpen(o => !o)}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              title="More"
            >
              <MOREI.more size={16} />
              <span>More</span>
              {MORE_MODULES.reduce((s, m) => s + (m.count || 0), 0) > 0 && (
                <span className="mc-topnav__count">
                  {MORE_MODULES.reduce((s, m) => s + (m.count || 0), 0)}
                </span>
              )}
              {MORE_MODULES.some(m => m.id === active) && <span className="mc-topnav__active-bar" />}
            </button>
            {moreOpen && (
              <div ref={morePopRef}>
                <MoreDropdown
                  active={active}
                  onSelect={onSelect}
                  onCreate={onCreate}
                  onClose={() => setMoreOpen(false)}
                />
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="mc-topnav__right">
        <button
          className="mc-topnav__search"
          role="search"
          onClick={() => onOpenSearch && onOpenSearch()}
          aria-label="Search (⌘K)"
        >
          <TI.search size={13} />
          <span>Search projects, tasks, files…</span>
          <kbd>⌘ K</kbd>
        </button>

        <button
          ref={btnRef}
          className={'mc-topnav__iconbtn mc-topnav__bell' + (notifOpen ? ' is-open' : '')}
          onClick={() => setNotifOpen(o => !o)}
          aria-expanded={notifOpen}
          aria-label={`Notifications${unread ? ` — ${unread} unread` : ''}`}
        >
          <TI.bell size={15} />
          {unread > 0 && <span className="mc-topnav__bell-dot">{unread > 9 ? '9+' : unread}</span>}
        </button>

        <div className="mc-topnav__user" title="You · PM">YO</div>

        {notifOpen && (
          <div className="mc-topnav__pop" ref={popRef}>
            <NotificationsPopover
              items={notifs}
              onMarkAllRead={markAllRead}
              onClose={() => setNotifOpen(false)}
            />
          </div>
        )}
      </div>
    </header>
  );
}

window.MC = window.MC || {};
window.MC.TopNav = TopNav;
