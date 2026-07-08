'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { getTotalUnreadForProject, getTotalUnreadDMs, getUnreadBreakdown, type SelectedMode } from '@/lib/messages-data'
import { ProjectUnreadTypeIndicators } from '@/components/messages/project-unread-indicators'
import { filterProjects } from '@/lib/priority-data'
import type { ProjectPriority } from '@/lib/priority-data'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, X, MessageCircle, ChevronRight, ImageIcon } from 'lucide-react'

// ─── Tooltip ──────────────────────────────────────────────────────────────────

const TOOLTIP_ROWS = [
  { key: 'project'     as const, label: 'Project Chat', color: 'bg-blue-400/80'    },
  { key: 'task'        as const, label: 'Tasks',        color: 'bg-emerald-400/80'  },
  { key: 'procurement' as const, label: 'Procurement',  color: 'bg-amber-400/80'    },
  { key: 'siteIssue'   as const, label: 'Site Issues',  color: 'bg-violet-400/80'   },
]

function BubbleTooltip({ project }: { project: ProjectPriority }) {
  const breakdown = getUnreadBreakdown(project.id)
  const hasAny    = TOOLTIP_ROWS.some(r => breakdown[r.key] > 0) || project.overdueTasks > 0

  return (
    <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 w-52 rounded-lg bg-[#1c1c1e] border border-border shadow-xl p-3 text-left">
      <p className="text-xs font-semibold text-foreground leading-tight">{project.name}</p>
      <p className="text-[10px] text-muted-foreground/60 mt-0.5 mb-2">PM: {project.manager}</p>
      {hasAny ? (
        <div className="space-y-1">
          {TOOLTIP_ROWS.map(row => breakdown[row.key] > 0 && (
            <div key={row.key} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={cn('h-[5px] w-[5px] rounded-full', row.color)} />
                <span className="text-[10px] text-muted-foreground">{row.label}</span>
              </div>
              <span className="text-[10px] font-semibold text-foreground/70 tabular-nums">{breakdown[row.key]}</span>
            </div>
          ))}
          {project.overdueTasks > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground/60">Overdue tasks</span>
              <span className="text-[10px] font-semibold text-foreground/50 tabular-nums">{project.overdueTasks}</span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-[10px] text-muted-foreground/40">No active alerts</p>
      )}
    </div>
  )
}

// ─── Vertical bubble — compact mode ───────────────────────────────────────────

// Derive a short display label (first word, max 8 chars)
function shortLabel(name: string): string {
  const first = name.split(' ')[0]
  return first.length > 8 ? first.slice(0, 7) + '…' : first
}

function CompactBubble({
  project, isSelected, onClick,
}: {
  project: ProjectPriority
  isSelected: boolean
  onClick: () => void
}) {
  const totalUnread = getTotalUnreadForProject(project.id)
  const breakdown   = getUnreadBreakdown(project.id)
  const [hovered, setHovered] = useState(false)
  const hasIndicators = Object.values(breakdown).some(v => v > 0)

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={onClick}
        aria-label={project.name}
        className={cn(
          'relative flex flex-col items-center w-full py-2.5 px-2 rounded-xl focus:outline-none transition-all duration-150',
          isSelected
            ? 'bg-blue-500/10 ring-1 ring-blue-500/20'
            : 'hover:bg-white/5'
        )}
      >
        {/* Left accent bar when selected */}
        {isSelected && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-10 rounded-r-full bg-blue-400/80" />
        )}

        {/* Bubble tile — fixed 52×52, centered */}
        <div className="relative mx-auto mb-1.5">
          <div
            className={cn(
              'flex items-center justify-center rounded-[13px] transition-all duration-150 overflow-hidden h-[52px] w-[52px]',
              isSelected ? 'ring-2 ring-blue-400/50' : 'ring-1 ring-white/10',
            )}
            style={{
              backgroundColor: isSelected ? project.color + '30' : 'rgba(255,255,255,0.06)',
            }}
          >
            <span
              className={cn(
                'text-sm font-bold tracking-tight select-none transition-colors duration-150',
                isSelected ? '' : 'text-foreground/45',
              )}
              style={isSelected ? { color: project.color } : undefined}
            >
              {project.initials}
            </span>
            {hovered && !isSelected && (
              <div className="absolute inset-0 flex items-center justify-center rounded-[13px] bg-black/40 backdrop-blur-[1px]">
                <ImageIcon className="h-4 w-4 text-white/70" />
              </div>
            )}
          </div>
          {/* Unread badge — capped so it never bleeds to rail edge */}
          {totalUnread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-bold flex items-center justify-center leading-none bg-primary text-primary-foreground shadow-sm">
              {totalUnread > 99 ? '99+' : totalUnread}
            </span>
          )}
        </div>

        {/* Indicator dot row — centered */}
        {hasIndicators && (
          <div className="flex justify-center w-full mb-1">
            <ProjectUnreadTypeIndicators
              breakdown={breakdown}
              maxVisible={4}
            />
          </div>
        )}

        {/* Short project label — centered, single line */}
        <span className={cn(
          'text-[9px] leading-none text-center w-full truncate transition-colors',
          isSelected ? 'text-foreground/85 font-semibold' : 'text-muted-foreground/45',
        )}>
          {shortLabel(project.name)}
        </span>
      </button>

      {/* Hover tooltip */}
      {hovered && <BubbleTooltip project={project} />}
    </div>
  )
}

