'use client'

import { useState, useRef, useEffect } from 'react'
import { useScenes } from '@/lib/scene-context'
import { AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

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

export function SceneBlockHeader() {
  const { selectedScene, updateScene } = useScenes()
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [showInsights, setShowInsights] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditingTitle])

  if (!selectedScene) return null

  const warnings = generateWarnings(selectedScene)

  const handleTitleClick = () => {
    setEditedTitle(selectedScene.title)
    setIsEditingTitle(true)
  }

  const handleSaveTitle = () => {
    if (editedTitle.trim() && selectedScene) {
      updateScene(selectedScene.id, { title: editedTitle.trim() })
    }
    setIsEditingTitle(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle()
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false)
    }
  }

  return (
    <div className="border-b border-border bg-card/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isEditingTitle ? (
            <input
              ref={inputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={handleKeyDown}
              className="border-b border-primary bg-transparent text-xl font-semibold text-foreground outline-none"
            />
          ) : (
            <button
              onClick={handleTitleClick}
              className="text-xl font-semibold text-foreground transition-colors hover:text-primary"
            >
              {selectedScene.title}
            </button>
          )}
          
          {warnings.length > 0 && (
            <button
              onClick={() => setShowInsights(!showInsights)}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
              )}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              {warnings.length} {warnings.length === 1 ? 'note' : 'notes'}
              {showInsights ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {showInsights && warnings.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
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
      )}
    </div>
  )
}
