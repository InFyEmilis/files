// Desktop project summary popover + All Projects dashboard grid.
//
// Two surfaces:
//   1. DesktopProjectSummary  — floating popover anchored to a rail row
//   2. DesktopAllProjectsGrid — full-screen dashboard (used when mode='all')
//
// Both reuse the same data + visual language (tiles, badges, needs-attention).

const { useState: _dpS, useEffect: _dpE, useMemo: _dpM, useRef: _dpR, useLayoutEffect: _dpLE } = React;
const _DPD = window.MeccaData;

// ── Icons ──────────────────────────────────────────────────────────────────
const _DPIc = ({ d, size = 14, stroke = 1.8, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const DpI = {
  close: p => <_DPIc {...p} d={<><path d="M18 6 6 18M6 6l12 12"/></>} />,
  task:  p => <_DPIc {...p} d={<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m7 12 2 2 3-4"/></>} />,
  proc:  p => <_DPIc {...p} d={<><path d="M2 3h2l3 12h13l3-9H6.5"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></>} />,
  chat:  p => <_DPIc {...p} d={<><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"/></>} />,
  warn:  p => <_DPIc {...p} d={<><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>} />,
  chev:  p => <_DPIc {...p} d={<><path d="m9 6 6 6-6 6"/></>} />,
  open:  p => <_DPIc {...p} d={<><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></>} />,
  info:  p => <_DPIc {...p} d={<><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></>} />,
};

// ── Avatar (matches phone variant, brighter than the rail) ─────────────────
function _ProjAvatar({ project, size = 36, radius = 10 }) {
  const hue = project.hue ?? 220;
  return (
    <span className="dps__avatar" style={{
      width: size, height: size, borderRadius: radius,
      background: `oklch(0.42 0.10 ${hue})`,
      color: `oklch(0.95 0.12 ${hue})`,
      boxShadow: `inset 0 0 0 1px oklch(0.60 0.14 ${hue} / 0.40)`,
    }}>
      {project.initials}
    </span>
  );
}

// ── Status badges (T / PR / C / SI) ─────────────────────────────────────────
function _StatusBadges({ project, compact = false }) {
  const breakdown = _DPD && _DPD.getUnreadBreakdown
    ? _DPD.getUnreadBreakdown(project.id)
    : null;
  const overdue   = project.overdueTasks  || 0;
  const dueToday  = project.dueTodayTasks || 0;
  const procUnread = (breakdown && breakdown.procurement) || 0;
  const chatUnread = breakdown
    ? (breakdown.project || 0) + (breakdown.task || 0) + (breakdown['custom-group'] || 0) + (breakdown.direct || 0)
    : (project.unreadMessages || 0);
  const siteUnread = (breakdown && breakdown['site-issue']) || 0;

  const badges = [];
  if (overdue > 0) badges.push({ code: 'T', n: overdue, cls: 'task-overdue' });
  else if (dueToday > 0) badges.push({ code: 'T', n: dueToday, cls: 'task-due' });
  if (project.hasWaitingApproval) badges.push({ code: 'PR', n: procUnread || '!', cls: 'proc-warn' });
  else if (procUnread > 0) badges.push({ code: 'PR', n: procUnread, cls: 'proc-normal' });
  if (chatUnread > 0) badges.push({ code: 'C', n: chatUnread > 99 ? '99+' : chatUnread, cls: 'chat-unread' });
  if (project.hasSiteIssue || siteUnread > 0) badges.push({ code: 'SI', n: siteUnread || '!', cls: 'site-crit' });
  if (!badges.length) return <div className="dps__badges dps__badges--empty" />;
  return (
    <div className={'dps__badges' + (compact ? ' dps__badges--compact' : '')}>
      {badges.map((b, i) => (
        <span key={i} className={'dps__badge dps__badge--' + b.cls}>
          <span className="dps__badge-code">{b.code}</span>
          <span className="dps__badge-n">{b.n}</span>
        </span>
      ))}
    </div>
  );
}

// ── Stat tile (used in popover + dashboard cards) ───────────────────────────
function _StatTile({ label, Glyph, primary, secondary, tone, onClick }) {
  return (
    <button className={'dps__tile dps__tile--' + tone} onClick={onClick} type="button">
      <div className="dps__tile-head">
        <span className="dps__tile-icon"><Glyph size={13} stroke={2} /></span>
        <span className="dps__tile-lbl">{label}</span>
      </div>
      <div className="dps__tile-primary">{primary}</div>
      {secondary && <div className="dps__tile-secondary">{secondary}</div>}
    </button>
  );
}

// ── Derives the at-a-glance numbers from a project ─────────────────────────
function _summarize(project) {
  const breakdown = _DPD && _DPD.getUnreadBreakdown
    ? _DPD.getUnreadBreakdown(project.id)
    : { project: 0, task: 0, procurement: 0, 'site-issue': 0, 'custom-group': 0, direct: 0 };
  const overdue   = project.overdueTasks  || 0;
  const dueToday  = project.dueTodayTasks || 0;
  const tasksTone = overdue > 0 ? 'crit' : dueToday > 0 ? 'warn' : 'ok';
  const tasksPrimary   = overdue > 0 ? overdue + ' overdue'
    : dueToday > 0 ? dueToday + ' due today' : 'On track';
  const tasksSecondary = overdue > 0 && dueToday > 0 ? dueToday + ' due today' : null;

  const procUnread = breakdown.procurement || 0;
  const procTone   = project.hasWaitingApproval ? 'warn' : procUnread > 0 ? 'info' : 'ok';
  const procPrimary   = project.hasWaitingApproval ? 'Needs approval'
    : procUnread > 0 ? procUnread + ' unread' : 'No pending';
  const procSecondary = project.hasWaitingApproval && procUnread > 0 ? procUnread + ' unread' : null;

  const chatUnread = (breakdown.project || 0) + (breakdown['custom-group'] || 0) + (breakdown.direct || 0) + (breakdown.task || 0);
  const chatTone   = chatUnread > 0 ? 'info' : 'ok';
  const chatPrimary   = chatUnread > 0 ? chatUnread + ' unread' : 'All caught up';

  const siteUnread = breakdown['site-issue'] || 0;
  const siteTone   = (project.hasSiteIssue || siteUnread > 0) ? 'crit' : 'ok';
  const sitePrimary   = (project.hasSiteIssue || siteUnread > 0)
    ? (siteUnread > 0 ? siteUnread + ' open' : 'Issue open')
    : 'All clear';

  return {
    tasks:        { tone: tasksTone, primary: tasksPrimary, secondary: tasksSecondary },
    procurement:  { tone: procTone,  primary: procPrimary,  secondary: procSecondary },
    chat:         { tone: chatTone,  primary: chatPrimary,  secondary: null },
    siteIssues:   { tone: siteTone,  primary: sitePrimary,  secondary: null },
  };
}

// ── Needs-attention rows ────────────────────────────────────────────────────
function _AttentionList({ projectId, onPick }) {
  const convs = _dpM(() => {
    if (!_DPD || !_DPD.getProjectConversations) return [];
    return (_DPD.getProjectConversations(projectId) || [])
      .filter(c => c.unreadCount > 0 || c.priorityLevel === 'p1' || c.priorityLevel === 'critical')
      .sort((a, b) => {
        const pa = (a.priorityLevel === 'critical' || a.priorityLevel === 'p1') ? 0 : 1;
        const pb = (b.priorityLevel === 'critical' || b.priorityLevel === 'p1') ? 0 : 1;
        if (pa !== pb) return pa - pb;
        return (b.unreadCount || 0) - (a.unreadCount || 0);
      })
      .slice(0, 4);
  }, [projectId]);

  if (!convs.length) return null;

  const kindMeta = {
    'project':     { Glyph: DpI.chat, tone: 'info' },
    'task':        { Glyph: DpI.task, tone: 'info' },
    'procurement': { Glyph: DpI.proc, tone: 'warn' },
    'site-issue':  { Glyph: DpI.warn, tone: 'crit' },
    'direct':      { Glyph: DpI.chat, tone: 'info' },
  };

  return (
    <div className="dps__att">
      <div className="dps__seclbl">Needs attention</div>
      <div className="dps__att-list">
        {convs.map(c => {
          const meta = kindMeta[c.type] || kindMeta.project;
          const tone = (c.priorityLevel === 'p1' || c.priorityLevel === 'critical') ? 'crit' : meta.tone;
          const sub = c.unreadCount > 0
            ? c.unreadCount + ' unread · ' + (c.lastSender || 'Activity')
            : (c.lastSender || c.type);
          return (
            <button
              key={c.id}
              className={'dps__att-row dps__att-row--' + tone}
              onClick={() => onPick && onPick(c.id)}
              type="button"
            >
              <span className="dps__att-icon"><meta.Glyph size={13} stroke={2} /></span>
              <div className="dps__att-body">
                <div className="dps__att-title">{c.title}</div>
                <div className="dps__att-sub">{sub}</div>
              </div>
              <DpI.chev size={12} stroke={2.2} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Tile grid (shared) ──────────────────────────────────────────────────────
function _TileGrid({ project, onDeepLink }) {
  const s = _summarize(project);
  return (
    <div className="dps__tiles">
      <_StatTile label="Tasks"       Glyph={DpI.task} {...s.tasks}       onClick={() => onDeepLink && onDeepLink('tasks')} />
      <_StatTile label="Procurement" Glyph={DpI.proc} {...s.procurement} onClick={() => onDeepLink && onDeepLink('procurement')} />
      <_StatTile label="Chat"        Glyph={DpI.chat} {...s.chat}        onClick={() => onDeepLink && onDeepLink('chat')} />
      <_StatTile label="Site issues" Glyph={DpI.warn} {...s.siteIssues}  onClick={() => onDeepLink && onDeepLink('site-issue')} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. POPOVER — anchored to a rail row (or centered if no anchor)
// ═══════════════════════════════════════════════════════════════════════════
function DesktopProjectSummary({ project, anchor, onClose, onOpenProject, onDeepLink, presentation = 'popover' }) {
  const ref = _dpR(null);
  const [pos, setPos] = _dpS(null);

  // Compute position once on mount + on resize
  _dpLE(() => {
    if (presentation === 'modal' || !anchor || !ref.current) {
      setPos(null);
      return;
    }
    const compute = () => {
      const ar = anchor.getBoundingClientRect();
      const pw = 340;
      const ph = Math.min(ref.current.offsetHeight, 580);
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      // Anchor to the right of the rail row, centered vertically — clamp to viewport
      let left = ar.right + 8;
      if (left + pw > vw - 12) left = ar.left - pw - 8;
      if (left < 12) left = 12;
      let top = ar.top + ar.height / 2 - ph / 2;
      top = Math.max(12, Math.min(top, vh - ph - 12));
      setPos({ left, top });
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [anchor, presentation]);

  _dpE(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target) && (!anchor || !anchor.contains(e.target))) {
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    // Defer pointerdown so the opening click doesn't immediately close
    const t = setTimeout(() => document.addEventListener('pointerdown', onDown), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [onClose, anchor]);

  if (!project) return null;

  const style = presentation === 'modal'
    ? { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }
    : pos
      ? { left: pos.left, top: pos.top }
      : { left: -9999, top: -9999, visibility: 'hidden' };

  return (
    <>
      {presentation === 'modal' && <div className="dps__scrim" onClick={onClose} aria-hidden="true" />}
      <div
        className={'dps dps--' + presentation}
        style={style}
        ref={ref}
        role="dialog"
        aria-label={project.name + ' summary'}
      >
        {/* Header */}
        <div className="dps__head">
          <_ProjAvatar project={project} size={40} radius={11} />
          <div className="dps__head-text">
            <div className="dps__name">{project.name}</div>
            <div className="dps__sub">{project.manager}</div>
            {project.priorityReason && (
              <div className={'dps__reason dps__reason--' + (project.priorityLevel || 'normal')}>
                {project.priorityReason}
              </div>
            )}
          </div>
          <button className="dps__close" onClick={onClose} aria-label="Close">
            <DpI.close size={12} stroke={2.2} />
          </button>
        </div>

        <div className="dps__body">
          <_TileGrid project={project} onDeepLink={(k) => { onDeepLink && onDeepLink(project.id, k); }} />
          <_AttentionList projectId={project.id} onPick={(cid) => { onDeepLink && onDeepLink(project.id, 'conv', cid); }} />
        </div>

        <div className="dps__foot">
          <button
            className="dps__cta"
            onClick={() => { onOpenProject && onOpenProject(project.id); onClose(); }}
          >
            <span>Open project</span>
            <DpI.open size={12} stroke={2} />
          </button>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. ALL-PROJECTS DASHBOARD — replaces inbox+chat when mode='all'
// ═══════════════════════════════════════════════════════════════════════════
function DesktopAllProjectsGrid({ projects, onOpenProject, onShowSummary }) {
  const [query, setQuery] = _dpS('');
  const q = query.trim().toLowerCase();
  const filtered = q
    ? projects.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.manager || '').toLowerCase().includes(q))
    : projects;

  const groups = [
    { label: 'Critical', items: filtered.filter(p => p.priorityLevel === 'critical') },
    { label: 'Active',   items: filtered.filter(p => p.priorityLevel === 'high'  || (p.priorityLevel === 'normal' && (p.unreadMessages||0) > 0)) },
    { label: 'Quiet',    items: filtered.filter(p => p.priorityLevel === 'normal' && !((p.unreadMessages||0) > 0)) },
  ].filter(g => g.items.length);

  const totals = _dpM(() => {
    let chat = 0, overdue = 0, waiting = 0, issues = 0;
    for (const p of projects) {
      const bk = _DPD.getUnreadBreakdown ? _DPD.getUnreadBreakdown(p.id) : {};
      chat    += (bk.project || 0) + (bk.task || 0) + (bk['custom-group'] || 0);
      overdue += p.overdueTasks || 0;
      if (p.hasWaitingApproval) waiting += 1;
      if (p.hasSiteIssue) issues += 1;
    }
    return { chat, overdue, waiting, issues };
  }, [projects]);

  return (
    <div className="dps-dash">
      <div className="dps-dash__head">
        <div>
          <h1>All projects</h1>
          <p>{projects.length} active · across your workspace</p>
        </div>
        <div className="dps-dash__head-stats">
          <div className="dps-dash__stat"><span className="dps-dash__stat-n">{totals.overdue}</span><span>overdue</span></div>
          <div className="dps-dash__stat"><span className="dps-dash__stat-n">{totals.waiting}</span><span>awaiting approval</span></div>
          <div className="dps-dash__stat"><span className="dps-dash__stat-n">{totals.issues}</span><span>open issues</span></div>
          <div className="dps-dash__stat"><span className="dps-dash__stat-n">{totals.chat}</span><span>unread</span></div>
        </div>
      </div>
      <div className="dps-dash__searchwrap">
        <_DPIc size={14} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>} />
        <input
          type="text"
          className="dps-dash__search"
          placeholder="Search projects…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="dps-dash__searchclr" onClick={() => setQuery('')} aria-label="Clear">✕</button>
        )}
      </div>
      <div className="dps-dash__scroll">
        {groups.length === 0 ? (
          <div className="dps-dash__empty">No projects match "{query}"</div>
        ) : (
          groups.map(g => (
            <div key={g.label} className="dps-dash__group">
              <div className="dps-dash__seclbl">
                <span>{g.label}</span>
                <span className="dps-dash__seclbl-n">{g.items.length}</span>
              </div>
              <div className="dps-dash__grid">
                {g.items.map(p => (
                  <DashCard
                    key={p.id}
                    project={p}
                    onOpen={() => onOpenProject && onOpenProject(p.id)}
                    onShowSummary={(anchor) => onShowSummary && onShowSummary(p.id, anchor)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function DashCard({ project, onOpen, onShowSummary }) {
  const cardRef = _dpR(null);
  const s = _summarize(project);

  return (
    <div className="dps-card" ref={cardRef}>
      <button
        className="dps-card__main"
        onClick={onOpen}
        onContextMenu={(e) => {
          e.preventDefault();
          onShowSummary && onShowSummary(cardRef.current);
        }}
      >
        <div className="dps-card__head">
          <_ProjAvatar project={project} size={36} radius={10} />
          <div className="dps-card__head-text">
            <div className="dps-card__name">{project.name}</div>
            <div className="dps-card__sub">{project.manager}</div>
          </div>
          {project.priorityLevel === 'critical' && (
            <span className="dps-card__prio dps-card__prio--crit" title="Critical" />
          )}
          {project.priorityLevel === 'high' && (
            <span className="dps-card__prio dps-card__prio--high" title="High" />
          )}
        </div>
        <_StatusBadges project={project} compact />
        <div className="dps-card__mini">
          <span className={'dps-card__mini-row dps-card__mini-row--' + s.tasks.tone}>
            <DpI.task size={11} stroke={2} />
            <span>{s.tasks.primary}</span>
          </span>
          <span className={'dps-card__mini-row dps-card__mini-row--' + s.procurement.tone}>
            <DpI.proc size={11} stroke={2} />
            <span>{s.procurement.primary}</span>
          </span>
        </div>
      </button>
      <button
        className="dps-card__info"
        onClick={(e) => { e.stopPropagation(); onShowSummary && onShowSummary(cardRef.current); }}
        aria-label={'Project summary — ' + project.name}
        title="View summary"
      >
        <DpI.info size={13} stroke={2} />
      </button>
    </div>
  );
}

// ── Exports ────────────────────────────────────────────────────────────────
window.MC = window.MC || {};
window.MC.DesktopProjectSummary = DesktopProjectSummary;
window.MC.DesktopAllProjectsGrid = DesktopAllProjectsGrid;
