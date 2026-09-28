import { COMPOSITIONS, PALETTES } from './catalog'
import type { CoverRecipe, VisualStorySpec } from './types'

export function hash(value: string): number {
  let h = 2166136261
  for (let i = 0; i < value.length; i++) h = Math.imul(h ^ value.charCodeAt(i), 16777619)
  return h >>> 0
}
export function random(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state += 0x6D2B79F5
    let t = Math.imul(state ^ state >>> 15, 1 | state)
    t ^= t + Math.imul(t ^ t >>> 7, 61 | t)
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}
export function initialSeed(spec: VisualStorySpec): number {
  return hash(['cover-v1', spec.ageGroup, spec.storyTheme, spec.setting, spec.protagonist, spec.companion ?? '', spec.objects.join(','), spec.narrativeSignature].join('|'))
}
export function recipeFromSeed(spec: VisualStorySpec, seed: number): CoverRecipe {
  const rng = random(seed)
  const compositions = COMPOSITIONS[spec.coverStyle]
  return {
    version: 1, seed: seed >>> 0,
    composition: compositions[Math.floor(rng() * compositions.length)],
    palette: Math.floor(rng() * PALETTES.length), scenery: Math.floor(rng() * 4),
    pose: Math.floor(rng() * 4), ornament: Math.floor(rng() * 4), mirror: rng() > .5,
  }
}

const KEY = 'fharmacuentos.cover.v1'
interface History { recent: number[]; saved: [number, number][] }
const empty = (): History => ({ recent: [], saved: [] })
const uint = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 0xFFFFFFFF
function storage(): Storage | undefined { try { return globalThis.localStorage } catch { return undefined } }
function read(): History {
  try {
    const raw = storage()?.getItem(KEY)
    if (!raw || raw.length > 10000) return empty()
    const data: unknown = JSON.parse(raw)
    if (!data || typeof data !== 'object') return empty()
    const { recent, saved } = data as History
    if (!Array.isArray(recent) || !Array.isArray(saved)) return empty()
    return { recent: recent.filter(uint).slice(-12), saved: saved.filter((v) => Array.isArray(v) && v.length === 2 && v.every(uint)).slice(-64) }
  } catch { return empty() }
}
function write(data: History) { try { storage()?.setItem(KEY, JSON.stringify(data)) } catch { /* Private browsing / quota: cover still works. */ } }
function choose(spec: VisualStorySpec, start: number, recent: number[], previous?: CoverRecipe): CoverRecipe {
  let best = recipeFromSeed(spec, start)
  let bestScore = Infinity
  for (let i = 0; i < 96; i++) {
    const next = recipeFromSeed(spec, (start + Math.imul(i, 2654435761)) >>> 0)
    if (previous && (next.seed === previous.seed || next.composition === previous.composition || next.palette === previous.palette || next.scenery === previous.scenery || next.pose === previous.pose)) continue
    const score = recent.slice(-6).reduce((sum, seed, index) => {
      const old = recipeFromSeed(spec, seed)
      return sum + (index + 1) * (Number(next.composition === old.composition) * 4 + Number(next.scenery === old.scenery) * 2 + Number(next.pose === old.pose) + Number(next.ornament === old.ornament) + Number(next.palette === old.palette) * 2)
    }, 0)
    if (score < bestScore) { best = next; bestScore = score }
  }
  return best
}
function remember(spec: VisualStorySpec, recipe: CoverRecipe, data: History) {
  const base = initialSeed(spec)
  write({ recent: [...data.recent, recipe.seed].slice(-12), saved: [...data.saved.filter(([key]) => key !== base), [base, recipe.seed] as [number, number]].slice(-64) })
}
export function createCoverRecipe(spec: VisualStorySpec, restore = true): CoverRecipe {
  const data = read()
  const base = initialSeed(spec)
  const saved = data.saved.find(([key]) => key === base)
  if (restore && saved) return recipeFromSeed(spec, saved[1])
  const previous = data.recent.length ? recipeFromSeed(spec, data.recent.at(-1)!) : undefined
  const recipe = choose(spec, base, data.recent, previous)
  remember(spec, recipe, data)
  return recipe
}
export function nextCoverRecipe(spec: VisualStorySpec, previous: CoverRecipe): CoverRecipe {
  const data = read()
  const recipe = choose(spec, (previous.seed + 1) >>> 0, data.recent, previous)
  remember(spec, recipe, data)
  return recipe
}
export function clearCoverHistory() { try { storage()?.removeItem(KEY) } catch { /* Optional storage. */ } }
