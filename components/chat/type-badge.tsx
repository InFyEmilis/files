import { cn } from '@/lib/utils'

type BadgeType = 'task' | 'procurement' | 'direct' | 'project'

interface TypeBadgeProps {
  type: BadgeType
  className?: string
}

const badgeConfig: Record<BadgeType, { label: string; className: string }> = {
  task: {
    label: 'TASK',
    className: 'bg-task-blue-bg text-task-blue',
  },
  procurement: {
    label: 'PROC',
    className: 'bg-proc-green-bg text-proc-green',
  },
  direct: {
    label: 'DM',
    className: 'bg-direct-gray-bg text-direct-gray',
  },
  project: {
    label: 'PROJECT',
    className: 'bg-foreground/8 text-foreground/60',
  },
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  const config = badgeConfig[type]
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
