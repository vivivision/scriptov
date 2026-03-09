'use client'

import type { ReactNode } from 'react'
import { NavigationSidebar } from '@/components/sidebar/navigation-sidebar'

interface AppLayoutProps {
  children: ReactNode
  rightPanel?: ReactNode
}

export function AppLayout({ children, rightPanel }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <NavigationSidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        {children}
      </main>
      {rightPanel && (
        <aside className="w-72 border-l border-border bg-card">
          {rightPanel}
        </aside>
      )}
    </div>
  )
}
