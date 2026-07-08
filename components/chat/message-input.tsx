'use client'

import { useState, useRef, useEffect } from 'react'
import { Paperclip, Send, Mic, Hash, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { mockUsers, mockTasks, phaseLabels, type User, type Task } from '@/lib/mock-data'

interface MessageInputProps {
  onSend?: (message: string) => void
  className?: string
}

type MentionType = 'people' | 'task' | null

export function MessageInput({ onSend, className }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [mentionType, setMentionType] = useState<MentionType>(null)
  const [mentionQuery, setMentionQuery] = useState('')
  const [mentionStartIndex, setMentionStartIndex] = useState(-1)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter suggestions based on query
  const peopleSuggestions = mockUsers.filter(u =>
    u.name.toLowerCase().includes(mentionQuery.toLowerCase())
  )
  const taskSuggestions = mockTasks.filter(t =>
    t.name.toLowerCase().includes(mentionQuery.toLowerCase())
  )

  const suggestions = mentionType === 'people' ? peopleSuggestions : taskSuggestions

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(0)
  }, [mentionQuery, mentionType])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMentionType(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSend = () => {
    if (message.trim() && onSend) {
      onSend(message.trim())
      setMessage('')
      setMentionType(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle dropdown navigation
    if (mentionType && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, suggestions.length - 1))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
        return
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        const selected = suggestions[selectedIndex]
        if (selected) {
          insertMention(selected)
        }
        return
      }
      if (e.key === 'Escape') {
        setMentionType(null)
        return
      }
    }

    // Send message on Enter (without shift)
    if (e.key === 'Enter' && !e.shiftKey && !mentionType) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const cursorPos = e.target.selectionStart || 0
    setMessage(value)

    // Check for @ or # trigger
    const textBeforeCursor = value.slice(0, cursorPos)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')
    const lastHashIndex = textBeforeCursor.lastIndexOf('#')

    // Determine which trigger is more recent
    if (lastAtIndex > lastHashIndex && lastAtIndex >= 0) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1)
      // Only trigger if no space before cursor since @
      if (!textAfterAt.includes(' ') && (lastAtIndex === 0 || /\s/.test(value[lastAtIndex - 1]))) {
        setMentionType('people')
        setMentionQuery(textAfterAt)
        setMentionStartIndex(lastAtIndex)
        return
      }
    } else if (lastHashIndex > lastAtIndex && lastHashIndex >= 0) {
      const textAfterHash = textBeforeCursor.slice(lastHashIndex + 1)
      // Only trigger if no space before cursor since #
      if (!textAfterHash.includes(' ') && (lastHashIndex === 0 || /\s/.test(value[lastHashIndex - 1]))) {
        setMentionType('task')
        setMentionQuery(textAfterHash)
        setMentionStartIndex(lastHashIndex)
        return
      }
    }

    setMentionType(null)
  }

  const insertMention = (item: User | Task) => {
    const isUser = 'avatar' in item
    const mentionText = isUser ? `@${item.name}` : `#${item.name}`
    
    const before = message.slice(0, mentionStartIndex)
    const after = message.slice(textareaRef.current?.selectionStart || mentionStartIndex + mentionQuery.length + 1)
    
    const newMessage = `${before}${mentionText} ${after}`
    setMessage(newMessage)
    setMentionType(null)
    setMentionQuery('')
    
    // Focus textarea and move cursor after mention
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = before.length + mentionText.length + 1
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
      }
    }, 0)
  }

  const triggerPeopleMention = () => {
    const cursorPos = textareaRef.current?.selectionStart || message.length
    const before = message.slice(0, cursorPos)
    const after = message.slice(cursorPos)
    const needsSpace = before.length > 0 && !before.endsWith(' ')
    
    const newMessage = `${before}${needsSpace ? ' ' : ''}@${after}`
    setMessage(newMessage)
    setMentionType('people')
    setMentionQuery('')
    setMentionStartIndex(cursorPos + (needsSpace ? 1 : 0))
    
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  const triggerTaskMention = () => {
    const cursorPos = textareaRef.current?.selectionStart || message.length
    const before = message.slice(0, cursorPos)
    const after = message.slice(cursorPos)
    const needsSpace = before.length > 0 && !before.endsWith(' ')
    
    const newMessage = `${before}${needsSpace ? ' ' : ''}#${after}`
    setMessage(newMessage)
    setMentionType('task')
    setMentionQuery('')
    setMentionStartIndex(cursorPos + (needsSpace ? 1 : 0))
    
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  return (
    <div className={cn('border-t border-border bg-background p-3 relative', className)}>
      {/* Mention Dropdown */}
      {mentionType && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute bottom-full left-0 right-0 mb-1 mx-3 bg-[#151517] border border-border rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto"
        >
          <div className="p-2 text-xs font-medium text-muted-foreground border-b border-border">
            {mentionType === 'people' ? 'People' : 'Tasks'}
          </div>
          {suggestions.map((item, index) => {
            const isUser = 'avatar' in item
            return (
              <button
                key={isUser ? (item as User).id : (item as Task).id}
                onClick={() => insertMention(item)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-left transition-colors',
                  index === selectedIndex ? 'bg-secondary' : 'hover:bg-secondary/50'
                )}
              >
                {isUser ? (
                  <>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-muted text-foreground text-xs">
                        {(item as User).avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{(item as User).name}</p>
                      <p className="text-xs text-muted-foreground truncate">{(item as User).role}</p>
                    </div>
                    {(item as User).online && (
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                    )}
                  </>
                ) : (
                  <>
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{(item as Task).name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {phaseLabels[(item as Task).phase]}
                      </p>
                    </div>
                    {(item as Task).status === 'completed' && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </>
                )}
              </button>
            )
          })}
        </div>
      )}

      <div className="flex items-end gap-1.5">
        {/* Attach — 44px tap target */}
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 shrink-0 text-muted-foreground hover:text-foreground"
        >
          <Paperclip className="h-5 w-5" />
          <span className="sr-only">Attach file</span>
        </Button>

        {/* Text input — extra vertical padding on mobile */}
        <div className="flex-1 rounded-2xl bg-secondary px-3 py-2.5">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none leading-5"
            style={{ minHeight: '22px', maxHeight: '120px' }}
          />
        </div>

        {/* @ mention — 44px tap target */}
        <Button
          variant="ghost"
          size="icon"
          onClick={triggerPeopleMention}
          className={cn(
            'h-11 w-11 shrink-0 text-muted-foreground hover:text-foreground',
            mentionType === 'people' && 'text-[#0ea5ff]',
          )}
        >
          <span className="text-base font-semibold">@</span>
          <span className="sr-only">Mention someone</span>
        </Button>

        {/* # task mention — 44px tap target */}
        <Button
          variant="ghost"
          size="icon"
          onClick={triggerTaskMention}
          className={cn(
            'h-11 w-11 shrink-0 text-muted-foreground hover:text-foreground',
            mentionType === 'task' && 'text-[#22c55e]',
          )}
        >
          <Hash className="h-5 w-5" />
          <span className="sr-only">Mention task</span>
        </Button>

        {message.trim() ? (
          /* Send — filled blue, 44px, clearly primary */
          <Button
            onClick={handleSend}
            size="icon"
            className="h-11 w-11 shrink-0 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-sm"
          >
            <Send className="h-4.5 w-4.5" />
            <span className="sr-only">Send message</span>
          </Button>
        ) : (
          /* Mic — 44px ghost */
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <Mic className="h-5 w-5" />
            <span className="sr-only">Voice message</span>
          </Button>
        )}
      </div>
    </div>
  )
}
