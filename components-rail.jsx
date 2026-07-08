// Components for Mecca chat — Rail, Inbox, ChatPane
const { useState, useMemo, useEffect, useRef, useLayoutEffect } = React;
const D = window.MeccaData;

// ── Iconography (inline SVG so we don't depend on lucide) ────────────────────
const Icon = ({ d, size = 16, stroke = 1.6, fill = 'none', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {d}
  </svg>
);
const I = {
  msg:    (p) => <Icon {...p} d={<><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"/></>} />,
  check:  (p) => <Icon {...p} d={<><rect x="3" y="3" width="18" height="18" rx="3"/><path d="m9 12 2 2 4-4"/></>} />,
  cart:   (p) => <Icon {...p} d={<><path d="M2 3h2l3 12h13l3-9H6.5"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></>} />,
  truck:  (p) => <Icon {...p} d={<><path d="M3 6h10v9H3z"/><path d="M13 9h4l4 4v2h-8z"/><path d="M5.5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M17.5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M13 15H7.5"/><path d="M15 9v4h5"/></>} />,
  alert:  (p) => <Icon {...p} d={<><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>} />,
  user:   (p) => <Icon {...p} d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />,
  users:  (p) => <Icon {...p} d={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />,
  search: (p) => <Icon {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>} />,
  plus:   (p) => <Icon {...p} d={<><path d="M12 5v14M5 12h14"/></>} />,
  chev:   (p) => <Icon {...p} d={<><path d="m6 9 6 6 6-6"/></>} />,
  more:   (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></>} />,
  pin:    (p) => <Icon {...p} d={<><path d="M12 17v5"/><path d="M9 10.76V6h6v4.76l3 3.24v3H6v-3z"/></>} />,
  panelL: (p) => <Icon {...p} d={<><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/></>} />,
  panelR: (p) => <Icon {...p} d={<><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m13 9 3 3-3 3"/></>} />,
  send:   (p) => <Icon {...p} d={<><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></>} />,
  paper:  (p) => <Icon {...p} d={<><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></>} />,
  smile:  (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></>} />,
  mic:    (p) => <Icon {...p} d={<><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2"/><path d="M12 19v3"/></>} />,
  phone:  (p) => <Icon {...p} d={<><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></>} />,
  video:  (p) => <Icon {...p} d={<><path d="m22 8-6 4 6 4V8z"/><rect x="2" y="6" width="14" height="12" rx="2"/></>} />,
  info:   (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></>} />,
  filter: (p) => <Icon {...p} d={<><path d="M3 6h18"/><path d="M7 12h10"/><path d="M11 18h2"/></>} />,
  link:   (p) => <Icon {...p} d={<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>} />,
  reply:  (p) => <Icon {...p} d={<><path d="M9 17 4 12l5-5"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></>} />,
  sparkles: (p) => <Icon {...p} d={<><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6 7.7 7.7M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></>} />,
  dot:    (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="3" fill="currentColor"/></>} fill="currentColor" />,
  archive:(p) => <Icon {...p} d={<><rect x="2.5" y="4" width="19" height="4.5" rx="1.2"/><path d="M4 8.5v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-10"/><path d="M10 13h4"/></>} />,
  rotate: (p) => <Icon {...p} d={<><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></>} />,
};

// ── Type config: glyphs + tonal hues for the type accent system ──────────────
const TYPE_CFG = {
  'project':     { Glyph: I.msg,   label: 'Project',     hue: 195, name: 'Project Chat' },
  'task':        { Glyph: I.check, label: 'Task',        hue: 220, name: 'Task' },
  'procurement': { Glyph: I.truck, label: 'Procurement', hue: 35,  name: 'Procurement' },
  'site-issue':  { Glyph: I.alert, label: 'Site Issue',  hue: 0,   name: 'Site Issue' },
  'custom-group':{ Glyph: I.users, label: 'Group',       hue: 260, name: 'Custom Group Chat' },
  'direct':      { Glyph: I.user,  label: 'Direct',      hue: 270, name: 'Direct' },
};

// Avatar — initials chip with deterministic hue
function Avatar({ p, size = 32, ring = false }) {
  const hue = p.hue ?? 220;
  const bg = `oklch(0.42 0.06 ${hue})`;
  const fg = `oklch(0.96 0.02 ${hue})`;
  return (
    <div
      className={'mc-avatar' + (ring ? ' mc-avatar--ring' : '')}
      style={{ width: size, height: size, background: bg, color: fg, fontSize: Math.round(size * 0.36) }}
      title={p.name}
    >
      {p.avatar}
    </div>
  );
}

function StackedAvatars({ people, max = 3, size = 22 }) {
  const visible = people.slice(0, max);
  return (
    <div className="mc-avatar-stack" style={{ paddingRight: (people.length - 1) * 6 }}>
      {visible.map((p, i) => (
        <div key={p.name} style={{ marginLeft: i === 0 ? 0 : -6, zIndex: max - i }}>
          <Avatar p={p} size={size} ring />
        </div>
      ))}
      {people.length > max && (
        <div className="mc-avatar mc-avatar--more" style={{ width: size, height: size, marginLeft: -6, fontSize: 9 }}>
          +{people.length - max}
        </div>
      )}
    </div>
  );
}

// Long-press helper — returns pointer handlers + a "click-was-press" guard so
// the onClick on the row doesn't also fire as a navigation when the user just
// wanted the summary. 500ms matches iOS's context-menu default.
function useLongPress(onLongPress, ms = 500) {
  const tRef = useRef(null);
  const triggered = useRef(false);
  const startedAtRef = useRef(0);

  const cancel = () => {
    if (tRef.current) { clearTimeout(tRef.current); tRef.current = null; }
  };
  const start = (e) => {
    // Ignore right-clicks (they have their own handler) and synthetic events.
    if (e.button && e.button !== 0) return;
    triggered.current = false;
    startedAtRef.current = Date.now();
    cancel();
    tRef.current = setTimeout(() => {
      triggered.current = true;
      onLongPress(e);
    }, ms);
  };
  return {
    handlers: {
      onPointerDown: start,
      onPointerUp:   cancel,
      onPointerLeave: cancel,
      onPointerCancel: cancel,
    },
    didTrigger: () => triggered.current,
  };
}

// One-time hint: "Hold to preview" shown the first time a user hovers a rail
// row, then dismissed forever. Stored in localStorage so it survives reload.
const HINT_KEY = 'mc.rail.holdHintSeen.v1';
function useHoldHint(enabled) {
  const [show, setShow] = useState(false);
  const dismissedRef = useRef(false);
  useEffect(() => {
    if (!enabled) return;
    try { if (localStorage.getItem(HINT_KEY) === '1') dismissedRef.current = true; } catch (e) {}
  }, [enabled]);
  const onEnter = () => {
    if (!enabled || dismissedRef.current) return;
    setShow(true);
  };
  const onLeave = () => setShow(false);
  const dismiss = () => {
    dismissedRef.current = true;
    setShow(false);
    try { localStorage.setItem(HINT_KEY, '1'); } catch (e) {}
  };
  return { show, onEnter, onLeave, dismiss };
}

// Tiny priority dot (P1/P2). P3/none renders nothing.
function PriorityDot({ level }) {
  if (level === 'p1') return <span className="mc-pdot mc-pdot--p1" title="Critical" />;
  if (level === 'p2') return <span className="mc-pdot mc-pdot--p2" title="High" />;
  return null;
}

// Single project row in the rail. Hosts:
// - Tap → switch project
// - Long-press (500ms, pointer events) → open summary
// - Right-click → open summary (desktop)
// - Hover ⓘ button → open summary (desktop only; hidden on touch via CSS)
// - One-time "Hold to preview" tooltip on first hover (desktop)
function RailRow({ p, expanded, isSel, summaryTrigger, onSelectProject, onShowSummary, hint }) {
  const wrapRef = useRef(null);
  const unread = D.getTotalUnread(p.id);
  const bk = D.getUnreadBreakdown(p.id);
  const chips = [
    { key: 'project',     count: bk.project,         hue: 195, Glyph: I.msg,   title: 'Project messages' },
    { key: 'task',        count: bk.task,            hue: 220, Glyph: I.check, title: 'Tasks' },
    { key: 'procurement', count: bk.procurement,     hue: 35,  Glyph: I.truck, title: 'Procurement' },
    { key: 'site-issue',  count: bk['site-issue'],   hue: 0,   Glyph: I.alert, title: 'Site issues' },
    { key: 'custom-group',count: bk['custom-group'], hue: 260, Glyph: I.users, title: 'Custom group chats' },
  ];
  const visibleChips = chips.filter(c => c.count > 0);

  const summaryOn = summaryTrigger !== 'off' && !!onShowSummary;
  const showInfoMode = summaryOn && (summaryTrigger === 'hover' || summaryTrigger === 'both' || summaryTrigger === 'always');
  const allowRightClick = summaryOn && (summaryTrigger === 'rightclick' || summaryTrigger === 'both' || summaryTrigger === 'always');
  const dataInfoAttr = summaryTrigger === 'always' ? 'always' : showInfoMode ? 'hover' : 'never';

  // Long-press is always on when summary is enabled — desktop benefits too,
  // and (hover: none) devices rely on it as the primary trigger.
  const lp = useLongPress(() => {
    if (!summaryOn) return;
    onShowSummary(p.id, wrapRef.current);
    if (hint) hint.dismiss();
  }, 500);

  const handleContext = (e) => {
    if (!allowRightClick) return;
    e.preventDefault();
    onShowSummary(p.id, wrapRef.current);
  };
  const handleClick = (e) => {
    // If a long-press already fired, eat the click so we don't also switch projects.
    if (lp.didTrigger()) { e.preventDefault(); e.stopPropagation(); return; }
    onSelectProject(p.id);
  };
  const handleEnter = () => { if (hint) hint.onEnter(); };
  const handleLeave = () => { if (hint) hint.onLeave(); };

  const rowEl = (
    <button
      className={'mc-rail__row' + (isSel ? ' is-selected' : '')}
      onClick={handleClick}
      title={!expanded ? p.name : undefined}
      {...(summaryOn ? lp.handlers : {})}
    >
      <div
        className="mc-rail__bubble"
        style={{
          background: isSel ? 'var(--mc-accent)' : 'var(--mc-surface)',
          color: isSel ? 'var(--mc-accent-fg)' : 'var(--mc-text-mute)',
        }}
      >
        {p.initials}
        {p.priorityLevel === 'critical' && <span className="mc-rail__priority mc-rail__priority--crit" />}
        {p.priorityLevel === 'high' && <span className="mc-rail__priority mc-rail__priority--high" />}
        {!expanded && unread > 0 && <span className="mc-rail__badge">{unread > 9 ? '9+' : unread}</span>}
      </div>
      {expanded && (
        <div className="mc-rail__rowtext">
          <span className="mc-rail__name">{p.name}</span>
          {visibleChips.length > 0 ? (
            <div className="mc-rail__chips">
              {visibleChips.map(c => (
                <span
                  key={c.key}
                  className="mc-rail__chip"
                  title={`${c.count} ${c.title.toLowerCase()}`}
                  style={{
                    background: `oklch(0.32 0.08 ${c.hue})`,
                    color: `oklch(0.92 0.04 ${c.hue})`,
                    borderColor: `oklch(0.42 0.08 ${c.hue} / 0.5)`,
                  }}
                >
                  <c.Glyph size={10} stroke={2} />
                  {c.count}
                </span>
              ))}
            </div>
          ) : (
            <span className="mc-rail__reason">{p.priorityReason}</span>
          )}
        </div>
      )}
    </button>
  );

  if (!summaryOn) return rowEl;

  return (
    <div
      ref={wrapRef}
      className="mc-rail__rowwrap"
      data-show-info={dataInfoAttr}
      onContextMenu={handleContext}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {rowEl}
      {showInfoMode && (
        <button
          className="mc-rail__rowinfo"
          onClick={(e) => {
            e.stopPropagation();
            onShowSummary(p.id, wrapRef.current);
            if (hint) hint.dismiss();
          }}
          aria-label={'Project summary — ' + p.name}
          title="View summary"
        >
          <I.info size={11} stroke={2} />
        </button>
      )}
      {hint && hint.show && (
        <div className="mc-rail__holdhint" role="tooltip">
          Hold to preview
        </div>
      )}
    </div>
  );
}

// ── Project Bubble Rail ──────────────────────────────────────────────────────
function ProjectBubbleRail({ variant, projects, selectedProjectId, selectedMode, onSelectProject, onSelectDirect, onToggleVariant, onShowSummary, summaryTrigger = 'both' }) {
  // variant: 'rail' (icons only), 'expanded' (icons + name), 'collapsed' (search-style)
  const collapsed = variant === 'collapsed';
  const expanded = variant === 'expanded';
  // First-time hover hint for the "hold to preview" gesture
  const hint = useHoldHint(!!onShowSummary && summaryTrigger !== 'off');

  const sections = useMemo(() => {
    const critical = projects.filter(p => p.priorityLevel === 'critical');
    const active = projects.filter(p => p.priorityLevel === 'high' || (p.priorityLevel === 'normal' && p.unreadMessages > 0));
    const quiet = projects.filter(p => p.priorityLevel === 'normal' && p.unreadMessages === 0);
    return [
      { label: 'Critical', items: critical },
      { label: 'Active',   items: active },
      { label: 'Quiet',    items: quiet },
    ].filter(s => s.items.length);
  }, [projects]);

  const dmUnread = D.getGlobalDMs().reduce((s, c) => s + c.unreadCount, 0);

  if (collapsed) {
    return (
      <aside className="mc-rail mc-rail--collapsed">
        <button className="mc-rail__expand" onClick={() => onToggleVariant('rail')} title="Expand sidebar">
          <I.panelR size={16} />
        </button>
      </aside>
    );
  }

  return (
    <aside className={'mc-rail ' + (expanded ? 'mc-rail--expanded' : 'mc-rail--rail')}>
      <div className="mc-rail__toggle">
        {expanded ? (
          <button className="mc-iconbtn" onClick={() => onToggleVariant('rail')} title="Collapse to rail">
            <I.panelL size={16} />
          </button>
        ) : (
          <button className="mc-rail__expand-mini mc-rail__expand-mini--static" onClick={() => onToggleVariant('expanded')} title="Expand">
            <I.panelR size={14} />
          </button>
        )}
      </div>

      <div className="mc-rail__scroll">
        <button
          className={'mc-rail__row mc-rail__row--all' + (selectedMode === 'all' ? ' is-selected' : '')}
          onClick={() => onSelectProject && onSelectProject('__all__')}
          title={!expanded ? 'All projects' : undefined}
        >
          <div className="mc-rail__bubble mc-rail__bubble--all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>
          </div>
          {expanded && <span className="mc-rail__name">All projects</span>}
          {expanded && <span className="mc-rail__count">{projects.length}</span>}
        </button>

        <button
          className={'mc-rail__row mc-rail__row--dm' + (selectedMode === 'direct' ? ' is-selected' : '')}
          onClick={onSelectDirect}
        >
          <div className="mc-rail__bubble mc-rail__bubble--dm">
            <I.user size={18} />
            {dmUnread > 0 && <span className="mc-rail__badge">{dmUnread}</span>}
          </div>
          {expanded && <span className="mc-rail__name">Direct messages</span>}
          {expanded && dmUnread > 0 && <span className="mc-rail__count">{dmUnread}</span>}
        </button>

        <div className="mc-rail__divider" />

        {sections.map(section => (
          <div key={section.label} className="mc-rail__section">
            {expanded && <div className="mc-rail__section-label">{section.label}</div>}
            {!expanded && <div className="mc-rail__section-tick" title={section.label} />}
            {section.items.map(p => (
              <RailRow
                key={p.id}
                p={p}
                expanded={expanded}
                isSel={selectedMode === 'project' && selectedProjectId === p.id}
                summaryTrigger={summaryTrigger}
                onSelectProject={onSelectProject}
                onShowSummary={onShowSummary}
                hint={hint}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mc-rail__foot">
        <button className="mc-iconbtn" title="New conversation">
          <I.plus size={16} />
        </button>
        <Avatar p={D.participants.you} size={28} ring />
      </div>
    </aside>
  );
}

window.MC = window.MC || {};
window.MC.ProjectBubbleRail = ProjectBubbleRail;
window.MC.Avatar = Avatar;
window.MC.StackedAvatars = StackedAvatars;
window.MC.PriorityDot = PriorityDot;
window.MC.TYPE_CFG = TYPE_CFG;
window.MC.I = I;
