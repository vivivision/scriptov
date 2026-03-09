'use client'

import { useState } from 'react'
import { GripVertical, Trash2, CloudRain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Block } from '@/lib/types'

interface AmbienceBlockProps {
  block: Block
  onUpdate: (updates: Partial<Block>) => void
  onDelete: () => void
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}

export function AmbienceBlock({ block, onUpdate, onDelete, dragHandleProps }: AmbienceBlockProps) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="group relative flex items-start gap-3 rounded-lg border border-dashed border-border bg-card/50 p-4 transition-all hover:border-muted-foreground/30">
      <div 
        {...dragHandleProps}
        className="flex cursor-grab items-center self-stretch text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-cyan-500/20">
        <CloudRain className="h-3.5 w-3.5 text-cyan-500" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Ambience
        </div>
        {isEditing ? (
          <Input
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            onBlur={() => setIsEditing(false)}
            autoFocus
            className="h-auto border-0 bg-transparent p-0 text-sm text-cyan-400 focus-visible:ring-0"
            placeholder="Describe the ambient sound or atmosphere..."
          />
        ) : (
          <p
            onClick={() => setIsEditing(true)}
            className="cursor-text text-sm text-cyan-400"
          >
            {block.content || 'Click to add ambience...'}
          </p>
        )}
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
