// Phone project summary — bottom sheet shown when user taps the (i) handle
// or long-presses a project card in the Detailed Grid variant.
//
// Three sections, deliberately slim:
//   1. Header (avatar / name / manager / close)
//   2. At-a-glance — 2×2 stat tiles (Tasks · Procurement · Chat · Site Issues)
//   3. Needs attention — specific actionable items, tap to deep-link

const { useState: psUseState, useEffect: psUseEffect, useMemo: psUseMemo, useRef: psUseRef } = React;
const PSD = window.MeccaData;

const _PSI = ({ d, size = 16, stroke = 1.8, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const PsI = {
  close: p => <_PSI {...p} d={<><path d="M18 6 6 18M6 6l12 12"/></>} />,
  task:  p => <_PSI {...p} d={<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m7 12 2 2 3-4"/></>} />,
  proc:  p => <_PSI {...p} d={<><path d="M2 3h2l3 12h13l3-9H6.5"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></>} />,
  chat:  p => <_PSI {...p} d={<><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"/></>} />,
  warn:  p => <_PSI {...p} d={<><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>} />,
  chev:  p => <_PSI {...p} d={<><path d="m9 6 6 6-6 6"/></>} />,
  pin:   p => <_PSI {...p} d={<><path d="M12 17v5"/><path d="M9 9V4l-2-2h10l-2 2v5l3 4H6z"/></>} />,
  open:  p => <_PSI {...p} d={<><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></>} />,
};

// ── Tile (one of the 2×2) ──────────────────────────────────────────────────
function StatTile({ kind, label, Glyph, primary, secondary, tone, onClick }) {
  return (
    <button
      className={'ph-psum__tile ph-psum__tile--' + tone}
      onClick={onClick}
      type="button"
    >
      <div className="ph-psum__tile-head">
        <span className="ph-psum__tile-icon"><Glyph size={14} stroke={2} /></span>
        <span className="ph-psum__tile-lbl">{label}</span>
      </div>
      <div className="ph-psum__tile-primary">{primary}</div>
      {secondary && <div className="ph-psum__tile-secondary">{secondary}</div>}
    </button>
  );
}

// ── Needs-attention row ────────────────────────────────────────────────────
function AttentionRow({ Glyph, title, sub, tone, onClick }) {
  return (
    <button className={'ph-psum__att-row ph-psum__att-row--' + tone} onClick={onClick} type="button">
      <span className="ph-psum__att-icon"><Glyph size={14} stroke={2} /></span>
      <div className="ph-psum__att-body">
        <div className="ph-psum__att-title">{title}</div>
        {sub && <div className="ph-psum__att-sub">{sub}</div>}
      </div>
      <PsI.chev size={14} stroke={2.2} />
    </button>
  );
}

// ── Main sheet ─────────────────────────────────────────────────────────────
function PhoneProjectSummary({ project, onClose, onOpenProject, onDeepLink }) {
  psUseEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!project) return null;
  const hue = project.hue ?? 220;

  // Breakdown of unread per conversation kind for this project
  const breakdown = PSD && PSD.getUnreadBreakdown
    ? PSD.getUnreadBreakdown(project.id)
    : { project: 0, task: 0, procurement: 0, 'site-issue': 0, direct: 0 };

  // ── Stat values + tone derivation ─────────────────────────────────────
  const overdue   = project.overdueTasks   || 0;
  const dueToday  = project.dueTodayTasks  || 0;
  const tasksTone = overdue > 0 ? 'crit' : dueToday > 0 ? 'warn' : 'ok';
  const tasksPrimary   = overdue > 0
    ? overdue + ' overdue'
    : dueToday > 0 ? dueToday + ' due today' : 'On track';
  const tasksSecondary = overdue > 0 && dueToday > 0 ? dueToday + ' due today' : null;

  const procUnread = breakdown.procurement || 0;
  const procTone   = project.hasWaitingApproval ? 'warn' : procUnread > 0 ? 'info' : 'ok';
  const procPrimary   = project.hasWaitingApproval
    ? 'Needs approval'
    : procUnread > 0 ? procUnread + ' unread' : 'No pending';
  const procSecondary = project.hasWaitingApproval && procUnread > 0
    ? procUnread + ' unread' : null;

  const chatUnread = (breakdown.project || 0) + (breakdown.direct || 0) + (breakdown.task || 0);
  const chatTone   = chatUnread > 0 ? 'info' : 'ok';
  const chatPrimary   = chatUnread > 0 ? chatUnread + ' unread' : 'All caught up';

  const siteUnread = breakdown['site-issue'] || 0;
  const siteTone   = (project.hasSiteIssue || siteUnread > 0) ? 'crit' : 'ok';
  const sitePrimary   = (project.hasSiteIssue || siteUnread > 0)
    ? (siteUnread > 0 ? siteUnread + ' open' : 'Issue open')
    : 'All clear';

  // ── Needs-attention items: pull specific conversations ────────────────
  const attention = psUseMemo(() => {
    if (!PSD || !PSD.getProjectConversations) return [];
    const convs = PSD.getProjectConversations(project.id) || [];
    // Rank: priority crit/p1 first, then by unread count
    const ranked = [...convs]
      .filter(c => c.unreadCount > 0 || c.priorityLevel === 'p1' || c.priorityLevel === 'critical')
      .sort((a, b) => {
        const pa = (a.priorityLevel === 'critical' || a.priorityLevel === 'p1') ? 0 : 1;
        const pb = (b.priorityLevel === 'critical' || b.priorityLevel === 'p1') ? 0 : 1;
        if (pa !== pb) return pa - pb;
        return (b.unreadCount || 0) - (a.unreadCount || 0);
      })
      .slice(0, 4);
    return ranked;
  }, [project.id]);

  const convKindMeta = {
    'project':      { Glyph: PsI.chat, label: 'Chat',        tone: 'info' },
    'task':         { Glyph: PsI.task, label: 'Task',        tone: 'info' },
    'procurement':  { Glyph: PsI.proc, label: 'Procurement', tone: 'warn' },
    'site-issue':   { Glyph: PsI.warn, label: 'Site issue',  tone: 'crit' },
    'direct':       { Glyph: PsI.chat, label: 'Direct',      tone: 'info' },
  };

  return (
    <>
      <div className="ph-psum__scrim" onClick={onClose} aria-hidden="true" />
      <div className="ph-psum" role="dialog" aria-label={`${project.name} summary`}>
        <div className="ph-psum__grabber" />

        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="ph-psum__head">
          <div
            className="ph-psum__avatar"
            style={{
              background: `oklch(0.42 0.10 ${hue})`,
              color: `oklch(0.95 0.12 ${hue})`,
              boxShadow: `inset 0 0 0 1px oklch(0.60 0.14 ${hue} / 0.40)`,
            }}
          >
            {project.initials}
            {project.priorityLevel === 'critical' && (
              <span className="ph-psum__avatar-prio" aria-hidden="true" />
            )}
          </div>
          <div className="ph-psum__head-text">
            <div className="ph-psum__name">{project.name}</div>
            <div className="ph-psum__sub">{project.manager}</div>
            {project.priorityReason && (
              <div className="ph-psum__reason">{project.priorityReason}</div>
            )}
          </div>
          <button className="ph-psum__close" onClick={onClose} aria-label="Close">
            <PsI.close size={14} stroke={2.2} />
          </button>
        </div>

        <div className="ph-psum__scroll">
          {/* ── Stat tiles ──────────────────────────────────────────── */}
          <div className="ph-psum__tiles">
            <StatTile
              kind="task"
              label="Tasks"
              Glyph={PsI.task}
              primary={tasksPrimary}
              secondary={tasksSecondary}
              tone={tasksTone}
              onClick={() => { onDeepLink && onDeepLink('tasks'); onClose(); }}
            />
            <StatTile
              kind="procurement"
              label="Procurement"
              Glyph={PsI.proc}
              primary={procPrimary}
              secondary={procSecondary}
              tone={procTone}
              onClick={() => { onDeepLink && onDeepLink('procurement'); onClose(); }}
            />
            <StatTile
              kind="chat"
              label="Chat"
              Glyph={PsI.chat}
              primary={chatPrimary}
              tone={chatTone}
              onClick={() => { onDeepLink && onDeepLink('chat'); onClose(); }}
            />
            <StatTile
              kind="site-issue"
              label="Site issues"
              Glyph={PsI.warn}
              primary={sitePrimary}
              tone={siteTone}
              onClick={() => { onDeepLink && onDeepLink('site-issue'); onClose(); }}
            />
          </div>

          {/* ── Needs attention ─────────────────────────────────────── */}
          {attention.length > 0 && (
            <div className="ph-psum__section">
              <div className="ph-psum__seclbl">Needs attention</div>
              <div className="ph-psum__att-list">
                {attention.map(c => {
                  const meta = convKindMeta[c.type] || convKindMeta.project;
                  const tone = (c.priorityLevel === 'p1' || c.priorityLevel === 'critical')
                    ? 'crit' : meta.tone;
                  const sub = c.unreadCount > 0
                    ? c.unreadCount + ' unread · ' + (c.lastSender || 'Activity')
                    : (c.lastSender || meta.label);
                  return (
                    <AttentionRow
                      key={c.id}
                      Glyph={meta.Glyph}
                      title={c.title}
                      sub={sub}
                      tone={tone}
                      onClick={() => { onDeepLink && onDeepLink('conv', c.id); onClose(); }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer CTA ─────────────────────────────────────────── */}
        <div className="ph-psum__foot">
          <button
            className="ph-psum__cta"
            onClick={() => { onOpenProject && onOpenProject(project.id); onClose(); }}
          >
            <span>Switch to project</span>
            <PsI.open size={14} stroke={2} />
          </button>
        </div>
      </div>
    </>
  );
}

window.PMC = window.PMC || {};
window.PMC.PhoneProjectSummary = PhoneProjectSummary;
