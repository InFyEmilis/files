// Phone app shell — manages screen navigation + module-level navigation
// (Approach A on mobile: floating bottom pill + more sheet).
const { useState: aUseState, useMemo: aUseMemo, useEffect: aUseEffect } = React;
const AD = window.MeccaData;
const APMC = window.PMC;
const PHONE_VARIANTS = window.PhoneVariants || {};

function getPhoneSelectionVariant() {
  const cfg = PHONE_VARIANTS.selection || {};
  const options = cfg.options || [];
  const fallback = cfg.default || 'status-icons';
  const params = new URLSearchParams(window.location.search || '');
  const requested =
    params.get('selection') ||
    params.get('picker') ||
    params.get('pickerVariant') ||
    fallback;
  const match = options.find(o => o.value === requested || o.pickerVariant === requested);
  return (match && match.pickerVariant) || requested || fallback;
}

// Tweakable defaults (host can rewrite this block)
const PHONE_TWEAKS = /*EDITMODE-BEGIN*/{
  "notifVariant": "grouped",
  "pickerVariant": getPhoneSelectionVariant()
}/*EDITMODE-END*/;

// Hook reference — tweaks-panel.jsx loads first so this is set at module
// evaluation time. Fall back to a stub if missing (so the app still runs).
const usePhoneTweaks = window.useTweaks || ((defs) => [defs, () => {}]);

// Module label lookup for the shell-bar (hybrid) middle slot.
const PHONE_MODULE_LABELS = {
  home: 'Home', calendar: 'Calendar', admin: 'Admin',
  procure: 'Procurement', chat: 'Chat', files: 'Files',
  projects: 'Projects', employees: 'Employees',
  quicknote: 'Quick Note', todo: 'ToDo', finances: 'Finances',
};

