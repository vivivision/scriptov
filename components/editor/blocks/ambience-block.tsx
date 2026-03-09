'use client'

import { useState, useRef } from 'react'
import { GripVertical, Trash2, CloudRain, Play, Pause, Upload, ChevronDown, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Block } from '@/lib/types'

// Preset ambient sounds
const AMBIENT_PRESETS = [
  { id: 'rain', name: 'Rain', description: 'Gentle rain falling', url: '/audio/rain.mp3' },
  { id: 'thunder', name: 'Thunderstorm', description: 'Thunder and rain', url: '/audio/thunder.mp3' },
  { id: 'ocean', name: 'Ocean Waves', description: 'Waves crashing on shore', url: '/audio/ocean.mp3' },
  { id: 'forest', name: 'Forest', description: 'Birds and rustling leaves', url: '/audio/forest.mp3' },
  { id: 'city', name: 'City Traffic', description: 'Urban street sounds', url: '/audio/city.mp3' },
  { id: 'cafe', name: 'Cafe', description: 'Coffee shop ambience', url: '/audio/cafe.mp3' },
  { id: 'wind', name: 'Wind', description: 'Gentle wind blowing', url: '/audio/wind.mp3' },
  { id: 'fire', name: 'Fireplace', description: 'Crackling fire', url: '/audio/fire.mp3' },
  { id: 'night', name: 'Night', description: 'Crickets and night sounds', url: '/audio/night.mp3' },
  { id: 'crowd', name: 'Crowd', description: 'Background crowd murmur', url: '/audio/crowd.mp3' },
]

interface AmbienceBlockProps {
  block: Block
  onUpdate: (updates: Partial<Block>) => void
  onDelete: () => void
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}

export function AmbienceBlock({ block, onUpdate, onDelete, dragHandleProps }: AmbienceBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedPreset = AMBIENT_PRESETS.find(p => p.url === block.audioUrl)

  const handlePlayPause = () => {
    if (!block.audioUrl) return

    if (isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(block.audioUrl)
        audioRef.current.crossOrigin = 'anonymous'
        audioRef.current.loop = true
        audioRef.current.onended = () => setIsPlaying(false)
      }
      audioRef.current.play().catch(() => setIsPlaying(false))
      setIsPlaying(true)
    }
  }

  const handlePresetSelect = (preset: typeof AMBIENT_PRESETS[0]) => {
    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
      setIsPlaying(false)
    }
    onUpdate({ 
      content: preset.description, 
      audioUrl: preset.url,
      audioType: 'preset'
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
        setIsPlaying(false)
      }
      const url = URL.createObjectURL(file)
      onUpdate({ 
        content: file.name.replace(/\.[^/.]+$/, ''),
        audioUrl: url,
        audioType: 'custom'
      })
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="group relative flex items-start gap-3 rounded-lg border border-dashed border-border bg-card/50 p-4 transition-all hover:border-muted-foreground/30">
      <div 
        {...dragHandleProps}
        className="flex cursor-grab items-center self-stretch text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-cyan-500/20">
        <CloudRain className="h-3.5 w-3.5 text-cyan-500" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Ambience
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 gap-1 px-1.5 text-xs text-cyan-400 hover:text-cyan-300"
              >
                <Volume2 className="h-3 w-3" />
                {selectedPreset?.name || (block.audioType === 'custom' ? 'Custom Audio' : 'Select Sound')}
                <ChevronDown className="h-2.5 w-2.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto">
              {AMBIENT_PRESETS.map((preset) => (
                <DropdownMenuItem
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className="flex flex-col items-start gap-0.5"
                >
                  <span className="text-xs font-medium">{preset.name}</span>
                  <span className="text-[10px] text-muted-foreground">{preset.description}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleUploadClick}>
                <Upload className="mr-2 h-3 w-3" />
                <span className="text-xs">Upload Custom Audio</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {block.audioUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlayPause}
              className="h-5 w-5 p-0 text-cyan-400 hover:text-cyan-300"
            >
              {isPlaying ? (
                <Pause className="h-3 w-3" />
              ) : (
                <Play className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>

        {isEditing ? (
          <Input
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            onBlur={() => setIsEditing(false)}
            autoFocus
            className="h-auto border-0 bg-transparent p-0 text-sm text-cyan-400 focus-visible:ring-0"
            placeholder="Describe the ambient sound or atmosphere..."
          />
        ) : (
          <p
            onClick={() => setIsEditing(true)}
            className="cursor-text text-sm text-cyan-400"
          >
            {block.content || 'Click to add ambience...'}
          </p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>
    </div>
  )
}
