'use client'

import { useState } from 'react'
import { useScenes } from '@/lib/scene-context'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ChevronLeft,
  ChevronRight,
  GripVertical,
  MoreHorizontal,
  Settings,
  EyeOff,
  Eye,
  Trash2,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Scene } from '@/lib/types'

interface SortableSceneItemProps {
  scene: Scene
  isSelected: boolean
  onSelect: () => void
  onSettings: () => void
  onToggleActive: () => void
  onDelete: () => void
}

function SortableSceneItem({
  scene,
  isSelected,
  onSelect,
  onSettings,
  onToggleActive,
  onDelete,
}: SortableSceneItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: scene.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-2 rounded-md border px-2 py-2 transition-all',
        isSelected
          ? 'border-primary bg-primary/10'
          : 'border-transparent hover:border-border hover:bg-muted/50',
        isDragging && 'opacity-50',
        !scene.isActive && 'opacity-50'
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex cursor-grab items-center text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <button
        onClick={onSelect}
        className="flex flex-1 flex-col items-start gap-0.5 text-left"
      >
        <span className="text-xs text-muted-foreground">Scene {scene.order + 1}</span>
        <span className={cn(
          'text-sm font-medium truncate max-w-[140px]',
          !scene.isActive && 'line-through'
        )}>
          {scene.title}
        </span>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={onSettings}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onToggleActive}>
            {scene.isActive ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function SceneSidebar() {
  const {
    project,
    selectedSceneId,
    setSelectedSceneId,
    addScene,
    deleteScene,
    toggleSceneActive,
    reorderScenes,
  } = useScenes()

  const [isCollapsed, setIsCollapsed] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sceneToDelete, setSceneToDelete] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = project.scenes.findIndex((s) => s.id === active.id)
      const newIndex = project.scenes.findIndex((s) => s.id === over.id)
      reorderScenes(oldIndex, newIndex)
    }
  }

  const handleDeleteClick = (sceneId: string) => {
    setSceneToDelete(sceneId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (sceneToDelete) {
      deleteScene(sceneToDelete)
      setSceneToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  if (isCollapsed) {
    return (
      <div className="flex h-full w-10 flex-col border-r border-border bg-card">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="m-1"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex h-full w-64 flex-col border-r border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-3 py-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold">Scenes</h2>
            <Button
              variant="secondary"
              size="icon"
              onClick={addScene}
              className="h-6 w-6"
              title="Add scene"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="h-7 w-7"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-2 py-2">          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={project.scenes.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-1">
                {project.scenes.map((scene) => (
                  <SortableSceneItem
                    key={scene.id}
                    scene={scene}
                    isSelected={scene.id === selectedSceneId}
                    onSelect={() => setSelectedSceneId(scene.id)}
                    onSettings={() => {}}
                    onToggleActive={() => toggleSceneActive(scene.id)}
                    onDelete={() => handleDeleteClick(scene.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </ScrollArea>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Scene</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this scene? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
