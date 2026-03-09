'use client'

import { Clapperboard, MessageSquare, CloudRain, Timer, StickyNote } from 'lucide-react'
import type { BlockType } from '@/lib/types'

export const PALETTE_DRAG_PREFIX = 'palette:'

export const blockTypes: { type: BlockType; label: string; icon: typeof Clapperboard; color: string; bg: string }[] = [
  { type: 'action',   label: 'Action',   icon: Clapperboard,  color: 'text-amber-500',  bg: 'bg-amber-500/10' },
  { type: 'dialogue', label: 'Dialogue', icon: MessageSquare, color: 'text-blue-500',   bg: 'bg-blue-500/10' },
  { type: 'ambience', label: 'Ambience', icon: CloudRain,     color: 'text-cyan-500',   bg: 'bg-cyan-500/10' },
  { type: 'pause',    label: 'Pause',    icon: Timer,         color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { type: 'note',     label: 'Note',     icon: StickyNote,    color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
]
