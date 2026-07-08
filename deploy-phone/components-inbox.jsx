// Inbox / Conversation list
const { useState: _useState, useMemo: _useMemo } = React;
const _D = window.MeccaData;
const _MC = window.MC;
const _I = _MC.I;
const _TYPE = _MC.TYPE_CFG;

const SECTION_DEFS = [
  { type: 'project',     label: 'Project chat'   },
  { type: 'task',        label: 'Tasks'          },
  { type: 'procurement', label: 'Procurement'    },
  { type: 'site-issue',  label: 'Site issues'    },
  { type: 'custom-group',label: 'Custom group chats' },
];

function TypeChip({ type }) {
  const cfg = _TYPE[type];
  const Glyph = cfg.Glyph;
  return (
    <span
      className="mc-typechip"
      style={{ '--h': cfg.hue }}
    >
      <Glyph size={11} stroke={2} />
    </span>
  );
}

function Search({ value, onChange, placeholder = 'Search conversations…' }) {
  return (
    <div className="mc-search">
      <_I.search size={14} />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      {value && <button className="mc-search__clear" onClick={() => onChange('')}>×</button>}
    </div>
  );
}

function ConvRow({ conv, isSelected, onClick, density, grouping }) {
  const cfg = _TYPE[conv.type];
  const Glyph = cfg.Glyph;
  const hasUnread = conv.unreadCount > 0;
  const showAvatar = conv.type === 'direct' || grouping === 'flat';
  const padded = density === 'spacious' ? 'mc-row--spacious' : density === 'compact' ? 'mc-row--compact' : '';

  // Show first participant avatar for direct/flat; show type glyph otherwise
  const senderHeader = conv.lastSender && conv.type !== 'direct';

  return (
    <button
      onClick={onClick}
      className={'mc-row ' + (isSelected ? 'is-selected ' : '') + padded}
    >
      <div className="mc-row__lead">
        {showAvatar && conv.participants[0] ? (
          <_MC.Avatar p={conv.participants[0]} size={36} />
        ) : (
          <div className="mc-row__icon" style={{ '--h': cfg.hue }}>
            <Glyph size={16} stroke={1.8} />
          </div>
        )}
      </div>

      <div className="mc-row__body">
        <div className="mc-row__top">
          <span className={'mc-row__title' + (hasUnread ? ' is-unread' : '')}>
            {conv.title}
          </span>
          <span className="mc-row__time">{_D.fmtRelative(conv.timestamp)}</span>
        </div>
        <div className="mc-row__sub">
          <span className="mc-row__preview">
            {senderHeader && <span className="mc-row__sender">{conv.lastSender.split(' ')[0]}: </span>}
            {conv.lastMessage}
          </span>
          {hasUnread && (
            <span className="mc-row__badge">{conv.unreadCount > 9 ? '9+' : conv.unreadCount}</span>
          )}
        </div>
        {conv.subtitle && density !== 'compact' && (
          <div className="mc-row__meta">{conv.subtitle}</div>
        )}
      </div>
    </button>
  );
}

function SectionHead({ label, count, unread, isOpen, onToggle, type, action }) {
  const cfg = type ? _TYPE[type] : null;
  const Glyph = cfg ? cfg.Glyph : null;
  return (
    <div className={'mc-section__head' + (isOpen ? '' : ' is-collapsed')}>
      <button className="mc-section__toggle" onClick={onToggle} type="button">
        <_I.chev size={12} className={'mc-section__chev' + (isOpen ? '' : ' is-rot')} />
        {Glyph && <span className="mc-section__glyph" style={{ color: `oklch(0.7 0.12 ${cfg.hue})` }}><Glyph size={12} stroke={2} /></span>}
        <span className="mc-section__label">{label}</span>
        <span className="mc-section__count">{count}</span>
        {!isOpen && unread > 0 && <span className="mc-section__unread">{unread}</span>}
      </button>
      {action}
    </div>
  );
}

