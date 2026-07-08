// Top-bar variants for the phone shell.
//   A  'floating' — original: floating chat+bell pill, project chip lives
//                   inside each screen's own header. (Existing chrome.)
//   B  'native'   — iOS NavigationStack-style toolbar at top of body.
//                   Centered title, leading workspace dot or back chevron,
//                   trailing global actions. Per-screen chrome is hidden by
//                   CSS — the shared bar takes over per-screen.
//   C  'hybrid'   — Persistent app-shell-owned bar at the very top
//                   (workspace pill left, module label center, actions
//                   right) + a per-screen secondary header below it. The
//                   shell bar never changes; only the secondary header
//                   updates as you navigate.
//
// All three modes hide the existing per-screen project chip / float pill
// where appropriate via classes on `.ph-app` (see phone-topbar-variants.css).

const { useEffect: tvUE, useState: tvUS, useRef: tvUR } = React;

// ── Local icon set ────────────────────────────────────────────────────────
const _TvIc = ({ d, size = 20, stroke = 1.7, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={stroke}
    strokeLinecap="round" strokeLinejoin="round" {...rest}>{d}</svg>
);
const TvI = {
  back:  p => <_TvIc {...p} d={<path d="m15 18-6-6 6-6"/>} />,
  chat:  p => <_TvIc {...p} d={<path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"/>} />,
  bell:  p => <_TvIc {...p} d={<><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9z"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>} />,
  down:  p => <_TvIc {...p} d={<path d="m6 9 6 6 6-6"/>} />,
  plus:  p => <_TvIc {...p} d={<><path d="M12 5v14M5 12h14"/></>} />,
  taskCircle: p => <_TvIc {...p} d={<><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>} />,
  folderPlus: p => <_TvIc {...p} d={<><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 11v6M9 14h6"/></>} />,
  userPlus: p => <_TvIc {...p} d={<><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></>} />,
  boxPlus: p => <_TvIc {...p} d={<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l4-2.3"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/><path d="M19 17v6M22 20h-6"/></>} />,
};

// ── Top-bar "+" create control — native press-drag-release menu ────────────
// Mirrors the bottom bar's More menu, but drops DOWN from the top-right.
// Press the +, slide a finger onto an item, release to create (or tap to
// open then tap a row). Portaled into .ph-app so it overlays the screen.
const TV_CREATE_ITEMS = [
  { id: 'new-task',        label: 'New task',       Glyph: TvI.taskCircle },
  { id: 'new-project',     label: 'New project',    Glyph: TvI.folderPlus },
  { id: 'add-employee',    label: 'Add employee',   Glyph: TvI.userPlus },
  { id: 'new-procurement', label: 'New PO',         Glyph: TvI.boxPlus },
];
function PhoneShellCreate({ onCreate }) {
  const [open, setOpen] = tvUS(false);
  const [hot, setHot]   = tvUS(null);
  const [host, setHost] = tvUS(null);
  const [pos, setPos]   = tvUS(null);
  const btnRef = tvUR(null);
  const drag   = tvUR({ on: false });

  const rowAt = (x, y) => {
    const el = document.elementFromPoint(x, y);
    const row = el && el.closest && el.closest('[data-create-row]');
    return row ? row.getAttribute('data-create-row') : null;
  };
  const close = () => { setOpen(false); setHot(null); };
  const choose = (id) => { close(); if (id && onCreate) onCreate(id); };
  const measure = () => {
    const b = btnRef.current; if (!b) return;
    const app = b.closest('.ph-app');
    setHost(app);
    if (app) {
      const br = b.getBoundingClientRect();
      const ar = app.getBoundingClientRect();
      setPos({ top: br.bottom - ar.top + 8, right: ar.right - br.right });
    }
  };
  const onDown = (e) => {
    e.preventDefault();
    measure();
    drag.current = { on: true, moved: false, wasOpen: open, sx: e.clientX, sy: e.clientY };
    setOpen(true);
    try { btnRef.current.setPointerCapture(e.pointerId); } catch (_) {}
  };
  const onMove = (e) => {
    const d = drag.current;
    if (!d.on) return;
    if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > 6) d.moved = true;
    setHot(rowAt(e.clientX, e.clientY));
  };
  const onUp = (e) => {
    const d = drag.current;
    drag.current = { on: false };
    try { btnRef.current.releasePointerCapture(e.pointerId); } catch (_) {}
    const over = rowAt(e.clientX, e.clientY);
    if (over) { choose(over); return; }
    if (!d.moved) { if (d.wasOpen) close(); /* else tap → stay open */ }
    else close();
  };

  tvUE(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const menu = open && host && pos ? ReactDOM.createPortal(
    <>
      <div className="ph-moremenu__scrim" onClick={close} aria-hidden="true" />
      <div
        className="ph-moremenu ph-moremenu--down"
        role="menu"
        aria-label="Create new"
        style={{ top: pos.top, right: pos.right, bottom: 'auto' }}
      >
        <div className="ph-moremenu__seclbl">Create</div>
        {TV_CREATE_ITEMS.map(it => (
          <button
            key={it.id}
            type="button"
            data-create-row={it.id}
            role="menuitem"
            className={'ph-moremenu__row' + (hot === it.id ? ' is-hot' : '')}
            onClick={() => choose(it.id)}
          >
            <span className="ph-moremenu__lbl">{it.label}</span>
            <span className="ph-moremenu__ico"><it.Glyph size={19} stroke={1.8} /></span>
          </button>
        ))}
      </div>
    </>,
    host
  ) : null;

  return (
    <>
      <button
        ref={btnRef}
        className={'ph-shellbar__act ph-shellbar__act--create' + (open ? ' is-open' : '')}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Create new"
      >
        <TvI.plus size={20} stroke={2.1} />
      </button>
      {menu}
    </>
  );
}

// ── B. NavigationStack-style toolbar ─────────────────────────────────────
// Renders a single 44pt iOS toolbar. Leading slot is either a back chevron
// (when `hasBack`) or a workspace dot. Title is centered. Trailing slot
// always holds global chat + bell.
function PhoneNavStackBar({
  title, sub,
  hasBack, onBack,
  workspaceInitial = 'M',
  onWorkspace,
  onChat, onBell, unread = 0,
}) {
  return (
    <div className="ph-navbar" role="banner">
      <div className="ph-navbar__leading">
        {hasBack ? (
          <button className="ph-navbar__back" onClick={onBack} aria-label="Back">
            <TvI.back size={24} stroke={2.4} />
          </button>
        ) : (
          <button className="ph-navbar__ws" onClick={onWorkspace} aria-label="Workspace">
            <span className="ph-navbar__ws-dot">{workspaceInitial}</span>
          </button>
        )}
      </div>
      <div className="ph-navbar__title" aria-live="polite">
        <div className="ph-navbar__title-row">{title}</div>
        {sub && <div className="ph-navbar__title-sub">{sub}</div>}
      </div>
      <div className="ph-navbar__trailing">
        <button className="ph-navbar__act" onClick={onChat} aria-label="Open chat">
          <TvI.chat size={19} />
        </button>
        <button className="ph-navbar__act" onClick={onBell} aria-label="Notifications">
          <TvI.bell size={19} />
          {unread > 0 && <span className="ph-navbar__dot">{unread > 9 ? '9+' : unread}</span>}
        </button>
      </div>
    </div>
  );
}

// ── C. Shell-owned persistent toolbar ────────────────────────────────────
// Always present, app-shell-level. Workspace pill on the left, module label
// in the middle, global chat + bell on the right. Never changes as you
// navigate inside a module — only the workspace and module switching do.
function PhoneShellBar({
  workspaceName = 'Mecca',
  workspaceInitial = 'M',
  project = null,        // when set, pill shows project bubble + name
  moduleLabel,
  onWorkspace,
  onChat, onBell, onCreate, unread = 0,
}) {
  const inProject = !!project;
  const hue = (project && project.hue) || 240;
  const initials = inProject ? (project.initials || '·') : workspaceInitial;
  const name = inProject ? project.name : workspaceName;
  const isProjectChat = inProject && moduleLabel === 'Chat';
  const prio = inProject && (project.priorityLevel === 'critical'
                              ? 'crit'
                              : project.priorityLevel === 'high' ? 'high' : null);
  return (
    <div className={'ph-shellbar' + (isProjectChat ? ' is-project-chat' : '')} role="banner">
      <button
        className={'ph-shellbar__ws' + (inProject ? ' is-project' : '')}
        onClick={onWorkspace}
        aria-label={inProject ? `Switch project · currently ${name}` : 'Switch workspace'}
      >
        <span
          className={'ph-shellbar__ws-dot' + (inProject ? ' is-project' : '')}
          style={inProject ? {
            background: `oklch(0.36 0.08 ${hue})`,
            color: `oklch(0.94 0.09 ${hue})`,
            boxShadow: `inset 0 0 0 1px oklch(0.55 0.12 ${hue} / 0.35)`,
          } : undefined}
        >
          {initials}
          {prio && <span className={`ph-shellbar__prio ph-shellbar__prio--${prio}`} />}
        </span>
        <span className="ph-shellbar__ws-name">{name}</span>
        <TvI.down size={13} stroke={2.4} />
      </button>
      {!isProjectChat && <div className="ph-shellbar__title">{moduleLabel}</div>}
      <div className="ph-shellbar__actions">
        {onCreate && <PhoneShellCreate onCreate={onCreate} />}
        {!isProjectChat && (
          <button className="ph-shellbar__act" onClick={onChat} aria-label="Open chat">
            <TvI.chat size={18} />
          </button>
        )}
        <button className="ph-shellbar__act" onClick={onBell} aria-label="Notifications">
          <TvI.bell size={18} />
          {unread > 0 && <span className="ph-shellbar__dot">{unread > 9 ? '9+' : unread}</span>}
        </button>
      </div>
    </div>
  );
}

// ── C. Per-screen secondary header (sits under the shell bar) ────────────
// Large-title style — title + subtitle + back chevron. The shell bar
// already owns global actions, so trailing is intentionally empty.
function PhoneShellSubHeader({ title, sub, hasBack, onBack }) {
  if (!title) return null;
  return (
    <div className="ph-subhead">
      {hasBack && (
        <button className="ph-subhead__back" onClick={onBack} aria-label="Back">
          <TvI.back size={20} stroke={2.2} />
        </button>
      )}
      <div className="ph-subhead__text">
        <div className="ph-subhead__title">{title}</div>
        {sub && <div className="ph-subhead__sub">{sub}</div>}
      </div>
    </div>
  );
}

window.PMC = window.PMC || {};
window.PMC.PhoneNavStackBar  = PhoneNavStackBar;
window.PMC.PhoneShellBar     = PhoneShellBar;
window.PMC.PhoneShellSubHeader = PhoneShellSubHeader;
