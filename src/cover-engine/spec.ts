import type { GeneratedStory, StoryFormData } from '../types'
import { OBJECT_WORDS, WORLDS } from './catalog'
import type { ObjectId, VisualStorySpec } from './types'

export function createVisualSpec(story: GeneratedStory, form: StoryFormData): VisualStorySpec {
  const world = WORLDS[form.style]
  // Only narrative text in memory. Remove supplied pseudonym before keyword analysis.
  // No title, clinical situation, emotion description, or free-text hash enters the seed.
  let text = story.paragraphs.join(' ').toLocaleLowerCase('es')
  for (const value of [form.protagonistName, form.extraDetails, form.situationOther, form.emotionOther]) {
    if (value.trim()) text = text.replaceAll(value.trim().toLocaleLowerCase('es'), '')
  }
  const detected = (Object.entries(OBJECT_WORDS) as [ObjectId, RegExp][])
    .map(([id, pattern]) => ({ id, hits: Array.from(text.matchAll(pattern)).length }))
    .filter(({ id, hits }) => hits > 0 && world.objects.includes(id))
    .sort((a, b) => b.hits - a.hits || a.id.localeCompare(b.id))
  const coverStyle = form.ageGroup === '3-5' ? 'album' : form.ageGroup === '6-8' ? 'adventure' : form.ageGroup === '9-12' ? 'graphic' : 'young'
  // Nonhuman protagonists only with explicit narrative evidence, never inferred from a diagnosis.
  const explicit = text.trim().match(/^(?:(?:era|soy|es)\s+)?(?:un|una)\s+(?:pequeñ[oa]\s+)?(zorro|dragón|robot|tortuga|búho)\s+(?:llamad[oa]|protagonista)/u)?.[1]
  const character = explicit ? ({ zorro: 'fox', 'dragón': 'dragon', robot: 'robot', tortuga: 'turtle', 'búho': 'owl' } as const)[explicit as 'zorro' | 'dragón' | 'robot' | 'tortuga' | 'búho'] : undefined
  return {
    ageGroup: form.ageGroup, storyTheme: form.style, setting: world.setting,
    protagonist: character ?? world.protagonist, companion: world.companion,
    objects: detected.length ? detected.map(({ id }) => id) : [...world.objects],
    mood: form.emotion, educationalGoal: form.pedagogicalCompetence, coverStyle,
    narrativeSignature: detected.map(({ id, hits }) => `${id}:${Math.min(hits, 15)}`).join('|'),
  }
}
