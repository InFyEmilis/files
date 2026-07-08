'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { MessageBubble } from '@/components/chat/message-bubble'
import { MessageInput } from '@/components/chat/message-input'
import {
  MessageSquare, CheckSquare, ShoppingCart, AlertTriangle, User2,
  ChevronLeft, MoreVertical, Users, ExternalLink, Archive,
  RotateCcw, Image, AtSign, Paperclip, ListTodo, Layers,
} from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { UnifiedConversation, UnifiedMessage } from '@/lib/messages-data'
import { conversationMessages } from '@/lib/messages-data'
import type { Message } from '@/lib/mock-data'

// ─── Type config ──────────────────────────────────────────────────────────────

const typeConfig = {
  project:      { icon: <MessageSquare className="h-4 w-4" />, label: 'Project Chat',   color: 'text-foreground/60', openLabel: 'Open Project' },
  task:         { icon: <CheckSquare   className="h-4 w-4" />, label: 'Task',           color: 'text-foreground/60', openLabel: 'Open Task' },
  procurement:  { icon: <ShoppingCart  className="h-4 w-4" />, label: 'Procurement',    color: 'text-foreground/60', openLabel: 'Open Procurement' },
  'site-issue': { icon: <AlertTriangle className="h-4 w-4" />, label: 'Site Issue',     color: 'text-foreground/60', openLabel: 'Open Site Issue' },
  direct:       { icon: <User2         className="h-4 w-4" />, label: 'Direct',         color: 'text-foreground/60', openLabel: 'View Profile' },
} as const

// ─── Convert UnifiedMessage → Message ────────────────────────────────────────

function toMessage(m: UnifiedMessage): Message {
  return {
    id: m.id,
    content: m.content,
    sender: m.sender,
    timestamp: m.timestamp,
    type: m.type,
    isOwn: m.isOwn,
    mediaUrl: m.mediaUrl,
    mediaName: m.mediaName,
    mediaThumbnail: m.mediaThumbnail,
    mediaSize: m.mediaSize,
    mediaType: m.mediaType,
  }
}

// ─── Empty / no selection state ───────────────────────────────────────────────

export function ChatPaneEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 text-center p-8">
      <div className="relative">
        <MessageSquare className="h-14 w-14 text-muted-foreground/15" strokeWidth={1.5} />
        <MessageSquare className="h-10 w-10 text-muted-foreground/10 absolute -bottom-2 -right-3" strokeWidth={1.5} />
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold text-foreground/50">Select a Conversation</p>
        <p className="text-sm text-muted-foreground/40">Choose a chat from the list to start messaging</p>
      </div>
    </div>
  )
}

// ─── Contextual starter (no messages yet) ────────────────────────────────────

