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
// Variantes con el flag "g" para sustituir todas las coincidencias en sanitize(); las de arriba
// se mantienen sin "g" porque .test() con una regex global es dependiente de lastIndex y da
// falsos negativos si se reutiliza entre llamadas.
const CLINICAL_PATTERN_G = /\b(\d+\s?(mg|ml|mcg|g)|dosis|comprimidos?|cápsulas?|inyecta|toma cada|medicamento exacto|pauta clínica)\b/gi
const SLASH_PATTERN_G = /\b\p{L}+\/[a-záéíóúñ]+\b/giu

function pick<T>(items: T[]): T { return items[Math.floor(Math.random() * items.length)] }
function wordCount(text: string): number { return (text.match(/[\p{L}\p{N}]+/gu) ?? []).length }
function competenceLabel(id: StoryFormData['pedagogicalCompetence']): string { return PEDAGOGICAL_COMPETENCES.find((c) => c.id === id)?.label ?? 'Trabajar una competencia concreta' }
function normalizeEmotion(data: StoryFormData): string { return data.emotion === 'otra' && data.emotionOther.trim() ? data.emotionOther.trim().toLowerCase() : EMOTION_CONTENT[data.emotion].acknowledge }
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

type AgeBand = 'infantil' | 'media' | 'adolescente'
function ageBand(ageGroup: AgeGroupId): AgeBand {
  if (ageGroup === '3-5') return 'infantil'
  if (ageGroup === '13-15' || ageGroup === '16-17') return 'adolescente'
  return 'media'
}

// Una entrada por escena base (las plantillas siempre tienen 7 escenas), para que expandScene
// nunca tenga que repetir la misma frase dentro de un mismo cuento.
const SCENE_DETAILS: Record<AgeBand, string[]> = {
  infantil: [
    'Había un ruidito cerca.',
    'Todo estaba muy tranquilo por un momento.',
    'Un rayo de luz entraba por algún lado.',
    'Se oía algo suave, como una respiración.',
    'Cerca había un huequito para mirar mejor.',
    'El aire olía a algo conocido.',
    'Todo parecía esperar, sin prisa.',
  ],
  media: [
    'Había sonidos pequeños alrededor y un objeto que esperaba en silencio.',
    'Nada brilló de golpe; solo apareció un hueco para probar algo posible.',
    'El aire se quedó un momento en calma, como dando tiempo a pensar.',
    'Alrededor había cosas de siempre: nada extraordinario, solo la vida normal continuando.',
    'Un detalle pequeño llamó la atención, aunque nadie lo señaló en voz alta.',
    'El tiempo pareció ir un poco más despacio justo en ese momento.',
    'No hacía falta que nada cambiara de golpe para que la escena importara.',
  ],
  adolescente: [
    'No hacía falta dramatizarlo; lo difícil era que la situación se colaba en un día normal.',
    'La escena seguía teniendo cosas corrientes alrededor: mensajes pendientes, una chaqueta en una silla y ganas de que nadie mirara demasiado.',
    'Nada estaba pensado para parecer importante, y aun así lo era.',
    'El resto del día seguía su curso, aunque por dentro algo pedía atención.',
    'No había música de fondo ni nada dramático: solo la rutina de siempre con un peso distinto.',
    'Costaba encajar esa sensación con la normalidad de todo lo demás.',
    'Era un momento cualquiera, del tipo que luego cuesta explicar con palabras exactas.',
  ],
}

