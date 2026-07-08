'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, MoreVertical, Phone, Video, Pin, PinOff, Archive, Flag, Image } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TypeBadge } from './type-badge'
import { cn } from '@/lib/utils'
import type { Conversation } from '@/lib/mock-data'

interface ChatHeaderProps {
  conversation: Conversation
  className?: string
  onTogglePriority?: (isPinned: boolean) => void
  onArchive?: () => void
}

export function ChatHeader({ conversation, className, onTogglePriority, onArchive }: ChatHeaderProps) {
  const { type, title, projectName, participants, isPinned } = conversation
  const [localIsPinned, setLocalIsPinned] = useState(isPinned || false)
  
  const backHref = type === 'direct' 
    ? '/direct-messages' 
    : conversation.projectId 
      ? `/project/${conversation.projectId}` 
      : '/'

  const handleTogglePriority = () => {
    const newValue = !localIsPinned
    setLocalIsPinned(newValue)
    onTogglePriority?.(newValue)
  }

  return (
    <header className={cn('sticky top-0 z-40 border-b border-border bg-background', className)}>
      <div className="flex h-14 items-center gap-2 px-2">
        <Link href={backHref}>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Go back</span>
          </Button>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {type !== 'direct' && <TypeBadge type={type} />}
            <h1 className="truncate text-sm font-semibold text-foreground">
              {title}
            </h1>
            {localIsPinned && (
              <Pin className="h-3 w-3 text-muted-foreground shrink-0" />
            )}
          </div>
          {projectName && (
            <p className="truncate text-xs text-muted-foreground">
              {projectName}
            </p>
          )}
          {type === 'direct' && participants && participants.length > 0 && (
            <p className="truncate text-xs text-muted-foreground">
              {participants.join(', ')}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Media Gallery - Primary Action */}
          <Link href={`/chat/${conversation.id}/media`}>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
              <Image className="h-4 w-4" />
              <span className="sr-only">Media gallery</span>
            </Button>
          </Link>
          
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span className="sr-only">Voice call</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
            <Video className="h-4 w-4" />
            <span className="sr-only">Video call</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleTogglePriority}>
                {localIsPinned ? (
                  <>
                    <PinOff className="h-4 w-4 mr-2" />
                    Remove from Priority
                  </>
                ) : (
                  <>
                    <Pin className="h-4 w-4 mr-2" />
                    Add to Priority
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Flag className="h-4 w-4 mr-2" />
                Mark as Urgent
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onArchive} className="text-muted-foreground">
                <Archive className="h-4 w-4 mr-2" />
                Archive Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
