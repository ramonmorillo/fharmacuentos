import type { AgeGroupId, StoryFormData, StyleId } from '../types'

export type Setting = 'forest' | 'space' | 'reef' | 'city' | 'room' | 'court' | 'panels'
export type Character = 'explorer' | 'astronaut' | 'owl' | 'robot' | 'turtle' | 'fox' | 'dragon'
export type ObjectId = 'map' | 'compass' | 'backpack' | 'door' | 'notebook' | 'signal' | 'shell' | 'ball' | 'star'
export type Composition = 'central' | 'lateral' | 'panorama' | 'diagonal' | 'minimal' | 'graphic'
export interface VisualStorySpec {
  ageGroup: AgeGroupId
  storyTheme: StyleId
  setting: Setting
  protagonist: Character
  companion?: Character
  objects: ObjectId[]
  mood: StoryFormData['emotion']
  educationalGoal: StoryFormData['pedagogicalCompetence']
  coverStyle: 'album' | 'adventure' | 'graphic' | 'young'
  /** Only allowlisted narrative tokens; never raw text, names or clinical fields. */
  narrativeSignature: string
}
export interface CoverRecipe {
  version: 1
  seed: number
  composition: Composition
  palette: number
  scenery: number
  pose: number
  ornament: number
  mirror: boolean
}
export interface CoverState { spec: VisualStorySpec; recipe: CoverRecipe }
export interface Palette { paper: string; ink: string; dark: string; mid: string; light: string; accent: string; sun: string }
export type Op = { op: 'm' | 'l' | 'c' | 'h'; c: number[] }
export interface Shape { ops: Op[]; fill: string; stroke?: string; width?: number }
export interface CoverText { text: string; x: number; y: number; size: number; color: string; font: 'serif' | 'sans'; bold: boolean; width: number }
export interface CoverDrawing { shapes: Shape[]; texts: CoverText[]; description: string }
