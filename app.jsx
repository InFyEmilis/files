// Main app — wires rail, inbox, chat, tweaks
const { useState: _S, useEffect: _E, useMemo: _M, useRef: _R } = React;
const DAT = window.MeccaData;
const C = window.MC;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "accent": "indigo",
  "density": "comfortable",
  "sidebar": "rail",
  "grouping": "by-type",
  "bubbleStyle": "rounded",
  // Summary triggers on rail rows: off | hover | rightclick | both | always
  "summaryTrigger": "both",
  // When 'All projects' is selected: dashboard (detailed grid) | inbox (default)
  "allProjectsView": "dashboard",
  // Popover presentation: anchor (next to rail) | modal (centered)
  "summaryPresentation": "anchor",
  "showTypeIcons": true
}/*EDITMODE-END*/;

const ACCENTS = {
  indigo:  { hue: 252, name: 'Indigo' },
  blue:    { hue: 230, name: 'Blue'   },
  emerald: { hue: 160, name: 'Emerald'},
  amber:   { hue: 50,  name: 'Amber'  },
};

function App() {
  const [tweaks, setTweak] = (window.useTweaks || (() => [TWEAK_DEFAULTS, () => {}]))(TWEAK_DEFAULTS);

  const defaultProject = useMemo(() => DAT.PRIORITY_PROJECTS.find(p => p.priorityLevel === 'critical') || DAT.PRIORITY_PROJECTS[0], []);

  const [selectedMode, setSelectedMode] = _S('project');
  const [selectedProjectId, setSelectedProjectId] = _S(defaultProject.id);
  const [selectedConvId, setSelectedConvId] = _S('');
  const [detailsOpen, setDetailsOpen] = _S(false);
  const [customConversations, setCustomConversations] = _S([]);
  // Archived conversation IDs — global so the inbox can filter on them
  // and the chat pane can show a banner for the active one.
  const [archivedIds, setArchivedIds] = _S(new Set());
  const toggleArchived = id => setArchivedIds(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  // Apply theme/accent/density to root
  _E(() => {
    const root = document.documentElement;
    root.dataset.theme = tweaks.theme;
    root.dataset.density = tweaks.density;
    root.dataset.bubble = tweaks.bubbleStyle;
    const acc = ACCENTS[tweaks.accent] || ACCENTS.indigo;
    root.style.setProperty('--mc-accent-h', acc.hue);
  }, [tweaks.theme, tweaks.density, tweaks.accent, tweaks.bubbleStyle]);

  const project = useMemo(() =>
    DAT.PRIORITY_PROJECTS.find(p => p.id === selectedProjectId),
    [selectedProjectId]);

  // Auto-select on project change
  _E(() => {
    if (selectedMode === 'project') setSelectedConvId(DAT.autoSelectConv(selectedProjectId));
    else {
      const dms = DAT.getGlobalDMs();
      const u = dms.find(d => d.unreadCount > 0);
      setSelectedConvId(u ? u.id : (dms[0]?.id || ''));
    }
  }, [selectedProjectId, selectedMode]);

  const conv = useMemo(() => {
    if (selectedMode === 'direct') return DAT.getGlobalDMs().find(c => c.id === selectedConvId) || null;
    const all = [
      ...DAT.getProjectConversations(selectedProjectId),
      ...DAT.getProjectDMs(selectedProjectId),
      ...customConversations.filter(c => c.projectId === selectedProjectId),
    ];
    return all.find(c => c.id === selectedConvId) || null;
  }, [selectedMode, selectedProjectId, selectedConvId, customConversations]);

  const handleSelectProject = id => {
    if (id === '__all__') {
      setSelectedMode('all');
      setSelectedProjectId(null);
      setSelectedConvId('');
      return;
    }
    setSelectedProjectId(id);
    setSelectedMode('project');
  };
  const handleSelectDirect = () => setSelectedMode('direct');
  const handleSelectConv = id => setSelectedConvId(id);
  const handleCreateCustomGroup = conv => {
    setCustomConversations(prev => [conv, ...prev]);
    setSelectedConvId(conv.id);
  };

  // Find an existing DM with the named participant. Prefer a project-context
  // DM under the current project; fall back to the global DM list. Returning
  // null lets the profile sheet keep the user where they are (no jarring
  // navigation when there's no DM yet).
  const handleOpenDM = (personName) => {
    const proj = DAT.CONVERSATIONS.find(c =>
      c.type === 'direct' && c.projectId === selectedProjectId && c.title === personName);
    const global = DAT.CONVERSATIONS.find(c =>
      c.type === 'direct' && !c.projectId && c.title === personName);
    const target = proj || global;
    if (!target) return;
    if (target.projectId) {
      setSelectedProjectId(target.projectId);
      setSelectedMode('project');
    } else {
      setSelectedMode('direct');
    }
    setSelectedConvId(target.id);
  };

  // When the All Projects dashboard is on, the dashboard itself lists every
  // project with rich detail — leaving the expanded rail showing names + unread
  // chips creates a redundant column. We auto-collapse to the icon rail once
  // on enter, and restore the user's previous sidebar variant on leave. If the
  // user explicitly re-expands while in dashboard, that wins — we don't fight
  // them.
  const showingAllDashboard = selectedMode === 'all' && tweaks.allProjectsView === 'dashboard';
  const prevSidebarRef = _R(null);
  _E(() => {
    if (showingAllDashboard) {
      if (tweaks.sidebar === 'expanded') {
        prevSidebarRef.current = 'expanded';
        setTweak('sidebar', 'rail');
      }
    } else if (prevSidebarRef.current) {
      setTweak('sidebar', prevSidebarRef.current);
      prevSidebarRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showingAllDashboard]);

  const sidebarVariant = tweaks.sidebar; // rail | expanded | collapsed
  const [activeModule, setActiveModule] = _S('chat');
  const [searchOpen, setSearchOpen] = _S(false);
  // Summary popover: { projectId, anchor } | null
  const [summary, setSummary] = _S(null);

  // Global ⌘K / Ctrl-K to open the search palette.
  _E(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setSearchOpen(o => !o);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Route a search-palette pick into the right module / conversation.
  const handleSearchPick = (item) => {
    setSearchOpen(false);
    if (!item) return;
    if (item.kind === 'project') {
      setActiveModule('chat');
      handleSelectProject(item.id);
    } else if (item.kind === 'person') {
      setActiveModule('chat');
      handleOpenDM(item.title);
    } else if (item.kind === 'file') {
      setActiveModule('files');
    } else if (item.kind === 'action') {
      // For demo: actions land you on the relevant module.
      if (item.id === 'act-approvals' || item.id === 'act-mentions' || item.id === 'act-today') setActiveModule('home');
      else if (item.id === 'act-issues') setActiveModule('chat');
    } else {
      // conversation / task / issue / procurement
      const conv = DAT.CONVERSATIONS.find(c => c.id === item.id);
      if (conv) {
        setActiveModule('chat');
        if (conv.projectId) {
          setSelectedProjectId(conv.projectId);
          setSelectedMode('project');
        } else {
          setSelectedMode('direct');
        }
        setSelectedConvId(conv.id);
      }
    }
  };

  return (
    <>
      <div className="mc-app">
        <C.TopNav active={activeModule} onSelect={setActiveModule} onOpenSearch={() => setSearchOpen(true)} />
        <div className="mc-shell" data-sidebar={sidebarVariant}>
        <C.ProjectBubbleRail
          variant={sidebarVariant}
          projects={DAT.PRIORITY_PROJECTS}
          selectedProjectId={selectedProjectId}
          selectedMode={selectedMode}
          onSelectProject={handleSelectProject}
          onSelectDirect={handleSelectDirect}
          onToggleVariant={v => setTweak('sidebar', v)}
          summaryTrigger={tweaks.summaryTrigger}
          onShowSummary={(pid, anchor) => setSummary({ projectId: pid, anchor })}
        />

        {activeModule === 'chat' ? (
          (selectedMode === 'all' && tweaks.allProjectsView === 'dashboard' && window.MC.DesktopAllProjectsGrid) ? (
            <window.MC.DesktopAllProjectsGrid
              projects={DAT.PRIORITY_PROJECTS}
              onOpenProject={(id) => handleSelectProject(id)}
              onShowSummary={(pid, anchor) => setSummary({ projectId: pid, anchor })}
            />
          ) : (
          <>
            <div className="mc-inbox-col">
              <C.ConversationList
                mode={selectedMode}
                project={project}
                selectedId={selectedConvId}
                onSelect={handleSelectConv}
                density={tweaks.density}
                grouping={tweaks.grouping}
                onCollapseInbox={null}
                archivedIds={archivedIds}
                customConversations={customConversations}
                onCreateCustomGroup={handleCreateCustomGroup}
              />
            </div>

            <div className="mc-chat-col">
              <C.ChatPane
                conv={conv}
                project={selectedMode === 'project' ? project : null}
                density={tweaks.density}
                isArchived={conv ? archivedIds.has(conv.id) : false}
                onToggleArchive={() => conv && toggleArchived(conv.id)}
                detailsOpen={detailsOpen}
                onToggleDetails={() => setDetailsOpen(o => !o)}
                onOpenDM={handleOpenDM}
              />
            </div>
          </>
          )
        ) : (
          <C.ModulePlaceholder moduleId={activeModule} />
        )}
      </div>
      </div>

      <MeccaTweaks tweaks={tweaks} setTweak={setTweak} />

      {C.SearchPalette && (
        <C.SearchPalette
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onPick={handleSearchPick}
        />
      )}
      {summary && window.MC.DesktopProjectSummary && (
        <window.MC.DesktopProjectSummary
          project={DAT.PRIORITY_PROJECTS.find(p => p.id === summary.projectId)}
          anchor={summary.anchor}
          presentation={tweaks.summaryPresentation}
          onClose={() => setSummary(null)}
          onOpenProject={(id) => { handleSelectProject(id); setActiveModule('chat'); }}
          onDeepLink={(pid, kind, convId) => {
            setActiveModule('chat');
            handleSelectProject(pid);
            if (kind === 'conv' && convId) setSelectedConvId(convId);
          }}
        />
      )}
    </>
  );
}

function useMemo(fn, deps) { return _M(fn, deps); }

// Custom Tweaks panel (uses TweaksPanel shell from starter)
function MeccaTweaks({ tweaks, setTweak }) {
  if (!window.TweaksPanel) return null;
  const { TweaksPanel, TweakSection, TweakRadio, TweakSelect, TweakToggle, TweakColor } = window;
  // Map accent keys to single hex strings for the color picker
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
      <TweakRadio label="Sidebar" value={tweaks.sidebar} onChange={v => setTweak('sidebar', v)}
        options={['rail','expanded','collapsed']} />
      <TweakRadio label="Density" value={tweaks.density} onChange={v => setTweak('density', v)}
        options={['compact','comfortable','spacious']} />
      <TweakRadio label="Grouping" value={tweaks.grouping} onChange={v => setTweak('grouping', v)}
        options={['by-type','flat']} />

      <TweakSection label="Project summary" />
      <TweakRadio
        label="Trigger on rail"
        value={tweaks.summaryTrigger}
        onChange={v => setTweak('summaryTrigger', v)}
        options={[
          { value: 'both',       label: 'Both' },
          { value: 'hover',      label: 'Hover ⓘ' },
          { value: 'rightclick', label: 'Right-click' },
          { value: 'always',     label: 'Always' },
          { value: 'off',        label: 'Off' },
        ]} />
      <TweakRadio
        label="Popover style"
        value={tweaks.summaryPresentation}
        onChange={v => setTweak('summaryPresentation', v)}
        options={[
          { value: 'anchor', label: 'Anchored' },
          { value: 'modal',  label: 'Modal' },
        ]} />
      <TweakRadio
        label="All projects view"
        value={tweaks.allProjectsView}
        onChange={v => setTweak('allProjectsView', v)}
        options={[
          { value: 'dashboard', label: 'Dashboard' },
          { value: 'inbox',     label: 'Inbox' },
        ]} />

      <TweakSection label="Chat" />
      <TweakRadio label="Bubble" value={tweaks.bubbleStyle} onChange={v => setTweak('bubbleStyle', v)}
        options={['rounded','soft','tail']} />
      <TweakToggle label="Type icons" value={tweaks.showTypeIcons} onChange={v => setTweak('showTypeIcons', v)} />
    </TweaksPanel>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