const SCENE_CLOSINGS: Record<AgeBand, string[]> = {
  infantil: [
    'Poco a poco, con calma, se puede seguir mirando qué hacer.',
    'No hay prisa para decidir el siguiente paso.',
    'Cada cosa a su tiempo, sin agobiarse.',
    'Con calma, todo se ve un poco más claro.',
    'Un pasito cada vez es suficiente.',
    'Está bien pararse a pensar antes de seguir.',
    'Todo puede esperar un momento más.',
  ],
  media: [
    '—No tienes que contestar perfecto —añadió la compañía—. Solo dime qué parte cabe hoy.',
    'Ese detalle cambió el ritmo de la escena y dio tiempo a mirar mejor lo que estaba pasando.',
    'No hacía falta resolverlo todo de una vez: bastaba con encontrar el siguiente paso posible.',
    'La calma duró lo justo para que la decisión no se sintiera forzada.',
    'Nadie esperaba una respuesta inmediata, y eso ayudó a pensar mejor.',
    'El momento pedía paciencia, no prisa, y así se vivió.',
    'Fue suficiente con probar una idea pequeña para que todo avanzara un poco.',
  ],
  adolescente: [
    '—No tienes que contestar perfecto —añadió la compañía—. Solo dime qué parte cabe hoy.',
    'Ese detalle cambió el ritmo de la escena y dio tiempo a mirar mejor lo que estaba pasando.',
    'No hacía falta tener una respuesta preparada; bastaba con no evitar la situación del todo.',
    'La conversación no se alargó más de lo necesario, y eso también se agradeció.',
    'Nadie exigió una reacción concreta, así que hubo margen para pensarlo con calma.',
    'El momento pedía tiempo, no una solución inmediata, y por una vez lo tuvo.',
    'Bastó con no fingir que todo estaba bien para que la escena avanzara.',
  ],
}

function expandScene(scene: string, index: number, ctx: NarrativeContext, target: { min: number }): string {
  const band = ageBand(ctx.ageGroup)
  const details = SCENE_DETAILS[band]
  if (target.min < 600) return scene
  if (target.min < 900) return `${scene} ${details[index % details.length]}`
  const closings = SCENE_CLOSINGS[band]
  return `${scene} ${details[index % details.length]} ${closings[index % closings.length]}`
}

/**
 * Escenas adicionales genéricas (no ligadas a un estilo) usadas para ganar extensión real
 * cuando la duración/edad lo requiere, en vez de repetir siempre la misma frase de relleno.
 * Cada una se usa como máximo una vez por cuento.
 */
function extraBeats(ctx: NarrativeContext): string[] {
  if (ctx.style === 'diario') {
    return [
      'Antes de decidir, repaso lo que ya sé: no hace falta resolverlo todo de golpe, solo dar el paso que toca ahora. {{companion}} no se adelanta ni me da la respuesta; deja que el silencio tenga su ritmo mientras conecto lo que siento con lo que puedo hacer.',
      'El primer intento no sale redondo. Me distraigo, pierdo el hilo o repito un gesto que ya sabía que no ayudaba. En vez de convertirlo en un fracaso, escribo: «Eso también cuenta como intentarlo», y la página vuelve a abrirse.',
      'Más tarde comparto un poco de lo vivido con alguien de casa. No hace falta contarlo todo de golpe: basta una frase o enseñar {{competenceArtifact}} para que la otra persona entienda por dónde va la cosa. Nadie corrige lo que escribo; solo me acompañan.',
      'Cuando vuelvo a pensar en lo que costaba al principio, ya no pesa del mismo modo. Sigue estando ahí, pero ahora hay una forma concreta de sostenerlo: {{competenceArtifact}} queda como recordatorio de que puedo volver a intentarlo, sin que la próxima vez tenga que salir perfecta.',
    ]
  }
  return [
    'Antes de decidir, {{name}} repasa lo que ya sabe: no hace falta resolverlo todo de golpe, solo dar el paso que toca ahora. {{companion}} no se adelanta ni ofrece la respuesta; deja que el silencio tenga su propio ritmo mientras {{name}} conecta lo que siente con lo que puede hacer.',
    'El primer intento no sale redondo. {{name}} se distrae, pierde el hilo o repite un gesto que ya sabía que no ayudaba. En vez de convertirlo en un fracaso, {{companion}} lo nombra en voz alta: —Eso también cuenta como intentarlo—, y la escena vuelve a abrirse.',
    'Más tarde, {{name}} comparte un poco de lo vivido con alguien de casa. No hace falta contarlo todo de golpe: basta una frase o enseñar {{competenceArtifact}} para que la otra persona entienda por dónde va la cosa. Nadie corrige el relato; solo lo acompañan.',
    'Cuando {{name}} vuelve a pensar en lo que costaba al principio, ya no pesa del mismo modo. Sigue estando ahí, pero ahora hay una forma concreta de sostenerlo: {{competenceArtifact}} queda como recordatorio de que se puede volver a intentar, sin que la próxima vez tenga que salir perfecta.',
  ]
}

