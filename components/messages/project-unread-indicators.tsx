'use client'

import { cn } from '@/lib/utils'
import type { UnreadBreakdown } from '@/lib/messages-data'

// ─── Types ────────────────────────────────────────────────────────────────────

interface IndicatorDef {
  key:     keyof UnreadBreakdown
  dot:     string   // dot fill color
  label:   string   // tooltip label
}

// Color rules per spec:
// Blue  = project chat/unread
// Amber = procurement
// Green = task updates
// Violet/purple = site issues  (no red in normal rail)
const INDICATOR_DEFS: IndicatorDef[] = [
  { key: 'project',     dot: 'bg-blue-400/80',    label: 'Project chat'  },
  { key: 'task',        dot: 'bg-emerald-400/80',  label: 'Tasks'         },
  { key: 'procurement', dot: 'bg-amber-400/80',    label: 'Procurement'   },
  { key: 'siteIssue',   dot: 'bg-violet-400/80',   label: 'Site issues'   },
]

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProjectUnreadTypeIndicatorsProps {
  breakdown:   UnreadBreakdown
  maxVisible?: number
  compact?:    boolean
  showLabels?: boolean
  className?:  string
  /** @deprecated kept for compat — ignored */
  variant?:    string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProjectUnreadTypeIndicators({
  breakdown,
  maxVisible = 4,
  showLabels = false,
  className,
}: ProjectUnreadTypeIndicatorsProps) {
  const active = INDICATOR_DEFS.filter(d => breakdown[d.key] > 0).slice(0, maxVisible)
  if (active.length === 0) return null

  // Label mode: shown in project header — horizontal pill-style row
  if (showLabels) {
    return (
      <div className={cn('flex items-center flex-wrap gap-x-3 gap-y-1', className)}>
        {active.map(def => {
          const count = breakdown[def.key]
          return (
            <span key={def.key} className="flex items-center gap-1.5 leading-none">
              <span className={cn('h-[5px] w-[5px] rounded-full shrink-0', def.dot)} />
              <span className="text-[10px] text-muted-foreground/60">{def.label}</span>
              <span className="text-[10px] font-semibold tabular-nums text-foreground/55">{count > 9 ? '9+' : count}</span>
            </span>
          )
        })}
      </div>
    )
  }

  // Compact dot+count mode: used in bubble rail and conversation list
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {active.map(def => {
        const count = breakdown[def.key]
        return (
          <span
            key={def.key}
            title={`${def.label}: ${count}`}
            className="flex items-center gap-[3px] leading-none"
          >
            <span className={cn('h-[5px] w-[5px] rounded-full shrink-0', def.dot)} />
            <span className="text-[9px] font-bold tabular-nums leading-none text-foreground/50">
              {count > 9 ? '9+' : count}
            </span>
          </span>
        )
      })}
    </div>
  )
}
