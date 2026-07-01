import { PEDAGOGICAL_COMPETENCES } from '../data/options'
import { COMPETENCE_ACTIONS, NARRATIVE_TEMPLATES, type NarrativeContext, type NarrativeTemplate } from '../data/narrativeTemplates'
import { EMOTION_CONTENT, SITUATION_CONTENT, STYLE_WORLDS } from '../data/storyContent'
import type { AgeGroupId, DurationId, GeneratedStory, StoryFormData } from '../types'

const DISCLAIMER =
  'Este cuento es un apoyo educativo y motivacional. No sustituye la información proporcionada por el equipo sanitario. Revise siempre el contenido antes de entregarlo al paciente o familia.'

const DEPTH_WORD_RANGES: Record<DurationId, { min: number; max: number }> = {
  mini: { min: 400, max: 600 },
  estandar: { min: 800, max: 1000 },
  desarrollado: { min: 1200, max: 1500 },
}

const AGE_WORD_RANGES: Record<AgeGroupId, { min: number; max: number }> = {
  '3-5': { min: 350, max: 600 },
  '6-8': { min: 600, max: 900 },
  '9-12': { min: 800, max: 1100 },
  '13-15': { min: 900, max: 1300 },
  '16-17': { min: 1000, max: 1500 },
}

const FORBIDDEN_PHRASES = [
  'cada pequeño paso cuenta', 'sin prisa, pero sin pausa', 'aprendió que', 'se dio cuenta de que',
  'autonomía progresiva', 'transición hacia decisiones', 'proceso', 'fortalece su confianza',
  'herramienta de apoyo emocional', 'de un tiempo a esta parte', 'nervioso/a', 'tranquilo/a', 'niño/a', 'hijo/a',
]
const CLINICAL_PATTERN = /\b(\d+\s?(mg|ml|mcg|g)|dosis|comprimidos?|cápsulas?|inyecta|toma cada|medicamento exacto|pauta clínica)\b/i
const SLASH_PATTERN = /\b\p{L}+\/[a-záéíóúñ]+\b/iu

function pick<T>(items: T[]): T { return items[Math.floor(Math.random() * items.length)] }
function wordCount(text: string): number { return (text.match(/[\p{L}\p{N}]+/gu) ?? []).length }
function competenceLabel(id: StoryFormData['pedagogicalCompetence']): string { return PEDAGOGICAL_COMPETENCES.find((c) => c.id === id)?.label ?? 'Trabajar una competencia concreta' }
function normalizeEmotion(data: StoryFormData): string { return data.emotion === 'otra' && data.emotionOther.trim() ? data.emotionOther.trim().toLowerCase() : EMOTION_CONTENT[data.emotion].acknowledge.replace(/^sintió |^notó /, '') }
function situationText(data: StoryFormData): string { return data.situation === 'otra' && data.situationOther.trim() ? data.situationOther.trim() : SITUATION_CONTENT[data.situation].challenge }
function capitalizeName(name: string): string { return name.toLocaleLowerCase('es-ES').split(/\s+/).filter(Boolean).map((p) => p.charAt(0).toLocaleUpperCase('es-ES') + p.slice(1)).join(' ') }
function replaceTokens(text: string, ctx: NarrativeContext): string {
  const comp = COMPETENCE_ACTIONS[ctx.competence]
  return text.replaceAll('{{name}}', ctx.name).replaceAll('{{situationText}}', ctx.situationText).replaceAll('{{emotion}}', ctx.emotion).replaceAll('{{companion}}', ctx.companion).replaceAll('{{competenceAction}}', comp.action).replaceAll('{{competenceArtifact}}', comp.artifact)
}

function targetRange(ageGroup: AgeGroupId, duration: DurationId): { min: number; max: number } {
  const depth = DEPTH_WORD_RANGES[duration]
  const age = AGE_WORD_RANGES[ageGroup]
  return { min: Math.min(depth.min, age.max), max: Math.min(depth.max, age.max) }
}

function chooseTemplate(data: StoryFormData, excluded = new Set<string>()): NarrativeTemplate {
  const scored = NARRATIVE_TEMPLATES.filter((t) => !excluded.has(t.id)).map((template) => {
    let score = 0
    if (template.ageGroup === data.ageGroup) score += 5
    if (template.style === data.style) score += 7
    if (template.competence === data.pedagogicalCompetence) score += 9
    if (template.situation === data.situation) score += 3
    if (template.situation === 'any') score += 1
    return { template, score }
  }).sort((a, b) => b.score - a.score)
  const bestScore = scored[0]?.score ?? 0
  const best = scored.filter((item) => item.score === bestScore).map((item) => item.template)
  return pick(best.length ? best : NARRATIVE_TEMPLATES)
}

function expandScene(scene: string, index: number, ctx: NarrativeContext, target: { min: number }): string {
  const teen = ctx.ageGroup === '13-15' || ctx.ageGroup === '16-17'
  const details = teen
    ? ['No hacía falta dramatizarlo; lo difícil era que la situación se colaba en un día normal.', 'La escena seguía teniendo cosas corrientes alrededor: mensajes pendientes, una chaqueta en una silla y ganas de que nadie mirara demasiado.']
    : ['Había sonidos pequeños alrededor y un objeto que esperaba en silencio.', 'Nada brilló de golpe; solo apareció un hueco para probar algo posible.']
  if (target.min < 600) return scene
  if (target.min < 900) return `${scene} ${details[index % details.length]}`
  return `${scene} ${details[index % details.length]} ${index === 3 ? '—No tienes que contestar perfecto —añadió la compañía—. Solo dime qué parte cabe hoy.' : 'Ese detalle cambió el ritmo de la escena y dio tiempo a mirar mejor lo que estaba pasando.'}`
}

