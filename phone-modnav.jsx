// Phone module navigation — Linear-style floating pill at the bottom +
// separated "more" button that opens a popover sheet listing all modules.
// Modules match the desktop topnav: Home · Calendar · Admin · Procurement
// · Chat · Files. The 4 most-used modules sit in the pill; the rest live
// in the more sheet (which also lists everything for completeness).

const { useState: mnS, useEffect: mnE, useRef: mnR } = React;

// ── Local icon set ─────────────────────────────────────────────────────────
const _MnIc = ({ d, size = 20, stroke = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const MnI = {
  home:     p => <_MnIc {...p} d={<><path d="m3 11 9-8 9 8"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/></>} />,
  calendar: p => <_MnIc {...p} d={<><rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9.5h18"/><path d="M8 2.5v4M16 2.5v4"/></>} />,
  admin:    p => <_MnIc {...p} d={<><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/><path d="m9 12 2 2 4-4"/></>} />,
  procure:  p => <_MnIc {...p} d={<><path d="M2 3h2l3 12h13l3-9H6.5"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></>} />,
  chat:     p => <_MnIc {...p} d={<><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"/></>} />,
  files:    p => <_MnIc {...p} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>} />,
  more:     p => <_MnIc {...p} d={<><path d="M21 3v6h-6"/><path d="M3 21v-6h6"/><path d="M21 3 13 11"/><path d="M3 21l8-8"/></>} />,
  chevDown: p => <_MnIc {...p} d={<><path d="m6 9 6 6 6-6"/></>} />,
  chevRight:p => <_MnIc {...p} d={<><path d="m9 18 6-6-6-6"/></>} />,
  search:   p => <_MnIc {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>} />,
  settings: p => <_MnIc {...p} d={<><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4.8a7 7 0 0 0-2.1-1.2L14 3h-4l-.4 2.4a7 7 0 0 0-2.1 1.2l-2.4-.8-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-.8a7 7 0 0 0 2.1 1.2L10 21h4l.4-2.4a7 7 0 0 0 2.1-1.2l2.4.8 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z"/></>} />,
  info:     p => <_MnIc {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></>} />,
  grid:     p => <_MnIc {...p} d={<><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></>} />,
  list:     p => <_MnIc {...p} d={<><path d="M8 6h12"/><path d="M8 12h12"/><path d="M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></>} />,
  pin:      p => <_MnIc {...p} d={<><path d="M12 17v5"/><path d="M7 17h10"/><path d="M8 3h8l-1 7 3 3v4H6v-4l3-3-1-7z"/></>} />,
  // Navigation modules (More sheet)
  folder:   p => <_MnIc {...p} d={<><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></>} />,
  users:    p => <_MnIc {...p} d={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />,
  note:     p => <_MnIc {...p} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h6M8 17h4"/></>} />,
  todo:     p => <_MnIc {...p} d={<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m7 12 2 2 3-4"/><path d="M14 13h4M14 16h3"/></>} />,
  dollar:   p => <_MnIc {...p} d={<><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>} />,
  // Create-action glyphs
  plus:        p => <_MnIc {...p} d={<><path d="M12 5v14M5 12h14"/></>} />,
  taskCircle:  p => <_MnIc {...p} d={<><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>} />,
  taskSquare:  p => <_MnIc {...p} d={<><rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8 12 3 3 5-6"/></>} />,
  alert:       p => <_MnIc {...p} d={<><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>} />,
  package:     p => <_MnIc {...p} d={<><path d="M21 8.5 12 3 3 8.5v7L12 21l9-5.5z"/><path d="m3.4 8.8 8.6 5.1 8.6-5.1"/><path d="M12 21v-7.1"/></>} />,
  truck:       p => <_MnIc {...p} d={<><path d="M3 6h10v9H3z"/><path d="M13 9h4l4 4v2h-8z"/><path d="M5.5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M17.5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M13 15H7.5"/><path d="M15 9v4h5"/></>} />,
  folderPlus:  p => <_MnIc {...p} d={<><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 11v6M9 14h6"/></>} />,
  userPlus:    p => <_MnIc {...p} d={<><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></>} />,
  boxPlus:     p => <_MnIc {...p} d={<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l4-2.3"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/><path d="M19 17v6M22 20h-6"/></>} />,
  // AI sparkles
  sparkles: p => <_MnIc {...p} d={<><path d="M12 3v3M12 18v3M5 12H2M22 12h-3M19 5l-2 2M7 17l-2 2M19 19l-2-2M7 7 5 5"/><circle cx="12" cy="12" r="3.4"/></>} />,
};

// Module config — order matches desktop topnav.
const ALL_MODULES = [
  { id: 'home',      label: 'Home',        Glyph: MnI.home,     count: 0  },
  { id: 'calendar',  label: 'Calendar',    Glyph: MnI.calendar, count: 2  },
  { id: 'admin',     label: 'Admin',       Glyph: MnI.admin,    count: 0  },
  { id: 'procure',   label: 'Procurement', Glyph: MnI.procure,  count: 3  },
  { id: 'chat',      label: 'Chat',        Glyph: MnI.chat,     count: 12 },
  { id: 'files',     label: 'Files',       Glyph: MnI.files,    count: 0  },
  // Modules accessible only via the More sheet's Navigation section
  { id: 'projects',  label: 'Projects',    Glyph: MnI.folder,   count: 0  },
  { id: 'employees', label: 'Employees',   Glyph: MnI.users,    count: 0  },
  { id: 'quicknote', label: 'Quick Note',  Glyph: MnI.note,     count: 0  },
  { id: 'todo',      label: 'ToDo',        Glyph: MnI.todo,     count: 3  },
  { id: 'finances',  label: 'Finances',    Glyph: MnI.dollar,   count: 0  },
];
// Pill shows the 4 most-frequent modules. Chat lives in the top-right pill
// (chat icon next to the bell); secondary modules live behind the "more" sheet.
const PILL_MODULES = ['home', 'calendar', 'procure'];
// Navigation items rendered in the More sheet (everything not in the pill,
// and not in the existing top/bottom chrome). Files lives here so the
// native nav stays to three roomy tabs.
const MORE_NAV_MODULES = ['files', 'projects', 'employees', 'quicknote', 'todo', 'finances'];
// Create actions shown above the navigation list in the More sheet.
const CREATE_ACTIONS = [
  { id: 'new-task',         label: 'New task',         Glyph: MnI.taskCircle, hue: 220 },
  { id: 'new-project',      label: 'New project',      Glyph: MnI.folderPlus, hue: 155 },
  { id: 'add-employee',     label: 'Add employee',     Glyph: MnI.userPlus,   hue: 290 },
  { id: 'new-procurement',  label: 'New procurement',  Glyph: MnI.boxPlus,    hue: 35  },
];

// ── Floating top-right action pill (chat + bell) ──────────────────────────
// Replaces the always-visible top bar. Sits floating at top-right over
// content. Project switching now lives behind the "more" sheet's Mecca row.
function PhoneFloatActions({ onChat, onTransfer, onNote, onBell, unread = 0 }) {
  // Backwards-compat: prefer onChat; fall back to legacy props
  const handleChat = onChat || onTransfer || onNote;
  return (
    <div className="ph-fab-top" role="toolbar" aria-label="Quick actions">
      <button className="ph-fab-top__btn" onClick={handleChat} aria-label="Open chat">
        <MnI.chat size={18} stroke={1.7} />
      </button>
      <div className="ph-fab-top__sep" />
      <button className="ph-fab-top__btn" onClick={onBell} aria-label="Notifications">
        <_MnIc size={18} stroke={1.7} d={<><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9z"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>} />
        {unread > 0 && <span className="ph-fab-top__dot">{unread > 9 ? '9+' : unread}</span>}
      </button>
    </div>
  );
}

// ── Project chip (top-bar "where am I" pill, opens project picker) ────────
// Lives inside each screen's top bar. Shows the current project (colored
// bubble + name + chevron) — or the Mecca workspace logo when no project
// is selected. Tap to open the project picker sheet.
function PhoneProjectChip({ project, onClick, screen, compact = false }) {
  const isWS = !project;
  const hue = (project && project.hue) || 220;
  const initials = (project && project.initials) || 'M';

  let primary, secondary;
  if (project) {
    primary = project.name;
    secondary = screen || project.priorityReason || (project.manager || 'Active');
  } else {
    primary = 'All Projects';
    secondary = screen || 'Mecca';
  }

  const ariaLabel = `Switch project · currently ${primary}`;

  return (
    <button
      className={
        'ph-projchip' +
        (compact ? ' ph-projchip--compact' : '') +
        (isWS ? ' ph-projchip--ws' : '')
      }
      onClick={onClick}
      aria-label={ariaLabel}
      aria-haspopup="dialog"
    >
      <span
        className={'ph-projchip__bubble' + (isWS ? ' ph-projchip__bubble--ws' : '')}
        style={isWS ? undefined : {
          background: `oklch(0.36 0.08 ${hue})`,
          color: `oklch(0.94 0.09 ${hue})`,
          boxShadow: `inset 0 0 0 1px oklch(0.55 0.12 ${hue} / 0.35)`,
        }}
      >
        <span className="ph-projchip__initials">{initials}</span>
        {project && project.priorityLevel === 'critical' && (
          <span className="ph-projchip__prio ph-projchip__prio--crit" aria-hidden="true" />
        )}
        {project && project.priorityLevel === 'high' && (
          <span className="ph-projchip__prio ph-projchip__prio--high" aria-hidden="true" />
        )}
      </span>
      <span className="ph-projchip__text">
        <span className="ph-projchip__row">
          <span className="ph-projchip__name">{primary}</span>
          <MnI.chevDown size={13} stroke={2.2} />
        </span>
        {secondary && <span className="ph-projchip__sub">{secondary}</span>}
      </span>
    </button>
  );
}

// ── Project picker sheet (bottom sheet) ────────────────────────────────────
// Four variants, selectable via Tweaks:
//   refined — lighter selected state, brighter avatars, real search
//   recent  — recent strip on top, then groups (default)
//   grid    — 2-column card grid, fastest scan
//   detail  — 2-column grid + status badges + ⓘ handle + long-press → summary

// Long-press helper — returns pointer handlers + a "click-was-press" flag.
// 500ms is the iOS default for context menus and feels natural for a card.
function useLongPress(onLongPress, ms = 500) {
  const tRef = mnR(null);
  const triggered = mnR(false);
  const elRef = mnR(null);
  const start = (e) => {
    triggered.current = false;
    if (e.currentTarget) {
      elRef.current = e.currentTarget;
      e.currentTarget.classList.add('is-pressing');
    }
    tRef.current = setTimeout(() => {
      triggered.current = true;
      if (elRef.current) elRef.current.classList.remove('is-pressing');
      onLongPress();
    }, ms);
  };
  const cancel = () => {
    if (tRef.current) {
      clearTimeout(tRef.current);
      tRef.current = null;
    }
    if (elRef.current) {
      elRef.current.classList.remove('is-pressing');
      elRef.current = null;
    }
  };
  return {
    bind: {
      onPointerDown:   start,
      onPointerUp:     cancel,
      onPointerLeave:  cancel,
      onPointerCancel: cancel,
      onContextMenu:   (e) => e.preventDefault(),
    },
    didTrigger: () => triggered.current,
  };
}

// ── Status badges (icons + count) — only non-zero ─────────────────────────
function StatusBadges({ project }) {
  const breakdown = PSD && PSD.getUnreadBreakdown
    ? PSD.getUnreadBreakdown(project.id)
    : null;
  const overdue   = project.overdueTasks  || 0;
  const dueToday  = project.dueTodayTasks || 0;
  const procUnread = (breakdown && breakdown.procurement) || 0;
  const chatUnread = breakdown
    ? (breakdown.project || 0) + (breakdown.task || 0) + (breakdown.direct || 0)
    : (project.unreadMessages || 0);
  const siteUnread = (breakdown && breakdown['site-issue']) || 0;
  const numericCount = (value, fallback = 1) => {
    const count = Number(value || 0);
    return count > 0 ? count : fallback;
  };

  const badges = [];
  if (overdue > 0) {
    badges.push({ Icon: MnI.taskSquare, n: overdue, cls: 'task-overdue', label: `${overdue} overdue tasks` });
  } else if (dueToday > 0) {
    badges.push({ Icon: MnI.taskSquare, n: dueToday, cls: 'task-due', label: `${dueToday} tasks due today` });
  }
  if (project.hasWaitingApproval) {
    const count = numericCount(procUnread);
    badges.push({ Icon: MnI.truck, n: count, cls: 'proc-warn', label: `${count} procurement approvals pending` });
  } else if (procUnread > 0) {
    badges.push({ Icon: MnI.truck, n: procUnread, cls: 'proc-normal', label: `${procUnread} procurement messages` });
  }
  if (chatUnread > 0) {
    badges.push({ Icon: MnI.chat, n: chatUnread, cls: 'chat-unread', label: `${chatUnread} chat messages` });
  }
  if (project.hasSiteIssue || siteUnread > 0) {
    const count = numericCount(siteUnread);
    badges.push({ Icon: MnI.alert, n: count, cls: 'site-crit', label: `${count} site issues need attention` });
  }
  if (!badges.length) return null;
  return (
    <div className="ph-projsheet__badges">
      {badges.map((b, i) => (
        <span key={i} className={'ph-projsheet__badge ph-projsheet__badge--' + b.cls} title={b.label} aria-label={b.label}>
          <span className="ph-projsheet__badge-icon"><b.Icon size={11} stroke={2.2} /></span>
          <span className="ph-projsheet__badge-n">{b.n}</span>
        </span>
      ))}
    </div>
  );
}

// PSD — shared data accessor (window.MeccaData)
const PSD = window.MeccaData;
const PINNED_PROJECT_IDS = new Set(['pp1', 'pp2', 'pp8', 'pp12']);
const COMPLETED_PROJECT_IDS = new Set(['pp13', 'pp15']);
const PROJECT_COMPANIES = {
  pp1: 'Mecca Construction',
  pp2: 'Downtown Retail Group',
  pp3: 'North Miami Partners',
  pp4: 'Wynwood Hospitality',
  pp5: 'Brickell Residential',
  pp6: 'Coral Gables Estates',
  pp7: 'Design Studio Group',
  pp8: 'Warehouse Holdings',
  pp9: 'Sunset Harbor Development',
  pp10: 'Midtown Medical Group',
  pp11: 'Overtown Partners',
  pp12: 'Bayfront Hotel Group',
  pp13: 'Edgewater Residences',
  pp14: 'Airport Logistics Co.',
  pp15: 'Lincoln Road Retail',
};
const PROJECT_PHASES = {
  pp1: ['construction', 'closeout'],
  pp2: ['construction'],
  pp3: ['preconstruction'],
  pp4: ['construction'],
  pp5: ['preconstruction'],
  pp6: ['construction', 'closeout'],
  pp7: ['preconstruction'],
  pp8: ['preconstruction', 'construction'],
  pp9: ['preconstruction'],
  pp10: ['construction'],
  pp11: ['preconstruction'],
  pp12: ['construction', 'closeout'],
  pp13: ['closeout'],
  pp14: ['construction'],
  pp15: ['closeout'],
};
const PROJECT_PHASE_LABELS = {
  preconstruction: 'Pre-construction',
  construction: 'Construction',
  closeout: 'Closeout',
};
const PROJECT_PHASE_SHORT_LABELS = {
  preconstruction: 'Pre-con',
  construction: 'Construction',
  closeout: 'Closeout',
};

function projectCompany(p) {
  return p.company || p.client || PROJECT_COMPANIES[p.id] || 'Mecca Construction';
}

function projectPhases(p) {
  const phases = p.phases || p.phase || PROJECT_PHASES[p.id] || ['construction'];
  return Array.isArray(phases) ? phases : [phases];
}

function PhasePills({ project, compact = false }) {
  const phases = projectPhases(project);
  return (
    <div className="ph-projsheet__phases" aria-label={'Project phases: ' + phases.map(phase => PROJECT_PHASE_LABELS[phase] || phase).join(', ')}>
      {phases.map(phase => {
        const label = compact
          ? (PROJECT_PHASE_SHORT_LABELS[phase] || PROJECT_PHASE_LABELS[phase] || phase)
          : (PROJECT_PHASE_LABELS[phase] || phase);
        return (
          <span key={phase} className="ph-projsheet__phase">
            {label}
          </span>
        );
      })}
    </div>
  );
}

function projectFolderKind(p) {
  const name = p.name.toLowerCase();
  const phases = projectPhases(p);
  if (COMPLETED_PROJECT_IDS.has(p.id) || (phases.length === 1 && phases.includes('closeout'))) return 'closeout';
  if (name.includes('warehouse') || name.includes('cargo') || name.includes('terminal')) return 'industrial';
  if (name.includes('retail') || name.includes('restaurant') || name.includes('pop-up')) return 'retail';
  return 'construction';
}

function projectFolderState(p) {
  if (p.hasSiteIssue) return 'site';
  if (p.hasWaitingApproval) return 'procurement';
  return 'normal';
}

function projectFolderCardClass(p, isSel) {
  const photoClass = p.id === 'pp1'
    ? 'has-photo-bg has-photo-mecca'
    : p.id === 'pp2'
      ? 'has-photo-bg has-photo-downtown'
      : '';
  return [
    'ph-projsheet__gridcard',
    'ph-projsheet__foldercard',
    isSel ? 'is-sel' : '',
    photoClass,
    'is-type-' + projectFolderKind(p),
    'is-state-' + projectFolderState(p),
  ].filter(Boolean).join(' ');
}

function projectUrgencyText(p) {
  if (p.hasSiteIssue) return 'Site issue needs attention';
  if (p.hasWaitingApproval) return 'Procurement approval pending';
  if ((p.overdueTasks || 0) > 0) return `${p.overdueTasks} overdue tasks`;
  if ((p.dueTodayTasks || 0) > 0) return `${p.dueTodayTasks} due today`;
  if ((p.unreadMessages || 0) > 0) return projectLastUpdateText(p);
  return 'Next: Review project status';
}

function projectLastUpdateText(p) {
  return (p.unreadMessages || 0) > 0
    ? `Updated ${Math.max(1, Math.min(8, p.unreadMessages))}h ago`
    : 'No recent updates';
}

function projectAttentionSections(p) {
  const breakdown = PSD && PSD.getUnreadBreakdown
    ? PSD.getUnreadBreakdown(p.id)
    : {};
  const overdue = p.overdueTasks || 0;
  const dueToday = p.dueTodayTasks || 0;
  const procurementUnread = (breakdown && breakdown.procurement) || 0;
  const siteUnread = (breakdown && breakdown['site-issue']) || 0;
  const taskUnread = (breakdown && breakdown.task) || 0;
  const projectUnread = (breakdown && breakdown.project) || 0;
  const chatUnread = p.unreadMessages || 0;
  const sections = [];
  const taskSignals = overdue + dueToday + taskUnread;
  const procurementSignals = procurementUnread + (p.hasWaitingApproval ? 1 : 0);
  const siteSignals = siteUnread + (p.hasSiteIssue ? 1 : 0);
  const chatSignals = chatUnread + projectUnread + taskUnread;

  if (taskSignals > 0) {
    sections.push({
      title: 'Tasks',
      Icon: MnI.taskSquare,
      tone: 'task',
      items: [
        `${overdue || 0} overdue`,
        `${dueToday || 0} due today`,
        taskUnread ? `${taskUnread} task-linked chats` : 'No assigned action',
      ],
    });
  }

  if (procurementSignals > 0) {
    sections.push({
      title: 'Procurement',
      Icon: MnI.truck,
      tone: 'procurement',
      items: [
        p.hasWaitingApproval ? 'Approval pending' : 'No approval blocker',
        `${Math.max(procurementUnread, p.hasWaitingApproval ? 2 : 0)} visible signals`,
        p.hasWaitingApproval ? 'Quote/order needs review' : 'Requests progressing',
      ],
    });
  }

  if (siteSignals > 0) {
    sections.push({
      title: 'Site Issues',
      Icon: MnI.alert,
      tone: 'site',
      items: [
        p.hasSiteIssue ? 'Unresolved issue open' : 'No open issue',
        `${Math.max(siteUnread, p.hasSiteIssue ? 1 : 0)} needs response`,
        p.hasSiteIssue ? 'New update needs review' : 'No new media',
      ],
    });
  }

  if (chatSignals > 0) {
    sections.push({
      title: 'Chat',
      Icon: MnI.chat,
      tone: 'chat',
      items: [
        `${chatUnread} unread work chats`,
        `${projectUnread || 0} project chat updates`,
        taskUnread ? `${taskUnread} task-linked chats` : 'No new mentions',
      ],
    });
  }

  return sections;
}

function needsProjectAttention(p) {
  return Boolean(
    p.priorityLevel === 'critical' ||
    p.hasBlocker ||
    p.hasWaitingApproval ||
    p.hasSiteIssue ||
    (p.overdueTasks || 0) > 0
  );
}

function projectPickerGroups(items, pinnedIds = PINNED_PROJECT_IDS) {
  const used = new Set();
  const take = (predicate) => items.filter((p) => {
    if (used.has(p.id) || !predicate(p)) return false;
    used.add(p.id);
    return true;
  });

  const pinned = take((p) => pinnedIds.has(p.id) && !COMPLETED_PROJECT_IDS.has(p.id));
  const attention = take((p) => needsProjectAttention(p) && !COMPLETED_PROJECT_IDS.has(p.id));
  const active = take((p) => !COMPLETED_PROJECT_IDS.has(p.id) && ((p.unreadMessages || 0) > 0 || (p.dueTodayTasks || 0) > 0 || p.priorityLevel === 'high'));
  const quiet = take((p) => !COMPLETED_PROJECT_IDS.has(p.id));
  const completed = take((p) => COMPLETED_PROJECT_IDS.has(p.id));

  return [
    { label: 'Pinned', items: pinned },
    { label: 'Needs Attention', items: attention },
    { label: 'Active', items: active },
    { label: 'Quiet', items: quiet },
    { label: 'Completed', items: completed, collapsed: true },
  ].filter(g => g.items.length);
}

// ── DetailGridCard — Detailed Grid variant card ───────────────────────────
// Tap card        → switch project
// Tap ⓘ handle    → open summary sheet
// Long-press card → open summary sheet (same destination)
function DetailGridCard({ p, isSel, Bubble, onSelect, onShowSummary, onLongPress, isExpanded, onToggleExpanded, showDetailsBar = false }) {
  const lp = useLongPress(() => onLongPress && onLongPress(p), 500);
  const cardClass = projectFolderCardClass(p, isSel) + (showDetailsBar && isExpanded ? ' is-expanded' : '');
  const toggleDetails = (e) => {
    e.stopPropagation();
    onToggleExpanded && onToggleExpanded(p.id);
  };
  const toggleDetailsFromKey = (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    e.stopPropagation();
    onToggleExpanded && onToggleExpanded(p.id);
  };
  return (
    <button
      className={cardClass}
      onClick={() => { if (!lp.didTrigger()) onSelect(); }}
      {...lp.bind}
    >
      <div className="ph-projsheet__foldertab">{projectCompany(p)}</div>
      <span
        className="ph-projsheet__infohandle"
        role="button"
        tabIndex={0}
        onClick={(e) => { e.stopPropagation(); onShowSummary && onShowSummary(); }}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label={'Project summary — ' + p.name}
        title="View summary"
      ><MnI.info size={16} stroke={1.9} /></span>
      <div className="ph-projsheet__foldernav" aria-hidden="true">
        {isSel ? (
          <_MnIc size={14} stroke={2.4} d={<><path d="m5 12 5 5L20 7"/></>} />
        ) : (
          <MnI.chevRight size={16} stroke={2.1} />
        )}
      </div>
      <div className="ph-projsheet__gridcard-head">
        <Bubble p={p} size={34} />
      </div>
      <div className="ph-projsheet__gridcard-body">
        <div className="ph-projsheet__gridcard-company">{projectCompany(p)}</div>
        <div className="ph-projsheet__gridcard-name">{p.name}</div>
        <div className="ph-projsheet__gridcard-sub">{p.manager || 'Active'}</div>
      </div>
      <div className="ph-projsheet__folderfooter">
        <StatusBadges project={p} />
        <PhasePills project={p} compact />
      </div>
      {showDetailsBar && (
      <div
        className="ph-projsheet__folderinfobar"
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={toggleDetails}
        onKeyDown={toggleDetailsFromKey}
        onPointerDown={(e) => e.stopPropagation()}
        title={isExpanded ? 'Hide details' : 'Show details'}
      >
        <span>Details <b>·</b> {projectLastUpdateText(p)}</span>
        <span className={'ph-projsheet__folderinfobar-chev' + (isExpanded ? ' is-open' : '')} aria-hidden="true">
          <MnI.chevDown size={13} stroke={2.1} />
        </span>
      </div>
      )}
      {showDetailsBar && isExpanded && (
        <div className="ph-projsheet__folderdrawer">
          <div className="ph-projsheet__folderdrawer-sections">
            {projectAttentionSections(p).map(({ title, Icon, tone, items }) => (
              <div key={title} className={'ph-projsheet__folderdetail ph-projsheet__folderdetail--' + tone}>
                <div className="ph-projsheet__folderdetail-head">
                  <Icon size={12} stroke={2.1} />
                  <span>{title}</span>
                </div>
                {items.map((item) => (
                  <div key={item} className="ph-projsheet__folderdetail-item">{item}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      {isSel && (
        <span className="ph-projsheet__check ph-projsheet__check--card" aria-label="Currently selected">
          <_MnIc size={12} stroke={2.4} d={<><path d="m5 12 5 5L20 7"/></>} />
        </span>
      )}
    </button>
  );
}

function StatusListRow({ p, isSel, Bubble, onSelect, onShowSummary, onLongPress }) {
  const lp = useLongPress(() => onLongPress && onLongPress(p), 500);
  return (
    <button
      className={'ph-projsheet__statusrow' + (isSel ? ' is-sel' : '')}
      onClick={() => { if (!lp.didTrigger()) onSelect(); }}
      {...lp.bind}
    >
      {isSel && <span className="ph-projsheet__selbar" aria-hidden="true" />}
      <Bubble p={p} size={38} />
      <div className="ph-projsheet__statusrow-main">
        <div className="ph-projsheet__statusrow-top">
          <div className="ph-projsheet__statusrow-copy">
            <div className="ph-projsheet__statusrow-company">{projectCompany(p)}</div>
            <div className="ph-projsheet__statusrow-title">{p.name}</div>
          </div>
          <span
            className="ph-projsheet__statusrow-info"
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onShowSummary && onShowSummary(); }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label={'Project summary — ' + p.name}
            title="View summary"
          ><MnI.info size={16} stroke={1.9} /></span>
        </div>
        <div className="ph-projsheet__statusrow-sub">
          <span>{p.manager || 'Active'}</span>
        </div>
        <PhasePills project={p} />
        <StatusBadges project={p} />
      </div>
    </button>
  );
}

function PhoneProjectSheet({ projects, currentProjectId, onSelect, onClose, onShowSummary, onOpenSettings, variant: variantProp }) {
  // Allow tweak override at render time without prop-drilling
  const rawVariant = variantProp || (window.__phoneTweaks && window.__phoneTweaks.pickerVariant) || 'recent';
  const variant = (rawVariant === 'status-icons' || rawVariant === 'folder-cards') ? 'detail' : rawVariant;
  const variantClass = rawVariant === variant ? variant : `${variant} ph-projsheet--${rawVariant}`;

  const sheetRef = mnR(null);
  const [query, setQuery] = mnS('');
  const [selectionView, setSelectionView] = mnS('cards');
  const [pinnedIds, setPinnedIds] = mnS(() => new Set(PINNED_PROJECT_IDS));
  const [actionProject, setActionProject] = mnS(null);
  const [expandedProjectId, setExpandedProjectId] = mnS(null);
  const isStatusIcons = rawVariant === 'status-icons';
  const isFolderCards = rawVariant === 'folder-cards';
  const effectiveSelectionView = isStatusIcons ? selectionView : 'cards';

  mnE(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Apply text filter
  const q = query.trim().toLowerCase();
  const filtered = q
    ? projects.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.manager || '').toLowerCase().includes(q) ||
        (p.priorityReason || '').toLowerCase().includes(q)
      )
    : projects;

  // Recent strip: pull the 3 with highest activity (unread + criticality proxy)
  // — meant to feel like "where you've been lately."
  const recents = [...projects]
    .map(p => ({ p, score: (p.unreadMessages || 0) * 2 + (p.priorityLevel === 'critical' ? 5 : p.priorityLevel === 'high' ? 2 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(x => x.p);

  // Groups (used by Refined + Recent variants)
  const groups = [
    { label: 'Critical', items: filtered.filter(p => p.priorityLevel === 'critical') },
    { label: 'Active',   items: filtered.filter(p => p.priorityLevel === 'high' || (p.priorityLevel === 'normal' && (p.unreadMessages || 0) > 0)) },
    { label: 'Quiet',    items: filtered.filter(p => p.priorityLevel === 'normal' && !((p.unreadMessages || 0) > 0)) },
  ].filter(g => g.items.length);
  const statusGroups = projectPickerGroups(filtered, pinnedIds);

  const togglePinnedProject = (projectId) => {
    setPinnedIds(prev => {
      const next = new Set(prev);
      next.has(projectId) ? next.delete(projectId) : next.add(projectId);
      return next;
    });
  };

  const closeProjectActions = () => setActionProject(null);
  const toggleExpandedProject = (projectId) => {
    setExpandedProjectId(prev => prev === projectId ? null : projectId);
  };

  // Reusable avatar bubble — brighter than before, matches the top-bar chip
  const Bubble = ({ p, size = 36 }) => {
    const hue = p.hue ?? 220;
    return (
      <span
        className="ph-projsheet__bubble"
        style={{
          width: size, height: size,
          background: `oklch(0.42 0.10 ${hue})`,
          color: `oklch(0.95 0.12 ${hue})`,
          boxShadow: `inset 0 0 0 1px oklch(0.60 0.14 ${hue} / 0.40)`,
        }}
      >
        {p.initials}
        {p.priorityLevel === 'critical' && <span className="ph-projsheet__prio ph-projsheet__prio--crit" />}
        {p.priorityLevel === 'high'     && <span className="ph-projsheet__prio ph-projsheet__prio--high" />}
      </span>
    );
  };

  const Row = ({ p }) => {
    const isSel = p.id === currentProjectId;
    const unread = p.unreadMessages || 0;
    return (
      <button
        className={'ph-projsheet__row' + (isSel ? ' is-sel' : '')}
        onClick={() => { onSelect(p.id); onClose(); }}
      >
        {isSel && <span className="ph-projsheet__selbar" aria-hidden="true" />}
        <Bubble p={p} />
        <div className="ph-projsheet__rowbody">
          <div className="ph-projsheet__name">{p.name}</div>
          <div className="ph-projsheet__sub">
            {p.manager || 'Active'}
            {p.priorityReason ? ' · ' + p.priorityReason : ''}
          </div>
        </div>
        {unread > 0 && <span className="ph-projsheet__count">{unread}</span>}
        {isSel && (
          <span className="ph-projsheet__check" aria-label="Currently selected">
            <_MnIc size={14} stroke={2.2} d={<><path d="m5 12 5 5L20 7"/></>} />
          </span>
        )}
      </button>
    );
  };

  // Workspace home row — used in all variants
  const WSRow = (
    <button
      className={'ph-projsheet__row ph-projsheet__row--ws' + (!currentProjectId ? ' is-sel' : '')}
      onClick={() => { onSelect(null); onClose(); }}
    >
      {!currentProjectId && <span className="ph-projsheet__selbar" aria-hidden="true" />}
      <span className="ph-pchip__logo ph-projsheet__logo">M</span>
      <div className="ph-projsheet__rowbody">
        <div className="ph-projsheet__name">All Projects</div>
        <div className="ph-projsheet__sub">Mecca workspace</div>
      </div>
      {!currentProjectId && (
        <span className="ph-projsheet__check" aria-label="Currently selected">
          <_MnIc size={14} stroke={2.2} d={<><path d="m5 12 5 5L20 7"/></>} />
        </span>
      )}
    </button>
  );

  return (
    <>
      <div className="ph-projsheet__scrim" onClick={onClose} aria-hidden="true" />
      <div
        className={'ph-projsheet ph-projsheet--' + variantClass + ' ph-projsheet--view-' + effectiveSelectionView}
        ref={sheetRef}
        role="dialog"
        aria-label="Switch project"
      >
        <div className="ph-projsheet__grabber" />
        <div className="ph-projsheet__head">
          <h2>Switch project</h2>
          <button className="ph-projsheet__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <label className="ph-projsheet__search">
          <MnI.search size={15} />
          <input
            className="ph-projsheet__searchin"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
          />
          {query && (
            <button
              type="button"
              className="ph-projsheet__searchclr"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >✕</button>
          )}
        </label>

        {isStatusIcons && (
          <div className="ph-projsheet__viewbar" role="tablist" aria-label="Project selection layout">
            <button
              type="button"
              className={'ph-projsheet__viewbtn' + (selectionView === 'cards' ? ' is-active' : '')}
              onClick={() => setSelectionView('cards')}
              aria-label="Use card view"
              aria-selected={selectionView === 'cards'}
              role="tab"
            >
              <MnI.grid size={14} stroke={1.9} />
              <span>Cards</span>
            </button>
            <button
              type="button"
              className={'ph-projsheet__viewbtn' + (selectionView === 'list' ? ' is-active' : '')}
              onClick={() => setSelectionView('list')}
              aria-label="Use list view"
              aria-selected={selectionView === 'list'}
              role="tab"
            >
              <MnI.list size={14} stroke={1.9} />
              <span>List</span>
            </button>
          </div>
        )}

        <div className="ph-projsheet__scroll">
          {WSRow}

          {/* Variant B: recent strip — hidden when actively searching */}
          {variant === 'recent' && !q && recents.length > 0 && (
            <div className="ph-projsheet__recent">
              <div className="ph-projsheet__seclbl ph-projsheet__seclbl--inset">Recent</div>
              <div className="ph-projsheet__recent-rail">
                {recents.map(p => {
                  const isSel = p.id === currentProjectId;
                  return (
                    <button
                      key={p.id}
                      className={'ph-projsheet__recent-card' + (isSel ? ' is-sel' : '')}
                      onClick={() => { onSelect(p.id); onClose(); }}
                    >
                      <Bubble p={p} size={32} />
                      <span className="ph-projsheet__recent-name">{p.name}</span>
                      {(p.unreadMessages || 0) > 0 && (
                        <span className="ph-projsheet__recent-dot" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Variant C: pill grid — flat list, 2-col grid, no group headers */}
          {variant === 'grid' && (
            filtered.length === 0 ? (
              <div className="ph-projsheet__empty">No projects match "{q}"</div>
            ) : (
              <div className="ph-projsheet__grid">
                {filtered.map(p => {
                  const isSel = p.id === currentProjectId;
                  const unread = p.unreadMessages || 0;
                  return (
                    <button
                      key={p.id}
                      className={'ph-projsheet__gridcard' + (isSel ? ' is-sel' : '')}
                      onClick={() => { onSelect(p.id); onClose(); }}
                    >
                      <div className="ph-projsheet__gridcard-head">
                        <Bubble p={p} size={34} />
                        {unread > 0 && <span className="ph-projsheet__count">{unread}</span>}
                      </div>
                      <div className="ph-projsheet__gridcard-name">{p.name}</div>
                      <div className="ph-projsheet__gridcard-sub">{p.manager || 'Active'}</div>
                      {isSel && (
                        <span className="ph-projsheet__check ph-projsheet__check--card" aria-label="Currently selected">
                          <_MnIc size={12} stroke={2.4} d={<><path d="m5 12 5 5L20 7"/></>} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )
          )}

          {/* Variant D: detailed grid — adds T/PR/C/SI badges, ⓘ handle, long-press */}
          {variant === 'detail' && effectiveSelectionView === 'cards' && (
            filtered.length === 0 ? (
              <div className="ph-projsheet__empty">No projects match "{q}"</div>
            ) : (
              <div className="ph-projsheet__cardgroups">
                {statusGroups.map(g => (
                  <div key={g.label} className={'ph-projsheet__cardgroup' + (g.collapsed ? ' is-collapsed' : '')}>
                    <div className="ph-projsheet__seclbl">
                      {g.label} <span className="ph-projsheet__seclbl-n">{g.items.length}</span>
                      {g.collapsed && <span className="ph-projsheet__collapsed-text">Collapsed</span>}
                    </div>
                    {!g.collapsed && (
                      <div className="ph-projsheet__grid">
                        {g.items.map(p => (
                          <DetailGridCard
                            key={p.id}
                            p={p}
                            isSel={p.id === currentProjectId}
                            Bubble={Bubble}
                            onSelect={() => { onSelect(p.id); onClose(); }}
                            onShowSummary={() => { onShowSummary && onShowSummary(p.id); onClose(); }}
                            onLongPress={(project) => setActionProject(project)}
                            isExpanded={expandedProjectId === p.id}
                            onToggleExpanded={toggleExpandedProject}
                            showDetailsBar={isFolderCards}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}

          {variant === 'detail' && effectiveSelectionView === 'list' && (
            groups.length === 0 ? (
              <div className="ph-projsheet__empty">No projects match "{q}"</div>
            ) : (
              <div className="ph-projsheet__statuslist">
                {statusGroups.map(g => (
                  <div key={g.label} className={'ph-projsheet__statusgroup' + (g.collapsed ? ' is-collapsed' : '')}>
                    <div className="ph-projsheet__seclbl">
                      {g.label} <span className="ph-projsheet__seclbl-n">{g.items.length}</span>
                      {g.collapsed && <span className="ph-projsheet__collapsed-text">Collapsed</span>}
                    </div>
                    {!g.collapsed && g.items.map(p => (
                        <StatusListRow
                          key={p.id}
                          p={p}
                          isSel={p.id === currentProjectId}
                          Bubble={Bubble}
                          onSelect={() => { onSelect(p.id); onClose(); }}
                          onShowSummary={() => { onShowSummary && onShowSummary(p.id); onClose(); }}
                          onLongPress={(project) => setActionProject(project)}
                        />
                      ))}
                  </div>
                ))}
              </div>
            )
          )}

          {/* Variants A & B: grouped list */}
          {(variant === 'refined' || variant === 'recent') && (
            groups.length === 0 ? (
              <div className="ph-projsheet__empty">No projects match "{q}"</div>
            ) : (
              groups.map(g => (
                <div key={g.label} className="ph-projsheet__group">
                  <div className="ph-projsheet__seclbl">{g.label} <span className="ph-projsheet__seclbl-n">{g.items.length}</span></div>
                  {g.items.map(p => <Row key={p.id} p={p} />)}
                </div>
              ))
            )
          )}
        </div>
        {false && onOpenSettings && (
          <button
            className="ph-projsheet__settings"
            onClick={() => { onOpenSettings(); onClose(); }}
          >
            <span className="ph-projsheet__settings-ico"><MnI.settings size={18} stroke={1.7} /></span>
            <span className="ph-projsheet__settings-lbl">Workspace settings</span>
            <span className="ph-projsheet__settings-chev">›</span>
          </button>
        )}
      </div>
    </>
  );
}

// ── Custom "More" control — native iOS press-drag-release menu ─────────────
// The bar's nav tabs are stock iOS; "More" is a custom control. Pressing it
// pops a context-style menu ABOVE the button; the user can keep the finger
// down and slide up onto a row, then release to pick (one continuous
// gesture) — or tap to open and tap a row. The menu is portaled into the
// .ph-app screen so it can overlay the whole phone.
function PhoneMoreControl({ active, onSelect }) {
  const [open, setOpen] = mnS(false);
  const [hot, setHot]   = mnS(null);
  const [host, setHost] = mnS(null);
  const btnRef = mnR(null);
  const drag   = mnR({ on: false });

  const items = MORE_NAV_MODULES
    .map(id => ALL_MODULES.find(m => m.id === id))
    .filter(Boolean)
    .map(m => ({ id: m.id, label: m.label, Glyph: m.Glyph, count: m.count, kind: 'nav' }));
  const rows = items.filter(i => i.kind);

  const rowAt = (x, y) => {
    const el = document.elementFromPoint(x, y);
    const row = el && el.closest && el.closest('[data-menu-row]');
    return row ? row.getAttribute('data-menu-row') : null;
  };

  const close = () => { setOpen(false); setHot(null); };
  const choose = (id) => {
    close();
    const it = rows.find(i => i.id === id);
    if (it && it.kind === 'nav') onSelect(id);
    // util rows (Search/Settings) are no-ops in this prototype
  };

  const onDown = (e) => {
    e.preventDefault();
    setHost(btnRef.current ? btnRef.current.closest('.ph-app') : null);
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
    if (!d.moved) { if (d.wasOpen) close(); /* else: tap → stay open */ }
    else close(); // dragged off into empty space → cancel
  };

  mnE(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const menu = open && host ? ReactDOM.createPortal(
    <>
      <div className="ph-moremenu__scrim" onClick={close} aria-hidden="true" />
      <div className="ph-moremenu" role="menu" aria-label="More modules">
        {items.map(it => it.divider ? (
          <div key={it.id} className="ph-moremenu__div" />
        ) : (
          <button
            key={it.id}
            type="button"
            data-menu-row={it.id}
            role="menuitem"
            className={
              'ph-moremenu__row' +
              (hot === it.id ? ' is-hot' : '') +
              (active === it.id ? ' is-current' : '')
            }
            onClick={() => choose(it.id)}
          >
            <span className="ph-moremenu__lbl">{it.label}</span>
            {it.kind === 'nav' && it.count > 0 && (
              <span className="ph-moremenu__count">{it.count > 99 ? '99+' : it.count}</span>
            )}
            <span className="ph-moremenu__ico"><it.Glyph size={19} stroke={1.8} /></span>
          </button>
        ))}
      </div>
    </>,
    host
  ) : null;

  return (
    <div className="ph-moremenu-anchor">
      <button
        ref={btnRef}
        className={'ph-modnav__more' + (open ? ' is-open' : '')}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More modules"
      >
        <MnI.more size={20} stroke={open ? 2.2 : 1.9} />
      </button>
      {menu}
    </div>
  );
}

// ── Floating module bar (native tabs + custom More) ────────────────────────
function PhoneModBar({ active, onSelect }) {
  const pillItems = PILL_MODULES.map(id => ALL_MODULES.find(m => m.id === id));
  const tabLabel = { home: 'Home', calendar: 'Calendar', procure: 'Procure' };
  return (
    <div className="ph-modnav" role="navigation" aria-label="Modules">
      <div className="ph-modnav__bar">
        <div className="ph-modnav__tabs">
          {pillItems.map(m => {
            const isActive = m.id === active;
            return (
              <button
                key={m.id}
                className={'ph-modnav__tab' + (isActive ? ' is-active' : '')}
                onClick={() => onSelect(m.id)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={m.label}
              >
                <span className="ph-modnav__tab-ico">
                  <m.Glyph size={26} stroke={isActive ? 2.2 : 1.8} />
                  {m.count > 0 && <span className="ph-modnav__dot" />}
                </span>
                <span className="ph-modnav__tab-lbl">{tabLabel[m.id] || m.label}</span>
              </button>
            );
          })}
        </div>
        <PhoneMoreControl active={active} onSelect={onSelect} />
      </div>
    </div>
  );
}

// ── More sheet (popover anchored to the floating round button) ─────────────
function PhoneMoreSheet({ active, onSelect, onClose, onOpenPicker, onCreate }) {
  const ref = mnR(null);
  mnE(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    // Defer to next tick so the click that opened the sheet doesn't close it.
    const t = setTimeout(() => {
      document.addEventListener('pointerdown', onDoc);
    }, 0);
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('pointerdown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const navModules = MORE_NAV_MODULES
    .map(id => ALL_MODULES.find(m => m.id === id))
    .filter(Boolean);

  return (
    <>
      <div className="ph-modsheet__scrim" aria-hidden="true" />
      <div className="ph-modsheet" ref={ref} role="dialog" aria-label="More">
        <button
          className="ph-modsheet__ws"
          onClick={() => { onClose(); if (onOpenPicker) onOpenPicker(); }}
          aria-label="Switch project"
        >
          <span className="ph-modsheet__ws-name">Mecca</span>
          <MnI.chevDown size={14} stroke={2} />
        </button>

        <div className="ph-modsheet__divider" />
        <div className="ph-modsheet__seclbl">Create new</div>
        <div className="ph-modsheet__list">
          {CREATE_ACTIONS.map(a => (
            <button
              key={a.id}
              className="ph-modsheet__row ph-modsheet__row--create"
              onClick={() => { if (onCreate) onCreate(a.id); onClose(); }}
            >
              <a.Glyph size={20} stroke={1.8} />
              <span className="ph-modsheet__lbl">{a.label}</span>
              <span className="ph-modsheet__row-chev">
                <MnI.plus size={14} stroke={2} />
              </span>
            </button>
          ))}
        </div>

        <div className="ph-modsheet__divider" />
        <div className="ph-modsheet__seclbl">Navigation</div>
        <div className="ph-modsheet__list">
          {navModules.map(m => {
            const isActive = m.id === active;
            return (
              <button
                key={m.id}
                className={'ph-modsheet__row' + (isActive ? ' is-active' : '')}
                onClick={() => { onSelect(m.id); onClose(); }}
              >
                <m.Glyph size={20} stroke={isActive ? 2.1 : 1.7} />
                <span className="ph-modsheet__lbl">{m.label}</span>
                {m.count > 0 && (
                  <span className={'ph-modsheet__count' + (isActive ? ' is-active' : '')}>
                    {m.count > 99 ? '99+' : m.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="ph-modsheet__divider" />
        <div className="ph-modsheet__list">
          <button className="ph-modsheet__row">
            <MnI.search size={20} stroke={1.7} />
            <span className="ph-modsheet__lbl">Search</span>
          </button>
          <button className="ph-modsheet__row">
            <MnI.settings size={20} stroke={1.7} />
            <span className="ph-modsheet__lbl">Settings</span>
          </button>
        </div>
        {actionProject && (
          <div className="ph-projsheet__actionscrim" onClick={closeProjectActions} aria-hidden="true" />
        )}
        {actionProject && (
          <div className="ph-projsheet__actions" role="dialog" aria-label={'Project actions for ' + actionProject.name}>
            <div className="ph-projsheet__actions-head">
              <span className="ph-projsheet__actions-kicker">{projectCompany(actionProject)}</span>
              <strong>{actionProject.name}</strong>
            </div>
            <button
              type="button"
              className="ph-projsheet__action"
              onClick={() => { togglePinnedProject(actionProject.id); closeProjectActions(); }}
            >
              <MnI.pin size={16} stroke={1.9} />
              <span>{pinnedIds.has(actionProject.id) ? 'Unpin project' : 'Pin project'}</span>
            </button>
            <button
              type="button"
              className="ph-projsheet__action"
              onClick={() => { onSelect(actionProject.id); onClose(); }}
            >
              <MnI.folder size={16} stroke={1.9} />
              <span>Go to project menu</span>
            </button>
            <button
              type="button"
              className="ph-projsheet__action"
              onClick={() => { onShowSummary && onShowSummary(actionProject.id); onClose(); }}
            >
              <MnI.users size={16} stroke={1.9} />
              <span>Check assigned users</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── Placeholder module screens ─────────────────────────────────────────────
// Visually polished but minimal — only the Chat module is fully wired.

function ModuleHeader({ title, subtitle, action, project, onOpenPicker }) {
  const Chip = window.PMC && window.PMC.PhoneProjectChip;
  return (
    <div className="ph-mod-head">
      {Chip && onOpenPicker && (
        <div className="ph-mod-head__chiprow">
          <Chip project={project || null} onClick={onOpenPicker} compact />
        </div>
      )}
      <div className="ph-mod-head__row">
        <div>
          <h1 className="ph-mod-head__title">{title}</h1>
          {subtitle && <div className="ph-mod-head__sub">{subtitle}</div>}
        </div>
        {action}
      </div>
    </div>
  );
}

// Contextual "+ New X" button shown in a module header. Visually distinct
// from generic icon buttons — a soft accent pill so it reads as a CTA.
function CreateButton({ label, onClick }) {
  return (
    <button className="ph-mod-head__create" onClick={onClick} aria-label={label}>
      <MnI.plus size={15} stroke={2.2} />
      <span>{label}</span>
    </button>
  );
}

// ── AI Assistant — floating sparkle FAB (bottom-right, above the modnav) ───
function PhoneAIFab({ onClick, hint }) {
  return (
    <button
      className="ph-ai-fab"
      onClick={onClick}
      aria-label="Ask AI assistant"
    >
      <span className="ph-ai-fab__halo" aria-hidden="true" />
      <span className="ph-ai-fab__core" aria-hidden="true">
        <MnI.sparkles size={20} stroke={1.9} />
      </span>
      {hint && <span className="ph-ai-fab__hint">{hint}</span>}
    </button>
  );
}

// ── Generic create sheet (one bottom sheet, content varies by action) ──────
const CREATE_SCHEMAS = {
  'new-task': {
    title: 'New task',
    subtitle: 'Create something to track',
    submit: 'Create task',
    fields: [
      { key: 'name',    label: 'Task name',  placeholder: 'e.g. Walk Level 5 with inspector', autoFocus: true },
      { key: 'project', label: 'Project',    type: 'select', options: ['MH HQ Renovation', 'Brickell Tower', 'Deer Run Mall'] },
      { key: 'assignee',label: 'Assignee',   type: 'select', options: ['Me', 'Sarah Chen', 'Mike Rodriguez', 'David Kim'] },
      { key: 'due',     label: 'Due',        type: 'select', options: ['Today', 'Tomorrow', 'This week', 'Next week', 'Pick a date…'] },
      { key: 'priority',label: 'Priority',   type: 'select', options: ['Normal', 'High', 'Critical'] },
    ],
  },
  'new-project': {
    title: 'New project',
    subtitle: 'Spin up a new workspace',
    submit: 'Create project',
    fields: [
      { key: 'name',     label: 'Project name', placeholder: 'e.g. Coral Gables Tower', autoFocus: true },
      { key: 'manager',  label: 'Project manager', type: 'select', options: ['Me', 'Sarah Chen', 'Lena Park', 'Marcus T.'] },
      { key: 'priority', label: 'Priority',  type: 'select', options: ['Normal', 'High', 'Critical'] },
      { key: 'kickoff',  label: 'Kickoff',   type: 'select', options: ['This week', 'Next week', 'This month', 'Pick a date…'] },
    ],
  },
  'add-employee': {
    title: 'Add employee',
    subtitle: 'Invite a teammate',
    submit: 'Send invite',
    fields: [
      { key: 'name',  label: 'Full name', placeholder: 'e.g. Casey Rivera', autoFocus: true },
      { key: 'email', label: 'Email',     placeholder: 'name@company.com', type: 'email' },
      { key: 'role',  label: 'Role',      type: 'select', options: ['Site Manager', 'Project Manager', 'Field Engineer', 'Procurement', 'Admin', 'Client'] },
      { key: 'team',  label: 'Team',      type: 'select', options: ['Core', 'MH HQ', 'Brickell Tower', 'External'] },
    ],
  },
  'new-procurement': {
    title: 'New procurement',
    subtitle: 'Start a purchase order',
    submit: 'Create PO',
    fields: [
      { key: 'item',     label: 'Item',     placeholder: 'e.g. 24 tonnes structural steel', autoFocus: true },
      { key: 'vendor',   label: 'Vendor',   type: 'select', options: ['TimberPro', 'MetalWorks', 'Cemex', 'Other…'] },
      { key: 'project',  label: 'Project',  type: 'select', options: ['MH HQ Renovation', 'Brickell Tower', 'Deer Run Mall'] },
      { key: 'amount',   label: 'Estimated cost', placeholder: '$0' },
      { key: 'deliver',  label: 'Need by',  type: 'select', options: ['This week', 'Next week', 'Within 30 days', 'Pick a date…'] },
    ],
  },
};

function PhoneCreateSheet({ actionId, onClose, onSubmit }) {
  const schema = CREATE_SCHEMAS[actionId];
  const [values, setValues] = mnS({});
  mnE(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  if (!schema) return null;

  const setField = (k, v) => setValues(prev => ({ ...prev, [k]: v }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(actionId, values);
    onClose();
  };

  return (
    <>
      <div className="ph-create__scrim" onClick={onClose} aria-hidden="true" />
      <form className="ph-create" onSubmit={handleSubmit} role="dialog" aria-label={schema.title}>
        <div className="ph-create__grabber" />
        <div className="ph-create__head">
          <div className="ph-create__head-text">
            <h2>{schema.title}</h2>
            {schema.subtitle && <div className="ph-create__sub">{schema.subtitle}</div>}
          </div>
          <button type="button" className="ph-create__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="ph-create__body">
          {schema.fields.map((f, i) => (
            <label key={f.key} className="ph-create__field">
              <span className="ph-create__lbl">{f.label}</span>
              {f.type === 'select' ? (
                <select
                  className="ph-create__select"
                  value={values[f.key] || ''}
                  onChange={(e) => setField(f.key, e.target.value)}
                >
                  <option value="" disabled>Select…</option>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  className="ph-create__input"
                  type={f.type || 'text'}
                  placeholder={f.placeholder || ''}
                  autoFocus={f.autoFocus}
                  value={values[f.key] || ''}
                  onChange={(e) => setField(f.key, e.target.value)}
                />
              )}
            </label>
          ))}
        </div>
        <div className="ph-create__foot">
          <button type="button" className="ph-create__btn ph-create__btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="ph-create__btn ph-create__btn--primary">
            {schema.submit}
          </button>
        </div>
      </form>
    </>
  );
}

function PhoneHomeModule({ onCreate, project, onOpenPicker }) {
  return (
    <div className="ph-mod">
      <ModuleHeader
        title="Home"
        subtitle="Wednesday · May 20"
        action={<CreateButton label="New task" onClick={() => onCreate && onCreate('new-task')} />}
        project={project}
        onOpenPicker={onOpenPicker}
      />
      <div className="ph-mod__hero">
        <div className="ph-mod__hero-eyebrow">Today</div>
        <div className="ph-mod__hero-title">3 site walks · 7 tasks due</div>
        <div className="ph-mod__hero-sub">2 approvals waiting · 1 flagged issue</div>
      </div>
      <div className="ph-mod__section-lbl">Pinned projects</div>
      <div className="ph-mod__cards">
        {[
          { initials: 'MH', name: 'Mecca HQ Renovation',  unread: 7, prio: 'crit', hue: 220 },
          { initials: 'DR', name: 'Downtown Retail Build', unread: 3, prio: 'crit', hue: 25 },
          { initials: 'BH', name: 'Bayfront Hotel Reno',   unread: 9, prio: 'crit', hue: 160 },
        ].map(p => (
          <div key={p.initials} className="ph-mod__card">
            <div className="ph-mod__card-bubble" style={{
              background: `oklch(0.32 0.06 ${p.hue})`,
              color: `oklch(0.92 0.10 ${p.hue})`,
            }}>{p.initials}</div>
            <div className="ph-mod__card-body">
              <div className="ph-mod__card-name">{p.name}</div>
              <div className="ph-mod__card-sub">{p.unread} unread · 4 tasks today</div>
            </div>
            {p.prio === 'crit' && <span className="ph-mod__card-dot" />}
          </div>
        ))}
      </div>
      <div className="ph-mod__section-lbl">Recent activity</div>
      <div className="ph-mod__activity">
        {[
          { who: 'Mike R.', what: 'flagged water leak — storage', t: '18m', hue: 25 },
          { who: 'David K.', what: 'submitted 3 lighting quotes', t: '46m', hue: 35 },
          { who: 'Sarah C.', what: 'assigned permit resubmission', t: '1h',  hue: 220 },
        ].map((a, i) => (
          <div key={i} className="ph-mod__activity-row">
            <div className="ph-mod__activity-av" style={{
              background: `oklch(0.42 0.06 ${a.hue})`,
              color: `oklch(0.96 0.02 ${a.hue})`,
            }}>{a.who.split(' ').map(s => s[0]).join('')}</div>
            <div className="ph-mod__activity-text">
              <b>{a.who}</b> {a.what}
            </div>
            <span className="ph-mod__activity-t">{a.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneCalendarModule({ onCreate, project, onOpenPicker }) {
  const days = [
    { day: 'Tue', date: 19, today: false },
    { day: 'Wed', date: 20, today: true },
    { day: 'Thu', date: 21, today: false },
    { day: 'Fri', date: 22, today: false },
    { day: 'Sat', date: 23, today: false },
  ];
  return (
    <div className="ph-mod">
      <ModuleHeader
        title="Calendar"
        subtitle="May 2026"
        action={<CreateButton label="New task" onClick={() => onCreate && onCreate('new-task')} />}
        project={project}
        onOpenPicker={onOpenPicker}
      />
      <div className="ph-cal__strip">
        {days.map(d => (
          <div key={d.date} className={'ph-cal__day' + (d.today ? ' is-today' : '')}>
            <span className="ph-cal__day-lbl">{d.day}</span>
            <span className="ph-cal__day-num">{d.date}</span>
          </div>
        ))}
      </div>
      <div className="ph-mod__section-lbl">Today · Wed May 20</div>
      <div className="ph-cal__events">
        {[
          { t: '8:00 AM', dur: '1h',    title: 'Site walk — Mecca HQ',     where: 'Level 3 framing', hue: 220 },
          { t: '11:30 AM',dur: '30m',   title: 'Lighting fixtures review', where: 'with David Kim',  hue: 35  },
          { t: '2:00 PM', dur: '45m',   title: 'MEP coordination',         where: 'Bayfront Hotel',  hue: 160 },
          { t: '4:00 PM', dur: '1h',    title: 'Inspector — zoning',       where: 'Downtown Retail', hue: 25  },
        ].map((e, i) => (
          <div key={i} className="ph-cal__event">
            <div className="ph-cal__event-time">
              <span>{e.t}</span>
              <span className="ph-cal__event-dur">{e.dur}</span>
            </div>
            <div className="ph-cal__event-bar" style={{ background: `oklch(0.62 0.18 ${e.hue})` }} />
            <div className="ph-cal__event-body">
              <div className="ph-cal__event-title">{e.title}</div>
              <div className="ph-cal__event-where">{e.where}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneAdminModule() {
  return (
    <div className="ph-mod">
      <ModuleHeader title="Admin" subtitle="Workspace · Mecca Construction" />
      <div className="ph-mod__stats">
        <div className="ph-mod__stat"><span>28</span><label>Members</label></div>
        <div className="ph-mod__stat"><span>15</span><label>Projects</label></div>
        <div className="ph-mod__stat"><span>$4.2M</span><label>In flight</label></div>
      </div>
      <div className="ph-mod__section-lbl">Areas</div>
      <div className="ph-mod__list">
        {[
          { label: 'Team & roles',     sub: '28 people · 6 roles' },
          { label: 'Billing',          sub: 'Pro plan · renews Jun 14' },
          { label: 'Integrations',     sub: 'Procore, QuickBooks, Slack' },
          { label: 'Security & audit', sub: 'SSO required · 18 events today' },
          { label: 'Workspace settings', sub: 'Name, logo, time zone' },
        ].map((r, i) => (
          <button key={i} className="ph-mod__list-row">
            <div>
              <div className="ph-mod__list-name">{r.label}</div>
              <div className="ph-mod__list-sub">{r.sub}</div>
            </div>
            <span className="ph-mod__list-chev">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PhoneProcureModule({ onCreate, project, onOpenPicker }) {
  const orders = [
    { n: 'Lighting fixtures',   sub: '3 quotes · waiting approval', amt: '$24,800', warn: true,  hue: 35 },
    { n: 'Steel beams (W12×26)',sub: 'Quote pending · 1 vendor',    amt: '$112k',   warn: false, hue: 200 },
    { n: 'HVAC unit',           sub: 'Approval needed',             amt: '$48k',    warn: true,  hue: 35 },
    { n: 'Lumber resupply',     sub: 'Ordered · ETA Friday',        amt: '$8,200',  warn: false, hue: 50 },
    { n: 'Plumbing rough-in',   sub: 'Quote received',              amt: '$15,400', warn: false, hue: 160 },
  ];
  return (
    <div className="ph-mod">
      <ModuleHeader
        title="Procurement"
        subtitle="3 waiting approval"
        action={<CreateButton label="New PO" onClick={() => onCreate && onCreate('new-procurement')} />}
        project={project}
        onOpenPicker={onOpenPicker}
      />
      <div className="ph-mod__chips">
        <span className="ph-mod__chip is-active">All · 7</span>
        <span className="ph-mod__chip">Pending · 3</span>
        <span className="ph-mod__chip">Approved</span>
      </div>
      <div className="ph-mod__list">
        {orders.map((o, i) => (
          <button key={i} className="ph-mod__list-row ph-mod__list-row--po">
            <div className="ph-mod__po-icon" style={{
              background: `oklch(0.32 0.08 ${o.hue})`,
              color: `oklch(0.92 0.10 ${o.hue})`,
            }}>$</div>
            <div className="ph-mod__list-body">
              <div className="ph-mod__list-top">
                <span className="ph-mod__list-name">{o.n}</span>
                <span className="ph-mod__po-amt">{o.amt}</span>
              </div>
              <div className={'ph-mod__list-sub' + (o.warn ? ' is-warn' : '')}>{o.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PhoneFilesModule() {
  return (
    <div className="ph-mod">
      <ModuleHeader title="Files" subtitle="142 across 7 projects" />
      <div className="ph-mod__chips">
        <span className="ph-mod__chip is-active">All</span>
        <span className="ph-mod__chip">Drawings</span>
        <span className="ph-mod__chip">Photos</span>
        <span className="ph-mod__chip">Contracts</span>
      </div>
      <div className="ph-mod__section-lbl">Folders</div>
      <div className="ph-mod__folders">
        {[
          { n: 'Drawings',          sub: '34 files · 2h ago' },
          { n: 'Site photos',       sub: '52 files · 1h ago' },
          { n: 'Contracts',         sub: '18 files · Sarah C.' },
          { n: 'Permits & zoning',  sub: '14 files · pending' },
        ].map((f, i) => (
          <div key={i} className="ph-mod__folder">
            <div className="ph-mod__folder-icon">▣</div>
            <div className="ph-mod__folder-name">{f.n}</div>
            <div className="ph-mod__folder-sub">{f.sub}</div>
          </div>
        ))}
      </div>
      <div className="ph-mod__section-lbl">Recent</div>
      <div className="ph-mod__list">
        {[
          { n: 'L3-framing-plan-v4.pdf',   sub: 'PDF · 4.2 MB · 30m ago' },
          { n: 'IMG_2456.jpg',             sub: 'Photo · Mike R. · 1h ago' },
          { n: 'lumber-quote-timberpro.pdf', sub: 'PDF · David K. · 2h ago' },
        ].map((f, i) => (
          <button key={i} className="ph-mod__list-row">
            <div className="ph-mod__file-icon">◳</div>
            <div className="ph-mod__list-body">
              <div className="ph-mod__list-name">{f.n}</div>
              <div className="ph-mod__list-sub">{f.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── AI Assistant chat sheet (opened from the sparkle FAB) ─────────────────
const AI_SUGGESTIONS = [
  { icon: 'taskCircle', text: 'Summarize unread messages in MH HQ' },
  { icon: 'folder',     text: 'Status of Brickell Tower this week' },
  { icon: 'taskCircle', text: 'Draft a reply to Mike\'s lumber-delay thread' },
  { icon: 'dollar',     text: "What's pending approval over $50k?" },
];

function PhoneAISheet({ onClose, contextLabel }) {
  const [text, setText] = mnS('');
  const [history, setHistory] = mnS([
    { from: 'ai', body: contextLabel
      ? `I'm here. Ask me anything about ${contextLabel} — or pick a quick action below.`
      : "I'm here. Ask anything about your projects, or pick a quick action below.",
    },
  ]);
  mnE(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const send = (msg) => {
    const t = (msg || text).trim();
    if (!t) return;
    setHistory(h => [
      ...h,
      { from: 'me', body: t },
      { from: 'ai', body: 'Looking into it… (this is a prototype — wire to your AI here)' },
    ]);
    setText('');
  };

  return (
    <>
      <div className="ph-ai__scrim" onClick={onClose} aria-hidden="true" />
      <div className="ph-ai" role="dialog" aria-label="AI assistant">
        <div className="ph-ai__grabber" />
        <div className="ph-ai__head">
          <div className="ph-ai__head-badge" aria-hidden="true">
            <MnI.sparkles size={16} stroke={1.9} />
          </div>
          <div className="ph-ai__head-text">
            <h2>Assistant</h2>
            <div className="ph-ai__sub">Powered by Mecca AI · context-aware</div>
          </div>
          <button className="ph-ai__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="ph-ai__stream">
          {history.map((m, i) => (
            <div key={i} className={'ph-ai__msg ph-ai__msg--' + m.from}>
              {m.from === 'ai' && (
                <span className="ph-ai__msg-av" aria-hidden="true">
                  <MnI.sparkles size={12} stroke={2} />
                </span>
              )}
              <div className="ph-ai__bubble">{m.body}</div>
            </div>
          ))}
        </div>

        {history.length <= 1 && (
          <div className="ph-ai__suggestions">
            {AI_SUGGESTIONS.map((s, i) => {
              const Glyph = MnI[s.icon] || MnI.sparkles;
              return (
                <button key={i} className="ph-ai__suggestion" onClick={() => send(s.text)}>
                  <Glyph size={14} stroke={1.8} />
                  <span>{s.text}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="ph-ai__composer">
          <input
            className="ph-ai__input"
            placeholder="Ask anything…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); send(); } }}
            autoFocus
          />
          <button
            className="ph-ai__send"
            onClick={() => send()}
            disabled={!text.trim()}
            aria-label="Send"
          >
            <_MnIc size={16} stroke={2} d={<><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></>} />
          </button>
        </div>
      </div>
    </>
  );
}

// ── New module placeholders (accessed from More sheet) ────────────────────
function PhoneProjectsModule({ onCreate, project, onOpenPicker }) {
  const samples = [
    { name: 'MH HQ Renovation',     manager: 'Sarah Chen',  status: 'Critical', hue: 0,   stat: '7 unread · 4 overdue' },
    { name: 'Brickell Tower',       manager: 'Lena Park',   status: 'Active',   hue: 220, stat: '3 unread · 2 due today' },
    { name: 'Deer Run Mall',        manager: 'Marcus T.',   status: 'Active',   hue: 155, stat: 'On track · 12 tasks' },
    { name: 'Coral Gables Annex',   manager: 'Priya Shah',  status: 'Quiet',    hue: 280, stat: 'Pre-construction' },
  ];
  return (
    <div className="ph-mod">
      <ModuleHeader
        title="Projects"
        subtitle={`${samples.length} active`}
        action={<CreateButton label="New project" onClick={() => onCreate && onCreate('new-project')} />}
        project={project}
        onOpenPicker={onOpenPicker}
      />
      <div className="ph-mod__section-lbl">All projects</div>
      <div className="ph-mod__list">
        {samples.map((p, i) => (
          <button key={i} className="ph-mod__list-row">
            <div className="ph-mod__avatar-sq" style={{
              background: `oklch(0.36 0.08 ${p.hue})`,
              color: `oklch(0.94 0.10 ${p.hue})`,
            }}>{p.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
            <div className="ph-mod__list-body">
              <div className="ph-mod__list-name">{p.name}</div>
              <div className="ph-mod__list-sub">{p.manager} · {p.stat}</div>
            </div>
            <span className={'ph-mod__pill ph-mod__pill--' + p.status.toLowerCase()}>{p.status}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PhoneEmployeesModule({ onCreate, project, onOpenPicker }) {
  const people = [
    { n: 'Sarah Chen',     r: 'Project Manager',  t: 'MH HQ',          hue: 280 },
    { n: 'Mike Rodriguez', r: 'Site Manager',     t: 'MH HQ',          hue: 18  },
    { n: 'David Kim',      r: 'Field Engineer',   t: 'Brickell Tower', hue: 220 },
    { n: 'Lena Park',      r: 'Project Manager',  t: 'Brickell Tower', hue: 200 },
    { n: 'Marcus T.',      r: 'Site Manager',     t: 'Deer Run Mall',  hue: 100 },
    { n: 'Priya Shah',     r: 'Project Manager',  t: 'Coral Gables',   hue: 320 },
  ];
  return (
    <div className="ph-mod">
      <ModuleHeader
        title="Employees"
        subtitle={`${people.length} active`}
        action={<CreateButton label="Add" onClick={() => onCreate && onCreate('add-employee')} />}
        project={project}
        onOpenPicker={onOpenPicker}
      />
      <div className="ph-mod__section-lbl">All employees</div>
      <div className="ph-mod__list">
        {people.map((p, i) => (
          <button key={i} className="ph-mod__list-row">
            <div className="ph-mod__avatar" style={{
              background: `oklch(0.40 0.09 ${p.hue})`,
              color: `oklch(0.94 0.10 ${p.hue})`,
              boxShadow: `inset 0 0 0 1px oklch(0.58 0.13 ${p.hue} / 0.35)`,
            }}>{p.n.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
            <div className="ph-mod__list-body">
              <div className="ph-mod__list-name">{p.n}</div>
              <div className="ph-mod__list-sub">{p.r} · {p.t}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PhoneQuickNoteModule({ project, onOpenPicker }) {
  const notes = [
    { t: 'Inspector callout', s: 'Wants the as-built drawings for L5 — bring copies Thursday.', when: 'Today, 9:14 AM' },
    { t: 'Lumber alt-supplier', s: 'MetalWorks quoted 12% under TimberPro. Worth a follow-up.', when: 'Yesterday' },
    { t: 'Permit C-2241', s: 'Renewal needs ECP\'s sign-off before submitting.', when: '2 days ago' },
  ];
  return (
    <div className="ph-mod">
      <ModuleHeader
        title="Quick Note"
        subtitle="Jot something down"
        project={project}
        onOpenPicker={onOpenPicker}
      />
      <div className="ph-quicknote">
        <textarea
          className="ph-quicknote__input"
          placeholder="What's on your mind?"
        />
        <div className="ph-quicknote__foot">
          <span className="ph-quicknote__hint">Tap-to-write · saves on blur</span>
          <button className="ph-quicknote__btn">Save</button>
        </div>
      </div>
      <div className="ph-mod__section-lbl">Recent</div>
      <div className="ph-mod__list">
        {notes.map((n, i) => (
          <button key={i} className="ph-mod__list-row">
            <div className="ph-mod__avatar-sq ph-mod__avatar-sq--note">
              <MnI.note size={16} stroke={1.7} />
            </div>
            <div className="ph-mod__list-body">
              <div className="ph-mod__list-name">{n.t}</div>
              <div className="ph-mod__list-sub">{n.s}</div>
              <div className="ph-mod__list-meta">{n.when}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PhoneToDoModule({ onCreate, project, onOpenPicker }) {
  const items = [
    { t: 'Confirm inspector arrival window', proj: 'MH HQ',          due: 'Today',     done: false, prio: 'high' },
    { t: 'Sign off Permit C-2241 renewal',   proj: 'Brickell Tower', due: 'Today',     done: false, prio: 'critical' },
    { t: 'Walk Level 5 before pour',         proj: 'Brickell Tower', due: 'Tomorrow',  done: false, prio: 'normal' },
    { t: 'Review MetalWorks quote',          proj: 'MH HQ',          due: 'This week', done: false, prio: 'normal' },
    { t: 'Submit weekly status to ECP',      proj: 'Mecca',          due: 'Friday',    done: true,  prio: 'normal' },
    { t: 'Update L3 framing plan',           proj: 'MH HQ',          due: 'Last week', done: true,  prio: 'normal' },
  ];
  return (
    <div className="ph-mod">
      <ModuleHeader
        title="ToDo"
        subtitle={`${items.filter(i => !i.done).length} open · ${items.filter(i => i.done).length} done`}
        action={<CreateButton label="New task" onClick={() => onCreate && onCreate('new-task')} />}
        project={project}
        onOpenPicker={onOpenPicker}
      />
      <div className="ph-mod__section-lbl">Open</div>
      <div className="ph-todo">
        {items.filter(i => !i.done).map((it, i) => (
          <button key={i} className={'ph-todo__row ph-todo__row--' + it.prio}>
            <span className="ph-todo__box" aria-hidden="true" />
            <div className="ph-todo__body">
              <div className="ph-todo__title">{it.t}</div>
              <div className="ph-todo__meta">
                <span>{it.proj}</span>
                <span className="ph-todo__sep">·</span>
                <span className={'ph-todo__due ph-todo__due--' + (it.due === 'Today' ? 'today' : 'soon')}>{it.due}</span>
              </div>
            </div>
            {it.prio !== 'normal' && (
              <span className={'ph-todo__prio ph-todo__prio--' + it.prio} aria-hidden="true" />
            )}
          </button>
        ))}
      </div>
      <div className="ph-mod__section-lbl">Done</div>
      <div className="ph-todo">
        {items.filter(i => i.done).map((it, i) => (
          <div key={i} className="ph-todo__row ph-todo__row--done">
            <span className="ph-todo__box ph-todo__box--checked" aria-hidden="true">
              <MnI.taskCircle size={12} stroke={2} />
            </span>
            <div className="ph-todo__body">
              <div className="ph-todo__title">{it.t}</div>
              <div className="ph-todo__meta"><span>{it.proj}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneFinancesModule({ onCreate, project, onOpenPicker }) {
  const stats = [
    { lbl: 'Budget',       val: '$12.4M', sub: 'across 4 projects',     hue: 220 },
    { lbl: 'Spent',        val: '$7.9M',  sub: '63% of budget',         hue: 35 },
    { lbl: 'Pending POs',  val: '$842K',  sub: '11 awaiting approval',  hue: 280 },
    { lbl: 'Overdue',      val: '$118K',  sub: '3 invoices · this week', hue: 0 },
  ];
  const recent = [
    { name: 'PO-1142 · Concrete batch',        proj: 'MH HQ',          amt: '$48,200', kind: 'approved', when: 'Yesterday' },
    { name: 'INV-9821 · TimberPro lumber',     proj: 'MH HQ',          amt: '$22,400', kind: 'overdue',  when: '4 days late' },
    { name: 'PO-1138 · Steel beams',           proj: 'Brickell Tower', amt: '$184,000', kind: 'pending', when: 'Today' },
    { name: 'INV-9810 · Permit C-2241 fee',    proj: 'Brickell Tower', amt: '$3,400',  kind: 'paid',     when: 'Last week' },
  ];
  return (
    <div className="ph-mod">
      <ModuleHeader
        title="Finances"
        subtitle="Q2 · YTD"
        action={<CreateButton label="New PO" onClick={() => onCreate && onCreate('new-procurement')} />}
        project={project}
        onOpenPicker={onOpenPicker}
      />
      <div className="ph-fin-grid">
        {stats.map((s, i) => (
          <div key={i} className="ph-fin-card" style={{
            '--fin-hue': s.hue,
          }}>
            <div className="ph-fin-card__lbl">{s.lbl}</div>
            <div className="ph-fin-card__val">{s.val}</div>
            <div className="ph-fin-card__sub">{s.sub}</div>
          </div>
        ))}
      </div>
      <div className="ph-mod__section-lbl">Recent activity</div>
      <div className="ph-mod__list">
        {recent.map((r, i) => (
          <button key={i} className="ph-mod__list-row">
            <div className={'ph-mod__avatar-sq ph-fin-kind ph-fin-kind--' + r.kind}>
              <MnI.dollar size={15} stroke={2} />
            </div>
            <div className="ph-mod__list-body">
              <div className="ph-mod__list-name">{r.name}</div>
              <div className="ph-mod__list-sub">{r.proj} · {r.when}</div>
            </div>
            <span className={'ph-fin-badge ph-fin-badge--' + r.kind}>{r.amt}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PhoneModulePlaceholder({ moduleId, onCreate, project, onOpenPicker }) {
  const p = { onCreate, project, onOpenPicker };
  switch (moduleId) {
    case 'home':      return <PhoneHomeModule {...p}/>;
    case 'calendar':  return <PhoneCalendarModule {...p}/>;
    case 'admin':     return <PhoneAdminModule/>;
    case 'procure':   return <PhoneProcureModule {...p}/>;
    case 'files':     return <PhoneFilesModule/>;
    case 'projects':  return <PhoneProjectsModule {...p}/>;
    case 'employees': return <PhoneEmployeesModule {...p}/>;
    case 'quicknote': return <PhoneQuickNoteModule {...p}/>;
    case 'todo':      return <PhoneToDoModule {...p}/>;
    case 'finances':  return <PhoneFinancesModule {...p}/>;
    default:          return null;
  }
}

window.PMC = window.PMC || {};
window.PMC.PhoneModBar = PhoneModBar;
window.PMC.PhoneMoreSheet = PhoneMoreSheet;
window.PMC.PhoneModulePlaceholder = PhoneModulePlaceholder;
window.PMC.PhoneTopBar = PhoneFloatActions;
window.PMC.PhoneFloatActions = PhoneFloatActions;
window.PMC.PhoneProjectSheet = PhoneProjectSheet;
window.PMC.PhoneProjectChip = PhoneProjectChip;
window.PMC.PhoneAIFab = PhoneAIFab;
window.PMC.PhoneCreateSheet = PhoneCreateSheet;
window.PMC.PhoneAISheet = PhoneAISheet;
