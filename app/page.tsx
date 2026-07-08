'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Plus, ChevronLeft, SlidersHorizontal, PanelLeftOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import { priorityProjects } from '@/lib/priority-data'
import {
  getConversationsForProject,
  getGlobalDirectMessages,
  getProjectDirectMessages,
  getTotalUnreadForProject,
  getUnreadBreakdown,
  autoSelectConversation,
  autoSelectDM,
  type SelectedMode,
} from '@/lib/messages-data'

import { ProjectBubbleRail } from '@/components/messages/project-bubble-rail'
import { ConversationList } from '@/components/messages/conversation-list'
import { ChatPane } from '@/components/messages/chat-pane'
import { ProjectUnreadTypeIndicators } from '@/components/messages/project-unread-indicators'


type MobileView = 'projects' | 'conversations' | 'chat'

export default function MessagesPage() {
  const defaultProject = priorityProjects.find(p => p.priorityLevel === 'critical') ?? priorityProjects[0]

  const [selectedMode, setSelectedMode]       = useState<SelectedMode>('project')
  const [selectedProjectId, setSelectedProjectId] = useState(defaultProject.id)
  const [selectedConvId, setSelectedConvId]   = useState<string>('')
  const [mobileView, setMobileView]           = useState<MobileView>('projects')
  const [railExpanded, setRailExpanded]       = useState(false)
  const [inboxCollapsed, setInboxCollapsed]   = useState(false)

  // Remember last project when switching to direct mode
  const lastProjectIdRef = useRef<string>(defaultProject.id)

  const selectedProject = useMemo(
    () => priorityProjects.find(p => p.id === selectedProjectId),
    [selectedProjectId]
  )

  const conversations = useMemo(
    () => getConversationsForProject(selectedProjectId, 'all', ''),
    [selectedProjectId]
  )

  const selectedConv = useMemo(() => {
    if (selectedMode === 'direct') {
      const allDMs = [...getGlobalDirectMessages(), ...getProjectDirectMessages(selectedProjectId)]
      return allDMs.find(c => c.id === selectedConvId) ?? null
    }
    return conversations.find(c => c.id === selectedConvId) ?? null
  }, [conversations, selectedConvId, selectedMode, selectedProjectId])

  // Auto-select conversation when project changes in project mode
  useEffect(() => {
    if (selectedMode === 'project') {
      setSelectedConvId(autoSelectConversation(selectedProjectId))
    }
  }, [selectedProjectId, selectedMode])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSelectProject = (id: string) => {
    lastProjectIdRef.current = id
    setSelectedProjectId(id)
    setSelectedMode('project')
    setMobileView('conversations')
  }

  const handleSelectDirect = () => {
    setSelectedMode('direct')
    setSelectedConvId(autoSelectDM())
    setMobileView('conversations')
  }

  const handleSelectConv = (id: string) => {
    setSelectedConvId(id)
    setMobileView('chat')
  }

  // ── Desktop ≥1024px ────────────────────────────────────────────────────────

  return (
    <>
      {/* ─── Desktop ─────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex h-screen bg-background overflow-hidden">

        {/* Col 1 — Vertical project rail — width grows when expanded */}
        <aside
          className={cn(
            'shrink-0 flex flex-col border-r border-border bg-background overflow-hidden transition-all duration-200',
            railExpanded ? 'w-[240px]' : 'w-[112px]',
          )}
        >
          <div className="flex items-center justify-center h-14 border-b border-border shrink-0">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">M</span>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="px-2 py-3">
              <ProjectBubbleRail
                projects={priorityProjects}
                selectedProjectId={selectedProjectId}
                selectedMode={selectedMode}
                onSelectProject={handleSelectProject}
                onSelectDirect={handleSelectDirect}
                mode="vertical"
                showSwitcher
                expanded={railExpanded}
                onExpandedChange={setRailExpanded}
              />
            </div>
          </ScrollArea>

          <div className="flex items-center justify-center py-3 border-t border-border shrink-0">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" title="New conversation">
              <Plus className="h-4 w-4" />
              <span className="sr-only">New conversation</span>
            </Button>
          </div>
        </aside>

        {/* Col 2 — Conversation inbox (collapsible) */}
        <div className={cn(
          'shrink-0 flex flex-col border-r border-border bg-background overflow-hidden transition-all duration-200',
          inboxCollapsed ? 'w-0 border-r-0' : 'w-[380px]',
        )}>
          <ConversationList
            mode={selectedMode}
            project={selectedProject}
            selectedId={selectedConvId}
            onSelect={handleSelectConv}
            onCollapseInbox={() => setInboxCollapsed(true)}
          />
        </div>

        {/* Col 3 — Chat pane */}
        <div className="flex-1 flex flex-col min-w-0 bg-background relative">
          {/* Restore inbox button — shown when inbox is collapsed */}
          {inboxCollapsed && (
            <button
              onClick={() => setInboxCollapsed(false)}
              title="Show message list"
              className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors shadow-sm"
            >
              <PanelLeftOpen className="h-3.5 w-3.5" />
              Messages
            </button>
          )}
          <ChatPane conversation={selectedConv} />
        </div>
      </div>

      {/* ─── Tablet 768–1023px ────────────────────────────────────────────────── */}
      <div className="hidden md:flex lg:hidden flex-col h-screen bg-background overflow-hidden">
        <header className="flex items-center gap-3 px-4 h-12 border-b border-border shrink-0">
          <span className="text-sm font-semibold text-foreground">
            {selectedMode === 'direct' ? 'Direct Messages' : (selectedProject?.name ?? 'Messages')}
          </span>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Plus className="h-4 w-4" />
          </Button>
        </header>

        <div className="px-4 py-2.5 border-b border-border shrink-0">
          <ProjectBubbleRail
            projects={priorityProjects}
            selectedProjectId={selectedProjectId}
            selectedMode={selectedMode}
            onSelectProject={handleSelectProject}
            onSelectDirect={handleSelectDirect}
            mode="horizontal"
            showSwitcher
          />
        </div>

        <div className="flex flex-1 min-h-0">
          <div className="w-[260px] shrink-0 border-r border-border overflow-hidden flex flex-col">
            <ConversationList
              mode={selectedMode}
              project={selectedProject}
              selectedId={selectedConvId}
              onSelect={handleSelectConv}
            />
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            <ChatPane conversation={selectedConv} />
          </div>
        </div>
      </div>

      {/* ─── Mobile <768px ────────────��───────────────────────────────────────── */}
      <div className="flex md:hidden flex-col h-screen bg-background overflow-hidden">

        {/* Step 1: Project grid */}
        {mobileView === 'projects' && (
          <div className="flex flex-col h-full">
            <header className="flex items-center justify-between px-4 h-14 border-b border-border shrink-0">
              <h1 className="text-base font-semibold text-foreground">Messages</h1>
              {/* 44px tap target for new conversation */}
              <Button variant="ghost" size="icon" className="h-11 w-11 text-muted-foreground hover:text-foreground">
                <Plus className="h-5 w-5" />
              </Button>
            </header>
            <ScrollArea className="flex-1">
              <div className="px-4 pt-4 space-y-5">
                {/* Direct Messages entry — 52px min height for easy tapping */}
                <button
                  onClick={handleSelectDirect}
                  className={cn(
                    'flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border transition-colors active:scale-[0.99]',
                    selectedMode === 'direct'
                      ? 'bg-foreground/8 border-foreground/20'
                      : 'bg-secondary border-transparent hover:bg-secondary/80',
                  )}
                >
                  <div className="h-11 w-11 rounded-full bg-foreground/8 flex items-center justify-center ring-1 ring-foreground/15 shrink-0">
                    <span className="text-foreground/70 text-sm font-bold">DM</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-foreground">Direct Messages</p>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">Person-to-person chats</p>
                  </div>
                </button>

                {/* Project sections */}
                {[
                  { label: 'Critical', items: priorityProjects.filter(p => p.priorityLevel === 'critical') },
                  { label: 'Active',   items: priorityProjects.filter(p => p.priorityLevel === 'high' || (p.priorityLevel === 'normal' && (p.unreadMessages > 0 || p.overdueTasks > 0))) },
                  { label: 'Quiet',    items: priorityProjects.filter(p => p.priorityLevel === 'normal' && p.unreadMessages === 0 && p.overdueTasks === 0) },
                ].filter(s => s.items.length > 0).map(section => (
                  <div key={section.label}>
                    {/* Section label — minimum 44px touch-safe row */}
                    <div className="flex items-center min-h-[44px] mb-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">{section.label}</p>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {section.items.map(project => {
                        const totalUnread = getTotalUnreadForProject(project.id)
                        const breakdown   = getUnreadBreakdown(project.id)
                        const isSelected  = selectedMode === 'project' && project.id === selectedProjectId
                        return (
                          /* Minimum 44px tap area via padding around the flex column */
                          <button
                            key={project.id}
                            onClick={() => handleSelectProject(project.id)}
                            className="flex flex-col items-center gap-1.5 focus:outline-none active:scale-95 transition-transform"
                          >
                            <div className="relative">
                              {/* 56×56 tile — clearly tappable */}
                              <div
                                className={cn(
                                  'h-14 w-14 rounded-2xl flex items-center justify-center transition-all',
                                  isSelected
                                    ? 'ring-2 ring-blue-400/60 shadow-lg'
                                    : 'ring-1 ring-white/12',
                                )}
                                style={{ backgroundColor: isSelected ? project.color + '30' : 'rgba(255,255,255,0.07)' }}
                              >
                                <span
                                  className={cn('text-base font-bold tracking-tight', !isSelected && 'text-foreground/50')}
                                  style={isSelected ? { color: project.color } : undefined}
                                >
                                  {project.initials}
                                </span>
                              </div>
                              {/* Unread badge — bigger and higher contrast */}
                              {totalUnread > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full text-[10px] font-bold bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                                  {totalUnread > 99 ? '99+' : totalUnread}
                                </span>
                              )}
                            </div>
                            <span className={cn(
                              'text-[10px] text-center leading-tight line-clamp-2 w-full',
                              isSelected ? 'text-foreground font-semibold' : 'text-muted-foreground/70',
                            )}>
                              {project.name}
                            </span>
                            {Object.values(breakdown).some(v => v > 0) && (
                              <ProjectUnreadTypeIndicators
                                breakdown={breakdown}
                                maxVisible={4}
                                className="justify-center"
                              />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Step 2: Conversation list */}
        {mobileView === 'conversations' && (
          <div className="flex flex-col h-full">
            <header className="flex items-center gap-1 px-2 h-14 border-b border-border shrink-0">
              {/* Back button — 44px tap target */}
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 shrink-0 text-muted-foreground hover:text-foreground"
                onClick={() => setMobileView('projects')}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <span className="flex-1 text-[15px] font-semibold text-foreground truncate px-1">
                {selectedMode === 'direct' ? 'Direct Messages' : (selectedProject?.name ?? 'Conversations')}
              </span>
              {/* Filter button — 44px tap target */}
              <Button variant="ghost" size="icon" className="h-11 w-11 text-muted-foreground hover:text-foreground shrink-0">
                <SlidersHorizontal className="h-4.5 w-4.5" />
              </Button>
            </header>
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <ConversationList
                mode={selectedMode}
                project={selectedProject}
                selectedId={selectedConvId}
                onSelect={handleSelectConv}
                className="flex-1"
              />
            </div>
          </div>
        )}

        {/* Step 3: Chat */}
        {mobileView === 'chat' && (
          <div className="flex flex-col h-full">
            <ChatPane conversation={selectedConv} onBack={() => setMobileView('conversations')} />
          </div>
        )}
      </div>
    </>
  )
}
