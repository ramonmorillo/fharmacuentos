import { BACKGROUNDS } from './assets/backgrounds'
import { CHARACTERS } from './assets/characters'
import { OBJECTS } from './assets/objects'
import type { Character, ObjectId, Palette, Setting, Shape } from './types'

export type AssetVariant = {
  slot: 0 | 1 | 2 | 3
  draw: (palette: Palette, variant: number, ageFlag: boolean) => Shape[]
} & ({ kind: 'background'; target: Setting } | { kind: 'character'; target: Character } | { kind: 'object'; target: ObjectId })

/** Add a single *.ts file here; Vite includes it at build time, without runtime requests. */
const modules = import.meta.glob<{ default: AssetVariant }>('./assets/variants/*.ts', { eager: true })
const variants = new Map<string, AssetVariant>()
for (const name of Object.keys(modules).sort()) {
  const variant = modules[name].default
  const key = `${variant.kind}/${variant.target}/${variant.slot}`
  if (variants.has(key)) throw new Error(`Duplicate local cover asset: ${key}`)
  variants.set(key, variant)
}
export function background(id: Setting, p: Palette, slot: number, simple: boolean): Shape[] {
  return variants.get(`background/${id}/${slot}`)?.draw(p,slot,simple) ?? BACKGROUNDS[id](p,slot,simple)
}
export function character(id: Character, p: Palette, slot: number, mature: boolean): Shape[] {
  return variants.get(`character/${id}/${slot}`)?.draw(p,slot,mature) ?? CHARACTERS[id](p,slot,mature)
}
export function object(id: ObjectId, p: Palette, slot: number, mature: boolean): Shape[] {
  return variants.get(`object/${id}/${slot}`)?.draw(p,slot,mature) ?? OBJECTS[id](p)
}
