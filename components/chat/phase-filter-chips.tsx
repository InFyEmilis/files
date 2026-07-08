'use client'

import { cn } from '@/lib/utils'
import { type Phase, phaseLabels } from '@/lib/mock-data'

export type PhaseFilterType = 'all' | Phase

interface PhaseFilterChipsProps {
  activePhase: PhaseFilterType
  onPhaseChange: (phase: PhaseFilterType) => void
  availablePhases?: Phase[]
  className?: string
}

export function PhaseFilterChips({ 
  activePhase, 
  onPhaseChange, 
  availablePhases = ['cds', 'preconstruction', 'construction'],
  className 
}: PhaseFilterChipsProps) {
  const filters: { value: PhaseFilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    ...availablePhases.map(phase => ({ value: phase, label: phaseLabels[phase] }))
  ]

  return (
    <div className={cn('flex gap-2 px-4 overflow-x-auto scrollbar-hide', className)}>
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onPhaseChange(filter.value)}
          className={cn(
            'rounded-full px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0',
            activePhase === filter.value
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