function ConversationStarter({ conv }: { conv: UnifiedConversation }) {
  const suggestions: { icon: React.ReactNode; label: string }[] = conv.type === 'project'
    ? [
        { icon: <ListTodo  className="h-3.5 w-3.5" />, label: 'Ask for site update' },
        { icon: <Image     className="h-3.5 w-3.5" />, label: 'Request progress photos' },
        { icon: <AtSign    className="h-3.5 w-3.5" />, label: 'Mention project manager' },
        { icon: <Paperclip className="h-3.5 w-3.5" />, label: 'Attach file' },
      ]
    : conv.type === 'task'
    ? [
        { icon: <CheckSquare className="h-3.5 w-3.5" />, label: 'Update task status' },
        { icon: <AtSign      className="h-3.5 w-3.5" />, label: 'Mention assignee' },
        { icon: <Paperclip   className="h-3.5 w-3.5" />, label: 'Attach file' },
      ]
    : [
        { icon: <AtSign    className="h-3.5 w-3.5" />, label: 'Mention a team member' },
        { icon: <Paperclip className="h-3.5 w-3.5" />, label: 'Attach file' },
      ]

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 px-6 text-center">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground/60">
          Start {typeConfig[conv.type].label}
        </p>
        <p className="text-xs text-muted-foreground/50">No messages yet. Start the conversation.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 text-xs font-medium transition-colors"
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Context card above messages ─────────────────────────────────────────────

function ContextCard({ conv }: { conv: UnifiedConversation }) {
  if (conv.type === 'project' || conv.type === 'direct') return null

  const cfg = typeConfig[conv.type]
  const cardStyle: Record<string, string> = {
    task:         'bg-foreground/4 border-foreground/10',
    procurement:  'bg-foreground/4 border-foreground/10',
    'site-issue': 'bg-foreground/4 border-foreground/10',
  }

  return (
    <div className={cn('mx-4 mt-4 mb-2 rounded-lg border p-3 flex items-start gap-3', cardStyle[conv.type])}>
      <div className={cn('shrink-0 mt-0.5', cfg.color)}>{cfg.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground truncate">{conv.title}</p>
        {conv.subtitle && (
          <p className="text-[11px] text-muted-foreground mt-0.5">{conv.subtitle}</p>
        )}
      </div>
      <button className="shrink-0 flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
        <ExternalLink className="h-3 w-3" />
        {cfg.openLabel}
      </button>
    </div>
  )
}

// ─── Operational Chat Header ──────────────────────────────────────────────────

function ChatHeader({
  conv,
  onBack,
  onArchive,
  isArchived,
}: {
  conv: UnifiedConversation
  onBack?: () => void
  onArchive: () => void
  isArchived: boolean
}) {
  const cfg = typeConfig[conv.type]

  return (
    <header className="flex flex-col border-b border-border shrink-0">
      {/* Title row */}
      <div className="flex items-center gap-2 px-2 sm:px-3 py-2 min-h-[52px]">
        {onBack && (
          /* 44px back button */
          <Button variant="ghost" size="icon" className="h-11 w-11 shrink-0" onClick={onBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}

        {/* Avatar for DMs, icon for others */}
        {conv.type === 'direct' ? (
          <div className="relative shrink-0">
            <div className="h-9 w-9 rounded-full bg-foreground/8 ring-1 ring-foreground/15 flex items-center justify-center">
              <span className="text-xs font-bold text-foreground/60">{conv.participants[0]?.avatar ?? '?'}</span>
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-foreground/40 ring-2 ring-background" />
          </div>
        ) : (
          <div className={cn('shrink-0', cfg.color)}>{cfg.icon}</div>
        )}

        {/* Title block */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{conv.title}</p>
            {conv.type === 'direct' && (
              <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-foreground/8 text-muted-foreground">
                Group
              </span>
            )}
          </div>
          {conv.subtitle && (
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">{conv.subtitle}</p>
          )}
        </div>

        {/* Desktop-only overflow menu */}
        <div className="hidden sm:flex items-center gap-0.5 shrink-0">
          <HeaderBtn icon={<ExternalLink className="h-3.5 w-3.5" />} label={cfg.openLabel} />
          <HeaderBtn icon={<Layers      className="h-3.5 w-3.5" />} label="Media & Files" />
          <HeaderBtn icon={<Users       className="h-3.5 w-3.5" />} label="Members" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem className="text-muted-foreground" onClick={onArchive}>
                <Archive className="h-4 w-4 mr-2" />
                {isArchived ? 'Unarchive' : 'Archive Chat'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile-only overflow menu (title row) */}
        <div className="flex sm:hidden shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11 text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem className="text-muted-foreground" onClick={onArchive}>
                <Archive className="h-4 w-4 mr-2" />
                {isArchived ? 'Unarchive' : 'Archive Chat'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile action pill row — scrollable, shown below the title */}
      <div className="flex sm:hidden items-center gap-2 px-3 pb-2.5 overflow-x-auto scrollbar-none">
        <MobileActionPill icon={<ExternalLink className="h-3.5 w-3.5" />} label={cfg.openLabel} />
        <MobileActionPill icon={<Layers      className="h-3.5 w-3.5" />} label="Media & Files" />
        <MobileActionPill icon={<Users       className="h-3.5 w-3.5" />} label="Members" />
      </div>
    </header>
  )
}

/** Secondary action pill — dark raised surface, 44px height, icon + label */
function MobileActionPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex-none flex items-center gap-1.5 h-11 px-3.5 rounded-full bg-secondary border border-border text-sm font-medium text-foreground/75 hover:text-foreground hover:bg-secondary/80 active:scale-95 transition-all whitespace-nowrap">
      {icon}
      {label}
    </button>
  )
}

function HeaderBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-white/6 transition-colors whitespace-nowrap">
      {icon}
      <span>{label}</span>
    </button>
  )
}

// ─── Main ChatPane ────────────────────────────────────────────────────────────

interface ChatPaneProps {
  conversation: UnifiedConversation | null
  onBack?: () => void
  className?: string
}

export function ChatPane({ conversation, onBack, className }: ChatPaneProps) {
  const [messages, setMessages]     = useState<UnifiedMessage[]>([])
  const [isArchived, setIsArchived] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Load messages when conversation changes
  useEffect(() => {
    if (conversation) {
      setMessages(conversationMessages[conversation.id] ?? [])
      setIsArchived(conversation.isArchived ?? false)
    }
  }, [conversation?.id])

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = (content: string) => {
    if (!content.trim()) return
    const newMsg: UnifiedMessage = {
      id: `msg-${Date.now()}`,
      content,
      sender: { name: 'You', avatar: 'ME', role: 'Project Manager' },
      timestamp: new Date(),
      type: 'text',
      isOwn: true,
    }
    setMessages(prev => [...prev, newMsg])
  }

  const handleArchiveToggle = () => {
    if (isArchived) {
      setMessages(prev => [...prev, {
        id: `sys-${Date.now()}`,
        content: 'Chat reopened.',
        sender: { name: 'System', avatar: 'SY', role: 'System' },
        timestamp: new Date(),
        type: 'text',
      }])
    }
    setIsArchived(v => !v)
  }

  if (!conversation) {
    return (
      <div className={cn('flex flex-col h-full bg-background', className)}>
        <ChatPaneEmpty />
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      {/* Header */}
      <ChatHeader
        conv={conversation}
        onBack={onBack}
        onArchive={handleArchiveToggle}
        isArchived={isArchived}
      />

      {/* Archived banner */}
      {isArchived && (
        <div className="flex items-center justify-between gap-3 px-4 py-2 bg-muted/40 border-b border-border shrink-0">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Archive className="h-4 w-4" />
            <span className="text-sm">Archived chat</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleArchiveToggle} className="h-7 text-xs gap-1.5">
            <RotateCcw className="h-3 w-3" />
            Reopen
          </Button>
        </div>
      )}

      {/* Context card (task / procurement / site-issue) */}
      <ContextCard conv={conversation} />

      {/* Messages */}
      <ScrollArea className="flex-1" ref={scrollRef as any}>
        <div className="px-4 py-4 space-y-1">
          {messages.length === 0 ? (
            <ConversationStarter conv={conversation} />
          ) : (
            messages.map((msg, idx) => {
              const prev = messages[idx - 1]
              const showAvatar = !prev || prev.sender.name !== msg.sender.name || prev.isOwn !== msg.isOwn
              return (
                <MessageBubble
                  key={msg.id}
                  message={toMessage(msg)}
                  showAvatar={showAvatar}
                />
              )
            })
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      {!isArchived && (
        <div className="shrink-0 border-t border-border">
          <MessageInput onSend={handleSend} />
        </div>
      )}
    </div>
  )
}
