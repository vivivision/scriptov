'use client'

import Link from 'next/link'
import { ScreenplayFormatter } from '@/components/script-view/screenplay-formatter'
import { useScenes } from '@/lib/scene-context'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download } from 'lucide-react'

export default function ScriptViewPage() {
  const { project } = useScenes()

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <Link 
          href="/scene-editor"
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Editor
        </Link>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </header>

      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-8">
          <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold uppercase tracking-wide text-foreground">
                {project.title}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {project.scenes.length} Scenes
              </p>
            </div>

            <ScreenplayFormatter scenes={project.scenes} />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
