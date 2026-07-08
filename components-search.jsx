// Global search command palette — opens from the topnav search bar (or ⌘K).
// Inspired by Linear/Raycast/Slack search: scoped chips, grouped results,
// recent + suggested when empty, keyboard navigation.

const { useState: _sS, useEffect: _sE, useMemo: _sM, useRef: _sR, useCallback: _sC } = React;

// ── Icons ────────────────────────────────────────────────────────────────────
const _SIc = ({ d, size = 14, stroke = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const SI = {
  search:   p => <_SIc {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>} />,
  arrow:    p => <_SIc {...p} d={<><path d="M9 5l7 7-7 7"/></>} />,
  enter:    p => <_SIc {...p} d={<><path d="M9 10l-5 5 5 5"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></>} />,
  close:    p => <_SIc {...p} d={<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>} />,
  clock:    p => <_SIc {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>} />,
  spark:    p => <_SIc {...p} d={<><path d="m12 3 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z"/></>} />,
  project:  p => <_SIc {...p} d={<><rect x="3" y="3" width="18" height="18" rx="4"/></>} />,
  person:   p => <_SIc {...p} d={<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>} />,
  chat:     p => <_SIc {...p} d={<><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"/></>} />,
  file:     p => <_SIc {...p} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>} />,
  task:     p => <_SIc {...p} d={<><rect x="4" y="5" width="16" height="16" rx="2"/><path d="m9 13 2 2 4-4"/></>} />,
  issue:    p => <_SIc {...p} d={<><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>} />,
  procure:  p => <_SIc {...p} d={<><path d="M2 3h2l3 12h13l3-9H6.5"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></>} />,
  cmd:      p => <_SIc {...p} d={<><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></>} />,
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const TYPE_META = {
  project:     { Icon: SI.project, label: 'Project',     hue: 252 },
  conversation:{ Icon: SI.chat,    label: 'Conversation',hue: 220 },
  task:        { Icon: SI.task,    label: 'Task',        hue: 155 },
  issue:       { Icon: SI.issue,   label: 'Site issue',  hue: 25  },
  procurement: { Icon: SI.procure, label: 'Procurement', hue: 70  },
  person:      { Icon: SI.person,  label: 'Person',      hue: 295 },
  file:        { Icon: SI.file,    label: 'File',        hue: 200 },
  action:      { Icon: SI.spark,   label: 'Action',      hue: 240 },
};

// Highlight matched substring inside text
function Highlight({ text, q }) {
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="mc-search-pal__hl">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

// ── Build the search index from MeccaData ────────────────────────────────────
function buildIndex() {
  const D = window.MeccaData;
  if (!D) return [];
  const items = [];

  // Projects
  D.PRIORITY_PROJECTS.forEach(p => {
    items.push({
      kind: 'project',
      id: p.id,
      title: p.name,
      sub: `${p.manager} · ${p.priorityReason}`,
      project: p,
      hint: p.priorityLevel,
    });
  });

  // People (de-duped by name)
  const seen = new Set();
  Object.values(D.participants).forEach(pa => {
    if (pa.name === 'You' || seen.has(pa.name)) return;
    seen.add(pa.name);
    items.push({
      kind: 'person',
      id: 'person-' + pa.avatar,
      title: pa.name,
      sub: pa.role,
      hue: pa.hue,
      avatar: pa.avatar,
    });
  });

  // Conversations (project channels, tasks, issues, procurement, DMs)
  D.CONVERSATIONS.forEach(c => {
    const proj = D.PRIORITY_PROJECTS.find(p => p.id === c.projectId);
    const kind = c.type === 'task'        ? 'task'
              : c.type === 'site-issue'   ? 'issue'
              : c.type === 'procurement'  ? 'procurement'
              : c.type === 'direct'       ? 'conversation'
              :                              'conversation';
    items.push({
      kind,
      id: c.id,
      title: c.title,
      sub: c.lastMessage,
      project: proj,
      whenISO: c.timestamp instanceof Date ? c.timestamp.toISOString() : null,
      whenLabel: c.timestamp ? D.fmtRelative(c.timestamp) : '',
      unread: c.unreadCount,
    });
  });

  // Synthetic files referenced in chats
  const files = [
    { name: 'L3-framing-plan-v4.pdf',     who: 'Emily Johnson',  size: '4.2 MB',  projId: 'pp1', t: '3h' },
    { name: 'MEP-coordination.dwg',       who: 'Lisa Park',      size: '12.8 MB', projId: 'pp3', t: '1d' },
    { name: 'Site-photos · Nov 14.zip',   who: 'Mike Rodriguez', size: '218 MB',  projId: 'pp1', t: '2d' },
    { name: 'Submittals — lighting.pdf',  who: 'David Kim',      size: '6.1 MB',  projId: 'pp1', t: '3d' },
    { name: 'RFI-14-response.pdf',        who: 'Emily Johnson',  size: '820 KB',  projId: 'pp3', t: '4d' },
    { name: 'Rebar-spec-Level3.pdf',      who: 'James Wilson',   size: '2.1 MB',  projId: 'pp2', t: '6d' },
    { name: 'Permit-zoning-resub.pdf',    who: 'Sarah Chen',     size: '1.4 MB',  projId: 'pp8', t: '1w' },
  ];
  files.forEach((f, i) => {
    const proj = D.PRIORITY_PROJECTS.find(p => p.id === f.projId);
    items.push({
      kind: 'file',
      id: 'file-' + i,
      title: f.name,
      sub: `${f.who} · ${f.size}`,
      project: proj,
      whenLabel: f.t,
    });
  });

  return items;
}

// ── Smart suggested actions (query-aware) ────────────────────────────────────
function suggestActions(q) {
  const out = [];
  const lo = q.toLowerCase();
  if (!q || 'approvals approve'.includes(lo)) {
    out.push({ kind: 'action', id: 'act-approvals', title: 'View items awaiting your approval', sub: '3 procurement decisions pending', shortcut: '⌘ A' });
  }
  if (!q || 'mentions'.includes(lo) || lo.includes('@')) {
    out.push({ kind: 'action', id: 'act-mentions', title: 'Mentions of @you', sub: '4 unread mentions across 3 projects', shortcut: '⌘ M' });
  }
  if (!q || 'today'.includes(lo) || 'overdue'.includes(lo)) {
    out.push({ kind: 'action', id: 'act-today',    title: 'Tasks due today',                sub: '11 tasks across all projects', shortcut: '⌘ T' });
  }
  if (!q || 'site'.includes(lo) || 'issue'.includes(lo) || 'urgent'.includes(lo)) {
    out.push({ kind: 'action', id: 'act-issues',   title: 'Open site issues',               sub: '6 open · 3 critical', shortcut: '⌘ I' });
  }
  return out;
}

// ── Scope chips ──────────────────────────────────────────────────────────────
const SCOPES = [
  { id: 'all',          label: 'All',          kinds: null },
  { id: 'projects',     label: 'Projects',     kinds: ['project'] },
  { id: 'people',       label: 'People',       kinds: ['person'] },
  { id: 'conversations',label: 'Conversations',kinds: ['conversation','task','issue','procurement'] },
  { id: 'files',        label: 'Files',        kinds: ['file'] },
];

// ── Result row ──────────────────────────────────────────────────────────────
function ResultRow({ item, q, active, onMouseEnter, onClick }) {
  const meta = TYPE_META[item.kind] || TYPE_META.action;
  const { Icon, hue } = meta;
  return (
    <button
      className={'mc-search-pal__row' + (active ? ' is-active' : '')}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      style={{ '--h': item.hue || hue }}
      role="option"
      aria-selected={active}
    >
      {item.kind === 'person' ? (
        <div className="mc-search-pal__avatar" style={{ '--h': item.hue || hue }}>
          {item.avatar}
        </div>
      ) : (
        <div className="mc-search-pal__icon">
          <Icon size={15} />
        </div>
      )}
      <div className="mc-search-pal__main">
        <div className="mc-search-pal__title">
          <Highlight text={item.title} q={q} />
          {item.unread > 0 && <span className="mc-search-pal__unread">{item.unread}</span>}
        </div>
        {item.sub && (
          <div className="mc-search-pal__sub">
            <Highlight text={item.sub} q={q} />
          </div>
        )}
      </div>
      <div className="mc-search-pal__meta">
        {item.project && (
          <span className="mc-search-pal__crumb">
            <span className="mc-search-pal__crumb-chip" aria-hidden>{item.project.initials}</span>
            <span>{item.project.name}</span>
          </span>
        )}
        {item.whenLabel && <span className="mc-search-pal__when">{item.whenLabel}</span>}
        {item.shortcut && <kbd className="mc-search-pal__kbd">{item.shortcut}</kbd>}
        {active && (
          <span className="mc-search-pal__go" aria-hidden>
            <SI.arrow size={12} stroke={2} />
          </span>
        )}
      </div>
    </button>
  );
}

// ── Group ───────────────────────────────────────────────────────────────────
function ResultGroup({ label, items, q, activeId, onHover, onPick, baseIndex }) {
  if (!items.length) return null;
  return (
    <div className="mc-search-pal__group">
      <div className="mc-search-pal__group-head">{label}<span>{items.length}</span></div>
      {items.map((it, i) => (
        <ResultRow
          key={it.id}
          item={it}
          q={q}
          active={activeId === it.id}
          onMouseEnter={() => onHover(it.id)}
          onClick={() => onPick(it)}
        />
      ))}
    </div>
  );
}

// ── Palette ─────────────────────────────────────────────────────────────────
function SearchPalette({ open, onClose, onPick }) {
  const [q, setQ] = _sS('');
  const [scope, setScope] = _sS('all');
  const [activeId, setActiveId] = _sS(null);
  const [recent, setRecent] = _sS([]); // list of {id,title,kind}
  const inputRef = _sR(null);
  const listRef = _sR(null);

  const index = _sM(() => buildIndex(), []);

  // Reset / focus on open
  _sE(() => {
    if (open) {
      setQ('');
      setScope('all');
      setActiveId(null);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 30);
    }
  }, [open]);

  // Filter
  const filtered = _sM(() => {
    const lo = q.trim().toLowerCase();
    let pool = index;
    const scopeDef = SCOPES.find(s => s.id === scope);
    if (scopeDef && scopeDef.kinds) pool = pool.filter(it => scopeDef.kinds.includes(it.kind));
    if (!lo) return pool;
    return pool.filter(it =>
      it.title.toLowerCase().includes(lo) ||
      (it.sub || '').toLowerCase().includes(lo) ||
      (it.project && it.project.name.toLowerCase().includes(lo))
    ).slice(0, 40);
  }, [q, scope, index]);

  // Group filtered
  const groups = _sM(() => {
    if (!q.trim() && scope === 'all') {
      // empty state — show recent + suggested actions + a few popular
      return {
        actions: suggestActions(''),
        recent: recent.map(r => index.find(i => i.id === r.id)).filter(Boolean),
        suggested: index.filter(i => i.kind === 'project').slice(0, 4),
      };
    }
    const byKind = { project: [], conversation: [], task: [], issue: [], procurement: [], person: [], file: [] };
    filtered.forEach(it => { (byKind[it.kind] || (byKind[it.kind] = [])).push(it); });
    return {
      actions: q.trim() ? suggestActions(q) : [],
      ...byKind,
    };
  }, [filtered, q, scope, index, recent]);

  // Flat ordered list of currently visible items, for keyboard nav
  const flat = _sM(() => {
    const ord = [];
    const push = arr => arr && arr.forEach(it => ord.push(it));
    if (!q.trim() && scope === 'all') {
      push(groups.actions); push(groups.recent); push(groups.suggested);
    } else {
      push(groups.actions);
      push(groups.project); push(groups.person); push(groups.conversation);
      push(groups.task); push(groups.issue); push(groups.procurement); push(groups.file);
    }
    return ord;
  }, [groups, q, scope]);

  // Reset active when filter changes
  _sE(() => { setActiveId(flat[0] ? flat[0].id : null); }, [q, scope]);

  // Keyboard nav
  const move = (delta) => {
    if (!flat.length) return;
    const idx = Math.max(0, flat.findIndex(i => i.id === activeId));
    const next = (idx + delta + flat.length) % flat.length;
    setActiveId(flat[next].id);
    // scroll into view
    requestAnimationFrame(() => {
      const el = listRef.current && listRef.current.querySelector('.mc-search-pal__row.is-active');
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
    });
  };

  const pickActive = () => {
    const item = flat.find(i => i.id === activeId) || flat[0];
    if (!item) return;
    setRecent(prev => {
      const next = [{ id: item.id, title: item.title, kind: item.kind },
                    ...prev.filter(r => r.id !== item.id)].slice(0, 5);
      return next;
    });
    onPick && onPick(item);
  };

  _sE(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp')   { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter')     { e.preventDefault(); pickActive(); }
      else if (e.key === 'Tab' && !e.shiftKey) {
        // cycle scopes with Tab
        e.preventDefault();
        const i = SCOPES.findIndex(s => s.id === scope);
        setScope(SCOPES[(i + 1) % SCOPES.length].id);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, activeId, flat, scope]);

  if (!open) return null;

  const isEmptyState = !q.trim() && scope === 'all';
  const totalResults = flat.length;

  return (
    <div className="mc-search-pal__wrap" role="dialog" aria-modal="true" aria-label="Search">
      <div className="mc-search-pal__backdrop" onClick={onClose} />
      <div className="mc-search-pal" role="combobox" aria-expanded="true">
        <div className="mc-search-pal__inputwrap">
          <SI.search size={18} stroke={1.8} />
          <input
            ref={inputRef}
            className="mc-search-pal__input"
            placeholder="Search projects, people, tasks, files…"
            value={q}
            onChange={e => setQ(e.target.value)}
            spellCheck="false"
            autoComplete="off"
          />
          {q && (
            <button className="mc-search-pal__clear" onClick={() => setQ('')} title="Clear">
              <SI.close size={12} />
            </button>
          )}
          <button className="mc-search-pal__esc" onClick={onClose} title="Close (Esc)">
            <kbd>Esc</kbd>
          </button>
        </div>

        <div className="mc-search-pal__scopes" role="tablist" aria-label="Scope">
          {SCOPES.map(s => (
            <button
              key={s.id}
              role="tab"
              aria-selected={scope === s.id}
              className={'mc-search-pal__scope' + (scope === s.id ? ' is-active' : '')}
              onClick={() => setScope(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mc-search-pal__list" ref={listRef} role="listbox" aria-label="Results">
          {isEmptyState && (
            <>
              <ResultGroup label="Quick actions" items={groups.actions || []} q="" activeId={activeId}
                onHover={setActiveId} onPick={pickActive} />
              {groups.recent && groups.recent.length > 0 && (
                <ResultGroup label="Recent" items={groups.recent} q="" activeId={activeId}
                  onHover={setActiveId} onPick={pickActive} />
              )}
              <ResultGroup label="Jump to a project" items={groups.suggested || []} q="" activeId={activeId}
                onHover={setActiveId} onPick={pickActive} />
            </>
          )}
          {!isEmptyState && totalResults === 0 && (
            <div className="mc-search-pal__empty">
              <div className="mc-search-pal__empty-icon"><SI.search size={20} stroke={1.4} /></div>
              <div className="mc-search-pal__empty-title">No matches for "{q}"</div>
              <div className="mc-search-pal__empty-sub">Try a different keyword, or switch scope.</div>
            </div>
          )}
          {!isEmptyState && totalResults > 0 && (
            <>
              {groups.actions && <ResultGroup label="Actions"       items={groups.actions}     q={q} activeId={activeId} onHover={setActiveId} onPick={(it)=>{ setActiveId(it.id); pickActive(); }} />}
              <ResultGroup label="Projects"      items={groups.project || []}     q={q} activeId={activeId} onHover={setActiveId} onPick={(it)=>{ setActiveId(it.id); pickActive(); }} />
              <ResultGroup label="People"        items={groups.person || []}      q={q} activeId={activeId} onHover={setActiveId} onPick={(it)=>{ setActiveId(it.id); pickActive(); }} />
              <ResultGroup label="Conversations" items={groups.conversation || []}q={q} activeId={activeId} onHover={setActiveId} onPick={(it)=>{ setActiveId(it.id); pickActive(); }} />
              <ResultGroup label="Tasks"         items={groups.task || []}        q={q} activeId={activeId} onHover={setActiveId} onPick={(it)=>{ setActiveId(it.id); pickActive(); }} />
              <ResultGroup label="Site issues"   items={groups.issue || []}       q={q} activeId={activeId} onHover={setActiveId} onPick={(it)=>{ setActiveId(it.id); pickActive(); }} />
              <ResultGroup label="Procurement"   items={groups.procurement || []} q={q} activeId={activeId} onHover={setActiveId} onPick={(it)=>{ setActiveId(it.id); pickActive(); }} />
              <ResultGroup label="Files"         items={groups.file || []}        q={q} activeId={activeId} onHover={setActiveId} onPick={(it)=>{ setActiveId(it.id); pickActive(); }} />
            </>
          )}
        </div>

        <footer className="mc-search-pal__foot">
          <div className="mc-search-pal__hints">
            <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
            <span><kbd>↵</kbd> Open</span>
            <span><kbd>Tab</kbd> Switch scope</span>
            <span><kbd>Esc</kbd> Close</span>
          </div>
          <div className="mc-search-pal__brand">
            <SI.spark size={12} />
            <span>Powered by Mecca Search</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

window.MC = window.MC || {};
window.MC.SearchPalette = SearchPalette;
