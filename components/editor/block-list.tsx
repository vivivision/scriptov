'use client'

import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useScenes } from '@/lib/scene-context'
import { useEditorDnd, DropGap, groupBlocks, groupItemId } from './editor-dnd-context'
import type { Block } from '@/lib/types'
import { ActionBlock } from './blocks/action-block'
import { AmbienceBlock } from './blocks/ambience-block'
import { PauseBlock } from './blocks/pause-block'
import { NoteBlock } from './blocks/note-block'
import { DialogueContainer } from './blocks/dialogue-container'

// ─── Sortable item wrapper ────────────────────────────────────────────────────

type GroupedItem =
  | { kind: 'single'; block: Block }
  | { kind: 'dialogueGroup'; blocks: Block[]; id: string }

function SortableItem({
  item,
  characters,
  onUpdateBlock,
  onDeleteBlock,
  onReorderDialogues,
  onAddDialogue,
  onAIGenerate,
}: {
  item: GroupedItem
  characters: string[]
  onUpdateBlock: (id: string, u: Partial<Block>) => void
  onDeleteBlock: (id: string) => void
  onReorderDialogues: (from: number, to: number) => void
  onAddDialogue: () => void
  onAIGenerate: () => void
}) {
  const id = groupItemId(item)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  const dragHandleProps = { ...attributes, ...listeners }

  if (item.kind === 'dialogueGroup') {
    return (
      <div ref={setNodeRef} style={style}>
        <DialogueContainer
          dialogueBlocks={item.blocks}
          characters={characters}
          onUpdateBlock={onUpdateBlock}
          onDeleteBlock={onDeleteBlock}
          onReorderDialogues={onReorderDialogues}
          onAddDialogue={onAddDialogue}
          onAIGenerate={onAIGenerate}
          dragHandleProps={dragHandleProps}
        />
      </div>
    )
  }

  const block = item.block
  return (
    <div ref={setNodeRef} style={style}>
      {block.type === 'action' && (
        <ActionBlock block={block} onUpdate={(u) => onUpdateBlock(block.id, u)} onDelete={() => onDeleteBlock(block.id)} dragHandleProps={dragHandleProps} />
      )}
      {block.type === 'ambience' && (
        <AmbienceBlock block={block} onUpdate={(u) => onUpdateBlock(block.id, u)} onDelete={() => onDeleteBlock(block.id)} dragHandleProps={dragHandleProps} />
      )}
      {block.type === 'pause' && (
        <PauseBlock block={block} onDelete={() => onDeleteBlock(block.id)} dragHandleProps={dragHandleProps} />
      )}
      {block.type === 'note' && (
        <NoteBlock block={block} onUpdate={(u) => onUpdateBlock(block.id, u)} onDelete={() => onDeleteBlock(block.id)} dragHandleProps={dragHandleProps} />
      )}
    </div>
  )
}

// ─── BlockList ────────────────────────────────────────────────────────────────

export function BlockList() {
  const { selectedScene, updateBlock, deleteBlock, addBlock } = useScenes()
  const { isDraggingFromPalette, overGapIndex } = useEditorDnd()

  if (!selectedScene) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Select a scene to start editing
      </div>
    )
  }

  const sortedBlocks = [...selectedScene.blocks].sort((a, b) => a.order - b.order)
  const characters = selectedScene.characters.map((c) => c.toUpperCase())
  const grouped = groupBlocks(sortedBlocks)
  const sortableIds = grouped.map(groupItemId)

  const handleUpdateBlock = (blockId: string, updates: Partial<Block>) =>
    updateBlock(selectedScene.id, blockId, updates)

  const handleDeleteBlock = (blockId: string) =>
    deleteBlock(selectedScene.id, blockId)

  const handleReorderDialogues = (fromIndex: number, toIndex: number) => {
    const dialogueBlocks = sortedBlocks.filter((b) => b.type === 'dialogue')
    const globalFrom = sortedBlocks.findIndex((b) => b.id === dialogueBlocks[fromIndex]?.id)
    const globalTo = sortedBlocks.findIndex((b) => b.id === dialogueBlocks[toIndex]?.id)
    if (globalFrom !== -1 && globalTo !== -1) {
      updateBlock(selectedScene.id, dialogueBlocks[fromIndex].id, { order: dialogueBlocks[toIndex].order })
      updateBlock(selectedScene.id, dialogueBlocks[toIndex].id, { order: dialogueBlocks[fromIndex].order })
    }
  }

  const handleAddDialogue = () => addBlock(selectedScene.id, 'dialogue')

  const handleAIGenerate = () => {
    // TODO: Open AI dialogue generator modal/panel
    console.log('AI Dialogue Generator triggered for scene:', selectedScene.id)
  }

  return (
    <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
      <div className="flex flex-col">
        {/* Top gap */}
        <DropGap index={0} isOver={isDraggingFromPalette && overGapIndex === 0} />

        {grouped.map((item, index) => (
          <div key={groupItemId(item)} className="flex flex-col">
            <SortableItem
              item={item}
              characters={characters}
              onUpdateBlock={handleUpdateBlock}
              onDeleteBlock={handleDeleteBlock}
              onReorderDialogues={handleReorderDialogues}
              onAddDialogue={handleAddDialogue}
              onAIGenerate={handleAIGenerate}
            />
            {/* Gap after each item — always mounted so useDroppable registers */}
            <DropGap
              index={index + 1}
              isOver={isDraggingFromPalette && overGapIndex === index + 1}
            />
          </div>
        ))}

        {/* Empty state drop zone */}
        {grouped.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border py-16 text-sm text-muted-foreground">
            <p>Drag a block from the right panel to start</p>
          </div>
        )}
      </div>
    </SortableContext>
  )
}
