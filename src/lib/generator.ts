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

const AGE_LIMITS: Record<AgeGroupId, { soften: (paragraph: string) => string }> = {
  '3-5': {
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
  '6-8': { soften: (p) => p.replaceAll('equipo sanitario', 'las personas que le cuidan') },
  '9-12': { soften: (p) => p },
  '13-15': { soften: (p) => p.replaceAll('animales sabios', 'personas de confianza') },
  '16-17': { soften: (p) => p.replaceAll('superhéroes', 'personas') },
}

function applyDuration(paragraphs: string[], data: StoryFormData): string[] {
  // Las microhistorias deben conservar escena, conflicto, intento, acción y cierre.
  // La duración suaviza el lenguaje, pero no recorta bloques narrativos obligatorios.
  return paragraphs.map(AGE_LIMITS[data.ageGroup].soften)
}

function addExtraDetail(paragraphs: string[], extraDetails: string): string[] {
  const detail = extraDetails.trim()
  if (!detail) return paragraphs
  const safeDetail = detail
    .replace(/\b\d+\s?(mg|ml|mcg|g|comprimidos?|cápsulas?)\b/gi, 'un detalle que conviene revisar')
    .replace(/\b(dosis|medicamento exacto|inyecta|toma cada)\b/gi, 'detalle de cuidado')
    .replace(SLASH_PATTERN, 'persona')
  const copy = [...paragraphs]
  copy.splice(Math.max(1, copy.length - 1), 0, `Detalle para personalizar la lectura: ${safeDetail}.`)
  return copy
}


function capitalizeName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toLocaleUpperCase('es-ES') + part.slice(1))
    .join(' ')
}

function buildNarrative(template: NarrativeTemplate, context: NarrativeContext): { paragraphs: string[] } {
  return {
    paragraphs: [
      template.openingScene(context),
      template.challengeScene(context),
      template.failedAttempt(context),
      template.companionDialogue(context),
      template.protagonistAction(context),
      template.realisticOutcome(context),
      template.closingImage(context),
    ],
  }
}

const FORBIDDEN_PHRASES = [
  'cada pequeño paso cuenta',
  'aprendió que',
  'se dio cuenta de que',
  'pedir ayuda también es ser valiente',
  'le ayudó a decidir aprender',
  'de un tiempo a esta parte',
  'proceso no lineal',
  'autonomía progresiva',
  'herramienta de apoyo emocional',
]

const CLINICAL_PATTERN = /\b(\d+\s?(mg|ml|mcg|g)|dosis|comprimido|cápsula|inyecta|toma cada|medicamento exacto)\b/i
const SLASH_PATTERN = /\b\p{L}+\/[a-záéíóúñ]+\b/iu

function validateStory({ title, paragraphs, activity, template, context }: { title: string; paragraphs: string[]; activity?: string; template: NarrativeTemplate; context: NarrativeContext }): { ok: boolean; reasons: string[] } {
  const text = [title, ...paragraphs, activity ?? ''].join(' ')
  const lowerText = text.toLocaleLowerCase('es-ES')
  const reasons: string[] = []
  if (!title.includes(context.name) && context.name !== 'Protagonista') reasons.push('El título no contiene el nombre capitalizado.')
  if (context.name !== capitalizeName(context.name)) reasons.push('El nombre no está capitalizado.')
  if (!template.actionWords.some((word) => lowerText.includes(word))) reasons.push('Falta una acción concreta del protagonista.')
  if (FORBIDDEN_PHRASES.some((phrase) => lowerText.includes(phrase))) reasons.push('Aparece una frase prohibida o repetitiva.')
  if (SLASH_PATTERN.test(text)) reasons.push('Aparece lenguaje con barras.')
  if (activity && !lowerText.includes(context.competenceLabel.toLocaleLowerCase('es-ES').split(' ')[0])) reasons.push('La actividad no está conectada con la competencia.')
  if (!template.requiredElements.some((element) => lowerText.includes(element))) reasons.push('No aparecen elementos del estilo elegido.')
  if (CLINICAL_PATTERN.test(text)) reasons.push('Aparecen dosis, medicamentos o instrucciones clínicas.')
  return { ok: reasons.length === 0, reasons }
}

export function generateStory(data: StoryFormData): GeneratedStory {
  const name = capitalizeName(data.protagonistName.trim() || 'Protagonista')
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

  const storyParts = buildNarrative(template, context)
  const paragraphs = applyDuration(addExtraDetail(storyParts.paragraphs, data.extraDetails), data)
  const familyQuestion = template.conversationQuestion(context)
  const activity = data.includeActivity ? template.activity(context) : undefined
  const parentMessage = data.includeParentMessage ? template.caregiverMessage(context) : undefined
  const title = template.title(context)
  const validation = validateStory({ title, paragraphs, activity, template, context })
  if (!validation.ok) {
    const alternative = chooseTemplate({ ...data, style: data.style })
    const alternativeParts = buildNarrative(alternative, context)
    const alternativeParagraphs = applyDuration(addExtraDetail(alternativeParts.paragraphs, data.extraDetails), data)
    const alternativeTitle = alternative.title(context)
    const alternativeValidation = validateStory({ title: alternativeTitle, paragraphs: alternativeParagraphs, activity: data.includeActivity ? alternative.activity(context) : undefined, template: alternative, context })
    if (alternativeValidation.ok) {
      return {
        title: alternativeTitle,
        paragraphs: alternativeParagraphs,
        motivationalMessage: `Competencia que se quiere trabajar: ${competenceLabel(data.pedagogicalCompetence)}. La historia muestra una acción concreta dentro de una escena narrativa.`,
        closing: alternativeParagraphs[alternativeParagraphs.length - 1] ?? '',
        activity: data.includeActivity ? alternative.activity(context) : undefined,
        familyQuestion: alternative.conversationQuestion(context),
        parentMessage: data.includeParentMessage ? alternative.caregiverMessage(context) : undefined,
        disclaimer: DISCLAIMER,
      }
    }
  }

  return {
    title,
    paragraphs,
    motivationalMessage: `Competencia que se quiere trabajar: ${competenceLabel(data.pedagogicalCompetence)}. La historia muestra una acción concreta dentro de una escena narrativa.`,
    closing: paragraphs[paragraphs.length - 1] ?? '',
    activity,
    familyQuestion,
    parentMessage,
    disclaimer: DISCLAIMER,
  }
}
