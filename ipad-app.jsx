// iPad app — master-detail layout with collapsible drawer (Option 2).
// Reuses the existing Mecca components but rearranges chrome for touch.

const { useState: _IS, useEffect: _IE, useMemo: _IM, useRef: _IR } = React;
const IDAT = window.MeccaData;
const IC = window.MC;

const I_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "accent": "indigo",
  "density": "comfortable",
  "grouping": "by-type",
  "bubbleStyle": "rounded",
  "drawerDefault": "rail"
}/*EDITMODE-END*/;

const I_ACCENTS = {
  indigo:  { hue: 252, name: 'Indigo' },
  blue:    { hue: 230, name: 'Blue'   },
  emerald: { hue: 160, name: 'Emerald'},
  amber:   { hue: 50,  name: 'Amber'  },
};

// ── Icons (small set used by the iPad chrome) ───────────────────────────────
const _IIc = ({ d, size = 22, stroke = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const II = {
  menu:     p => <_IIc {...p} d={<><path d="M4 6h16M4 12h16M4 18h16"/></>} />,
  back:     p => <_IIc {...p} d={<><path d="M15 6l-6 6 6 6"/></>} />,
  search:   p => <_IIc {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>} />,
  bell:     p => <_IIc {...p} d={<><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9z"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>} />,
  home:     p => <_IIc {...p} d={<><path d="m3 11 9-8 9 8"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/></>} />,
  calendar: p => <_IIc {...p} d={<><rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9.5h18"/><path d="M8 2.5v4M16 2.5v4"/></>} />,
  admin:    p => <_IIc {...p} d={<><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/><path d="m9 12 2 2 4-4"/></>} />,
  procure:  p => <_IIc {...p} d={<><path d="M2 3h2l3 12h13l3-9H6.5"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></>} />,
  chat:     p => <_IIc {...p} d={<><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"/></>} />,
  files:    p => <_IIc {...p} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>} />,
};

const IPAD_MODULES = [
  { id: 'home',     label: 'Home',        Glyph: II.home,     count: 0 },
  { id: 'chat',     label: 'Chat',        Glyph: II.chat,     count: 12 },
  { id: 'calendar', label: 'Calendar',    Glyph: II.calendar, count: 2 },
  { id: 'admin',    label: 'Admin',       Glyph: II.admin,    count: 0 },
  { id: 'procure',  label: 'Procurement', Glyph: II.procure,  count: 3 },
  { id: 'files',    label: 'Files',       Glyph: II.files,    count: 0 },
];

// ── Top bar ─────────────────────────────────────────────────────────────────
function IPadTopBar({ portrait, view, activeModule, onSelectModule, onMenu, onBack, onOpenSearch, contextEyebrow, contextTitle, navStyle }) {
  // In portrait chat drill-down: back chevron + breadcrumb (modules hidden to
  // make room for the conversation title).
  const showBack = portrait && view === 'chat';
  const showModules = !showBack;
  const isNative = navStyle === 'native';
  const isFloating = navStyle === 'floating';
  const headerCls =
    'ipad-top'
    + (isNative ? ' ipad-top--native' : '')
    + (isFloating ? ' ipad-top--floating' : '');

  return (
    <header className={headerCls}>
      {showBack ? (
        <button className="ipad-top__back" onClick={onBack} aria-label="Back to inbox">
          <II.back size={22} />
        </button>
      ) : (
        <button className="ipad-top__menu" onClick={onMenu} aria-label="Toggle projects">
          <II.menu size={22} />
        </button>
      )}

      {showBack && (
        <div className="ipad-top__context">
          {contextEyebrow && <span className="ipad-top__context-eyebrow">{contextEyebrow}</span>}
          {contextTitle && <span className="ipad-top__context-title">{contextTitle}</span>}
        </div>
      )}

      {showModules && (
        <nav
          className={'ipad-top__nav'
            + (isNative ? ' ipad-top__nav--native' : '')
            + (isFloating ? ' ipad-top__nav--floating' : '')}
          aria-label="Modules"
          role="tablist"
        >
          {IPAD_MODULES.map(m => {
            const isActive = m.id === activeModule;
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={isActive}
                className={'ipad-top__tab' + (isActive ? ' is-active' : '')}
                onClick={() => onSelectModule(m.id)}
                aria-current={isActive ? 'page' : undefined}
                title={m.label}
              >
                <m.Glyph size={isNative || isFloating ? 17 : 18} />
                <span className="ipad-top__tab-label">{m.label}</span>
                {!isNative && !isFloating && m.count > 0 && (
                  <span className={'ipad-top__tab-count' + (isActive ? ' is-active' : '')}>
                    {m.count > 99 ? '99+' : m.count}
                  </span>
                )}
                {(isNative || isFloating) && m.count > 0 && !isActive && (
                  <span className="ipad-top__tab-dot" aria-hidden />
                )}
                {!isNative && !isFloating && isActive && <span className="ipad-top__tab-bar" />}
              </button>
            );
          })}
        </nav>
      )}

      {showModules && <div style={{ flex: 1, minWidth: 0 }} />}

      <button className="ipad-top__search" onClick={onOpenSearch} aria-label="Search (⌘K)">
        <II.search size={16} />
        <span>Search…</span>
        <kbd>⌘ K</kbd>
      </button>

      <div className="ipad-top__right">
        <button className="ipad-top__icon" aria-label="Notifications">
          <II.bell size={20} />
          <span className="ipad-dot">3</span>
        </button>
        <div className="ipad-top__user" title="You · PM">YO</div>
      </div>
    </header>
  );
}

// ── Drawer (projects only — modules live in the top bar) ───────────────────
function IPadDrawer({ open, activeModule, selectedProjectId, onSelectProject, projects }) {
  return (
    <aside className="ipad-drawer" aria-label="Projects">
      <div className="ipad-drawer__sec-label">Projects</div>

      <div className="ipad-drawer__projects">
        {projects.map(p => {
          const isActive = p.id === selectedProjectId && activeModule === 'chat';
          const prio = p.priorityLevel === 'critical' ? 'crit' : p.priorityLevel === 'high' ? 'high' : null;
          return (
            <button
              key={p.id}
              className={'ipad-proj' + (isActive ? ' is-active' : '')}
              onClick={() => onSelectProject(p.id)}
              title={p.name}
            >
              <span className="ipad-proj__chip" style={{ '--mc-c': p.color }}>
                {p.initials}
                {prio && <span className={'ipad-proj__chip-prio ipad-proj__chip-prio--' + prio} />}
              </span>
              <span className="ipad-proj__body">
                <span className="ipad-proj__name">{p.name}</span>
                <span className="ipad-proj__reason">{p.priorityReason}</span>
              </span>
              {p.unreadMessages > 0 && open && (
                <span className="ipad-proj__badge">{p.unreadMessages}</span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

// ── App ─────────────────────────────────────────────────────────────────────
function IPadApp() {
  const [tweaks, setTweak] = (window.useTweaks || (() => [I_TWEAK_DEFAULTS, () => {}]))(I_TWEAK_DEFAULTS);

  // ?nav=native|classic overrides the tweak without persisting (used by the
  // showcase canvas to compare both variants without stomping the saved value).
  const navOverride = _IM(() => {
    const p = new URLSearchParams(window.location.search).get('nav');
    return (p === 'native' || p === 'classic' || p === 'floating') ? p : null;
  }, []);
  const effectiveNavStyle = navOverride || tweaks.navStyle;

  // Apply tokens to :root
  _IE(() => {
    const root = document.documentElement;
    root.dataset.theme = tweaks.theme;
    root.dataset.density = tweaks.density;
    root.dataset.bubble = tweaks.bubbleStyle;
    const acc = I_ACCENTS[tweaks.accent] || I_ACCENTS.indigo;
    root.style.setProperty('--mc-accent-h', acc.hue);
  }, [tweaks.theme, tweaks.density, tweaks.accent, tweaks.bubbleStyle]);

  // Portrait detection
  const [portrait, setPortrait] = _IS(() => window.matchMedia('(max-width: 1023px)').matches);
  _IE(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const onChange = e => setPortrait(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  // Drawer state — in landscape it's a pinned rail/open toggle;
  // in portrait it's an overlay that defaults closed.
  const [drawerOpen, setDrawerOpen] = _IS(false);
  // When orientation flips, reset to a sensible default.
  _IE(() => { setDrawerOpen(false); }, [portrait]);

  // Selection state — same shape as the Mac app
  const defaultProject = _IM(
    () => IDAT.PRIORITY_PROJECTS.find(p => p.priorityLevel === 'critical') || IDAT.PRIORITY_PROJECTS[0],
    []
  );
  const initialModule = _IM(() => {
    const requested = new URLSearchParams(window.location.search).get('module');
    if (requested === 'files' || window.IPAD_INITIAL_MODULE === 'files') return 'files';
    return 'chat';
  }, []);
  const [activeModule, setActiveModule] = _IS(initialModule);
  const [selectedMode, setSelectedMode] = _IS('project');
  const [selectedProjectId, setSelectedProjectId] = _IS(defaultProject.id);
  const [selectedConvId, setSelectedConvId] = _IS('');
  // Portrait drill-down: 'inbox' (default) or 'chat'
  const [view, setView] = _IS('inbox');
  const [archivedIds, setArchivedIds] = _IS(new Set());
  const [detailsOpen, setDetailsOpen] = _IS(false);
  const [searchOpen, setSearchOpen] = _IS(false);

  const toggleArchived = id => setArchivedIds(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const project = _IM(
    () => IDAT.PRIORITY_PROJECTS.find(p => p.id === selectedProjectId),
    [selectedProjectId]
  );

  // Auto-select a conversation when project changes
  _IE(() => {
    if (selectedMode === 'project') setSelectedConvId(IDAT.autoSelectConv(selectedProjectId));
    else {
      const dms = IDAT.getGlobalDMs();
      const u = dms.find(d => d.unreadCount > 0);
      setSelectedConvId(u ? u.id : (dms[0]?.id || ''));
    }
  }, [selectedProjectId, selectedMode]);

  const conv = _IM(() => {
    if (selectedMode === 'direct') return IDAT.getGlobalDMs().find(c => c.id === selectedConvId) || null;
    const all = [...IDAT.getProjectConversations(selectedProjectId), ...IDAT.getProjectDMs(selectedProjectId)];
    return all.find(c => c.id === selectedConvId) || null;
  }, [selectedMode, selectedProjectId, selectedConvId]);

  // Handlers
  const handleSelectModule = (id) => {
    setActiveModule(id);
    if (portrait) setDrawerOpen(false);
    if (id === 'chat') setView('inbox');
  };
  const handleSelectProject = (id) => {
    setActiveModule('chat');
    setSelectedProjectId(id);
    setSelectedMode('project');
    if (portrait) {
      setDrawerOpen(false);
      setView('inbox');
    }
  };
  const handleSelectDirect = () => setSelectedMode('direct');
  const handleSelectConv = (id) => {
    setSelectedConvId(id);
    if (portrait) setView('chat');
  };
  const handleBackToInbox = () => setView('inbox');

  const handleOpenDM = (personName) => {
    const proj = IDAT.CONVERSATIONS.find(c =>
      c.type === 'direct' && c.projectId === selectedProjectId && c.title === personName);
    const global = IDAT.CONVERSATIONS.find(c =>
      c.type === 'direct' && !c.projectId && c.title === personName);
    const target = proj || global;
    if (!target) return;
    setActiveModule('chat');
    if (target.projectId) {
      setSelectedProjectId(target.projectId);
      setSelectedMode('project');
    } else {
      setSelectedMode('direct');
    }
    setSelectedConvId(target.id);
    if (portrait) setView('chat');
  };

  // ⌘K opens search
  _IE(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setSearchOpen(o => !o);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleSearchPick = (item) => {
    setSearchOpen(false);
    if (!item) return;
    if (item.kind === 'project') handleSelectProject(item.id);
    else if (item.kind === 'person') handleOpenDM(item.title);
    else if (item.kind === 'file') setActiveModule('files');
    else if (item.kind === 'action') setActiveModule('home');
    else {
      const c = IDAT.CONVERSATIONS.find(x => x.id === item.id);
      if (c) {
        setActiveModule('chat');
        if (c.projectId) { setSelectedProjectId(c.projectId); setSelectedMode('project'); }
        else setSelectedMode('direct');
        setSelectedConvId(c.id);
        if (portrait) setView('chat');
      }
    }
  };

  // Drawer "open" semantics:
  // - Landscape: open === expanded label rail; closed === icon rail
  // - Portrait: open === overlay visible; closed === hidden
  const shellDrawerState = drawerOpen ? 'open' : 'rail';
  const isChat = activeModule === 'chat';
  const moduleLabel = IPAD_MODULES.find(m => m.id === activeModule)?.label || '';

  // Context strip in the top bar:
  // - chat view in portrait: show the conv title
  // - other modules: show the module name
  let contextEyebrow = null, contextTitle = null;
  if (portrait && isChat && view === 'chat' && conv) {
    contextEyebrow = project ? project.name : 'Direct';
    contextTitle = conv.title;
  } else if (portrait && !isChat) {
    contextTitle = moduleLabel;
  } else if (!portrait && isChat && project) {
    contextEyebrow = 'Project';
    contextTitle = project.name;
  } else if (!portrait && !isChat) {
    contextTitle = moduleLabel;
  }

  return (
    <>
      <div className="ipad-app">
        <IPadTopBar
          portrait={portrait}
          view={view}
          activeModule={activeModule}
          onSelectModule={handleSelectModule}
          contextEyebrow={contextEyebrow}
          contextTitle={contextTitle}
          onMenu={() => setDrawerOpen(o => !o)}
          onBack={handleBackToInbox}
          onOpenSearch={() => setSearchOpen(true)}
          navStyle={effectiveNavStyle}
        />

        <div className="ipad-shell" data-drawer={shellDrawerState}>
          <IPadDrawer
            open={drawerOpen}
            activeModule={activeModule}
            selectedProjectId={selectedProjectId}
            onSelectProject={handleSelectProject}
            projects={IDAT.PRIORITY_PROJECTS}
          />

          {/* Backdrop only in portrait; clicking closes the drawer */}
          <div className="ipad-drawer-backdrop" onClick={() => setDrawerOpen(false)} />

          <main
            className="ipad-main"
            data-view={view}
            {...(!isChat ? { 'data-module-non-chat': '' } : {})}
          >
            {isChat ? (
              <>
                <div className="ipad-inbox-col">
                  <IC.ConversationList
                    mode={selectedMode}
                    project={project}
                    selectedId={selectedConvId}
                    onSelect={handleSelectConv}
                    density={tweaks.density}
                    grouping={tweaks.grouping}
                    onCollapseInbox={null}
                    archivedIds={archivedIds}
                  />
                </div>

                <div className="ipad-chat-col">
                  {conv ? (
                    <IC.ChatPane
                      conv={conv}
                      project={selectedMode === 'project' ? project : null}
                      density={tweaks.density}
                      isArchived={archivedIds.has(conv.id)}
                      onToggleArchive={() => toggleArchived(conv.id)}
                      detailsOpen={detailsOpen}
                      onToggleDetails={() => setDetailsOpen(o => !o)}
                      onOpenDM={handleOpenDM}
                    />
                  ) : (
                    <div className="ipad-chat-empty">
                      <div className="ipad-chat-empty__icon"><II.chat size={26} stroke={1.4} /></div>
                      <div className="ipad-chat-empty__title">Select a conversation</div>
                      <div className="ipad-chat-empty__sub">
                        Pick a project from the navigation to see its threads, or open a direct message.
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : activeModule === 'files' && IC.IPadFilesPage ? (
              <IC.IPadFilesPage project={project} compact={portrait} />
            ) : (
              <div className="ipad-chat-col">
                <IC.ModulePlaceholder moduleId={activeModule} />
              </div>
            )}
          </main>
        </div>
      </div>

      {IC.SearchPalette && (
        <IC.SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} onPick={handleSearchPick} />
      )}

      <IPadTweaks tweaks={tweaks} setTweak={setTweak} />
    </>
  );
}

// ── Tweaks panel (slim, iPad-aware) ─────────────────────────────────────────
function IPadTweaks({ tweaks, setTweak }) {
  if (!window.TweaksPanel) return null;
  const { TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakColor } = window;
  const accentHex = {
    indigo:  '#7c6cff',
    blue:    '#4d8cff',
    emerald: '#3eb88a',
    amber:   '#e8a84a',
  };
  const reverseAccent = h => Object.entries(accentHex).find(([, v]) => v === h)?.[0] || 'indigo';

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Appearance" />
      <TweakRadio label="Theme" value={tweaks.theme} onChange={v => setTweak('theme', v)}
        options={['dark','light']} />
      <TweakColor label="Accent" value={accentHex[tweaks.accent] || accentHex.indigo}
        onChange={v => setTweak('accent', reverseAccent(v))}
        options={Object.values(accentHex)} />

      <TweakSection label="Layout" />
      <TweakRadio label="Top nav" value={tweaks.navStyle} onChange={v => setTweak('navStyle', v)}
        options={['classic','native','floating']} />
      <TweakRadio label="Density" value={tweaks.density} onChange={v => setTweak('density', v)}
        options={['comfortable','spacious']} />
      <TweakRadio label="Grouping" value={tweaks.grouping} onChange={v => setTweak('grouping', v)}
        options={['by-type','flat']} />

      <TweakSection label="Chat" />
      <TweakRadio label="Bubble" value={tweaks.bubbleStyle} onChange={v => setTweak('bubbleStyle', v)}
        options={['rounded','soft','tail']} />
    </TweaksPanel>
  );
}

const ipadRoot = ReactDOM.createRoot(document.getElementById('root'));
ipadRoot.render(<IPadApp />);
