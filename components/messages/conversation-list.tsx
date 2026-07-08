'use client'

import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  MessageSquare, CheckSquare, ShoppingCart, AlertTriangle, User2,
  Search, ChevronDown, MoreHorizontal, FolderOpen, ListTodo, FileText,
  Package, Pin, GripVertical, Settings2, EyeOff, Eye, PanelLeftClose,
  Plus,
} from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import type { UnifiedConversation, ConvType, SelectedMode, ConvPriorityLevel } from '@/lib/messages-data'
import {
  formatRelativeTime, getConversationsForProject, getGlobalDirectMessages,
  getProjectDirectMessages, getTotalUnreadDMs, pinnedDMIds, getUnreadBreakdown,
} from '@/lib/messages-data'
import type { ProjectPriority } from '@/lib/priority-data'
import { ProjectUnreadTypeIndicators } from '@/components/messages/project-unread-indicators'
import { CreateGroupModal } from '@/components/messages/create-group-modal'
import { useState, useMemo } from 'react'

// ─── Section definitions ──────────────────────────────────────────────────────

interface SectionDef {
  type: ConvType
  label: string
  icon: React.ReactNode
}

const SECTION_DEFS: SectionDef[] = [
  { type: 'project',      label: 'PROJECT CHAT',        icon: <MessageSquare className="h-3 w-3" /> },
  { type: 'task',         label: 'TASK CHATS',          icon: <CheckSquare   className="h-3 w-3" /> },
  { type: 'procurement',  label: 'PROCUREMENT CHATS',   icon: <ShoppingCart  className="h-3 w-3" /> },
  { type: 'site-issue',   label: 'SITE ISSUE CHATS',    icon: <AlertTriangle className="h-3 w-3" /> },
]

const CUSTOM_GROUP_SECTION: SectionDef = {
  type: 'direct',
  label: 'CUSTOM GROUP CHATS',
  icon: <User2 className="h-3 w-3" />,
}

// ─── Type config (icons + colours for conversation rows) ──────────────────────

const typeConfig: Record<ConvType, { icon: React.ReactNode; iconLg: React.ReactNode; color: string }> = {
  project:      { icon: <MessageSquare className="h-4 w-4" />, iconLg: <MessageSquare className="h-[18px] w-[18px]" />, color: 'text-blue-400/60 bg-blue-500/10'   },
  task:         { icon: <CheckSquare   className="h-4 w-4" />, iconLg: <CheckSquare   className="h-[18px] w-[18px]" />, color: 'text-emerald-400/60 bg-emerald-500/10' },
  procurement:  { icon: <ShoppingCart  className="h-4 w-4" />, iconLg: <ShoppingCart  className="h-[18px] w-[18px]" />, color: 'text-amber-400/60 bg-amber-500/10'  },
  'site-issue': { icon: <AlertTriangle className="h-4 w-4" />, iconLg: <AlertTriangle className="h-[18px] w-[18px]" />, color: 'text-violet-400/60 bg-violet-500/10' },
  direct:       { icon: <User2         className="h-4 w-4" />, iconLg: <User2         className="h-[18px] w-[18px]" />, color: 'text-foreground/50 bg-foreground/8'  },
}

// ─── Conversation row ─────────────────────────────────────────────────────────

