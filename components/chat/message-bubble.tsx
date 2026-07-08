'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { Message } from '@/lib/mock-data'
import { Play, FileText, X, Download, Share2, Copy, Reply, Pin, ExternalLink, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface MessageBubbleProps {
  message: Message
  showAvatar?: boolean
  className?: string
  onMediaClick?: (message: Message) => void
  onReply?: (message: Message) => void
  onGoToTask?: (taskName: string) => void
}

// Parse message content for mentions
function parseMessageContent(content: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  // Match @Name or #TaskName (capturing words with spaces until next @ or # or end)
  const mentionRegex = /(@[\w\s]+?)(?=\s[@#]|\s*$|[.,!?])|(@\w+)|(\#[\w\s\-]+?)(?=\s[@#]|\s*$|[.,!?])|(\#[\w\-]+)/g
  
  let lastIndex = 0
  let match

  // Simple approach: split by @ and # and reconstruct
  const simpleRegex = /(@[A-Za-z][A-Za-z\s]*[A-Za-z])|(\#[A-Za-z][A-Za-z\s\-]*[A-Za-z0-9])/g
  
  while ((match = simpleRegex.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index))
    }

    const fullMatch = match[0]
    if (fullMatch.startsWith('@')) {
      // People mention - blue
      parts.push(
        <button
          key={match.index}
          className="font-medium text-[#0ea5ff] hover:underline"
          onClick={(e) => {
            e.stopPropagation()
            // Could open user preview here
          }}
        >
          {fullMatch}
        </button>
      )
    } else if (fullMatch.startsWith('#')) {
      // Task mention - green
      parts.push(
        <button
          key={match.index}
          className="font-semibold text-[#22c55e] hover:underline"
          onClick={(e) => {
            e.stopPropagation()
            // Could open task details here
          }}
        >
          {fullMatch}
        </button>
      )
    }

    lastIndex = match.index + fullMatch.length
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex))
  }

  return parts.length > 0 ? parts : [content]
}

// Check if message contains task mentions
function hasTaskMention(content: string): boolean {
  return /#[A-Za-z]/.test(content)
}

// Extract task names from content
function getTaskMentions(content: string): string[] {
  const regex = /\#([A-Za-z][A-Za-z\s\-]*[A-Za-z0-9])/g
  const matches: string[] = []
  let match
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1])
  }
  return matches
}

export function MessageBubble({ message, showAvatar = true, className, onMediaClick, onReply, onGoToTask }: MessageBubbleProps) {
  const { content, sender, timestamp, isOwn, type, mediaUrl, mediaName, mediaThumbnail, mediaSize, mediaType } = message
  const [showMediaViewer, setShowMediaViewer] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const formattedTime = timestamp.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content)
    }
  }

  const taskMentions = content ? getTaskMentions(content) : []

  return (
    <div
      className={cn(
        'flex gap-2 group',
        isOwn ? 'flex-row-reverse' : 'flex-row',
        className
      )}
    >
      {showAvatar && !isOwn && (
        <Avatar className="h-8 w-8 shrink-0 mt-1">
          <AvatarFallback className="bg-secondary text-foreground text-xs font-medium">
            {sender.avatar}
          </AvatarFallback>
        </Avatar>
      )}
      {showAvatar && isOwn && <div className="w-8 shrink-0" />}

      <div
        className={cn(
          'flex max-w-[75%] flex-col gap-1 relative',
          isOwn ? 'items-end' : 'items-start'
        )}
      >
        {!isOwn && (
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs font-medium text-foreground">{sender.name}</span>
            {sender.role && (
              <span className="text-[10px] text-muted-foreground">{sender.role}</span>
            )}
          </div>
        )}
        
        {/* Media Content */}
        {(type === 'image' || type === 'video' || type === 'file') && mediaUrl && (
          <>
            {type === 'image' && (
              <button
                onClick={() => setShowMediaViewer(true)}
                className="rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
              >
                <img
                  src={mediaThumbnail || mediaUrl}
                  alt={mediaName || 'Image'}
                  className="max-w-full max-h-48 object-cover rounded-lg"
                />
              </button>
            )}
            {type === 'video' && (
              <button
                onClick={() => setShowMediaViewer(true)}
                className="relative rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
              >
                <img
                  src={mediaThumbnail || '/placeholder.svg?height=200&width=300'}
                  alt={mediaName || 'Video'}
                  className="max-w-full max-h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="h-5 w-5 text-foreground ml-0.5" />
                  </div>
                </div>
              </button>
            )}
            {type === 'file' && (
              <button
                onClick={() => setShowMediaViewer(true)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2',
                  isOwn ? 'bg-primary/80' : 'bg-secondary'
                )}
              >
                <div className={cn(
                  'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
                  isOwn ? 'bg-primary-foreground/20' : 'bg-muted'
                )}>
                  <FileText className="h-5 w-5" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-sm font-medium truncate">{mediaName}</p>
                  <p className={cn('text-xs', isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                    {mediaType} {mediaSize && `• ${mediaSize}`}
                  </p>
                </div>
              </button>
            )}
          </>
        )}

        {/* Text Content with Mentions */}
        {content && (
          <div className="relative flex items-start gap-1">
            <div
              className={cn(
                'rounded-2xl px-3 py-2 text-sm',
                isOwn
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-secondary text-foreground rounded-bl-md'
              )}
            >
              {parseMessageContent(content)}
            </div>
            
            {/* Message Actions */}
            <DropdownMenu open={showActions} onOpenChange={setShowActions}>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'h-6 w-6 rounded-full bg-secondary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0',
                    showActions && 'opacity-100'
                  )}
                >
                  <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isOwn ? 'end' : 'start'} className="w-40">
                <DropdownMenuItem onClick={() => onReply?.(message)}>
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Pin className="h-4 w-4 mr-2" />
                  Pin
                </DropdownMenuItem>
                {taskMentions.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    {taskMentions.map((task, i) => (
                      <DropdownMenuItem 
                        key={i}
                        onClick={() => onGoToTask?.(task)}
                        className="text-[#22c55e]"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Go to #{task}
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        
        <span className="px-1 text-[10px] text-muted-foreground">
          {formattedTime}
        </span>
      </div>

      {/* Inline Media Viewer */}
      {showMediaViewer && mediaUrl && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <header className="flex items-center justify-between p-4 bg-black/80">
            <button
              onClick={() => setShowMediaViewer(false)}
              className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <button className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <Download className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
            {type === 'image' && (
              <img
                src={mediaUrl}
                alt={mediaName || 'Image'}
                className="max-w-full max-h-full object-contain"
              />
            )}
            {type === 'video' && (
              <div className="relative w-full max-w-lg aspect-video bg-muted rounded-lg flex items-center justify-center">
                <img
                  src={mediaThumbnail || '/placeholder.svg?height=400&width=600'}
                  alt={mediaName || 'Video'}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                    <Play className="h-8 w-8 text-foreground ml-1" />
                  </button>
                </div>
              </div>
            )}
            {type === 'file' && (
              <div className="text-center text-white">
                <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-10 w-10" />
                </div>
                <p className="text-lg font-medium mb-1">{mediaName}</p>
                <p className="text-sm text-white/60">
                  {mediaType} {mediaSize && `• ${mediaSize}`}
                </p>
              </div>
            )}
          </div>

          <footer className="p-4 bg-black/80">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-white/10 text-white text-xs">
                  {sender.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{sender.name}</p>
                <p className="text-xs text-white/60">{formattedTime}</p>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  )
}
