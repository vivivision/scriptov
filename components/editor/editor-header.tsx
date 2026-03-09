'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useScenes } from '@/lib/scene-context'
import { Button } from '@/components/ui/button'
import { FileText, Check } from 'lucide-react'

export function EditorHeader() {
  const { project, updateProject } = useScenes()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(project.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleTitleClick = () => {
    setEditedTitle(project.title)
    setIsEditing(true)
  }

  const handleSave = () => {
    if (editedTitle.trim()) {
      updateProject({ title: editedTitle.trim() })
    } else {
      setEditedTitle(project.title)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditedTitle(project.title)
      setIsEditing(false)
    }
  }

  return (
    <header className="flex items-center justify-between border-b border-border bg-background px-6 py-3">
      <div className="flex items-center gap-3">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="border-b border-primary bg-transparent text-lg font-semibold text-foreground outline-none"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleSave}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <button
            onClick={handleTitleClick}
            className="text-lg font-semibold text-foreground transition-colors hover:text-primary"
          >
            {project.title}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link 
          href="/script-view"
          className="inline-flex items-center justify-center rounded-md bg-secondary hover:bg-secondary/80 px-3 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 gap-2"
        >
          <FileText className="h-4 w-4" />
          Script View
        </Link>
      </div>
    </header>
  )
}
