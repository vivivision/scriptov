export type BlockType = 'action' | 'dialogue' | 'ambience' | 'pause' | 'note'

export interface Block {
  id: string
  type: BlockType
  content: string
  characterName?: string
  order: number
}

export interface Scene {
  id: string
  title: string
  location: string
  time: string
  characters: string[]
  description: string
  blocks: Block[]
  mood: string[]
  order: number
  isActive: boolean
}

export interface Project {
  id: string
  title: string
  scenes: Scene[]
}
