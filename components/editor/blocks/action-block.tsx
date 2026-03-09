'use client'

import { useState } from 'react'
import { GripVertical, Trash2, Clapperboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { Block } from '@/lib/types'

interface ActionBlockProps {
  block: Block
  onUpdate: (updates: Partial<Block>) => void
  onDelete: () => void
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}

export function ActionBlock({ block, onUpdate, onDelete, dragHandleProps }: ActionBlockProps) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="group relative flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-muted-foreground/30">
      <div 
        {...dragHandleProps}
        className="flex cursor-grab items-center self-stretch text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-amber-500/20">
        <Clapperboard className="h-3.5 w-3.5 text-amber-500" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Action
        </div>
        {isEditing ? (
          <Textarea
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            onBlur={() => setIsEditing(false)}
            autoFocus
            className="min-h-[60px] resize-none border-0 bg-transparent p-0 text-sm leading-relaxed text-foreground focus-visible:ring-0"
            placeholder="Describe the action..."
          />
        ) : (
          <p
            onClick={() => setIsEditing(true)}
            className="cursor-text whitespace-pre-wrap text-sm leading-relaxed text-foreground"
          >
            {block.content || 'Click to add action...'}
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