function buildNarrative(template: NarrativeTemplate, ctx: NarrativeContext, duration: DurationId): string[] {
  const range = targetRange(ctx.ageGroup, duration)
  const paragraphs = template.scenes.map((scene, i) => expandScene(replaceTokens(scene, ctx), i, ctx, range))
  while (wordCount(paragraphs.join(' ')) < range.min) {
    const i = paragraphs.length % 7
    paragraphs[i] += ` ${ctx.name} vuelve a mirar el objeto de la escena y prueba a explicarlo con sus propias palabras. La compañía espera, sin convertirlo en examen, y la elección queda un poco más clara.`
  }
  return paragraphs
}

function sanitize(text: string): string { return text.replace(SLASH_PATTERN, 'persona').replace(CLINICAL_PATTERN, 'detalle de cuidado') }

function validateStory(args: { title: string; paragraphs: string[]; activity: string; familyQuestion: string; parentMessage: string; template: NarrativeTemplate; context: NarrativeContext; duration: DurationId }): { ok: boolean; reasons: string[] } {
  const { title, paragraphs, activity, familyQuestion, parentMessage, template, context, duration } = args
  const storyText = [title, ...paragraphs].join(' ')
  const fullText = [storyText, activity, familyQuestion, parentMessage, DISCLAIMER].join(' ')
  const lowerStory = storyText.toLocaleLowerCase('es-ES')
  const lowerFull = fullText.toLocaleLowerCase('es-ES')
  const range = targetRange(context.ageGroup, duration)
  const reasons: string[] = []
  if (wordCount(paragraphs.join(' ')) < range.min) reasons.push('Extensión insuficiente para la profundidad seleccionada.')
  if (!COMPETENCE_ACTIONS[context.competence].keywords.some((word) => lowerFull.includes(word))) reasons.push('Falta acción concreta conectada con la competencia.')
  if (FORBIDDEN_PHRASES.some((phrase) => lowerStory.includes(phrase))) reasons.push('Aparece una frase prohibida en el cuento.')
  if (context.ageGroup !== '13-15' && context.ageGroup !== '16-17' && lowerStory.includes('equipo sanitario')) reasons.push('Lenguaje sanitario adulto en narración infantil.')
  if (title.includes(context.name.toLocaleUpperCase('es-ES')) && context.name.length > 1) reasons.push('Nombre en mayúsculas completas.')
  if (SLASH_PATTERN.test(fullText)) reasons.push('Aparece lenguaje con barras.')
  if (!template.requiredElements.some((element) => lowerStory.includes(element))) reasons.push('No aparecen elementos propios del estilo.')
  if (!COMPETENCE_ACTIONS[context.competence].keywords.some((word) => [activity, familyQuestion, parentMessage].join(' ').toLocaleLowerCase('es-ES').includes(word))) reasons.push('Actividad o acompañamiento poco conectado con la competencia.')
  if (CLINICAL_PATTERN.test(fullText)) reasons.push('Aparecen dosis, medicamentos concretos o instrucciones clínicas.')
  if (![activity, familyQuestion, parentMessage, DISCLAIMER].every(Boolean)) reasons.push('Faltan apartados finales obligatorios.')
  if (activity.trim() === parentMessage.trim() || activity.trim() === familyQuestion.trim()) reasons.push('La sección final repite literalmente el cierre.')
  return { ok: reasons.length === 0, reasons }
}

export function generateStory(data: StoryFormData): GeneratedStory {
  const name = capitalizeName(data.protagonistName.trim() || 'Protagonista')
  const world = STYLE_WORLDS[data.style]
  const ctx: NarrativeContext = { name, ageGroup: data.ageGroup, situation: data.situation, situationText: sanitize(situationText(data)), emotion: normalizeEmotion(data), style: data.style, competence: data.pedagogicalCompetence, competenceLabel: competenceLabel(data.pedagogicalCompetence), companion: world.companionName || 'una persona de confianza', extraDetail: data.extraDetails.trim() || undefined }
  const excluded = new Set<string>()
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const template = chooseTemplate(data, excluded)
    excluded.add(template.id)
    const title = `${ctx.name} y ${COMPETENCE_ACTIONS[ctx.competence].artifact}`
    const paragraphs = buildNarrative(template, ctx, data.duration).map(sanitize)
    const competenceContent = COMPETENCE_ACTIONS[ctx.competence]
    const activity = competenceContent.activity
    const familyQuestion = competenceContent.question
    const parentMessage = competenceContent.caregiver
    const validation = validateStory({ title, paragraphs, activity, familyQuestion, parentMessage, template, context: ctx, duration: data.duration })
    if (validation.ok || attempt === 2) {
      if (!validation.ok) console.warn('FHarmacuentos: validación narrativa con advertencias', validation.reasons)
      return { title, paragraphs, motivationalMessage: `Qué puede trabajar este cuento: ${ctx.competenceLabel}.`, closing: paragraphs.at(-1) ?? '', activity, familyQuestion, parentMessage, disclaimer: DISCLAIMER }
    }
    console.warn('FHarmacuentos: plantilla descartada por validación', template.id, validation.reasons)
  }
  throw new Error('No se pudo generar el cuento')
}

export const __storyQuality = { validateStory, targetRange, wordCount }
