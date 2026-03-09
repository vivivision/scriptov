'use client'

import { useDraggable } from '@dnd-kit/core'
import { blockTypes, PALETTE_DRAG_PREFIX } from '@/components/editor/add-block-button'
import type { BlockType } from '@/lib/types'

function DraggablePaletteItem({
  type,
  label,
  icon: Icon,
  color,
  bg,
}: (typeof blockTypes)[number]) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${PALETTE_DRAG_PREFIX}${type}`,
    data: { type: 'palette', blockType: type },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`group flex cursor-grab flex-col items-center gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs font-medium transition-colors hover:bg-muted/60 active:cursor-grabbing select-none ${isDragging ? 'opacity-40' : ''}`}
      title={`Drag to add ${label}`}
    >
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${bg}`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </span>
      <span className="text-center text-muted-foreground group-hover:text-foreground transition-colors leading-tight">{label}</span>
    </div>
  )
}

export function BlockPaletteSidebar() {
  return (
    <aside className="flex h-full w-24 shrink-0 flex-col border-l border-border bg-card">
      <div className="border-b border-border px-3 py-3">
        <p className="text-xs font-semibold text-muted-foreground">Blocks</p>
      </div>
      <div className="flex flex-col gap-2 p-2">
        {blockTypes.map((bt) => (
          <DraggablePaletteItem key={bt.type} {...bt} />
        ))}
      </div>
    </aside>
  )
}
