'use client'

import { AlertTriangle, ExternalLink, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  type EscalationCard as EscalationCardType, 
  statusLabels, 
  statusColors, 
  phaseLabels,
  mockUsers,
  formatRelativeTime
} from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface EscalationCardProps {
  card: EscalationCardType
  onViewTask?: () => void
  onOpenTaskChat?: () => void
}

export function EscalationCard({ card, onViewTask, onOpenTaskChat }: EscalationCardProps) {
  const assignedUserData = mockUsers.filter(u => card.assignedUsers.includes(u.name))

  return (
    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold tracking-wider text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">
              TASK ESCALATION
            </span>
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(card.timestamp)}
            </span>
          </div>
          <h4 className="font-semibold text-foreground mt-1">{card.taskName}</h4>
        </div>
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-3 flex-wrap text-xs">
        <span className={cn(
          'px-2 py-0.5 rounded font-medium',
          statusColors[card.taskStatus]
        )}>
          {statusLabels[card.taskStatus]}
        </span>
        <span className="text-muted-foreground">
          Phase: <span className="text-foreground">{phaseLabels[card.phase]}</span>
        </span>
      </div>

      {/* Assigned users */}
      {assignedUserData.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Assigned:</span>
          <div className="flex -space-x-2">
            {assignedUserData.map((user) => (
              <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
                <AvatarFallback className="bg-secondary text-foreground text-[10px] font-medium">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-xs text-foreground">
            {assignedUserData.map(u => u.name).join(', ')}
          </span>
        </div>
      )}

      {/* Summary */}
      <p className="text-sm text-foreground/80 bg-background/50 rounded-lg p-3">
        {card.summary}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-xs gap-1.5"
          onClick={onViewTask}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View Task
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-xs gap-1.5"
          onClick={onOpenTaskChat}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Open Task Chat
        </Button>
      </div>
    </div>
  )
}
