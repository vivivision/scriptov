'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Project, Scene, Block, BlockType } from './types'
import { initialProject } from './data'

interface SceneContextType {
  project: Project
  selectedSceneId: string | null
  selectedScene: Scene | null
  setSelectedSceneId: (id: string | null) => void
  updateProject: (updates: Partial<Project>) => void
  updateScene: (sceneId: string, updates: Partial<Scene>) => void
  addScene: () => void
  deleteScene: (sceneId: string) => void
  toggleSceneActive: (sceneId: string) => void
  reorderScenes: (fromIndex: number, toIndex: number) => void
  addBlock: (sceneId: string, type: BlockType) => void
  addBlockAtIndex: (sceneId: string, type: BlockType, index: number) => void
  updateBlock: (sceneId: string, blockId: string, updates: Partial<Block>) => void
  deleteBlock: (sceneId: string, blockId: string) => void
  reorderBlocks: (sceneId: string, fromIndex: number, toIndex: number) => void
}

const SceneContext = createContext<SceneContextType | null>(null)

export function SceneProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<Project>(initialProject)
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(
    initialProject.scenes[2]?.id || null
  )

  const selectedScene = project.scenes.find((s) => s.id === selectedSceneId) || null

  const updateProject = useCallback((updates: Partial<Project>) => {
    setProject((prev) => ({ ...prev, ...updates }))
  }, [])

  const updateScene = useCallback((sceneId: string, updates: Partial<Scene>) => {
    setProject((prev) => ({
      ...prev,
      scenes: prev.scenes.map((scene) =>
        scene.id === sceneId ? { ...scene, ...updates } : scene
      ),
    }))
  }, [])

  const addScene = useCallback(() => {
    const newScene: Scene = {
      id: `scene-${Date.now()}`,
      title: 'New Scene',
      location: '',
      time: '',
      characters: [],
      description: '',
      blocks: [],
      mood: [],
      order: 0,
      isActive: true,
    }
    setProject((prev) => {
      const updatedScenes = prev.scenes.map((s) => ({ ...s, order: s.order + 1 }))
      return { ...prev, scenes: [newScene, ...updatedScenes] }
    })
    setSelectedSceneId(newScene.id)
  }, [])

  const deleteScene = useCallback((sceneId: string) => {
    setProject((prev) => {
      const newScenes = prev.scenes.filter((scene) => scene.id !== sceneId)
      return {
        ...prev,
        scenes: newScenes.map((scene, index) => ({ ...scene, order: index })),
      }
    })
    setSelectedSceneId((prevId) => {
      if (prevId === sceneId) {
        const remainingScenes = project.scenes.filter((s) => s.id !== sceneId)
        return remainingScenes[0]?.id || null
      }
      return prevId
    })
  }, [project.scenes])

  const toggleSceneActive = useCallback((sceneId: string) => {
    setProject((prev) => ({
      ...prev,
      scenes: prev.scenes.map((scene) =>
        scene.id === sceneId ? { ...scene, isActive: !scene.isActive } : scene
      ),
    }))
  }, [])

  const reorderScenes = useCallback((fromIndex: number, toIndex: number) => {
    setProject((prev) => {
      const newScenes = [...prev.scenes]
      const [movedScene] = newScenes.splice(fromIndex, 1)
      newScenes.splice(toIndex, 0, movedScene)
      return {
        ...prev,
        scenes: newScenes.map((scene, index) => ({ ...scene, order: index })),
      }
    })
  }, [])

  const addBlock = useCallback((sceneId: string, type: BlockType) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: '',
      characterName: type === 'dialogue' ? 'CHARACTER' : undefined,
      order: 0,
    }

    setProject((prev) => ({
      ...prev,
      scenes: prev.scenes.map((scene) => {
        if (scene.id !== sceneId) return scene
        const maxOrder = Math.max(...scene.blocks.map((b) => b.order), -1)
        return {
          ...scene,
          blocks: [...scene.blocks, { ...newBlock, order: maxOrder + 1 }],
        }
      }),
    }))
  }, [])

  const addBlockAtIndex = useCallback((sceneId: string, type: BlockType, index: number) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: '',
      characterName: type === 'dialogue' ? 'CHARACTER' : undefined,
      order: index,
    }

    setProject((prev) => ({
      ...prev,
      scenes: prev.scenes.map((scene) => {
        if (scene.id !== sceneId) return scene
        const sorted = [...scene.blocks].sort((a, b) => a.order - b.order)
        sorted.splice(index, 0, newBlock)
        return {
          ...scene,
          blocks: sorted.map((block, i) => ({ ...block, order: i })),
        }
      }),
    }))
  }, [])

  const updateBlock = useCallback(
    (sceneId: string, blockId: string, updates: Partial<Block>) => {
      setProject((prev) => ({
        ...prev,
        scenes: prev.scenes.map((scene) => {
          if (scene.id !== sceneId) return scene
          return {
            ...scene,
            blocks: scene.blocks.map((block) =>
              block.id === blockId ? { ...block, ...updates } : block
            ),
          }
        }),
      }))
    },
    []
  )

  const deleteBlock = useCallback((sceneId: string, blockId: string) => {
    setProject((prev) => ({
      ...prev,
      scenes: prev.scenes.map((scene) => {
        if (scene.id !== sceneId) return scene
        return {
          ...scene,
          blocks: scene.blocks.filter((block) => block.id !== blockId),
        }
      }),
    }))
  }, [])

  const reorderBlocks = useCallback(
    (sceneId: string, fromIndex: number, toIndex: number) => {
      setProject((prev) => ({
        ...prev,
        scenes: prev.scenes.map((scene) => {
          if (scene.id !== sceneId) return scene
          const newBlocks = [...scene.blocks]
          const [movedBlock] = newBlocks.splice(fromIndex, 1)
          newBlocks.splice(toIndex, 0, movedBlock)
          return {
            ...scene,
            blocks: newBlocks.map((block, index) => ({ ...block, order: index })),
          }
        }),
      }))
    },
    []
  )

  return (
    <SceneContext.Provider
      value={{
        project,
        selectedSceneId,
        selectedScene,
        setSelectedSceneId,
        updateProject,
        updateScene,
        addScene,
        deleteScene,
        toggleSceneActive,
        reorderScenes,
        addBlock,
        addBlockAtIndex,
        updateBlock,
        deleteBlock,
        reorderBlocks,
      }}
    >
      {children}
    </SceneContext.Provider>
  )
}

export function useScenes() {
  const context = useContext(SceneContext)
  if (!context) {
    throw new Error('useScenes must be used within a SceneProvider')
  }
  return context
}
