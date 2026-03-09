'use client'

import { useState, useRef, useEffect } from 'react'
import { useScenes } from '@/lib/scene-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { MapPin, Users, Plus, X, ChevronDown, Pencil } from 'lucide-react'

// Predefined places for quick selection
const PRESET_PLACES = [
  { id: 'interior-house', name: 'INT. HOUSE', category: 'Interior' },
  { id: 'interior-office', name: 'INT. OFFICE', category: 'Interior' },
  { id: 'interior-apartment', name: 'INT. APARTMENT', category: 'Interior' },
  { id: 'interior-car', name: 'INT. CAR', category: 'Interior' },
  { id: 'interior-restaurant', name: 'INT. RESTAURANT', category: 'Interior' },
  { id: 'interior-hospital', name: 'INT. HOSPITAL', category: 'Interior' },
  { id: 'exterior-street', name: 'EXT. STREET', category: 'Exterior' },
  { id: 'exterior-park', name: 'EXT. PARK', category: 'Exterior' },
  { id: 'exterior-beach', name: 'EXT. BEACH', category: 'Exterior' },
  { id: 'exterior-forest', name: 'EXT. FOREST', category: 'Exterior' },
  { id: 'exterior-city', name: 'EXT. CITY', category: 'Exterior' },
  { id: 'exterior-rooftop', name: 'EXT. ROOFTOP', category: 'Exterior' },
]

export function SceneEditorTitle() {
  const { project, selectedScene, updateScene } = useScenes()
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [editedDescription, setEditedDescription] = useState('')
  const [isEditingPlace, setIsEditingPlace] = useState(false)
  const [editedPlace, setEditedPlace] = useState('')
  const [newCharacter, setNewCharacter] = useState('')
  const [isAddingCharacter, setIsAddingCharacter] = useState(false)
  
  const descriptionInputRef = useRef<HTMLInputElement>(null)
  const placeInputRef = useRef<HTMLInputElement>(null)
  const characterInputRef = useRef<HTMLInputElement>(null)

  // Get scene number based on order in project
  const sceneNumber = selectedScene
    ? project.scenes.findIndex((s) => s.id === selectedScene.id) + 1
    : 0

  useEffect(() => {
    if (isEditingDescription && descriptionInputRef.current) {
      descriptionInputRef.current.focus()
    }
  }, [isEditingDescription])

  useEffect(() => {
    if (isEditingPlace && placeInputRef.current) {
      placeInputRef.current.focus()
    }
  }, [isEditingPlace])

  useEffect(() => {
    if (isAddingCharacter && characterInputRef.current) {
      characterInputRef.current.focus()
    }
  }, [isAddingCharacter])

  if (!selectedScene) {
    return (
      <div className="border-b border-border bg-muted/30 px-6 py-4">
        <p className="text-sm text-muted-foreground">No scene selected</p>
      </div>
    )
  }

  const handleDescriptionClick = () => {
    setEditedDescription(selectedScene.description)
    setIsEditingDescription(true)
  }

  const handleDescriptionSave = () => {
    updateScene(selectedScene.id, { description: editedDescription.trim() })
    setIsEditingDescription(false)
  }

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleDescriptionSave()
    } else if (e.key === 'Escape') {
      setIsEditingDescription(false)
    }
  }

  const handlePlaceSelect = (place: string) => {
    updateScene(selectedScene.id, { location: place })
  }

  const handleCustomPlaceClick = () => {
    setEditedPlace(selectedScene.location)
    setIsEditingPlace(true)
  }

  const handlePlaceSave = () => {
    updateScene(selectedScene.id, { location: editedPlace.trim() })
    setIsEditingPlace(false)
  }

  const handlePlaceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePlaceSave()
    } else if (e.key === 'Escape') {
      setIsEditingPlace(false)
    }
  }

  const handleAddCharacter = () => {
    if (newCharacter.trim() && !selectedScene.characters.includes(newCharacter.trim().toUpperCase())) {
      updateScene(selectedScene.id, {
        characters: [...selectedScene.characters, newCharacter.trim().toUpperCase()],
      })
      setNewCharacter('')
    }
    setIsAddingCharacter(false)
  }

  const handleCharacterKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCharacter()
    } else if (e.key === 'Escape') {
      setNewCharacter('')
      setIsAddingCharacter(false)
    }
  }

  const handleRemoveCharacter = (character: string) => {
    updateScene(selectedScene.id, {
      characters: selectedScene.characters.filter((c) => c !== character),
    })
  }

  return (
    <div className="border-b border-border bg-muted/30 px-6 py-4">
      <div className="flex flex-col gap-3">
        {/* Scene Number and Description Row */}
        <div className="flex items-start gap-3">
          <Badge variant="outline" className="shrink-0 bg-primary/10 text-primary">
            Scene {sceneNumber}
          </Badge>
          
          <div className="min-w-0 flex-1">
            {isEditingDescription ? (
              <Input
                ref={descriptionInputRef}
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                onBlur={handleDescriptionSave}
                onKeyDown={handleDescriptionKeyDown}
                className="h-7 text-sm"
                placeholder="Add a short description to your scene"
              />
            ) : (
              <button
                onClick={handleDescriptionClick}
                className="w-full text-left text-sm transition-colors hover:text-primary"
              >
                {selectedScene.description ? (
                  <span className="text-foreground">{selectedScene.description}</span>
                ) : (
                  <span className="italic text-muted-foreground">
                    Add a short description to your scene
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Place and Characters Row */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Place Selector */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            {isEditingPlace ? (
              <Input
                ref={placeInputRef}
                value={editedPlace}
                onChange={(e) => setEditedPlace(e.target.value)}
                onBlur={handlePlaceSave}
                onKeyDown={handlePlaceKeyDown}
                className="h-7 w-48 text-sm"
                placeholder="Enter location..."
              />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 px-2 text-sm font-medium"
                  >
                    {selectedScene.location || 'Select place'}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto">
                  <DropdownMenuItem onClick={handleCustomPlaceClick}>
                    <Pencil className="mr-2 h-3 w-3" />
                    <span className="text-xs">Custom Location</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    Interior
                  </div>
                  {PRESET_PLACES.filter((p) => p.category === 'Interior').map((place) => (
                    <DropdownMenuItem
                      key={place.id}
                      onClick={() => handlePlaceSelect(place.name)}
                      className="text-xs"
                    >
                      {place.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    Exterior
                  </div>
                  {PRESET_PLACES.filter((p) => p.category === 'Exterior').map((place) => (
                    <DropdownMenuItem
                      key={place.id}
                      onClick={() => handlePlaceSelect(place.name)}
                      className="text-xs"
                    >
                      {place.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="h-4 w-px bg-border" />

          {/* Characters */}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap items-center gap-1.5">
              {selectedScene.characters.map((character) => (
                <Badge
                  key={character}
                  variant="secondary"
                  className="gap-1 pr-1 text-xs"
                >
                  {character}
                  <button
                    onClick={() => handleRemoveCharacter(character)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              ))}
              
              <Popover open={isAddingCharacter} onOpenChange={setIsAddingCharacter}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" align="start">
                  <Input
                    ref={characterInputRef}
                    value={newCharacter}
                    onChange={(e) => setNewCharacter(e.target.value)}
                    onKeyDown={handleCharacterKeyDown}
                    placeholder="Character name"
                    className="h-8 text-sm"
                  />
                  <div className="mt-2 flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => {
                        setNewCharacter('')
                        setIsAddingCharacter(false)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={handleAddCharacter}
                    >
                      Add
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