function ConversationList({ mode, project, selectedId, onSelect, density, grouping, onCollapseInbox, archivedIds, customConversations, onCreateCustomGroup }) {
  const [search, setSearch] = _useState('');
  const [openSections, setOpenSections] = _useState(new Set(['project','task','procurement','site-issue','custom-group']));
  const [filter, setFilter] = _useState('all'); // all | unread | archive
  const [creatingGroup, setCreatingGroup] = _useState(false);
  const [groupName, setGroupName] = _useState('');
  const [groupMembers, setGroupMembers] = _useState(new Set());
  const archived = archivedIds || new Set();

  const projectId = project?.id ?? '';
  const isDM = mode === 'direct';

  const all = _useMemo(() => {
    if (isDM) return _D.getGlobalDMs();
    return [
      ..._D.getProjectConversations(projectId),
      ...((customConversations || []).filter(c => c.projectId === projectId)),
    ];
  }, [isDM, projectId, customConversations]);

  const availableGroupMembers = _useMemo(() => {
    const byName = new Map();
    for (const c of all) {
      for (const p of c.participants || []) {
        if (p.name !== 'You') byName.set(p.name, p);
      }
    }
    return Array.from(byName.values()).slice(0, 6);
  }, [all]);

  const filtered = _useMemo(() => {
    let list = all;
    // Archive filter is its own bucket: show only archived; All/Unread hide them.
    if (filter === 'archive') list = list.filter(c => archived.has(c.id));
    else list = list.filter(c => !archived.has(c.id));
    if (filter === 'unread') list = list.filter(c => c.unreadCount > 0);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q) ||
        (c.subtitle || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [all, filter, search, archived]);

  const sortedFlat = _useMemo(() => {
    const order = { p1: 0, p2: 1, p3: 2, none: 3 };
    return [...filtered].sort((a, b) => {
      const la = order[a.priorityLevel] ?? 2, lb = order[b.priorityLevel] ?? 2;
      if (la !== lb) return la - lb;
      if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount;
      return b.timestamp - a.timestamp;
    });
  }, [filtered]);

  const grouped = _useMemo(() => {
    const map = new Map();
    for (const c of filtered) {
      const arr = map.get(c.type) || [];
      arr.push(c);
      map.set(c.type, arr);
    }
    return map;
  }, [filtered]);

  const toggle = type => setOpenSections(prev => {
    const n = new Set(prev);
    n.has(type) ? n.delete(type) : n.add(type);
    return n;
  });

  const startCustomGroup = () => {
    setCreatingGroup(true);
    setOpenSections(prev => new Set([...prev, 'custom-group']));
    setGroupName('');
    setGroupMembers(new Set(availableGroupMembers.slice(0, 2).map(p => p.name)));
  };
  const toggleGroupMember = name => setGroupMembers(prev => {
    const n = new Set(prev);
    n.has(name) ? n.delete(name) : n.add(name);
    return n;
  });
  const createCustomGroup = () => {
    const title = groupName.trim();
    if (!title || !projectId || groupMembers.size === 0) return;
    const participants = availableGroupMembers.filter(p => groupMembers.has(p.name));
    const conv = {
      id: `c-local-${projectId}-${Date.now()}`,
      projectId,
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

  // ── Inbox header ───────────────────────────────────────────────────────────
  let header;
  if (isDM) {
    const dmUnread = _D.getGlobalDMs().reduce((s, c) => s + c.unreadCount, 0);
    header = (
      <div className="mc-inbox__head">
        <div className="mc-inbox__title">
          <h2>Direct messages</h2>
          {dmUnread > 0 && <span className="mc-inbox__pill">{dmUnread} unread</span>}
        </div>
        <p className="mc-inbox__subtitle">Person-to-person · not linked to a project</p>
      </div>
    );
  } else if (project) {
    const breakdown = _D.getUnreadBreakdown(project.id);
    header = (
      <div className="mc-inbox__head">
        <div className="mc-inbox__title">
          <div className="mc-inbox__chip" style={{ background: project.color + '22', color: project.color }}>
            {project.initials}
          </div>
          <div className="mc-inbox__titlecol">
            <h2>{project.name}</h2>
            <p className="mc-inbox__subtitle">
              {project.manager}
            </p>
          </div>
          {onCollapseInbox && (
            <button className="mc-iconbtn" onClick={onCollapseInbox} title="Collapse list">
              <_I.panelL size={15} />
            </button>
          )}
        </div>
      </div>
    );
  } else {
    header = <div className="mc-inbox__head"><div className="mc-inbox__title"><h2>Messages</h2></div></div>;
  }

  return (
    <div className="mc-inbox">
      {header}

      <div className="mc-inbox__toolbar">
        <Search value={search} onChange={setSearch} placeholder={isDM ? 'Search people…' : 'Search conversations…'} />
        <div className="mc-segmented mc-segmented--filters">
          {['all', 'unread', 'archive'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={filter === f ? 'is-active' : ''} title={f === 'archive' ? 'Archived chats' : null}>
              {f === 'archive' ? (
                <><_I.archive size={12} stroke={2} /><span>Archive</span></>
              ) : (
                f === 'all' ? 'All' : 'Unread'
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mc-inbox__scroll">
        {grouping === 'flat' || isDM ? (
          <div className="mc-section__body mc-section__body--top">
            {sortedFlat.length === 0 && (
              <div className="mc-empty"><_I.msg size={20} /><p>No conversations</p></div>
            )}
            {sortedFlat.map(c => (
              <ConvRow key={c.id} conv={c} isSelected={c.id === selectedId} onClick={() => onSelect(c.id)} density={density} grouping={grouping} />
            ))}
          </div>
        ) : (
          <>
            {SECTION_DEFS.map(def => {
              const items = grouped.get(def.type) || [];
              const canCreateCustom = !isDM && def.type === 'custom-group';
              if (!items.length && !canCreateCustom) return null;
              const isOpen = openSections.has(def.type);
              const unread = items.reduce((s, c) => s + c.unreadCount, 0);
              return (
                <section key={def.type} className="mc-section">
                  <SectionHead
                    label={def.label}
                    count={items.length}
                    unread={unread}
                    isOpen={isOpen}
                    onToggle={() => toggle(def.type)}
                    type={def.type}
                    action={canCreateCustom && (
                      <button className="mc-section__add" onClick={startCustomGroup} type="button" aria-label="Add custom group chat">
                        <_I.plus size={12} stroke={2.2} />
                      </button>
                    )}
                  />
                  {isOpen && (
                    <div className="mc-section__body">
                      {canCreateCustom && creatingGroup && (
                        <div className="mc-group-create">
                          <input
                            className="mc-group-create__input"
                            value={groupName}
                            onChange={e => setGroupName(e.target.value)}
                            placeholder="Group name"
                            autoFocus
                          />
                          <div className="mc-group-create__members">
                            {availableGroupMembers.map(p => (
                              <button
                                key={p.name}
                                className={'mc-group-create__member' + (groupMembers.has(p.name) ? ' is-selected' : '')}
                                onClick={() => toggleGroupMember(p.name)}
                                type="button"
                              >
                                <_MC.Avatar p={p} size={22} />
                                <span>{p.name.split(' ')[0]}</span>
                              </button>
                            ))}
                          </div>
                          <div className="mc-group-create__actions">
                            <button className="mc-group-create__cancel" onClick={() => setCreatingGroup(false)} type="button">Cancel</button>
                            <button
                              className="mc-group-create__submit"
                              onClick={createCustomGroup}
                              disabled={!groupName.trim() || groupMembers.size === 0}
                              type="button"
                            >
                              Create
                            </button>
                          </div>
                        </div>
                      )}
                      {items.map(c => (
                        <ConvRow key={c.id} conv={c} isSelected={c.id === selectedId} onClick={() => onSelect(c.id)} density={density} grouping={grouping} />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}

            {grouped.size === 0 && (
              <div className="mc-empty"><_I.msg size={20} /><p>No conversations</p></div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

window.MC.ConversationList = ConversationList;
