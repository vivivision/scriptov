'use client'

import { useState } from 'react'
import { GripVertical, Trash2, MessageSquare, User, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Block } from '@/lib/types'

interface DialogueBlockProps {
  block: Block
  onUpdate: (updates: Partial<Block>) => void
  onDelete: () => void
  characters?: string[]
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}

export function DialogueBlock({ 
  block, 
  onUpdate, 
  onDelete, 
  characters = ['ANNA', 'MARK'],
  dragHandleProps 
}: DialogueBlockProps) {
  const [isEditingContent, setIsEditingContent] = useState(false)

  return (
    <div className="group relative flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-muted-foreground/30">
      <div 
        {...dragHandleProps}
        className="flex cursor-grab items-center self-stretch text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-500/20">
        <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Dialogue
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 gap-1 px-2 text-xs font-bold uppercase tracking-wide text-blue-400 hover:text-blue-300"
              >
                <User className="h-3 w-3" />
                {block.characterName || 'CHARACTER'}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {characters.map((character) => (
                <DropdownMenuItem
                  key={character}
                  onClick={() => onUpdate({ characterName: character })}
                  className="text-xs uppercase"
                >
                  {character}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isEditingContent ? (
          <Textarea
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            onBlur={() => setIsEditingContent(false)}
            autoFocus
            className="min-h-[40px] resize-none border-0 bg-transparent p-0 text-sm leading-relaxed text-foreground focus-visible:ring-0"
            placeholder="Enter dialogue..."
          />
        ) : (
          <p
            onClick={() => setIsEditingContent(true)}
            className="cursor-text whitespace-pre-wrap text-sm italic leading-relaxed text-foreground"
          >
            {block.content || 'Click to add dialogue...'}
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
