'use client'

import { cn } from '@/lib/utils'

export type FilterType = 'all' | 'tasks' | 'procurement'

interface FilterChipsProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  className?: string
}

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'tasks', label: 'Tasks' },
  { value: 'procurement', label: 'Procurement' },
]

export function FilterChips({ activeFilter, onFilterChange, className }: FilterChipsProps) {
  return (
    <div className={cn('flex gap-2 px-4', className)}>
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
            activeFilter === filter.value
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
