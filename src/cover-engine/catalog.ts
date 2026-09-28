import type { StyleId } from '../types'
import type { Character, Composition, ObjectId, Palette, Setting } from './types'

/** Single editorial registry. Clinical situations deliberately do not map to images. */
export const WORLDS: Record<StyleId, { setting: Setting; protagonist: Character; companion?: Character; objects: ObjectId[] }> = {
  aventurero: { setting: 'forest', protagonist: 'explorer', objects: ['map', 'compass', 'backpack'] },
  magico: { setting: 'forest', protagonist: 'explorer', objects: ['door', 'star', 'map'] },
  animales: { setting: 'forest', protagonist: 'explorer', companion: 'owl', objects: ['map', 'backpack'] },
  espacial: { setting: 'space', protagonist: 'astronaut', companion: 'robot', objects: ['signal', 'star'] },
  submarino: { setting: 'reef', protagonist: 'explorer', companion: 'turtle', objects: ['shell', 'map'] },
  superheroes: { setting: 'city', protagonist: 'explorer', objects: ['star', 'signal'] },
  deportivo: { setting: 'court', protagonist: 'explorer', objects: ['ball', 'signal'] },
  realista: { setting: 'city', protagonist: 'explorer', objects: ['backpack', 'notebook'] },
  diario: { setting: 'room', protagonist: 'explorer', objects: ['notebook', 'signal'] },
  comic: { setting: 'panels', protagonist: 'explorer', objects: ['notebook', 'star'] },
}
export const OBJECT_WORDS: Record<ObjectId, RegExp> = {
  map: /\bmapa\b/gi, compass: /\bbrújula\b/gi, backpack: /\bmochila\b/gi,
  door: /\bpuerta\b/gi, notebook: /\b(diario|libreta|agenda|nota)\b/gi,
  signal: /\b(señal|panel|tarjeta|marcador)\b/gi, shell: /\bconcha\b/gi,
  ball: /\b(pista|jugada|pase|equipo)\b/gi, star: /\b(chispa|luz|poder|misión)\b/gi,
}
export const COMPOSITIONS: Record<'album' | 'adventure' | 'graphic' | 'young', Composition[]> = {
  album: ['central', 'lateral', 'panorama'],
  adventure: ['central', 'lateral', 'panorama', 'diagonal'],
  graphic: ['panorama', 'diagonal', 'graphic', 'lateral'],
  young: ['minimal', 'graphic', 'diagonal'],
}
export const PALETTES: Palette[] = [
  { paper: '#FBF1DC', ink: '#173D3A', dark: '#194F48', mid: '#447C65', light: '#AAC3A1', accent: '#D26748', sun: '#EDB953' },
  { paper: '#F8EDE1', ink: '#31374A', dark: '#383D63', mid: '#707B98', light: '#BEC5D5', accent: '#BA543F', sun: '#ECC57B' },
  { paper: '#EFF4EA', ink: '#213D48', dark: '#225768', mid: '#478E92', light: '#A0CBBD', accent: '#CC674F', sun: '#EDBC61' },
  { paper: '#F7ECD9', ink: '#4B343C', dark: '#59475C', mid: '#998DA1', light: '#CEBDC0', accent: '#AB4D3D', sun: '#E2AB58' },
  { paper: '#F1F0E7', ink: '#202D40', dark: '#263C57', mid: '#587582', light: '#B5C4BF', accent: '#C66345', sun: '#DBB674' },
  { paper: '#F6EFD9', ink: '#343D35', dark: '#354F43', mid: '#7E936B', light: '#C5CAA6', accent: '#B75B43', sun: '#DCA853' },
]
export const SETTING_LABELS: Record<Setting, string> = {
  forest: 'un bosque y un camino', space: 'una órbita y una nave', reef: 'un arrecife',
  city: 'un horizonte de ciudad', room: 'una ventana y un diario', court: 'una pista', panels: 'viñetas abiertas',
}
export const CHARACTER_LABELS: Record<Character, string> = {
  explorer: 'figura de exploración ficticia', astronaut: 'astronauta', owl: 'búho', robot: 'robot', turtle: 'tortuga', fox: 'zorro', dragon: 'dragón',
}
