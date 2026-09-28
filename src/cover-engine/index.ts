import type { GeneratedStory, StoryFormData } from '../types'
import { createVisualSpec } from './spec'
import { createCoverRecipe } from './seed'
import type { CoverState } from './types'

export function createCover(story: GeneratedStory, form: StoryFormData): CoverState {
  const spec = createVisualSpec(story, form)
  return { spec, recipe: createCoverRecipe(spec, false) }
}
export { nextCoverRecipe, clearCoverHistory } from './seed'
export type { CoverState } from './types'
