// Phone-specific components — projects list, project inbox, chat
const { useState: pUseState, useMemo: pUseMemo, useEffect: pUseEffect, useRef: pUseRef, useLayoutEffect: pUseLayoutEffect } = React;
window.MC = window.MC || {};
const PD = window.MeccaData;
// Lazy proxies — components-rail.jsx may not have populated window.MC yet
// when this script evaluates (Babel script order isn't guaranteed).
const PMC = new Proxy({}, { get: (_, k) => window.MC[k] });
const PI = new Proxy({}, { get: (_, k) => (window.MC.I || {})[k] });
const PTYPE = new Proxy({}, { get: (_, k) => (window.MC.TYPE_CFG || {})[k] });

function phoneChatDisplayTitle(conv, project) {
  if (!conv) return '';
  if (conv.type !== 'project') return conv.title;
  const p = project || (PD.PRIORITY_PROJECTS || []).find(item => item.id === conv.projectId);
  return (p && p.name) || conv.title;
}
window.PhoneChatDisplayTitle = phoneChatDisplayTitle;

// Back-arrow icon
const BackIcon = (p) => (
  <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18 9 12l6-6" />
  </svg>
);

// ── Projects list (top-level inbox / "rail" replaced by full screen) ─────────
function PhoneProjects({ projects, customConversations, archivedIds, onOpenProject, onOpenConv, onOpenDM, dmUnread, onOpenPicker }) {
  const [search, setSearch] = pUseState('');
  const [selectedId, setSelectedId] = pUseState(null);
  const [filter, setFilter] = pUseState('all');
  const [openMessageSections, setOpenMessageSections] = pUseState(new Set(['project','task','procurement','site-issue','custom-group']));
  const archived = archivedIds || new Set();
  // Default pinned: the highest-priority projects
  const [pinnedIds, setPinnedIds] = pUseState(() => {
    const ids = projects.filter(p => p.priorityLevel === 'critical').slice(0, 3).map(p => p.id);
    return new Set(ids);
  });

  const sections = pUseMemo(() => {
    let list = projects;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    const pinned = list.filter(p => pinnedIds.has(p.id));
    const rest   = list.filter(p => !pinnedIds.has(p.id));
    const active = rest.filter(p => p.priorityLevel === 'critical' || p.priorityLevel === 'high' || (p.priorityLevel === 'normal' && PD.getTotalUnread(p.id) > 0));
    const quiet  = rest.filter(p => p.priorityLevel === 'normal' && PD.getTotalUnread(p.id) === 0);
    return [
      { label: 'Pinned', key: 'pinned', items: pinned },
      { label: 'Active', key: 'active', items: active },
      { label: 'Quiet',  key: 'quiet',  items: quiet },
    ].filter(s => s.items.length);
  }, [projects, search, pinnedIds]);

  const projectById = pUseMemo(() => new Map(projects.map(p => [p.id, p])), [projects]);
  const allConversations = pUseMemo(() => ([
    ...projects.flatMap(p => PD.getProjectConversations(p.id)),
    ...((customConversations || []).filter(c => c.projectId)),
  ]), [projects, customConversations]);
  const filteredConversations = pUseMemo(() => {
    let list = allConversations;
    if (filter === 'archive') list = list.filter(c => archived.has(c.id));
    else list = list.filter(c => !archived.has(c.id));
    if (filter === 'unread') list = list.filter(c => c.unreadCount > 0);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => {
        const projectName = projectById.get(c.projectId)?.name || '';
        return c.title.toLowerCase().includes(q) ||
          (c.lastMessage || '').toLowerCase().includes(q) ||
          (c.subtitle || '').toLowerCase().includes(q) ||
          projectName.toLowerCase().includes(q);
      });
    }
    return [...list].sort((a, b) => {
      if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount;
      return b.timestamp - a.timestamp;
    });
  }, [allConversations, filter, search, archived, projectById]);
  const groupedConversations = pUseMemo(() => {
    const map = new Map();
    for (const c of filteredConversations) {
      const arr = map.get(c.type) || [];
      arr.push(c);
      map.set(c.type, arr);
    }
    return map;
  }, [filteredConversations]);
  const messageSections = [
    { type: 'project', label: 'Project chats' },
    { type: 'task', label: 'Tasks' },
    { type: 'procurement', label: 'Procurement' },
    { type: 'site-issue', label: 'Site issues' },
    { type: 'custom-group', label: 'Custom group chats' },
  ];
  const toggleMessageSection = type => setOpenMessageSections(prev => {
    const next = new Set(prev);
    next.has(type) ? next.delete(type) : next.add(type);
    return next;
  });

  return (
    <div className="ph">
      <div className="ph-grid-top">
        {window.PMC.PhoneProjectChip ? (
          <window.PMC.PhoneProjectChip
            project={null}
            screen="Messages - all projects"
            onClick={onOpenPicker}
          />
        ) : <h1>Messages</h1>}
      </div>

      <div className="ph-scroll">
        <div className="ph-grid-search">
          <PI.search size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..." />
        </div>

        <PhoneChatModeSwitch
          active="project"
          projectCount={allConversations.reduce((s, c) => s + c.unreadCount, 0)}
          dmCount={dmUnread}
          onProject={() => {}}
          onDMs={onOpenDM}
        />

        <div className="ph-filter">
          {['all','unread','archive'].map(f => (
            <button key={f} className={'ph-filter__pill' + (filter===f?' is-active':'')} onClick={() => setFilter(f)}>
              {f === 'archive' ? (
                <span style={{display:'inline-flex', alignItems:'center', gap:5}}>
                  <PI.archive size={11} stroke={2} />Archive
                </span>
              ) : (f === 'all' ? 'All' : 'Unread')}
            </button>
          ))}
        </div>

        {messageSections.map(def => {
          const items = groupedConversations.get(def.type) || [];
          if (!items.length) return null;
          const cfg = PTYPE[def.type] || PTYPE.project || {};
          const Glyph = cfg.Glyph || PI.msg;
          const isOpen = openMessageSections.has(def.type);
          const unread = items.reduce((s,c) => s + c.unreadCount, 0);
          return (
            <div key={def.type}>
              <div className="ph-sectionrow">
                <button className={'ph-section' + (isOpen ? '' : ' is-collapsed')} onClick={() => toggleMessageSection(def.type)} type="button">
                  <PI.chev size={12} className={'ph-section__chev' + (isOpen ? '' : ' is-rot')} />
                  <span style={{ color: `oklch(0.7 0.12 ${cfg.hue || 220})`, display:'inline-flex' }}><Glyph size={12} stroke={2} /></span>
                  <span>{def.label}</span>
                  <span className="ph-section__count">{items.length}</span>
                  {!isOpen && unread > 0 && <span className="ph-section__unread">{unread}</span>}
                </button>
              </div>
              {isOpen && items.map(c => (
                <PhoneConvRow
                  key={c.id}
                  conv={c}
                  contextLine={projectById.get(c.projectId)?.name || 'All projects'}
                  onClick={() => onOpenConv ? onOpenConv(c) : onOpenProject(c.projectId)}
                />
              ))}
            </div>
          );
        })}

        {filteredConversations.length === 0 && (
          <div className="ph-empty">
            <div className="ph-empty__title">No conversations found</div>
            <div className="ph-empty__sub">Try a different search or filter.</div>
          </div>
        )}
        <div style={{height: 24}} />
      </div>
    </div>
  );

  return (
    <div className="ph">
      <div className="ph-grid-top">
        {window.PMC.PhoneProjectChip ? (
          <window.PMC.PhoneProjectChip
            project={null}
            screen="Messages · all projects"
            onClick={onOpenPicker}
          />
        ) : <h1>Messages</h1>}
        <button className="ph-grid-top__add" aria-label="New">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      <div className="ph-scroll">
        <div className="ph-grid-search">
          <PI.search size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects or people…" />
        </div>

        {/* Direct messages entry */}
        <button className="ph-dmcard" onClick={onOpenDM}>
          <div className="ph-dmcard__bubble">
            <span>DM</span>
            {dmUnread > 0 && <span className="ph-dmcard__dot" />}
          </div>
          <div className="ph-dmcard__body">
            <div className="ph-dmcard__title">Direct Messages</div>
            <div className="ph-dmcard__sub">Person-to-person chats</div>
          </div>
        </button>

        {sections.map(s => (
          <div key={s.label} className="ph-gridsection">
            <div className="ph-gridsection__label">{s.label}</div>
            <div className="ph-grid">
              {s.items.map(p => (
                <PhoneProjectTile
                  key={p.id}
                  project={p}
                  isSelected={selectedId === p.id}
                  onClick={() => {
                    setSelectedId(p.id);
                    onOpenProject(p.id);
                  }}
                />
              ))}
            </div>
          </div>
        ))}
        <div style={{height: 24}} />
      </div>

    </div>
  );
}

