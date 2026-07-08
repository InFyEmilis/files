'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatRelativeTime, phaseLabels, type Conversation, type PriorityLevel } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { AtSign, AlertTriangle, CheckCircle, Pin } from 'lucide-react'

// Priority level indicator colors (subtle dots)
const priorityLevelColors: Record<PriorityLevel, string> = {
  urgent: 'bg-foreground/60',
  important: 'bg-foreground/40',
  relevant: 'bg-foreground/25',
}

interface MessageRowProps {
  conversation: Conversation
  onClick?: () => void
  href?: string
  isSelected?: boolean
  isPriority?: boolean
  showPhase?: boolean
  showProject?: boolean
}

const typeConfig = {
  task: { label: 'TASK', dotColor: 'bg-foreground/40' },
  procurement: { label: 'PROC', dotColor: 'bg-foreground/40' },
  project: { label: 'PROJECT', dotColor: 'bg-foreground/40' },
  direct: { label: 'DIRECT', dotColor: 'bg-foreground/25' },
}

export function MessageRow({ conversation, onClick, href, isSelected, isPriority, showPhase = false, showProject = true }: MessageRowProps) {
  const { id, type, title, lastMessage, timestamp, unread, projectName, avatar, isMentioned, needsApproval, isEscalated, isBlocked, isPinned, priorityLevel, phase } = conversation
  const config = typeConfig[type]

  const rowClassName = cn(
    'flex items-start gap-3 px-4 py-3 w-full text-left transition-colors',
    'hover:bg-secondary/50 active:bg-secondary',
    isSelected && 'bg-primary/10 hover:bg-primary/10'
  )

  // Build secondary line content
  const secondaryParts: string[] = []
  if (showProject && projectName && type !== 'project') {
    secondaryParts.push(projectName)
  }
  if (showPhase && phase) {
    secondaryParts.push(phaseLabels[phase])
  }
  const secondaryLine = secondaryParts.join(' · ')

  // Get priority dot color - use priority level if in priority section, otherwise use type color
  const getPriorityDotColor = () => {
    if (isPriority && priorityLevel) {
      return priorityLevelColors[priorityLevel]
    }
    return config.dotColor
  }

  const content = (
    <>
      {/* Left: Priority dot or Avatar for DMs */}
      {type === 'direct' ? (
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback className="bg-secondary text-foreground text-xs font-medium">
            {avatar || title.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className={cn('h-2.5 w-2.5 rounded-full mt-1.5 shrink-0', getPriorityDotColor())} />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top row: type label + title */}
        <div className="flex items-center gap-1.5">
          <span className={cn(
            'text-[10px] font-semibold uppercase tracking-wide',
            type === 'task' && 'text-foreground/60',
            type === 'procurement' && 'text-foreground/60',
            type === 'project' && 'text-foreground/60',
            type === 'direct' && 'text-muted-foreground'
          )}>
            {config.label}
          </span>
          <span className={cn(
            'truncate text-sm',
            unread ? 'font-semibold text-foreground' : 'font-medium text-foreground/90'
          )}>
            {title}
          </span>
        </div>

        {/* Middle row: project/phase info */}
        {secondaryLine && (
          <p className="text-xs text-muted-foreground truncate">
            {secondaryLine}
          </p>
        )}

        {/* Bottom row: message preview */}
        <p className={cn(
          'text-sm mt-0.5 truncate',
          unread ? 'text-foreground/80' : 'text-muted-foreground'
        )}>
          {lastMessage}
        </p>
      </div>

      {/* Right: indicators and time */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-xs text-muted-foreground">
          {formatRelativeTime(timestamp)}
        </span>
        
        <div className="flex items-center gap-1">
          {/* Pinned indicator for manually added priority items */}
          {isPinned && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
              <Pin className="h-3 w-3 text-muted-foreground" />
            </span>
          )}
          {/* Priority indicators */}
          {isMentioned && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/8">
              <AtSign className="h-3 w-3 text-foreground/60" />
            </span>
          )}
          {(isEscalated || isBlocked) && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/8">
              <AlertTriangle className="h-3 w-3 text-foreground/50" />
            </span>
          )}
          {needsApproval && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/8">
              <CheckCircle className="h-3 w-3 text-foreground/50" />
            </span>
          )}
          
          {/* Unread badge */}
          {unread && !isMentioned && !isEscalated && !isBlocked && !needsApproval && !isPinned && (
            <span className="h-2 w-2 rounded-full bg-primary" />
          )}
        </div>
      </div>
    </>
  )

  // Render as link or button
  if (href) {
    return (
      <Link href={href} className={rowClassName}>
        {content}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={rowClassName}>
      {content}
    </button>
  )
}
