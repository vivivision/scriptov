'use client'

import type { Scene, Block } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ScreenplayFormatterProps {
  scenes: Scene[]
}

function formatSceneHeading(scene: Scene): string {
  const interior = scene.location.toLowerCase().includes('apartment') || 
                   scene.location.toLowerCase().includes('shop') ||
                   scene.location.toLowerCase().includes('room')
    ? 'INT.'
    : 'EXT.'
  
  return `${interior} ${scene.location.toUpperCase()} – ${scene.time.toUpperCase()}`
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'action':
      return (
        <p className="my-4 text-foreground">
          {block.content}
        </p>
      )
    case 'dialogue':
      return (
        <div className="my-4 flex flex-col items-center">
          <span className="font-semibold uppercase tracking-wide text-foreground">
            {block.characterName}
          </span>
          <p className="max-w-xs text-center text-foreground">
            {block.content}
          </p>
        </div>
      )
    case 'ambience':
      return (
        <p className="my-4 italic text-muted-foreground">
          ({block.content})
        </p>
      )
    case 'pause':
      return (
        <p className="my-4 text-center italic text-muted-foreground">
          (pause)
        </p>
      )
    case 'note':
      return null // Notes don't appear in screenplay format
    default:
      return null
  }
}

export function ScreenplayFormatter({ scenes }: ScreenplayFormatterProps) {
  const sortedScenes = [...scenes].sort((a, b) => a.order - b.order)

  return (
    <div className="font-mono text-sm leading-relaxed">
      {sortedScenes.map((scene, sceneIndex) => {
        const sortedBlocks = [...scene.blocks]
          .filter((b) => b.type !== 'note')
          .sort((a, b) => a.order - b.order)

        return (
          <div key={scene.id} className={cn(sceneIndex > 0 && 'mt-12')}>
            <h2 className="mb-6 font-bold uppercase tracking-wide text-foreground">
              {formatSceneHeading(scene)}
            </h2>
            {sortedBlocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
          </div>
        )
      })}
    </div>
  )
}
