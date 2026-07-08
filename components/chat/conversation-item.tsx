'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { TypeBadge } from './type-badge'
import { UnreadIndicator } from './unread-indicator'
import { formatRelativeTime, type Conversation } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface ConversationItemProps {
  conversation: Conversation
  showProjectName?: boolean
  className?: string
  onClick?: () => void
  asButton?: boolean
}

export function ConversationItem({ conversation, showProjectName = false, className, onClick, asButton = false }: ConversationItemProps) {
  const { id, type, title, lastMessage, timestamp, unread, projectName, avatar } = conversation

  const itemClassName = cn(
    'flex items-start gap-3 px-4 py-3 transition-colors hover:bg-secondary/50 active:bg-secondary w-full text-left',
    unread && 'bg-secondary/30',
    className
  )

  const content = (
    <>
      {/* Avatar or Type indicator */}
      {type === 'direct' ? (
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="bg-secondary text-foreground text-sm font-medium">
            {avatar || title.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
          <TypeBadge type={type} />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {type !== 'direct' && <TypeBadge type={type} className="shrink-0" />}
            <span className={cn(
              'truncate text-sm',
              unread ? 'font-semibold text-foreground' : 'font-medium text-foreground/90'
            )}>
              {title}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {unread && <UnreadIndicator />}
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(timestamp)}
            </span>
          </div>
        </div>
        
        {showProjectName && projectName && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {projectName}
          </p>
        )}
        
        <p className={cn(
          'text-sm mt-1 truncate',
          unread ? 'text-foreground/80' : 'text-muted-foreground'
        )}>
          {lastMessage}
        </p>
      </div>
    </>
  )

  if (asButton || onClick) {
    return (
      <button
        onClick={onClick}
        className={itemClassName}
      >
        {content}
      </button>
    )
  }

  return (
    <Link
      href={`/chat/${id}`}
      className={itemClassName}
    >
      {content}
    </Link>
  )
}
