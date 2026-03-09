'use client'

import { useScenes } from '@/lib/scene-context'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, MapPin, Clock, Users, Sparkles } from 'lucide-react'

function generateWarnings(scene: {
  blocks: { type: string; characterName?: string }[]
  characters: string[]
}) {
  const warnings: string[] = []
  const dialogueBlocks = scene.blocks.filter((b) => b.type === 'dialogue')
  const totalBlocks = scene.blocks.length

  if (totalBlocks > 0) {
    const dialoguePercentage = (dialogueBlocks.length / totalBlocks) * 100
    if (dialoguePercentage > 70) {
      warnings.push('Scene is mostly dialogue')
    }
  }

  const characterCounts: Record<string, number> = {}
  dialogueBlocks.forEach((block) => {
    const name = block.characterName || 'Unknown'
    characterCounts[name] = (characterCounts[name] || 0) + 1
  })

  const entries = Object.entries(characterCounts)
  if (entries.length > 0 && dialogueBlocks.length >= 3) {
    const [topCharacter, topCount] = entries.sort((a, b) => b[1] - a[1])[0]
    const percentage = Math.round((topCount / dialogueBlocks.length) * 100)
    if (percentage >= 60) {
      warnings.push(`Character ${topCharacter} speaks ${percentage}% of lines`)
    }
  }

  const actionBlocks = scene.blocks.filter((b) => b.type === 'action')
  if (actionBlocks.length === 0 && totalBlocks > 2) {
    warnings.push('Scene may lack visual action')
  }

  if (scene.characters.length < 2 && dialogueBlocks.length > 4) {
    warnings.push('Scene may lack conflict')
  }

  return warnings
}

export function StoryInsights() {
  const { selectedScene } = useScenes()

  if (!selectedScene) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
        Select a scene to view insights
      </div>
    )
  }

  const warnings = generateWarnings(selectedScene)

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-6 p-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Story Insights</h2>
          </div>

          {warnings.length > 0 ? (
            <div className="flex flex-col gap-2">
              {warnings.map((warning, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 rounded-md bg-amber-500/10 p-2.5 text-xs text-amber-500"
                >
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{warning}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No warnings for this scene</p>
          )}
        </div>

        <div>
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Scene Metadata
          </h3>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Location:</span>
              <span className="text-foreground">{selectedScene.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Time:</span>
              <span className="text-foreground">{selectedScene.time}</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Users className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Characters:</span>
              <span className="text-foreground">{selectedScene.characters.join(', ')}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Scene Mood
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedScene.mood.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Block Summary
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md bg-muted/50 p-2">
              <span className="text-muted-foreground">Action:</span>{' '}
              <span className="font-medium text-foreground">
                {selectedScene.blocks.filter((b) => b.type === 'action').length}
              </span>
            </div>
            <div className="rounded-md bg-muted/50 p-2">
              <span className="text-muted-foreground">Dialogue:</span>{' '}
              <span className="font-medium text-foreground">
                {selectedScene.blocks.filter((b) => b.type === 'dialogue').length}
              </span>
            </div>
            <div className="rounded-md bg-muted/50 p-2">
              <span className="text-muted-foreground">Ambience:</span>{' '}
              <span className="font-medium text-foreground">
                {selectedScene.blocks.filter((b) => b.type === 'ambience').length}
              </span>
            </div>
            <div className="rounded-md bg-muted/50 p-2">
              <span className="text-muted-foreground">Notes:</span>{' '}
              <span className="font-medium text-foreground">
                {selectedScene.blocks.filter((b) => b.type === 'note').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
