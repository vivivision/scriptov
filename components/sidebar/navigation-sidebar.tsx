'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useScenes } from '@/lib/scene-context'
import {
  LayoutGrid,
  PenLine,
  FileText,
  Lightbulb,
  Film,
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

const navItems = [
  { href: '/scene-board', label: 'Scene Board', icon: LayoutGrid },
  { href: '/scene-editor', label: 'Scene Editor', icon: PenLine },
  { href: '/script-view', label: 'Script View', icon: FileText },
]

export function NavigationSidebar() {
  const pathname = usePathname()
  const { project, selectedSceneId, setSelectedSceneId } = useScenes()

  return (
    <div className="flex h-full w-60 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-2 border-b border-border px-4 py-4">
        <Film className="h-5 w-5 text-sidebar-foreground" />
        <h1 className="text-sm font-semibold text-sidebar-foreground">
          {project.title}
        </h1>
      </div>

      <nav className="flex flex-col gap-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center gap-2 px-4 py-3">
        <Lightbulb className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Scenes
        </span>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="flex flex-col gap-1 pb-4">
          {project.scenes
            .sort((a, b) => a.order - b.order)
            .map((scene) => {
              const isSelected = scene.id === selectedSceneId
              return (
                <button
                  key={scene.id}
                  onClick={() => setSelectedSceneId(scene.id)}
                  className={cn(
                    'flex flex-col items-start rounded-md px-3 py-2 text-left transition-colors',
                    isSelected
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  )}
                >
                  <span className="text-sm font-medium">{scene.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {scene.location} - {scene.time}
                  </span>
                </button>
              )
            })}
        </div>
      </ScrollArea>
    </div>
  )
}
