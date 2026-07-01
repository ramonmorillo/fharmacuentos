import { PEDAGOGICAL_COMPETENCES } from '../data/options'
import { NARRATIVE_TEMPLATES, type NarrativeContext, type NarrativeTemplate } from '../data/narrativeTemplates'
import { EMOTION_CONTENT, SITUATION_CONTENT, STYLE_WORLDS } from '../data/storyContent'
import type { AgeGroupId, GeneratedStory, StoryFormData } from '../types'

const DISCLAIMER =
  'Este cuento es un apoyo educativo y motivacional. No sustituye la información proporcionada por el equipo sanitario. Revise siempre el contenido antes de entregarlo al paciente o familia.'

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function competenceLabel(id: StoryFormData['pedagogicalCompetence']): string {
  return PEDAGOGICAL_COMPETENCES.find((c) => c.id === id)?.label ?? 'Trabajar un paso concreto'
}

function normalizeEmotion(data: StoryFormData): string {
  if (data.emotion === 'otra' && data.emotionOther.trim()) return data.emotionOther.trim().toLowerCase()
  return EMOTION_CONTENT[data.emotion].acknowledge.replace(/^sintió |^notó /, '')
}

function situationText(data: StoryFormData): string {
  if (data.situation === 'otra' && data.situationOther.trim()) return data.situationOther.trim()
  return SITUATION_CONTENT[data.situation].challenge
}

function chooseTemplate(data: StoryFormData): NarrativeTemplate {
  const scored = NARRATIVE_TEMPLATES.map((template) => {
    let score = 0
    if (template.ageGroups.includes(data.ageGroup)) score += 5
    if (template.styles.includes(data.style)) score += 4
    if (template.competencies.includes(data.pedagogicalCompetence)) score += 6
    if (template.situations?.includes(data.situation)) score += 3
    return { template, score }
  })
    .filter(({ score }) => score >= 9)
    .sort((a, b) => b.score - a.score)

  const bestScore = scored[0]?.score
  const best = scored.filter((item) => item.score === bestScore).map((item) => item.template)
  return pick(best.length > 0 ? best : NARRATIVE_TEMPLATES)
}

const AGE_LIMITS: Record<AgeGroupId, { maxParagraphs: number; soften: (paragraph: string) => string }> = {
  '3-5': {
    maxParagraphs: 5,
    soften: (p) =>
      p
        .replaceAll('equipo sanitario', 'las personas que le cuidan')
        .replaceAll('autocuidado', 'cuidado')
        .replaceAll('tratamiento', 'momento de cuidado')
        .replace(/, aunque[^.]+\./g, '.')
        .split(/(?<=\.)\s+/)
        .map((sentence) => sentence.replace(/(.{70,}?), /, '$1. '))
        .join(' '),
  },
  '6-8': { maxParagraphs: 5, soften: (p) => p.replaceAll('equipo sanitario', 'las personas que le cuidan') },
  '9-12': { maxParagraphs: 5, soften: (p) => p },
  '13-15': { maxParagraphs: 5, soften: (p) => p.replaceAll('animales sabios', 'personas de confianza') },
  '16-17': { maxParagraphs: 5, soften: (p) => p.replaceAll('superhéroes', 'personas') },
}

function applyDuration(paragraphs: string[], data: StoryFormData): string[] {
  const limit = data.duration === 'muy-corto' ? 3 : data.duration === 'corto' ? 4 : AGE_LIMITS[data.ageGroup].maxParagraphs
  return paragraphs.slice(0, limit).map(AGE_LIMITS[data.ageGroup].soften)
}

function addExtraDetail(paragraphs: string[], extraDetails: string): string[] {
  const detail = extraDetails.trim()
  if (!detail) return paragraphs
  const safeDetail = detail.replace(/\b\d+\s?(mg|ml|mcg|g|comprimidos?|cápsulas?)\b/gi, 'un detalle que conviene revisar')
  const copy = [...paragraphs]
  copy.splice(Math.max(1, copy.length - 1), 0, `Detalle para personalizar la lectura: ${safeDetail}.`)
  return copy
}

export function generateStory(data: StoryFormData): GeneratedStory {
  const name = data.protagonistName.trim() || 'nuestro protagonista'
  const world = STYLE_WORLDS[data.style]
  const template = chooseTemplate(data)
  const context: NarrativeContext = {
    name,
    ageGroup: data.ageGroup,
    situation: data.situation,
    situationText: situationText(data),
    emotion: normalizeEmotion(data),
    style: data.style,
    competence: data.pedagogicalCompetence,
    competenceLabel: competenceLabel(data.pedagogicalCompetence),
    companion: world.companionName,
    extraDetail: data.extraDetails.trim() || undefined,
  }

  const paragraphs = applyDuration(addExtraDetail(template.paragraphs(context), data.extraDetails), data)
  const familyQuestion = template.question(context)
  const activity = data.includeActivity ? template.activity(context) : undefined
  const parentMessage = data.includeParentMessage ? template.caregiverMessage(context) : undefined

  return {
    title: template.title(context),
    paragraphs,
    motivationalMessage: `${competenceLabel(data.pedagogicalCompetence)} mediante una historia de ${template.pattern}: el protagonista prueba una acción concreta y el reto se vuelve más manejable.`,
    closing: paragraphs[paragraphs.length - 1] ?? '',
    activity,
    familyQuestion,
    parentMessage,
    disclaimer: DISCLAIMER,
  }
}
