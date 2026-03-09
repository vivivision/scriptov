'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { SceneCard } from '@/components/scene-board/scene-card'
import { useScenes } from '@/lib/scene-context'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LayoutGrid } from 'lucide-react'

export default function SceneBoardPage() {
  const { project, reorderScenes } = useScenes()
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const sortedScenes = [...project.scenes].sort((a, b) => a.order - b.order)

  const handleDragStart = (index: number) => {
    setDragIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDrop = (toIndex: number) => {
    if (dragIndex !== null && dragIndex !== toIndex) {
      reorderScenes(dragIndex, toIndex)
    }
    setDragIndex(null)
    setDragOverIndex(null)
  }

  return (
    <AppLayout>
      <div className="flex h-full flex-col">
        <header className="flex items-center gap-3 border-b border-border px-6 py-4">
          <LayoutGrid className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-semibold text-foreground">Scene Board</h1>
          <span className="text-sm text-muted-foreground">
            {project.scenes.length} scenes
          </span>
        </header>

        <ScrollArea className="flex-1">
          <div className="p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedScenes.map((scene, index) => (
                <SceneCard
                  key={scene.id}
                  scene={scene}
                  index={index}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  isDragging={dragIndex === index}
                  dragOverIndex={dragOverIndex}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </AppLayout>
  )
}
