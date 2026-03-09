'use client'

import { GripVertical, Trash2, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Block } from '@/lib/types'

interface PauseBlockProps {
  block: Block
  onDelete: () => void
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}

export function PauseBlock({ block: _block, onDelete, dragHandleProps }: PauseBlockProps) {
  return (
    <div className="group relative flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3 transition-all hover:border-muted-foreground/30">
      <div 
        {...dragHandleProps}
        className="flex cursor-grab items-center text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-purple-500/20">
        <Timer className="h-3.5 w-3.5 text-purple-500" />
      </div>

      <div className="flex-1">
        <span className="text-sm font-medium text-purple-400">[Pause]</span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>
    </div>
  )
}