// ─── Expanded row — shows bubble + name + meta ────────────────────────────────

function ExpandedRow({
  project, isSelected, onClick,
}: {
  project: ProjectPriority
  isSelected: boolean
  onClick: () => void
}) {
  const totalUnread = getTotalUnreadForProject(project.id)
  const breakdown   = getUnreadBreakdown(project.id)
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      aria-label={project.name}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'relative flex items-center gap-2.5 w-full px-2 py-2 rounded-xl text-left focus:outline-none transition-all duration-150',
        isSelected ? 'bg-blue-500/10 ring-1 ring-blue-500/20' : 'hover:bg-white/5'
      )}
    >
      {isSelected && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 rounded-r-full bg-blue-400/80" />
      )}
      <div className="relative shrink-0">
        <div
          className={cn(
            'relative flex items-center justify-center rounded-[10px] overflow-hidden',
            isSelected ? 'ring-2 ring-blue-400/50' : 'ring-1 ring-white/10',
            isSelected ? 'h-9 w-9' : 'h-8 w-8',
          )}
          style={{
            backgroundColor: isSelected ? project.color + '28' : 'rgba(255,255,255,0.05)',
          }}
        >
          <span
            className="text-[11px] font-bold tracking-tight"
            style={isSelected ? { color: project.color } : undefined}
          >
            {project.initials}
          </span>
          {hovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
              <ImageIcon className="h-3 w-3 text-white/70" />
            </div>
          )}
        </div>
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 rounded-full text-[8px] font-bold flex items-center justify-center leading-none bg-foreground/70 text-background">
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-xs leading-tight truncate', isSelected ? 'text-foreground font-semibold' : 'text-foreground/80 font-medium')}>
          {project.name}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {/* Type indicators inline — compact=false to show pill-style counts */}
          <ProjectUnreadTypeIndicators
            breakdown={breakdown}
            maxVisible={4}
            compact={false}
          />
        </div>
      </div>
    </button>
  )
}

// ─── Horizontal bubble — mobile / tablet ──────────────────────────────────────

function HorizontalBubble({
  project, isSelected, onClick,
}: {
  project: ProjectPriority
  isSelected: boolean
  onClick: () => void
}) {
  const totalUnread = getTotalUnreadForProject(project.id)
  const breakdown   = getUnreadBreakdown(project.id)
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      title={project.name}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex flex-col items-center gap-1.5 shrink-0 focus:outline-none"
      style={{ width: 64 }}
    >
      <div className="relative">
        {/* Rounded-square logo tile */}
        <div
          className={cn(
            'relative flex items-center justify-center rounded-2xl transition-all duration-150 overflow-hidden',
            isSelected ? 'h-14 w-14' : 'h-[52px] w-[52px]',
            isSelected ? 'ring-2 ring-blue-400/50' : 'ring-1 ring-white/10',
          )}
          style={{
            backgroundColor: isSelected ? project.color + '30' : 'rgba(255,255,255,0.06)',
          }}
        >
          {/* Two-letter initials styled like a logo — large, bold, coloured only when active */}
          <span
            className={cn(
              'font-bold tracking-tight select-none transition-colors duration-150',
              isSelected ? 'text-base' : 'text-sm text-foreground/40',
            )}
            style={isSelected ? { color: project.color } : undefined}
          >
            {project.initials}
          </span>
          {hovered && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 backdrop-blur-[1px]">
              <ImageIcon className="h-4 w-4 text-white/70" />
            </div>
          )}
        </div>
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 rounded-full text-[9px] font-bold flex items-center justify-center leading-none bg-foreground/60 text-background">
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </div>
      <span
        className={cn('text-[10px] leading-tight text-center w-full px-0.5 transition-colors', isSelected ? 'text-foreground font-medium' : 'text-muted-foreground/60')}
        style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}
      >
        {project.name}
      </span>
    </button>
  )
}

