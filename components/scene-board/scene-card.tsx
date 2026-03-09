'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useScenes } from '@/lib/scene-context'
import type { Scene } from '@/lib/types'
import { GripVertical, MapPin, Clock, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SceneCardProps {
  scene: Scene
  index: number
  onDragStart: (index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDrop: (index: number) => void
  isDragging: boolean
  dragOverIndex: number | null
}

export function SceneCard({
  scene,
  index,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
  dragOverIndex,
}: SceneCardProps) {
  const router = useRouter()
  const { setSelectedSceneId } = useScenes()

  const handleClick = () => {
    setSelectedSceneId(scene.id)
    router.push('/scene-editor')
  }

  return (
    <Card
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={() => onDrop(index)}
      onClick={handleClick}
      className={cn(
        'cursor-pointer transition-all hover:border-muted-foreground/30 hover:shadow-md',
        isDragging && 'opacity-50',
        dragOverIndex === index && 'border-primary'
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
            <CardTitle className="text-base">{scene.title}</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {scene.time}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {scene.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {scene.time}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>{scene.characters.join(', ')}</span>
        </div>

        <p className="text-sm text-foreground/80">{scene.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {scene.mood.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
