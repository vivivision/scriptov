'use client'

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type Active,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { createContext, useContext, useState, useCallback } from 'react'
import { useScenes } from '@/lib/scene-context'
import type { BlockType, Block } from '@/lib/types'
import { PALETTE_DRAG_PREFIX, blockTypes } from './add-block-button'

// ─── Context ────────────────────────────────────────────────────────────────

interface EditorDndContextValue {
  activeId: string | null
  overGapIndex: number | null
  isDraggingFromPalette: boolean
  isDraggingBlock: boolean
}

const EditorDndCtx = createContext<EditorDndContextValue>({
  activeId: null,
  overGapIndex: null,
  isDraggingFromPalette: false,
  isDraggingBlock: false,
})

export function useEditorDnd() {
  return useContext(EditorDndCtx)
}

// ─── Gap droppable (rendered inside the provider's children) ─────────────────

export function DropGap({ index, isOver }: { index: number; isOver: boolean }) {
  const { setNodeRef } = useDroppable({ id: `gap:${index}` })
  return (
    <div ref={setNodeRef} className="relative w-full" style={{ height: isOver ? 32 : 12 }}>
      {isOver && (
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center gap-2 px-1">
          <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
          <div className="h-0.5 flex-1 rounded-full bg-primary" />
          <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
        </div>
      )}
    </div>
  )
}

// ─── Overlay card ─────────────────────────────────────────────────────────────

function PaletteOverlayCard({ blockType }: { blockType: BlockType }) {
  const bt = blockTypes.find((b) => b.type === blockType)
  if (!bt) return null
  const Icon = bt.icon
  return (
    <div className="flex cursor-grabbing items-center gap-3 rounded-md border border-primary/40 bg-card px-3 py-2.5 text-sm font-medium shadow-xl ring-1 ring-primary/20">
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${bt.bg}`}>
        <Icon className={`h-4 w-4 ${bt.color}`} />
      </span>
      {bt.label}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type GroupedItem =
  | { kind: 'single'; block: Block }
  | { kind: 'dialogueGroup'; blocks: Block[]; id: string }

export function groupBlocks(blocks: Block[]): GroupedItem[] {
  const result: GroupedItem[] = []
  let dlg: Block[] = []
  for (const block of blocks) {
    if (block.type === 'dialogue') {
      dlg.push(block)
    } else {
      if (dlg.length) {
        result.push({ kind: 'dialogueGroup', blocks: dlg, id: `dlg-group-${dlg[0].id}` })
        dlg = []
      }
      result.push({ kind: 'single', block })
    }
  }
  if (dlg.length) result.push({ kind: 'dialogueGroup', blocks: dlg, id: `dlg-group-${dlg[0].id}` })
  return result
}

export function groupItemId(item: GroupedItem) {
  return item.kind === 'single' ? item.block.id : item.id
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function EditorDndProvider({ children }: { children: React.ReactNode }) {
  const { selectedScene, reorderBlocks, addBlock, addBlockAtIndex, updateBlock } = useScenes()

  const [activeItem, setActiveItem] = useState<Active | null>(null)
  const [overGapIndex, setOverGapIndex] = useState<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const isDraggingFromPalette = !!activeItem && String(activeItem.id).startsWith(PALETTE_DRAG_PREFIX)
  const isDraggingBlock = !!activeItem && !isDraggingFromPalette

  const activePaletteType = isDraggingFromPalette
    ? (String(activeItem!.id).replace(PALETTE_DRAG_PREFIX, '') as BlockType)
    : null

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveItem(event.active)
    setOverGapIndex(null)
  }, [])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const overId = String(event.over?.id ?? '')
    if (overId.startsWith('gap:')) {
      setOverGapIndex(parseInt(overId.replace('gap:', ''), 10))
    } else {
      setOverGapIndex(null)
    }
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setActiveItem(null)
    setOverGapIndex(null)

    if (!over || !selectedScene) return

    const activeId = String(active.id)
    const overId = String(over.id)

    // ── Palette → list drop ───────────────────────────────────────────
    if (activeId.startsWith(PALETTE_DRAG_PREFIX)) {
      const blockType = activeId.replace(PALETTE_DRAG_PREFIX, '') as BlockType
      if (overId.startsWith('gap:')) {
        const gapIndex = parseInt(overId.replace('gap:', ''), 10)
        addBlockAtIndex(selectedScene.id, blockType, gapIndex)
      } else {
        addBlock(selectedScene.id, blockType)
      }
      return
    }

    // ── Existing block reorder ────────────────────────────────────────
    if (activeId === overId) return

    const sortedBlocks = [...selectedScene.blocks].sort((a, b) => a.order - b.order)
    const grouped = groupBlocks(sortedBlocks)
    const oldIndex = grouped.findIndex((item) => groupItemId(item) === activeId)
    const newIndex = grouped.findIndex((item) => groupItemId(item) === overId)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(grouped, oldIndex, newIndex)
    reordered.forEach((item, i) => {
      const blocks = item.kind === 'single' ? [item.block] : item.blocks
      blocks.forEach((block, j) => {
        updateBlock(selectedScene.id, block.id, { order: i * 10 + j })
      })
    })
  }, [selectedScene, addBlock, addBlockAtIndex, updateBlock])

  return (
    <EditorDndCtx.Provider value={{
      activeId: activeItem ? String(activeItem.id) : null,
      overGapIndex,
      isDraggingFromPalette,
      isDraggingBlock,
    }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {children}

        <DragOverlay dropAnimation={null}>
          {activePaletteType && <PaletteOverlayCard blockType={activePaletteType} />}
        </DragOverlay>
      </DndContext>
    </EditorDndCtx.Provider>
  )
}