const REFLECTION_POOL: Record<AgeBand, (ctx: NarrativeContext) => string[]> = {
  infantil: (ctx) => [
    `${ctx.name} vuelve a mirar el objeto y lo toca despacio.`,
    `${ctx.companion} espera cerca, sin prisa.`,
    `${ctx.name} respira hondo antes de decidir.`,
    'No pasa nada si no sale perfecto a la primera.',
    `${ctx.name} se toma su tiempo para pensarlo.`,
    'Un abrazo o una palabra amable también ayudan en momentos así.',
    `${ctx.name} sonríe un poco al ver que ya lo ha intentado.`,
  ],
  media: (ctx) => [
    `${ctx.name} vuelve a mirar el objeto de la escena y prueba a explicarlo con sus propias palabras.`,
    `${ctx.companion} espera, sin convertirlo en examen, y la elección queda un poco más clara.`,
    `${ctx.name} respira antes de decidir, y eso también cuenta como un paso.`,
    `Nada tiene que salir perfecto a la primera; ${ctx.name} solo necesita encontrar una parte que sí pueda intentar.`,
    'El silencio que sigue no resulta incómodo: da tiempo para pensar sin que nadie meta prisa.',
    `Un pequeño gesto, casi sin darse cuenta, ayuda a ${ctx.name} a seguir adelante.`,
    'La escena no necesita más que ese intento sincero para tener sentido.',
  ],
  adolescente: (ctx) => [
    `${ctx.name} vuelve a mirar el objeto de la escena y prueba a explicarlo con sus propias palabras.`,
    `${ctx.companion} espera, sin convertirlo en examen, y la elección queda un poco más clara.`,
    `${ctx.name} recuerda que ya ha resuelto cosas parecidas antes, aunque esta vez sea distinta.`,
    'No hace falta tener la respuesta perfecta; basta con encontrar una parte que sí encaje hoy.',
    'El silencio que sigue no resulta incómodo: da tiempo para pensar sin que nadie meta prisa.',
    `Nadie mide el resultado desde fuera; a ${ctx.name} le basta con notar que lo ha intentado de verdad.`,
    'La situación sigue sin ser sencilla, pero ya no ocupa todo el espacio de antes.',
  ],
}

function buildNarrative(template: NarrativeTemplate, ctx: NarrativeContext, duration: DurationId): string[] {
  const range = targetRange(ctx.ageGroup, duration)
  const paragraphs = template.scenes.map((scene, i) => expandScene(replaceTokens(scene, ctx), i, ctx, range))

  // 1) Ganar extensión real con escenas adicionales únicas (cada una aparece como máximo una vez).
  if (range.min >= 600) {
    for (const beat of extraBeats(ctx)) {
      if (wordCount(paragraphs.join(' ')) >= range.min) break
      paragraphs.push(replaceTokens(beat, ctx))
    }
  }

  // 2) Si aún falta extensión, repartir frases variadas entre distintos párrafos (round-robin),
  // acotando cuántas veces puede repetirse cada una para no volver a caer en el bug de duplicado.
  const pool = REFLECTION_POOL[ageBand(ctx.ageGroup)](ctx)
  const maxAdditions = pool.length * 2
  let added = 0
  while (wordCount(paragraphs.join(' ')) < range.min && added < maxAdditions) {
    const targetParagraph = added % paragraphs.length
    const sentence = pool[added % pool.length]
    paragraphs[targetParagraph] += ` ${sentence}`
    added += 1
  }
  return paragraphs
}

function sanitize(text: string): string { return text.replaceAll(SLASH_PATTERN_G, 'persona').replaceAll(CLINICAL_PATTERN_G, 'detalle de cuidado') }

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