// ─── Project Switcher Overlay ─────────────────────────────────────────────────

function ProjectSwitcher({
  projects, selectedProjectId, onSelect, onClose,
}: {
  projects: ProjectPriority[]
  selectedProjectId: string
  onSelect: (id: string) => void
  onClose: () => void
}) {
  const [query, setQuery]       = useState('')
  const [focusIdx, setFocusIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const filtered = filterProjects(projects, 'all', query)

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => { setFocusIdx(0) }, [query])

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocusIdx(i => Math.min(i + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setFocusIdx(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter')     { if (filtered[focusIdx]) { onSelect(filtered[focusIdx].id); onClose() } }
    if (e.key === 'Escape')    { onClose() }
  }, [filtered, focusIdx, onSelect, onClose])

  const priorityBadge: Record<string, string> = {
    critical: 'bg-foreground/10 text-foreground/60',
    high:     'bg-foreground/8 text-foreground/50',
    normal:   'bg-foreground/5 text-muted-foreground',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md mx-4 rounded-xl bg-[#1c1c1e] border border-border shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKey}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Switch project..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <ul className="max-h-[360px] overflow-y-auto py-2">
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-muted-foreground">No projects found</li>
          )}
          {filtered.map((project, idx) => {
            const totalUnread = getTotalUnreadForProject(project.id)
            const isFocused   = idx === focusIdx
            const metaParts   = [
              project.overdueTasks > 0 ? `${project.overdueTasks} overdue` : null,
              totalUnread > 0 ? `${totalUnread > 9 ? '9+' : totalUnread} unread` : null,
              project.manager,
            ].filter(Boolean)
            return (
              <li key={project.id}>
                <button
                  onClick={() => { onSelect(project.id); onClose() }}
                  onMouseEnter={() => setFocusIdx(idx)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                    isFocused ? 'bg-white/6' : 'hover:bg-white/4',
                  )}
                >
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-1"
                    style={{ backgroundColor: project.color + '22', borderColor: project.color + '55' }}
                  >
                    <span className="text-xs font-bold" style={{ color: project.color }}>{project.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/90 truncate">{project.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{metaParts.join(' · ')}</p>
                  </div>
                  <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize shrink-0', priorityBadge[project.priorityLevel] ?? priorityBadge.normal)}>
                    {project.priorityLevel}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-[11px] text-muted-foreground/50">
          <span><kbd className="font-mono bg-white/8 px-1 rounded">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono bg-white/8 px-1 rounded">↵</kbd> select</span>
          <span><kbd className="font-mono bg-white/8 px-1 rounded">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface ProjectBubbleRailProps {
  projects: ProjectPriority[]
  selectedProjectId: string
  selectedMode: SelectedMode
  onSelectProject: (id: string) => void
  onSelectDirect: () => void
  mode?: 'vertical' | 'horizontal'
  showSwitcher?: boolean
  expanded?: boolean
  onExpandedChange?: (v: boolean) => void
}

export function ProjectBubbleRail({
  projects,
  selectedProjectId,
  selectedMode,
  onSelectProject,
  onSelectDirect,
  mode = 'vertical',
  showSwitcher = false,
  expanded: expandedProp,
  onExpandedChange,
}: ProjectBubbleRailProps) {
  const [switcherOpen, setSwitcherOpen]   = useState(false)
  const [expandedLocal, setExpandedLocal] = useState(false)
  const expanded    = expandedProp !== undefined ? expandedProp : expandedLocal
  const setExpanded = (v: boolean) => { setExpandedLocal(v); onExpandedChange?.(v) }

  useEffect(() => {
    if (!showSwitcher) return
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSwitcherOpen(v => !v) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showSwitcher])

  // Group into sections: Pinned (critical), Active (high priority), Other Projects
  const pinned = projects.filter(p => p.priorityLevel === 'critical')
  const active = projects.filter(p => p.priorityLevel === 'high')
  const other  = projects.filter(p => p.priorityLevel !== 'critical' && p.priorityLevel !== 'high')
  const sections = [
    { label: 'Pinned',         items: pinned },
    { label: 'Active',         items: active },
    { label: 'Other Projects', items: other },
  ].filter(s => s.items.length > 0)

  const dmUnread  = getTotalUnreadDMs()
  const isDMMode  = selectedMode === 'direct'

  if (mode === 'horizontal') {
    return (
      <>
        <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
          {projects.map(project => (
            <HorizontalBubble
              key={project.id}
              project={project}
              isSelected={selectedMode === 'project' && project.id === selectedProjectId}
              onClick={() => onSelectProject(project.id)}
            />
          ))}
        </div>
        {switcherOpen && (
          <ProjectSwitcher projects={projects} selectedProjectId={selectedProjectId} onSelect={onSelectProject} onClose={() => setSwitcherOpen(false)} />
        )}
      </>
    )
  }

  // Vertical mode
  return (
    <>
      <div className="flex flex-col w-full h-full">
        {/* Top controls: search + expand toggle */}
        <div className="flex items-center justify-between px-1 mb-1 gap-1 shrink-0">
          {showSwitcher && (
            <button
              onClick={() => setSwitcherOpen(true)}
              title="Switch project (Cmd+K)"
              className="flex items-center justify-center h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/6 transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => setExpanded(v => !v)}
            title={expanded ? 'Collapse rail' : 'Expand to show names'}
            className="flex items-center justify-center h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/6 transition-colors ml-auto"
          >
            <ChevronRight className={cn('h-3.5 w-3.5 transition-transform duration-200', expanded && 'rotate-180')} />
          </button>
        </div>

        {/* Direct Messages entry — always at top, not scrolled */}
        <button
          onClick={onSelectDirect}
          className={cn(
            'relative flex flex-col items-center w-full py-2.5 px-2 rounded-xl focus:outline-none transition-all duration-150 shrink-0',
            expanded ? 'flex-row gap-2.5 py-2' : '',
            isDMMode ? 'bg-blue-500/10 ring-1 ring-blue-500/20' : 'hover:bg-white/5',
          )}
        >
          {isDMMode && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-10 rounded-r-full bg-blue-400/80" />
          )}
          <div className="relative mx-auto shrink-0">
            <div className={cn(
              'flex items-center justify-center rounded-[13px] ring-1 transition-all h-[52px] w-[52px]',
              isDMMode
                ? 'ring-blue-400/50 ring-2 bg-white/8'
                : 'ring-white/10 bg-white/4',
            )}>
              <MessageCircle className={cn('transition-colors', isDMMode ? 'h-5 w-5 text-foreground/70' : 'h-5 w-5 text-foreground/25')} />
            </div>
            {dmUnread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 rounded-full bg-foreground/60 text-[9px] font-bold text-background flex items-center justify-center">
                {dmUnread > 9 ? '9+' : dmUnread}
              </span>
            )}
          </div>
          {expanded ? (
            <div className="flex-1 min-w-0 text-left">
              <p className={cn('text-xs font-medium truncate', isDMMode ? 'text-foreground' : 'text-foreground/70')}>
                Direct Messages
              </p>
              {dmUnread > 0 && (
                <p className="text-[10px] text-foreground/50">{dmUnread} unread</p>
              )}
            </div>
          ) : (
            <span className={cn(
              'text-[9px] leading-none text-center w-full truncate transition-colors mt-1.5',
              isDMMode ? 'text-foreground/85 font-semibold' : 'text-muted-foreground/45',
            )}>
              Messages
            </span>
          )}
        </button>

        {/* Divider */}
        <div className="mx-2 my-1.5 h-px bg-border/40 shrink-0" />

        {/* Project sections — independently scrollable */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="flex flex-col pb-4 pt-1">
            {sections.map((section, si) => (
              <div key={section.label} className={cn(si > 0 && 'mt-4')}>
                {/* Section label */}
                <p className={cn(
                  'mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground/40 truncate',
                  expanded ? 'px-3 text-left' : 'text-center px-1',
                )}>
                  {expanded ? section.label : section.label.slice(0, 3)}
                </p>
                {/* Items */}
                <div className="flex flex-col gap-1.5">
                  {section.items.map(project => (
                    expanded ? (
                      <ExpandedRow
                        key={project.id}
                        project={project}
                        isSelected={selectedMode === 'project' && project.id === selectedProjectId}
                        onClick={() => onSelectProject(project.id)}
                      />
                    ) : (
                      <CompactBubble
                        key={project.id}
                        project={project}
                        isSelected={selectedMode === 'project' && project.id === selectedProjectId}
                        onClick={() => onSelectProject(project.id)}
                      />
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {switcherOpen && (
        <ProjectSwitcher projects={projects} selectedProjectId={selectedProjectId} onSelect={onSelectProject} onClose={() => setSwitcherOpen(false)} />
      )}
    </>
  )
}