function PhoneApp({
  // 'floating' (A) | 'native' (B) | 'hybrid' (C). See phone-topbar-variants.
  variant = 'floating',
  // Optional seed so each phone in a comparison row can start on the same
  // screen with no per-phone fiddling.
  seedScreen = 'projects',
  seedProjectId = null,
  showTweaks = true,
} = {}) {
  // Module-level nav (matches desktop topnav): home | calendar | admin |
  // procure | chat | files. The Chat module owns the existing screen stack
  // below — every other module renders a placeholder landing screen.
  const [module, setModule] = aUseState('home');
  const [chatLayerOpen, setChatLayerOpen] = aUseState(true);
  const [moreOpen, setMoreOpen] = aUseState(false);
  const [pickerOpen, setPickerOpen] = aUseState(false);
  const [notifOpen, setNotifOpen] = aUseState(false);
  const [createAction, setCreateAction] = aUseState(null);
  const [summaryProjectId, setSummaryProjectId] = aUseState(null);
  const [customConversations, setCustomConversations] = aUseState([]);
  // Tweaks (variant of notifications sheet)
  const [tweaks, setTweaks] = usePhoneTweaks(PHONE_TWEAKS);

  // Screens inside the Chat module
  // 'projects' | 'projectInbox' | 'chat' | 'dms' | 'details' | 'profile'
  const [screen, setScreen] = aUseState(seedScreen);
  const [projectId, setProjectId] = aUseState(seedProjectId);
  const [convId, setConvId] = aUseState(() => seedProjectId ? AD.autoSelectConv(seedProjectId) : null);
  const [member, setMember] = aUseState(null);
  // Global archived-conv set
  const [archivedIds, setArchivedIds] = aUseState(new Set());
  const toggleArchived = (id) => setArchivedIds(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  // Force dark theme
  aUseEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  const projects = AD.PRIORITY_PROJECTS;
  const project = aUseMemo(() => projects.find(p => p.id === projectId), [projectId]);
  const projectUnread = aUseMemo(() => {
    if (!projectId) return 0;
    return [
      ...AD.getProjectConversations(projectId),
      ...customConversations.filter(c => c.projectId === projectId),
    ].reduce((s, c) => s + c.unreadCount, 0);
  }, [projectId, customConversations]);
  const conv = aUseMemo(() => (
    AD.CONVERSATIONS.find(c => c.id === convId) ||
    customConversations.find(c => c.id === convId) ||
    null
  ), [convId, customConversations]);
  const dmUnread = aUseMemo(() => AD.getGlobalDMs().reduce((s, c) => s + c.unreadCount, 0), []);
  const isCurrentArchived = conv ? archivedIds.has(conv.id) : false;

  const openDM = (personName) => {
    const proj = AD.CONVERSATIONS.find(c =>
      c.type === 'direct' && c.projectId === projectId && c.title === personName);
    const global = AD.CONVERSATIONS.find(c =>
      c.type === 'direct' && !c.projectId && c.title === personName);
    const target = proj || global;
    if (!target) return;
    setConvId(target.id);
    if (target.projectId) setProjectId(target.projectId);
    else setProjectId(null);
    setMember(null);
    setScreen('chat');
  };

  const handleSelectModule = (id) => {
    if (id === 'chat') {
      setChatLayerOpen(true);
      return;
    }
    setModule(id);
  };
  const handleCreateCustomGroup = conv => {
    setCustomConversations(prev => [conv, ...prev]);
    setConvId(conv.id);
    setProjectId(conv.projectId || null);
    setScreen('chat');
  };

  // Hide the floating module bar when we're deep in the chat stack
  // (chat, details, profile) so it doesn't crowd the composer or chrome.
  const deepInChat = chatLayerOpen &&
    (screen === 'chat' || screen === 'details' || screen === 'profile');
  const isChatConversation = chatLayerOpen && screen === 'chat';
  const usesScreenChrome = chatLayerOpen &&
    (screen === 'chat' || screen === 'details' || screen === 'profile');
  const showModNav = !deepInChat;

  // ── Derived screen meta for the variant top bars ──────────────────────
  // Captures the title/subtitle and the back action for the current screen
  // so the NavStack bar (B) and the Shell sub-header (C) can render without
  // peeking into the screen components.
  const screenMeta = aUseMemo(() => {
    const moduleLabel = PHONE_MODULE_LABELS[module] || 'Mecca';
    if (module !== 'chat') {
      return { title: moduleLabel, sub: null, back: null, moduleLabel };
    }
    if (screen === 'profile' && member) {
      return {
        title: member.name,
        sub: member.role || 'Profile',
        back: () => setScreen('details'),
        moduleLabel,
      };
    }
    if (screen === 'details' && conv) {
      return {
        title: 'Details',
        sub: conv.title,
        back: () => setScreen('chat'),
        moduleLabel,
      };
    }
    if (screen === 'chat' && conv) {
      const sub = (conv.type !== 'direct' && project) ? project.name
        : (conv.participants && conv.participants[0] && conv.participants[0].role) || null;
      return {
        title: conv.title,
        sub,
        back: () => {
          if (conv.type === 'direct' && !conv.projectId) setScreen('dms');
          else setScreen('projectInbox');
        },
        moduleLabel,
      };
    }
    if (screen === 'projectInbox' && project) {
      return {
        title: project.name,
        sub: project.priorityReason || project.manager,
        back: () => setScreen('projects'),
        moduleLabel,
      };
    }
    if (screen === 'dms') {
      return {
        title: 'Direct messages',
        sub: 'Person-to-person',
        back: () => setScreen('projects'),
        moduleLabel,
      };
    }
    return { title: 'Messages', sub: 'All projects', back: null, moduleLabel };
  }, [module, screen, project, conv, member]);

  // Action shared by the NavStack bar and shell bar — opens chat module.
  const handleOpenChat = () => {
    setChatLayerOpen(true);
  };

  // ── Body content ───────────────────────────────────────────────────────
  const renderChatBody = () => {
    if (screen === 'profile' && member) {
      return (
        <APMC.PhoneProfile
          person={member}
          conv={conv}
          onBack={() => setScreen('details')}
          onMessage={(p) => openDM(p.name)}
        />
      );
    }
    if (screen === 'details' && conv) {
      return (
        <APMC.PhoneDetails
          conv={conv}
          project={project}
          isArchived={isCurrentArchived}
          onArchive={() => toggleArchived(conv.id)}
          onBack={() => setScreen('chat')}
          onOpenProfile={(p) => { setMember(p); setScreen('profile'); }}
        />
      );
    }
    if (screen === 'chat' && conv) {
      return (
        <APMC.PhoneChat
          conv={conv}
          project={project}
          isArchived={isCurrentArchived}
          onArchive={() => toggleArchived(conv.id)}
          onOpenDetails={() => setScreen('details')}
          onBack={() => {
            if (conv.type === 'direct' && !conv.projectId) setScreen('dms');
            else setScreen('projectInbox');
          }}
        />
      );
    }
    if (screen === 'projectInbox' && project) {
      return (
        <APMC.PhoneProjectInbox
          project={project}
          archivedIds={archivedIds}
          customConversations={customConversations}
          onCreateCustomGroup={handleCreateCustomGroup}
          onBack={() => setScreen('projects')}
          onOpenConv={(id) => { setConvId(id); setScreen('chat'); }}
          onOpenPicker={() => setPickerOpen(true)}
          onOpenDMs={() => setScreen('dms')}
        />
      );
    }
    if (screen === 'dms') {
      return (
        <APMC.PhoneDMs
          archivedIds={archivedIds}
          onBack={() => setScreen('projects')}
          onOpenConv={(id, target) => {
            setConvId(id);
            setProjectId((target && target.projectId) || null);
            setScreen('chat');
          }}
          onOpenPicker={() => setPickerOpen(true)}
          onOpenProjectChats={() => {
            if (projectId) setScreen('projectInbox');
            else setScreen('projects');
          }}
          projectUnread={projectUnread}
          customConversations={customConversations}
          onCreateCustomGroup={handleCreateCustomGroup}
        />
      );
    }
    return (
      <APMC.PhoneProjects
        projects={projects}
        customConversations={customConversations}
        archivedIds={archivedIds}
        dmUnread={dmUnread}
        onOpenProject={(id) => {
          setProjectId(id);
          setConvId(AD.autoSelectConv(id));
          setScreen('projectInbox');
        }}
        onOpenConv={(conv) => {
          setProjectId(conv.projectId);
          setConvId(conv.id);
          setScreen('chat');
        }}
        onOpenDM={() => setScreen('dms')}
        onOpenPicker={() => setPickerOpen(true)}
      />
    );
  };

  let body;
  if (module !== 'chat') {
    body = (
      <APMC.PhoneModulePlaceholder
        moduleId={module}
        onCreate={setCreateAction}
        project={project || null}
        onOpenPicker={() => setPickerOpen(true)}
      />
    );
  } else if (screen === 'profile' && member) {
    body = (
      <APMC.PhoneProfile
        person={member}
        conv={conv}
        onBack={() => setScreen('details')}
        onMessage={(p) => openDM(p.name)}
      />
    );
  } else if (screen === 'details' && conv) {
    body = (
      <APMC.PhoneDetails
        conv={conv}
        project={project}
        isArchived={isCurrentArchived}
        onArchive={() => toggleArchived(conv.id)}
        onBack={() => setScreen('chat')}
        onOpenProfile={(p) => { setMember(p); setScreen('profile'); }}
      />
    );
  } else if (screen === 'chat' && conv) {
    body = (
      <APMC.PhoneChat
        conv={conv}
        project={project}
        isArchived={isCurrentArchived}
        onArchive={() => toggleArchived(conv.id)}
        onOpenDetails={() => setScreen('details')}
        onBack={() => {
          if (conv.type === 'direct' && !conv.projectId) setScreen('dms');
          else setScreen('projectInbox');
        }}
      />
    );
  } else if (screen === 'projectInbox' && project) {
    body = (
      <APMC.PhoneProjectInbox
        project={project}
        archivedIds={archivedIds}
        customConversations={customConversations}
        onCreateCustomGroup={handleCreateCustomGroup}
        onBack={() => setScreen('projects')}
        onOpenConv={(id) => { setConvId(id); setScreen('chat'); }}
        onOpenPicker={() => setPickerOpen(true)}
        onOpenDMs={() => setScreen('dms')}
      />
    );
  } else if (screen === 'dms') {
    body = (
      <APMC.PhoneDMs
        archivedIds={archivedIds}
        onBack={() => setScreen('projects')}
        onOpenConv={(id, target) => {
          setConvId(id);
          setProjectId((target && target.projectId) || null);
          setScreen('chat');
        }}
        onOpenPicker={() => setPickerOpen(true)}
        onOpenProjectChats={() => {
          if (projectId) setScreen('projectInbox');
          else setScreen('projects');
        }}
        projectUnread={projectUnread}
        customConversations={customConversations}
        onCreateCustomGroup={handleCreateCustomGroup}
      />
    );
  } else {
    body = (
      <APMC.PhoneProjects
        projects={projects}
        customConversations={customConversations}
        archivedIds={archivedIds}
        dmUnread={dmUnread}
        onOpenProject={(id) => {
          setProjectId(id);
          setConvId(AD.autoSelectConv(id));
          setScreen('projectInbox');
        }}
        onOpenConv={(conv) => {
          setProjectId(conv.projectId);
          setConvId(conv.id);
          setScreen('chat');
        }}
        onOpenDM={() => setScreen('dms')}
        onOpenPicker={() => setPickerOpen(true)}
      />
    );
  }

  // Top-bar variant chrome (B + C). Rendered as siblings of .ph-app__body
  // so they sit above the screen and own the toolbar space natively.
  const bellOnly = () => setNotifOpen(true);
  const showNavStack = variant === 'native' && !usesScreenChrome;
  const showShellBar = variant === 'hybrid' && !usesScreenChrome;

  return (
    <div className={
      'ph-app' +
      (showModNav ? ' has-modnav' : '') +
      (isChatConversation ? ' is-chat-conversation' : '') +
      (usesScreenChrome ? ' is-screen-owned' : '') +
      ' is-bar-' + variant
    }>
      {showNavStack && window.PMC && window.PMC.PhoneNavStackBar && (
        <window.PMC.PhoneNavStackBar
          title={screenMeta.title}
          sub={screenMeta.sub}
          hasBack={!!screenMeta.back}
          onBack={screenMeta.back}
          workspaceInitial="M"
          onWorkspace={() => setPickerOpen(true)}
          onChat={handleOpenChat}
          onBell={bellOnly}
          unread={3}
        />
      )}
      {showShellBar && window.PMC && window.PMC.PhoneShellBar && (
        <window.PMC.PhoneShellBar
          workspaceName="Mecca"
          workspaceInitial="M"
          project={module === 'chat' ? project : null}
          moduleLabel={screenMeta.moduleLabel}
          onWorkspace={() => setPickerOpen(true)}
          onChat={handleOpenChat}
          onBell={bellOnly}
          onCreate={setCreateAction}
          unread={3}
        />
      )}
      {showShellBar && window.PMC && window.PMC.PhoneShellSubHeader
        /* Suppress the sub-header where it would just duplicate something
           that's already visible: the project name (now in the pill) for
           project-inbox, and the module label (in the pill's center slot)
           for non-chat modules. */
        && !(module === 'chat' && screen === 'projectInbox')
        && module === 'chat' && (
        <window.PMC.PhoneShellSubHeader
          title={screenMeta.title}
          sub={screenMeta.sub}
          hasBack={!!screenMeta.back}
          onBack={screenMeta.back}
        />
      )}
      <div className="ph-app__body">
        {body}
      </div>
      {chatLayerOpen && (
        <div className="ph-chatlayer" role="dialog" aria-modal="true" aria-label="Chat screen">
          <div className="ph-chatlayer__top">
            {window.PMC && window.PMC.PhoneProjectChip && (
              <window.PMC.PhoneProjectChip
                project={project || null}
                onClick={() => setPickerOpen(true)}
                compact
              />
            )}
            <button
              className="ph-chatlayer__close"
              type="button"
              onClick={() => setChatLayerOpen(false)}
              aria-label="Close chat"
            >
              <span className="ph-chatlayer__close-text">Close</span>
              <span className="ph-chatlayer__close-icon" aria-hidden="true">x</span>
            </button>
          </div>
          <div className="ph-chatlayer__body">
            {renderChatBody()}
          </div>
        </div>
      )}
      {showModNav && variant === 'floating' && (
        <APMC.PhoneFloatActions
          unread={3}
          onChat={handleOpenChat}
          onBell={bellOnly}
        />
      )}
      {showModNav && (
        <APMC.PhoneModBar
          active={module}
          onSelect={handleSelectModule}
        />
      )}
      {pickerOpen && (
        <APMC.PhoneProjectSheet
          projects={projects}
          currentProjectId={projectId}
          variant={tweaks.pickerVariant}
          onShowSummary={(id) => setSummaryProjectId(id)}
          onSelect={(id) => {
            if (id) {
              // Navigate into the chosen project's chat inbox
              setProjectId(id);
              setConvId(AD.autoSelectConv(id));
              setChatLayerOpen(true);
              setScreen('projectInbox');
            } else {
              // Back to workspace home (all projects)
              setProjectId(null);
              setConvId(null);
              setChatLayerOpen(true);
              setScreen('projects');
            }
          }}
          onClose={() => setPickerOpen(false)}
          onOpenSettings={() => { handleSelectModule('admin'); setPickerOpen(false); }}
        />
      )}
      {notifOpen && APMC.PhoneNotificationsSheet && (
        <APMC.PhoneNotificationsSheet
          variant={tweaks.notifVariant || 'grouped'}
          onClose={() => setNotifOpen(false)}
          onNavigate={(n) => {
            const tgt = n.target || {};
            if (tgt.module && tgt.module !== 'chat') setModule(tgt.module);
            if (tgt.module === 'chat') {
              setChatLayerOpen(true);
              // Map project name → id, then deep-link as best we can
              const p = projects.find(pp => pp.name === tgt.projectName);
              if (p) {
                setProjectId(p.id);
                if (tgt.screen === 'chat') {
                  setConvId(AD.autoSelectConv(p.id));
                  setScreen('chat');
                } else {
                  setConvId(AD.autoSelectConv(p.id));
                  setScreen('projectInbox');
                }
              } else {
                setScreen('projects');
              }
            }
          }}
        />
      )}
      {summaryProjectId && APMC.PhoneProjectSummary && (
        <APMC.PhoneProjectSummary
          project={projects.find(p => p.id === summaryProjectId)}
          onClose={() => setSummaryProjectId(null)}
          onOpenProject={(id) => {
            setProjectId(id);
            setConvId(AD.autoSelectConv(id));
            setChatLayerOpen(true);
            setScreen('projectInbox');
          }}
          onDeepLink={(kind, convId) => {
            const id = summaryProjectId;
            setProjectId(id);
            setChatLayerOpen(true);
            if (kind === 'conv' && convId) {
              setConvId(convId);
              setScreen('chat');
            } else {
              setConvId(AD.autoSelectConv(id));
              setScreen('projectInbox');
            }
          }}
        />
      )}
      {createAction && APMC.PhoneCreateSheet && (
        <APMC.PhoneCreateSheet
          actionId={createAction}
          onClose={() => setCreateAction(null)}
          onSubmit={() => {/* future: post to a backend */}}
        />
      )}
      {showTweaks && window.TweaksPanel && (
        <window.TweaksPanel>
          <window.TweakSection label="Sheets" />
          <window.TweakRadio
            label="Notifications"
            value={tweaks.notifVariant}
            options={[
              { value: 'grouped', label: 'Grouped' },
              { value: 'tabbed',  label: 'Tabs' },
              { value: 'rich',    label: 'Rich feed' },
            ]}
            onChange={(v) => {
              setTweaks('notifVariant', v);
              if (!notifOpen) setNotifOpen(true);
            }}
          />
          <window.TweakRadio
            label="Project picker"
            value={tweaks.pickerVariant}
            options={(PHONE_VARIANTS.selection && PHONE_VARIANTS.selection.options) || [
              { value: 'status-icons', label: 'Status icons' },
              { value: 'folder-cards', label: 'Folder cards' },
              { value: 'refined', label: 'Refined list' },
              { value: 'recent',  label: 'Recents' },
              { value: 'grid',    label: 'Simple grid' },
            ]}
            onChange={(v) => {
              setTweaks('pickerVariant', v);
              if (!pickerOpen) setPickerOpen(true);
            }}
          />
          <window.TweakButton
            label={notifOpen ? 'Close notifications' : 'Open notifications'}
            onClick={() => setNotifOpen(!notifOpen)}
          />
        </window.TweaksPanel>
      )}
    </div>
  );
}

window.PhoneApp = PhoneApp;