function ConversationRow({
  conv, isSelected, onClick, showDragHandle = false,
}: {
  conv: UnifiedConversation
  isSelected: boolean
  onClick: () => void
  showDragHandle?: boolean
}) {
  const cfg      = typeConfig[conv.type]
  const hasUnread = conv.unreadCount > 0
  const pl        = conv.priorityLevel ?? 'p3'
  const isNone    = pl === 'none'
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'group w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors rounded-lg border',
        isSelected
          ? 'bg-selected-surface border-primary/20'
          : 'bg-card-surface border-transparent hover:border-border hover:bg-card-surface/80',
      )}
    >
      {showDragHandle && hovered && !isNone && (
        <div className="hidden lg:flex shrink-0 self-center opacity-20 cursor-grab -ml-1 mr-[-4px]">
          <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      )}

      {/* Icon */}
      <div className="shrink-0 mt-0.5">
        <div className={cn('rounded-lg flex items-center justify-center h-8 w-8', cfg.color)}>
          {cfg.iconLg}
        </div>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        {/* Title row + timestamp (right-aligned) */}
        <div className="flex items-baseline gap-1.5">
          <p className={cn(
            'flex-1 text-[13px] leading-tight truncate',
            isSelected || hasUnread ? 'text-foreground font-semibold' : 'text-foreground/80 font-medium',
          )}>
            {conv.title}
          </p>
          {!isNone && (
            <span className="shrink-0 text-[10px] text-muted-foreground/45 whitespace-nowrap tabular-nums">
              {formatRelativeTime(conv.timestamp)}
            </span>
          )}
        </div>

        {/* Subtitle / status row */}
        {conv.subtitle && (
          <p className="text-[11px] text-muted-foreground/50 leading-tight mt-0.5 truncate">{conv.subtitle}</p>
        )}

        {/* Message preview + unread badge on same row */}
        {!isNone && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <p className={cn(
              'flex-1 text-[11px] leading-snug line-clamp-1 min-w-0',
              hasUnread ? 'text-foreground/60' : 'text-muted-foreground/40',
            )}>
              {conv.lastSender && conv.type !== 'direct' && (
                <span className="text-muted-foreground/35">{conv.lastSender}: </span>
              )}
              {conv.lastMessage}
            </p>
            {hasUnread && (
              <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center leading-none bg-primary text-primary-foreground">
                {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({
  label, count, unreadCount, isOpen, onToggle, icon, canHide, isHidden, onToggleHide, onCreate,
}: {
  label: string
  count: number
  unreadCount: number
  isOpen: boolean
  onToggle: () => void
  icon?: React.ReactNode
  canHide?: boolean
  isHidden?: boolean
  onToggleHide?: () => void
  onCreate?: () => void
}) {
  return (
    <div className="flex items-center gap-0.5 px-2 pt-2.5 pb-1.5">
      {/* Collapsible toggle — takes up all available width */}
      <button
        onClick={onToggle}
        className="flex-1 flex items-center gap-1.5 min-w-0 group"
      >
        <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground/65 flex-1 text-left truncate group-hover:text-muted-foreground/90 transition-colors">
          {label}
        </span>
        {unreadCount > 0 && (
          <span className="min-w-[16px] h-[15px] px-1 rounded-full bg-primary/20 text-[9px] font-bold text-primary flex items-center justify-center shrink-0">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        <span className="text-[10px] text-muted-foreground/40 tabular-nums shrink-0 font-medium">{count}</span>
        <ChevronDown className={cn('h-3 w-3 text-muted-foreground/40 transition-transform duration-150 shrink-0', !isOpen && '-rotate-90')} />
      </button>
      {/* Create button — labeled pill on mobile (44px), icon-only on desktop */}
      {onCreate && (
        <button
          onClick={e => { e.stopPropagation(); onCreate() }}
          title="New group"
          className="shrink-0 flex items-center gap-1 ml-1 transition-colors
            h-5 rounded text-muted-foreground/50 hover:text-foreground hover:bg-white/8
            sm:w-5 sm:justify-center
            max-sm:h-9 max-sm:px-2.5 max-sm:rounded-full max-sm:border max-sm:border-border
            max-sm:bg-secondary max-sm:text-foreground/70 max-sm:hover:text-foreground max-sm:hover:bg-secondary/80"
        >
          <Plus className="h-3 w-3 shrink-0" />
          <span className="text-[11px] font-semibold sm:hidden">New</span>
        </button>
      )}
      {canHide && onToggleHide && (
        <button
          onClick={onToggleHide}
          className="shrink-0 p-0.5 rounded hover:bg-white/4 text-muted-foreground/20 hover:text-muted-foreground/50 transition-colors"
          title={isHidden ? 'Show section' : 'Hide section'}
        >
          {isHidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        </button>
      )}
    </div>
  )
}

// ─── Manage Sections drawer content ──────────────────────────────────────────

function ManageSectionsPanel({
  sectionOrder, hiddenSections, onReorder, onToggleHide, onClose,
}: {
  sectionOrder: ConvType[]
  hiddenSections: Set<ConvType>
  onReorder: (next: ConvType[]) => void
  onToggleHide: (type: ConvType) => void
  onClose: () => void
}) {
  const all: SectionDef[] = [...SECTION_DEFS, CUSTOM_GROUP_SECTION]
  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-inbox-surface border-r border-border">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <p className="text-sm font-semibold text-foreground">Manage Sections</p>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Done</button>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-3 py-3 space-y-1">
          <p className="text-[10px] text-muted-foreground/40 px-2 pb-1 uppercase tracking-widest">Visibility</p>
          {all.map(def => {
            const hidden = hiddenSections.has(def.type)
            return (
              <div key={def.type} className="flex items-center gap-3 px-2 py-2.5 rounded-lg bg-section-surface">
                <span className="text-muted-foreground/50 shrink-0">{def.icon}</span>
                <span className="flex-1 text-[12px] font-medium text-foreground/80 tracking-wide">{def.label}</span>
                <button
                  onClick={() => onToggleHide(def.type)}
                  className={cn(
                    'shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold transition-colors',
                    hidden
                      ? 'bg-foreground/8 text-muted-foreground hover:bg-foreground/12'
                      : 'bg-primary/10 text-primary hover:bg-primary/15',
                  )}
                >
                  {hidden ? 'Show' : 'Visible'}
                </button>
              </div>
            )
          })}
          <p className="text-[10px] text-muted-foreground/40 px-2 pt-3 pb-1 uppercase tracking-widest">Note</p>
          <p className="text-[11px] text-muted-foreground/50 px-2">
            Drag-to-reorder and per-section collapse defaults are available to Owner/Admin roles.
          </p>
        </div>
      </ScrollArea>
    </div>
  )
}

// ─── Project inbox header ─────────────────────────────────────────────────────

function ProjectHeader({
  project, onManageSections, isAdmin, onCollapse,
}: {
  project: ProjectPriority
  onManageSections: () => void
  isAdmin: boolean
  onCollapse?: () => void
}) {
  const breakdown    = useMemo(() => getUnreadBreakdown(project.id), [project.id])
  const hasBreakdown = Object.values(breakdown).some(v => v > 0)

  return (
    <div className="px-4 pt-4 pb-3 border-b border-border shrink-0 space-y-2">
      {/* Title + menu */}
      <div className="flex items-center gap-1.5 min-w-0">
        <h2 className="flex-1 text-[15px] font-semibold text-foreground leading-tight truncate">
          {project.name}
        </h2>
        {isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* 36px desktop / 44px mobile */}
              <button className="shrink-0 h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white/6 text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/50">Admin</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onManageSections}>
                <Settings2 className="h-4 w-4 mr-2" />
                Manage Sections
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {onCollapse && (
          <button
            onClick={onCollapse}
            title="Hide message list"
            className="shrink-0 h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white/6 text-muted-foreground/30 hover:text-muted-foreground transition-colors"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Unread · overdue · manager */}
      <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
        {project.unreadMessages > 0 && (
          <span className="text-foreground/65 font-medium">{project.unreadMessages} unread</span>
        )}
        {project.unreadMessages > 0 && project.overdueTasks > 0 && (
          <span className="text-muted-foreground/30">·</span>
        )}
        {project.overdueTasks > 0 && (
          <span className="text-foreground/45 font-medium">{project.overdueTasks} overdue</span>
        )}
        {(project.unreadMessages > 0 || project.overdueTasks > 0) && (
          <span className="text-muted-foreground/30">·</span>
        )}
        <span className="text-muted-foreground/60 truncate">{project.manager}</span>
      </div>

      {/* Type indicator row */}
      {hasBreakdown && (
        <ProjectUnreadTypeIndicators
          breakdown={breakdown}
          maxVisible={5}
          showLabels
        />
      )}

      {/* Quick action buttons */}
      <div className="flex items-center gap-1 flex-wrap">
        <ActionBtn icon={<FolderOpen className="h-3 w-3" />} label="Open Project" />
        <ActionBtn icon={<ListTodo   className="h-3 w-3" />} label="Tasks" />
        <ActionBtn icon={<FileText   className="h-3 w-3" />} label="Files" />
        <ActionBtn icon={<Package    className="h-3 w-3" />} label="Procurement" />
      </div>
    </div>
  )
}

function ActionBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-[12px] font-medium
      text-muted-foreground/65 hover:text-foreground hover:bg-white/6
      transition-colors min-h-[36px] sm:min-h-0 sm:px-2 sm:py-1 sm:text-[11px]">
      {icon}<span>{label}</span>
    </button>
  )
}

// ─── DM inbox header ──────────────────────────────────────────────────────────

function DMHeader() {
  const totalUnread = getTotalUnreadDMs()
  return (
    <div className="px-4 pt-4 pb-3 border-b border-border shrink-0 space-y-1">
      <div className="flex items-center gap-2">
        <h2 className="flex-1 text-[15px] font-semibold text-foreground">Direct Messages</h2>
        {totalUnread > 0 && (
          <span className="text-[11px] font-medium text-foreground/50">{totalUnread} unread</span>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground/50">
        Person-to-person messages not linked to a project
      </p>
    </div>
  )
}

// ─── Direct Messages inbox ─────────────────��──────────────────────────────────

function DirectInbox({
  selectedId, onSelect,
}: {
  selectedId: string
  onSelect: (id: string) => void
}) {
  const [search, setSearch] = useState('')
  const allDMs = useMemo(() => getGlobalDirectMessages(), [])

  const filtered = useMemo(() => {
    if (!search.trim()) return allDMs
    const q = search.toLowerCase()
    return allDMs.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q) ||
      c.participants[0]?.role.toLowerCase().includes(q)
    )
  }, [allDMs, search])

  const pinned = filtered.filter(c => pinnedDMIds.has(c.id))
  const recent = filtered.filter(c => !pinnedDMIds.has(c.id))

  return (
    <>
      <DMHeader />
      <div className="px-3 pt-3 pb-2 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Search people..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-8 w-full rounded-lg bg-section-surface pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-2 py-1 space-y-1 pb-4">
          {pinned.length > 0 && (
            <section>
              <div className="flex items-center gap-1.5 px-2 py-1.5">
                <Pin className="h-3 w-3 text-muted-foreground/35" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">Pinned</span>
              </div>
              <div className="space-y-1">
                {pinned.map(conv => (
                  <ConversationRow key={conv.id} conv={conv} isSelected={conv.id === selectedId} onClick={() => onSelect(conv.id)} />
                ))}
              </div>
            </section>
          )}
          {recent.length > 0 && (
            <section>
              <div className="flex items-center gap-1.5 px-2 py-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">Recent</span>
              </div>
              <div className="space-y-1">
                {recent.map(conv => (
                  <ConversationRow key={conv.id} conv={conv} isSelected={conv.id === selectedId} onClick={() => onSelect(conv.id)} />
                ))}
              </div>
            </section>
          )}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center px-4">
              <User2 className="h-8 w-8 text-muted-foreground/15" />
              <p className="text-sm text-muted-foreground/50">No direct messages found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  )
}

// ─── Main ConversationList ────────────────────────────────────────────────────

interface ConversationListProps {
  mode: SelectedMode
  project: ProjectPriority | undefined
  selectedId: string
  onSelect: (id: string) => void
  onCollapseInbox?: () => void
  className?: string
}

// Simulate admin role — in production this would come from auth context
const IS_ADMIN = true

export function ConversationList({ mode, project, selectedId, onSelect, onCollapseInbox, className }: ConversationListProps) {
  const [search, setSearch]             = useState('')
  const [openSections, setOpenSections] = useState<Set<ConvType>>(new Set(SECTION_DEFS.map(s => s.type).concat('direct' as ConvType)))
  const [hiddenSections, setHiddenSections] = useState<Set<ConvType>>(new Set())
  const [pdmOpen, setPdmOpen]           = useState(true)
  const [managingLayout, setManagingLayout] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)

  const projectId = project?.id ?? ''

  const conversations = useMemo(
    () => getConversationsForProject(projectId, 'all', search),
    [projectId, search]
  )

  const grouped = useMemo(() => {
    const map = new Map<ConvType, UnifiedConversation[]>()
    for (const conv of conversations) {
      if (conv.type === 'direct') continue
      const arr = map.get(conv.type) ?? []
      arr.push(conv)
      map.set(conv.type, arr)
    }
    return map
  }, [conversations])

  const projectDMs = useMemo(
    () => projectId ? getProjectDirectMessages(projectId) : [],
    [projectId]
  )

  const toggleSection = (type: ConvType) =>
    setOpenSections(prev => {
      const next = new Set(prev)
      next.has(type) ? next.delete(type) : next.add(type)
      return next
    })

  const toggleHide = (type: ConvType) =>
    setHiddenSections(prev => {
      const next = new Set(prev)
      next.has(type) ? next.delete(type) : next.add(type)
      return next
    })

  // ── Direct Messages mode ──────────────────────────────────────────────────
  if (mode === 'direct') {
    return (
      <div className={cn('flex flex-col h-full min-h-0 bg-inbox-surface', className)}>
        <DirectInbox selectedId={selectedId} onSelect={onSelect} />
      </div>
    )
  }

  // ── Project mode ──────────────────────────────────────────────────────────
  return (
    <div className={cn('relative flex flex-col h-full min-h-0 bg-inbox-surface', className)}>

      {/* Create Custom Group Chat modal */}
      {showCreateGroup && project && (
        <CreateGroupModal
          projectName={project.name}
          onClose={() => setShowCreateGroup(false)}
          onCreate={data => {
            // In production: create GetStream channel, add members, navigate to new group
            console.log('[v0] Create group:', data)
            setShowCreateGroup(false)
          }}
        />
      )}

      {/* Manage Sections overlay (admin only) */}
      {managingLayout && (
        <ManageSectionsPanel
          sectionOrder={SECTION_DEFS.map(s => s.type)}
          hiddenSections={hiddenSections}
          onReorder={() => {}}
          onToggleHide={toggleHide}
          onClose={() => setManagingLayout(false)}
        />
      )}

      {/* Project header */}
      {project ? (
        <ProjectHeader
          project={project}
          onManageSections={() => setManagingLayout(true)}
          isAdmin={IS_ADMIN}
          onCollapse={onCollapseInbox}
        />
      ) : (
        <div className="px-4 pt-4 pb-3 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground">Messages</h2>
        </div>
      )}

      {/* Search */}
      <div className="px-3 pt-3 pb-3 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-8 w-full rounded-lg bg-section-surface pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Grouped conversations */}
      {conversations.length === 0 && projectDMs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center px-4">
          <MessageSquare className="h-8 w-8 text-muted-foreground/15" />
          <p className="text-sm text-muted-foreground/50">No conversations</p>
          <p className="text-xs text-muted-foreground/35">Select a project or change filters.</p>
        </div>
      ) : (
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-2 py-1 space-y-1 pb-4">

            {SECTION_DEFS.map(def => {
              const items = grouped.get(def.type)
              if (!items || items.length === 0) return null
              if (hiddenSections.has(def.type)) return null
              const isOpen = openSections.has(def.type)
              const sectionUnread = items.reduce((s, c) => s + c.unreadCount, 0)

              return (
                <section key={def.type} className="rounded-xl overflow-hidden bg-section-surface">
                  <SectionHeader
                    label={def.label}
                    count={items.length}
                    unreadCount={sectionUnread}
                    isOpen={isOpen}
                    onToggle={() => toggleSection(def.type)}
                    icon={def.icon}
                    canHide={IS_ADMIN}
                    isHidden={false}
                    onToggleHide={() => toggleHide(def.type)}
                  />
                  {isOpen && (
                    <div className="px-1.5 pb-1.5 space-y-1">
                      {items.map(conv => (
                        <ConversationRow
                          key={conv.id}
                          conv={conv}
                          isSelected={conv.id === selectedId}
                          onClick={() => onSelect(conv.id)}
                          showDragHandle={IS_ADMIN}
                        />
                      ))}
                    </div>
                  )}
                </section>
              )
            })}

            {/* CUSTOM GROUP CHATS section */}
            {!hiddenSections.has('direct') && (
              <section className="rounded-xl overflow-hidden bg-section-surface">
                <SectionHeader
                  label={CUSTOM_GROUP_SECTION.label}
                  count={projectDMs.length}
                  unreadCount={projectDMs.reduce((s, c) => s + c.unreadCount, 0)}
                  isOpen={pdmOpen}
                  onToggle={() => setPdmOpen(v => !v)}
                  icon={CUSTOM_GROUP_SECTION.icon}
                  canHide={IS_ADMIN}
                  isHidden={false}
                  onToggleHide={() => toggleHide('direct')}
                  onCreate={IS_ADMIN ? () => setShowCreateGroup(true) : undefined}
                />
                {pdmOpen && (
                  <div className="px-1.5 pb-1.5 space-y-1">
                    {projectDMs.map(conv => (
                      <ConversationRow
                        key={conv.id}
                        conv={conv}
                        isSelected={conv.id === selectedId}
                        onClick={() => onSelect(conv.id)}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

          </div>
        </ScrollArea>
      )}
    </div>
  )
}
