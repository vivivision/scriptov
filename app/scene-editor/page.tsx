'use client'

import { EditorHeader } from '@/components/editor/editor-header'
import { SceneBlockHeader } from '@/components/editor/scene-block-header'
import { BlockList } from '@/components/editor/block-list'
import { BlockPaletteSidebar } from '@/components/editor/block-palette-sidebar'
import { EditorDndProvider } from '@/components/editor/editor-dnd-context'
import { SceneSidebar } from '@/components/sidebar/scene-sidebar'
import { useScenes } from '@/lib/scene-context'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function SceneEditorPage() {
  const { selectedScene } = useScenes()

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <EditorHeader />

      <EditorDndProvider>
        <div className="flex flex-1 overflow-hidden">
          <SceneSidebar />

          <div className="flex flex-1 flex-col overflow-hidden">
            {selectedScene && (
              <>
                <SceneBlockHeader />

                <ScrollArea className="flex-1">
                  <div className="mx-auto max-w-3xl px-6 py-6">
                    <BlockList />
                  </div>
                </ScrollArea>
              </>
            )}

            {!selectedScene && (
              <div className="flex flex-1 items-center justify-center text-muted-foreground">
                No scene selected
              </div>
            )}
          </div>

          <BlockPaletteSidebar />
        </div>
      </EditorDndProvider>
    </div>
  )
}