// Grid tile — square avatar + name + count badge + breakdown chips
function PhoneProjectTile({ project: p, isSelected, onClick }) {
  const unread = PD.getTotalUnread(p.id);
  const bk = PD.getUnreadBreakdown(p.id);
  const isCrit = false;
  const chips = [
    { key: 'project',     count: bk.project,       hue: 220, label: 'P'  },
    { key: 'task',        count: bk.task,          hue: 155, label: 'T'  },
    { key: 'procurement', count: bk.procurement,   hue: 35,  label: 'PR' },
    { key: 'site-issue',  count: bk['site-issue'], hue: 0,   label: 'SI' },
  ].filter(c => c.count > 0);
  return (
    <button
      className={'ph-tile' + (isSelected ? ' is-selected' : '') + (isCrit ? ' is-crit' : '')}
      onClick={onClick}
    >
      <div className="ph-tile__avatar">
        <span className="ph-tile__initials">{p.initials}</span>
        {unread > 0 && (
          <span className="ph-tile__badge">{unread > 99 ? '99+' : unread}</span>
        )}
      </div>
      <div className={'ph-tile__name' + (isSelected ? ' is-selected' : '')}>{p.name}</div>
      {chips.length > 0 && (
        <div className="ph-tile__chips">
          {chips.map(c => (
            <span key={c.key} className="ph-tilechip"
              style={{
                background: `oklch(0.32 0.10 ${c.hue})`,
                color: `oklch(0.86 0.10 ${c.hue})`,
              }}
              title={`${c.count} ${c.key}`}>
              {c.label} · {c.count}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

// ── Project inbox (conversations within a project) ──────────────────────────
function PhoneProjectInbox({ project, archivedIds, customConversations, onCreateCustomGroup, onBack, onOpenConv, onOpenPicker, onOpenDMs }) {
  const [search, setSearch] = pUseState('');
  const [filter, setFilter] = pUseState('all');
  const [openSections, setOpenSections] = pUseState(new Set(['project','task','procurement','site-issue','custom-group']));
  const [creatingGroup, setCreatingGroup] = pUseState(false);
  const [groupName, setGroupName] = pUseState('');
  const [groupMembers, setGroupMembers] = pUseState(new Set());
  const archived = archivedIds || new Set();

  const all = pUseMemo(() => ([
    ...PD.getProjectConversations(project.id),
    ...((customConversations || []).filter(c => c.projectId === project.id)),
  ]), [project.id, customConversations]);
  const projectUnread = pUseMemo(() => all.reduce((s, c) => s + c.unreadCount, 0), [all]);
  const dmUnread = pUseMemo(() => PD.getGlobalDMs().reduce((s, c) => s + c.unreadCount, 0), []);
  const availableGroupMembers = pUseMemo(() => {
    const byName = new Map();
    for (const c of all) {
      for (const p of c.participants || []) {
        if (p.name !== 'You') byName.set(p.name, p);
      }
    }
    return Array.from(byName.values()).slice(0, 6);
  }, [all]);
  const filtered = pUseMemo(() => {
    let list = all;
    // Archive is its own bucket: show only archived; All/Unread hide them.
    if (filter === 'archive') list = list.filter(c => archived.has(c.id));
    else list = list.filter(c => !archived.has(c.id));
    if (filter === 'unread') list = list.filter(c => c.unreadCount > 0);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => c.title.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q));
    }
    return list;
  }, [all, filter, search, archived]);

  const SECTIONS = [
    { type: 'project', label: 'Project chat' },
    { type: 'task', label: 'Tasks' },
    { type: 'procurement', label: 'Procurement' },
    { type: 'site-issue', label: 'Site issues' },
    { type: 'custom-group', label: 'Custom group chats' },
  ];
  const grouped = pUseMemo(() => {
    const m = new Map();
    for (const c of filtered) {
      if (!m.has(c.type)) m.set(c.type, []);
      m.get(c.type).push(c);
    }
    return m;
  }, [filtered]);
  const toggleSection = type => setOpenSections(prev => {
    const next = new Set(prev);
    next.has(type) ? next.delete(type) : next.add(type);
    return next;
  });
  const startCustomGroup = () => {
    setCreatingGroup(true);
    setOpenSections(prev => new Set([...prev, 'custom-group']));
    setGroupName('');
    setGroupMembers(new Set(availableGroupMembers.slice(0, 2).map(p => p.name)));
  };
  const toggleGroupMember = name => setGroupMembers(prev => {
    const next = new Set(prev);
    next.has(name) ? next.delete(name) : next.add(name);
    return next;
  });
  const createCustomGroup = () => {
    const title = groupName.trim();
    if (!title || groupMembers.size === 0) return;
    const participants = availableGroupMembers.filter(p => groupMembers.has(p.name));
    const conv = {
      id: `c-phone-${project.id}-${Date.now()}`,
      projectId: project.id,
      type: 'custom-group',
      title,
      subtitle: `Custom group · ${participants.length + 1} members`,
      lastMessage: 'Custom group created.',
      lastSender: 'You',
      timestamp: new Date(),
      unreadCount: 0,
      priority: 'normal',
      priorityLevel: 'p3',
      participants,
    };
    onCreateCustomGroup && onCreateCustomGroup(conv);
    setCreatingGroup(false);
    setGroupName('');
    setGroupMembers(new Set());
  };

  return (
    <div className="ph">
      <div className="ph-top ph-top--withchip">
        <button className="ph-top__back" onClick={onBack}><BackIcon /></button>
        <div className="ph-top__title">
          {window.PMC.PhoneProjectChip ? (
            <window.PMC.PhoneProjectChip
              project={project}
              screen={project.manager + ' · ' + project.priorityReason}
              onClick={onOpenPicker}
            />
          ) : (
            <>
              <h1>{project.name}</h1>
              <div className="ph-top__sub">{project.manager} · {project.priorityReason}</div>
            </>
          )}
        </div>
        <div className="ph-top__actions">
          <button className="ph-top__btn"><PI.more size={18} /></button>
        </div>
      </div>

      <PhoneChatModeSwitch
        active="project"
        projectCount={projectUnread}
        dmCount={dmUnread}
        onProject={() => {}}
        onDMs={onOpenDMs}
      />

      <div className="ph-search">
        <PI.search size={14} />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search conversations…" />
      </div>

      <div className="ph-filter">
        {['all','unread','archive'].map(f => (
          <button key={f} className={'ph-filter__pill' + (filter===f?' is-active':'')} onClick={() => setFilter(f)}>
            {f === 'archive' ? (
              <span style={{display:'inline-flex', alignItems:'center', gap:5}}>
                <PI.archive size={11} stroke={2} />Archive
              </span>
            ) : (f === 'all' ? 'All' : 'Unread')}
          </button>
        ))}
      </div>

      <div className="ph-scroll">
        {SECTIONS.map(def => {
          const items = grouped.get(def.type) || [];
          const canCreateCustom = def.type === 'custom-group' && !!onCreateCustomGroup;
          if (!items.length && !canCreateCustom) return null;
          const cfg = PTYPE[def.type] || PTYPE.project || {};
          const Glyph = cfg.Glyph || PI.msg;
          const isOpen = openSections.has(def.type);
          const unread = items.reduce((s,c) => s + c.unreadCount, 0);
          return (
            <div key={def.type}>
              <div className="ph-sectionrow">
                <button className={'ph-section' + (isOpen ? '' : ' is-collapsed')} onClick={() => toggleSection(def.type)} type="button">
                  <PI.chev size={12} className={'ph-section__chev' + (isOpen ? '' : ' is-rot')} />
                  <span style={{ color: `oklch(0.7 0.12 ${cfg.hue || 220})`, display:'inline-flex' }}><Glyph size={12} stroke={2} /></span>
                  <span>{def.label}</span>
                  <span className="ph-section__count">{items.length}</span>
                  {!isOpen && unread > 0 && <span className="ph-section__unread">{unread}</span>}
                </button>
                {canCreateCustom && (
                  <button className="ph-section__add" onClick={startCustomGroup} type="button" aria-label="Add custom group chat">
                    <PI.plus size={13} stroke={2.2} />
                  </button>
                )}
              </div>
              {isOpen && (
                <>
                  {items.map(c => <PhoneConvRow key={c.id} conv={c} onClick={() => onOpenConv(c.id)} />)}
                </>
              )}
            </div>
          );
        })}
      </div>

      {creatingGroup && (
        <div className="ph-group-sheet" role="dialog" aria-modal="true" aria-label="New group chat">
          <button className="ph-group-sheet__scrim" onClick={() => setCreatingGroup(false)} aria-label="Cancel new group chat" />
          <div className="ph-group-sheet__panel">
            <div className="ph-group-sheet__grabber" />
            <h2 className="ph-group-sheet__title">New group chat</h2>
            <label className="ph-group-sheet__field">
              <span>Group name</span>
              <input
                className="ph-group-create__input"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                placeholder="Site coordination"
                autoFocus
              />
            </label>
            <div className="ph-group-sheet__members-head">
              <span>Members</span>
              <strong>{groupMembers.size} selected</strong>
            </div>
            <div className="ph-group-create__members">
              {availableGroupMembers.map(p => (
                <button
                  key={p.name}
                  className={'ph-group-create__member' + (groupMembers.has(p.name) ? ' is-selected' : '')}
                  onClick={() => toggleGroupMember(p.name)}
                  type="button"
                >
                  {PMC.Avatar && <PMC.Avatar p={p} size={22} />}
                  <span>{p.name.split(' ')[0]}</span>
                  {groupMembers.has(p.name) && PI.check && (
                    <span className="ph-group-create__check"><PI.check size={12} stroke={2.2} /></span>
                  )}
                </button>
              ))}
            </div>
            <div className="ph-group-create__actions">
              <button className="ph-group-create__cancel" onClick={() => setCreatingGroup(false)} type="button">Cancel</button>
              <button
                className="ph-group-create__submit"
                onClick={createCustomGroup}
                disabled={!groupName.trim() || groupMembers.size === 0}
                type="button"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PhoneChatModeSwitch({ active, projectCount, dmCount, onProject, onDMs }) {
  return (
    <div className="ph-chatmode" role="tablist" aria-label="Chat inbox type">
      <button
        className={'ph-chatmode__btn' + (active === 'project' ? ' is-active' : '')}
        onClick={onProject}
        type="button"
        role="tab"
        aria-selected={active === 'project'}
      >
        <span>Project chats</span>
        {projectCount > 0 && <span className="ph-chatmode__count">{projectCount > 99 ? '99+' : projectCount}</span>}
      </button>
      <button
        className={'ph-chatmode__btn' + (active === 'direct' ? ' is-active' : '')}
        onClick={onDMs}
        type="button"
        role="tab"
        aria-selected={active === 'direct'}
      >
        <span>Direct messages</span>
        {dmCount > 0 && <span className="ph-chatmode__count">{dmCount > 99 ? '99+' : dmCount}</span>}
      </button>
    </div>
  );
}

function PhoneConvRow({ conv, onClick, contextLine }) {
  const cfg = (window.MC.TYPE_CFG && window.MC.TYPE_CFG[conv.type]) || (window.MC.TYPE_CFG && window.MC.TYPE_CFG.project) || {};
  const Glyph = cfg.Glyph || (window.MC.I && window.MC.I.msg);
  const Avatar = window.MC.Avatar;
  const hasUnread = conv.unreadCount > 0;
  const isDM = conv.type === 'direct';
  const title = phoneChatDisplayTitle(conv);
  return (
    <button className="ph-conv" onClick={onClick}>
      <div className="ph-conv__lead">
        {isDM && conv.participants[0] && Avatar ? (
          <Avatar p={conv.participants[0]} size={40} />
        ) : (
          <div className="ph-conv__icon" style={{ '--h': cfg.hue }}>
            {Glyph && <Glyph size={16} stroke={1.8} />}
          </div>
        )}
      </div>
      <div className="ph-conv__body">
        <div className="ph-conv__top">
          <span className={'ph-conv__title' + (hasUnread?' is-unread':'')}>{title}</span>
          <span className="ph-conv__time">{PD.fmtRelative(conv.timestamp)}</span>
        </div>
        <div className="ph-conv__sub">
          <span className="ph-conv__preview">
            {!isDM && conv.lastSender && <span className="ph-conv__sender">{conv.lastSender.split(' ')[0]}: </span>}
            {conv.lastMessage}
          </span>
          {hasUnread && <span className="ph-conv__badge">{conv.unreadCount > 9 ? '9+' : conv.unreadCount}</span>}
        </div>
        {(contextLine || conv.subtitle) && (
          <div className="ph-conv__meta">
            {contextLine}
            {contextLine && conv.subtitle ? ' · ' : ''}
            {!contextLine && conv.subtitle ? conv.subtitle : ''}
            {contextLine && conv.subtitle ? conv.subtitle : ''}
          </div>
        )}
      </div>
    </button>
  );
}

// ── Chat screen ──────────────────────────────────────────────────────────────
function PhoneChat({ conv, project, onBack, isArchived, onArchive, onOpenDetails }) {
  const [composed, setComposed] = pUseState([]);
  const [text, setText] = pUseState('');
  const scrollRef = pUseRef(null);
  const cfg = PTYPE[conv.type] || PTYPE.project;
  const Glyph = (cfg && cfg.Glyph) || (window.MC.I && window.MC.I.msg);
  const others = conv.participants.filter(p => p.name !== 'You');
  const isLinked = conv.type !== 'project' && conv.type !== 'direct' && conv.subtitle;
  const linkedLabel = conv.type === 'task' ? 'Due date'
    : conv.type === 'procurement' ? 'Linked procurement'
    : conv.type === 'site-issue' ? 'Linked site issue'
    : conv.type === 'custom-group' ? 'Custom group'
    : 'Linked chat';
  const openLabel = conv.type === 'task' ? 'Open task'
    : conv.type === 'procurement' ? 'Open procurement'
    : conv.type === 'site-issue' ? 'Open issue'
    : 'Open';
  const title = phoneChatDisplayTitle(conv, project);

  const baseMsgs = pUseMemo(() => PD.getMessages(conv.id), [conv.id]);
  const allMsgs = pUseMemo(() => groupPhone(baseMsgs.concat(composed)), [baseMsgs, composed]);

  pUseLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [allMsgs.length, conv.id]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    setComposed(prev => [...prev, {
      id: 'u' + Date.now(), content: t, sender: PD.participants.you, timestamp: new Date(), isOwn: true,
    }]);
    setText('');
  };

  return (
    <div className="ph">
      <div className="ph-chat">
        <div className="ph-chat__head">
          <button className="ph-chat__head-back" onClick={onBack}><BackIcon /></button>
          <button className="ph-chat__head-id" onClick={onOpenDetails} aria-label="Open details">
            {conv.type === 'direct' && conv.participants[0] && window.MC.Avatar ? (
              React.createElement(window.MC.Avatar, { p: conv.participants[0], size: 36, ring: true })
            ) : (
              <div className="ph-chat__head-icon" style={{ '--h': cfg.hue }}>
                <Glyph size={16} stroke={1.8} />
              </div>
            )}
            <div className="ph-chat__head-text">
              <div className="ph-chat__head-title">
                <span style={{overflow:'hidden', textOverflow:'ellipsis'}}>{title}</span>
              </div>
              <div className="ph-chat__head-sub">
                {conv.type !== 'direct' && project && <span>{project.name}</span>}
                {others.length > 0 && conv.type !== 'direct' && <span>· {others.length + 1} members</span>}
                {conv.type === 'direct' && conv.participants[0] && <span>{conv.participants[0].role}</span>}
              </div>
            </div>
          </button>
          <div className="ph-chat__head-actions">
            <button className="ph-chat__head-btn"><PI.phone size={17} /></button>
            <button className="ph-chat__head-btn" onClick={onOpenDetails} aria-label="Details">
              <PI.info size={18} />
            </button>
          </div>
        </div>

        {isArchived && (
          <div className="ph-chat__archived">
            <div className="ph-chat__archived-left">
              <PI.archive size={13} />
              <span>This chat is archived</span>
            </div>
            <button className="ph-chat__archived-btn" onClick={onArchive}>
              <PI.rotate size={11} />
              <span>Reopen</span>
            </button>
          </div>
        )}

        {isLinked && (
          <div className="ph-chat__context" style={{ '--h': cfg.hue }}>
            <div className="ph-chat__context-icon"><Glyph size={13} stroke={2} /></div>
            <div className="ph-chat__context-body">
              <div className="ph-chat__context-title">{linkedLabel}</div>
              <div className="ph-chat__context-meta">{conv.subtitle}</div>
            </div>
            <button className="ph-chat__context-link" onClick={onOpenDetails} type="button" aria-label={`${openLabel}: ${conv.title}`}>
              <span>{openLabel}</span>
              {PI.link && <PI.link size={12} stroke={2} />}
            </button>
          </div>
        )}

        <div className="ph-chat__stream" ref={scrollRef}>
          {allMsgs.map(m => <PhoneMsg key={m.id} m={m} />)}
        </div>

        {!isArchived && (
          <div className="ph-composer">
            <button className="ph-composer__btn"><PI.plus size={20} /></button>
            <div className="ph-composer__field">
              <input
                style={{flex:1, border:0, outline:'none', background:'transparent', color:'var(--mc-text)', fontSize:14}}
                value={text}
                onChange={e=>setText(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); send(); } }}
                placeholder="Message…"
              />
              <PI.smile size={18} />
            </div>
            {text.trim() ? (
              <button className="ph-composer__send" onClick={send}><PI.send size={16} /></button>
            ) : (
              <button className="ph-composer__btn"><PI.mic size={20} /></button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function groupPhone(msgs) {
  const out = [];
  for (let i = 0; i < msgs.length; i++) {
    const m = msgs[i], prev = msgs[i-1], next = msgs[i+1];
    const sP = prev && prev.sender.name === m.sender.name && (m.timestamp - prev.timestamp) < 5*60_000;
    const sN = next && next.sender.name === m.sender.name && (next.timestamp - m.timestamp) < 5*60_000;
    let pos;
    if (!sP && !sN) pos = 'single';
    else if (!sP && sN) pos = 'first';
    else if (sP && sN) pos = 'middle';
    else pos = 'last';
    let showDay = !prev || prev.timestamp.toDateString() !== m.timestamp.toDateString();
    out.push({ ...m, pos, showDay });
  }
  return out;
}

function PhoneMsg({ m }) {
  const own = m.isOwn;
  const showAvatar = !own && (m.pos === 'last' || m.pos === 'single');
  const showName = !own && (m.pos === 'first' || m.pos === 'single');
  return (
    <>
      {m.showDay && <div className="ph-day"><span>{PD.fmtDay(m.timestamp)}</span></div>}
      <div className={'ph-msg ph-msg--' + (own?'own':'other') + ' ph-msg--' + m.pos}>
        <div className="ph-msg__avatar">
          {showAvatar && !own && window.MC.Avatar && React.createElement(window.MC.Avatar, { p: m.sender, size: 24 })}
        </div>
        <div className="ph-msg__col">
          {showName && (
            <div className="ph-msg__name">
              <span style={{ color: `oklch(0.78 0.08 ${m.sender.hue ?? 220})` }}>{m.sender.name}</span>
              <span className="ph-msg__role">{m.sender.role}</span>
            </div>
          )}
          <div className="ph-msg__bubble">
            <span>{m.content}</span>
            <span className="ph-msg__time">{PD.fmtTime(m.timestamp)}</span>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Direct messages list ─────────────────────────────────────────────────────
function PhoneDMs({ onBack, onOpenConv, archivedIds, onOpenPicker, onOpenProjectChats, projectUnread, customConversations, onCreateCustomGroup }) {
  const [search, setSearch] = pUseState('');
  const [creatingGroup, setCreatingGroup] = pUseState(false);
  const [groupName, setGroupName] = pUseState('');
  const [groupMembers, setGroupMembers] = pUseState(new Set());
  const archived = archivedIds || new Set();
  const dmUnread = pUseMemo(() => PD.getGlobalDMs().reduce((s, c) => s + c.unreadCount, 0), []);
  const globalGroups = (customConversations || []).filter(c => !c.projectId && c.type === 'custom-group');
  const availableGroupMembers = pUseMemo(() => {
    const byName = new Map();
    for (const c of PD.getGlobalDMs()) {
      for (const p of c.participants || []) {
        if (p.name !== 'You') byName.set(p.name, p);
      }
    }
    return Array.from(byName.values()).slice(0, 6);
  }, []);
  const dms = [...PD.getGlobalDMs(), ...globalGroups].filter(c => {
    if (archived.has(c.id)) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.title.toLowerCase().includes(q) ||
      (c.subtitle || '').toLowerCase().includes(q) ||
      (c.lastMessage || '').toLowerCase().includes(q);
  });
  const startCustomGroup = () => {
    setCreatingGroup(true);
    setGroupName('');
    setGroupMembers(new Set(availableGroupMembers.slice(0, 2).map(p => p.name)));
  };
  const toggleGroupMember = name => setGroupMembers(prev => {
    const next = new Set(prev);
    next.has(name) ? next.delete(name) : next.add(name);
    return next;
  });
  const createCustomGroup = () => {
    const title = groupName.trim();
    if (!title || groupMembers.size === 0) return;
    const participants = availableGroupMembers.filter(p => groupMembers.has(p.name));
    const conv = {
      id: `c-phone-global-${Date.now()}`,
      projectId: '',
      type: 'custom-group',
      title,
      subtitle: `Custom group · ${participants.length + 1} members`,
      lastMessage: 'Custom group created.',
      lastSender: 'You',
      timestamp: new Date(),
      unreadCount: 0,
      priority: 'normal',
      priorityLevel: 'p3',
      participants,
    };
    onCreateCustomGroup && onCreateCustomGroup(conv);
    setCreatingGroup(false);
    setGroupName('');
    setGroupMembers(new Set());
  };
  return (
    <div className="ph">
      <div className="ph-top ph-top--withchip">
        <button className="ph-top__back" onClick={onBack}><BackIcon /></button>
        <div className="ph-top__title">
          {window.PMC.PhoneProjectChip ? (
            <window.PMC.PhoneProjectChip
              project={null}
              screen="Direct messages"
              onClick={onOpenPicker}
            />
          ) : (
            <>
              <h1>Direct messages</h1>
              <div className="ph-top__sub">Person-to-person</div>
            </>
          )}
        </div>
        <div className="ph-top__actions">
          <button className="ph-top__btn" onClick={startCustomGroup} type="button" aria-label="Create group chat">
            <PI.plus size={18} stroke={2.1} />
          </button>
        </div>
      </div>
      <PhoneChatModeSwitch
        active="direct"
        projectCount={projectUnread || 0}
        dmCount={dmUnread}
        onProject={onOpenProjectChats}
        onDMs={() => {}}
      />
      <div className="ph-search">
        <PI.search size={14} />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search people..." />
      </div>
      <div className="ph-scroll">
        {dms.map(c => <PhoneConvRow key={c.id} conv={c} onClick={() => onOpenConv(c.id, c)} />)}
      </div>
      {creatingGroup && (
        <div className="ph-group-sheet" role="dialog" aria-modal="true" aria-label="New group chat">
          <button className="ph-group-sheet__scrim" onClick={() => setCreatingGroup(false)} aria-label="Cancel new group chat" />
          <div className="ph-group-sheet__panel">
            <div className="ph-group-sheet__grabber" />
            <h2 className="ph-group-sheet__title">New group chat</h2>
            <label className="ph-group-sheet__field">
              <span>Group name</span>
              <input
                className="ph-group-create__input"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                placeholder="Team coordination"
                autoFocus
              />
            </label>
            <div className="ph-group-sheet__members-head">
              <span>Members</span>
              <strong>{groupMembers.size} selected</strong>
            </div>
            <div className="ph-group-create__members">
              {availableGroupMembers.map(p => (
                <button
                  key={p.name}
                  className={'ph-group-create__member' + (groupMembers.has(p.name) ? ' is-selected' : '')}
                  onClick={() => toggleGroupMember(p.name)}
                  type="button"
                >
                  {PMC.Avatar && <PMC.Avatar p={p} size={22} />}
                  <span>{p.name.split(' ')[0]}</span>
                  {groupMembers.has(p.name) && PI.check && (
                    <span className="ph-group-create__check"><PI.check size={12} stroke={2.2} /></span>
                  )}
                </button>
              ))}
            </div>
            <div className="ph-group-create__actions">
              <button className="ph-group-create__cancel" onClick={() => setCreatingGroup(false)} type="button">Cancel</button>
              <button
                className="ph-group-create__submit"
                onClick={createCustomGroup}
                disabled={!groupName.trim() || groupMembers.size === 0}
                type="button"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PhoneTabbar({ active }) {
  const items = [
    { id: 'messages', label: 'Messages', icon: PI.msg },
    { id: 'tasks', label: 'Tasks', icon: PI.check },
    { id: 'projects', label: 'Projects', icon: PI.panelR },
    { id: 'me', label: 'Me', icon: PI.user },
  ];
  return (
    <div className="ph-tabbar">
      {items.map(i => {
        const I = i.icon;
        return (
          <button key={i.id} className={'ph-tab' + (active===i.id?' is-active':'')}>
            <I size={20} stroke={active===i.id?2.2:1.6} />
            <span>{i.label}</span>
          </button>
        );
      })}
    </div>
  );
}

window.PMC = { PhoneProjects, PhoneProjectInbox, PhoneChat, PhoneDMs };
