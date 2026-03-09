'use client'

import { useState } from 'react'
import { GripVertical, Trash2, MessageSquare, User, Sparkles, ChevronDown, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Block } from '@/lib/types'

interface DialogueLine {
  block: Block
  onUpdate: (updates: Partial<Block>) => void
  onDelete: () => void
  characters: string[]
}

function SortableDialogueLine({ block, onUpdate, onDelete, characters }: DialogueLine) {
  const [isEditingContent, setIsEditingContent] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleAIAssist = () => {
    console.log('[v0] AI assist triggered for dialogue line:', block.id)
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="group/line flex items-start gap-2 rounded-md bg-muted/30 p-3 transition-colors hover:bg-muted/50"
    >
      <div 
        {...attributes}
        {...listeners}
        className="flex cursor-grab items-center self-stretch text-muted-foreground opacity-0 transition-opacity group-hover/line:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 gap-1 px-1.5 text-xs font-bold uppercase tracking-wide text-blue-400 hover:text-blue-300"
              >
                <User className="h-3 w-3" />
                {block.characterName || 'CHARACTER'}
                <ChevronDown className="h-2.5 w-2.5" />
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

          <Button
            variant="ghost"
            size="sm"
            onClick={handleAIAssist}
            className="h-5 gap-1 px-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Sparkles className="h-3 w-3" />
            AI
          </Button>
        </div>

        {isEditingContent ? (
          <Textarea
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            onBlur={() => setIsEditingContent(false)}
            autoFocus
            className="min-h-[32px] resize-none border-0 bg-transparent p-0 text-sm leading-relaxed text-foreground focus-visible:ring-0"
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
        className="h-5 w-5 shrink-0 opacity-0 transition-opacity group-hover/line:opacity-100"
      >
        <Trash2 className="h-3 w-3 text-muted-foreground" />
      </Button>
    </div>
  )
}

interface DialogueContainerProps {
  dialogueBlocks: Block[]
  characters: string[]
  onUpdateBlock: (blockId: string, updates: Partial<Block>) => void
  onDeleteBlock: (blockId: string) => void
  onReorderDialogues: (fromIndex: number, toIndex: number) => void
  onAddDialogue: () => void
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}

export function DialogueContainer({
  dialogueBlocks,
  characters,
  onUpdateBlock,
  onDeleteBlock,
  onReorderDialogues,
  onAddDialogue,
  dragHandleProps,
}: DialogueContainerProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = dialogueBlocks.findIndex((block) => block.id === active.id)
      const newIndex = dialogueBlocks.findIndex((block) => block.id === over.id)
      onReorderDialogues(oldIndex, newIndex)
    }
  }

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
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Dialogue
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddDialogue}
            className="h-6 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-3 w-3" />
            Add Line
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={dialogueBlocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {dialogueBlocks.map((block) => (
                <SortableDialogueLine
                  key={block.id}
                  block={block}
                  characters={characters}
                  onUpdate={(updates) => onUpdateBlock(block.id, updates)}
                  onDelete={() => onDeleteBlock(block.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}
