import { ACTIVITIES } from '../data/activities'
import { PARENT_MESSAGES } from '../data/parentMessages'
import {
  EMOTION_CONTENT,
  MESSAGE_CONTENT,
  SITUATION_CONTENT,
  STYLE_WORLDS,
  type MessageContent,
} from '../data/storyContent'
import type { AgeGroupId, GeneratedStory, StoryFormData } from '../types'

const DISCLAIMER =
  'Este cuento es un apoyo educativo y motivacional. No sustituye la información proporcionada por el equipo sanitario. Revise siempre el contenido antes de entregarlo al paciente o familia.'

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function joinMessageClosings(name: string, messages: MessageContent[]): string {
  if (messages.length === 0) {
    return `${name} descubrió que, poco a poco, las cosas se hacen más fáciles`
  }
  const [first, ...rest] = messages.map((m) => m.closing)
  const restJoined = rest.map((c) => `también ${c}`)
  return `${name} ${[first, ...restJoined].join(', y ')}`
}

interface TierVoice {
  leadConnectors: string[]
  closingLeads: string[]
  reflection?: (name: string, symbolName: string) => string[]
  finalLine: (name: string) => string[]
}

const TIER_VOICES: Record<AgeGroupId, TierVoice> = {
  '3-5': {
    leadConnectors: ['Un día,', 'Hace poco,'],
    closingLeads: ['Poco a poco,', 'Con el tiempo,'],
    finalLine: (name) => [
      `Y aunque no todos los días eran fáciles, ${name} sabía que no estaba solo/a.`,
      `${name} sonrió, porque cada paso pequeño también cuenta.`,
    ],
  },
  '6-8': {
    leadConnectors: ['Un día,', 'De un tiempo a esta parte,'],
    closingLeads: ['Poco a poco,', 'Con paciencia,'],
    reflection: (name) => [
      `${name} entendió que no hacía falta ser perfecto/a para seguir adelante, solo intentarlo.`,
    ],
    finalLine: (name) => [
      `Y aunque quedaban días difíciles por delante, ${name} se sintió un poco más fuerte.`,
      `${name} guardó esta historia para recordarla cuando hiciera falta un poco de ánimo.`,
    ],
  },
  '9-12': {
    leadConnectors: ['De un tiempo a esta parte,', 'Últimamente,'],
    closingLeads: ['Con el paso de los días,', 'Poco a poco,'],
    reflection: (name, symbolName) => [
      `${name} pensó en cómo se había sentido y se dio cuenta de que estaba bien no tener todas las respuestas todavía. ${symbolName} le recordaba que los avances no siempre se ven de golpe.`,
    ],
    finalLine: (name) => [
      `${name} sabía que quedaban días complicados, pero también sabía que no tendría que afrontarlos en solitario.`,
      `Sin necesidad de hacerlo todo perfecto, ${name} se sintió un poco más capaz que el día anterior.`,
    ],
  },
  '13-15': {
    leadConnectors: ['Desde hace algún tiempo,', 'Últimamente,'],
    closingLeads: ['Con el paso de los días,', 'Sin darse mucha cuenta,'],
    reflection: (name, symbolName) => [
      `${name} pensó que estaba bien no tener ganas todos los días, y que eso no lo/la convertía en alguien que lo hace mal. ${symbolName} se había convertido en un recordatorio silencioso de que el proceso no es lineal.`,
    ],
    finalLine: (name) => [
      `${name} no tenía todas las respuestas, pero sí sabía que podía apoyarse en su gente cuando lo necesitara.`,
      `Sin dramatizarlo ni restarle importancia, ${name} siguió adelante, a su ritmo.`,
    ],
  },
  '16-17': {
    leadConnectors: ['Desde hace un tiempo,', 'En las últimas semanas,'],
    closingLeads: ['Con el paso de los días,', 'Sin prisa, pero sin pausa,'],
    reflection: (name, symbolName) => [
      `${name} reconoció que asumir más responsabilidad sobre su propio cuidado era, a la vez, un reto y una forma de crecer. ${symbolName} simbolizaba esa transición hacia decisiones cada vez más propias.`,
    ],
    finalLine: (name) => [
      `${name} entendió que la autonomía se construye poco a poco, y que seguir pidiendo apoyo cuando hace falta forma parte de ese proceso, no lo contradice.`,
      `Sin necesidad de tenerlo todo resuelto, ${name} se sintió un poco más preparado/a para lo que viniera.`,
    ],
  },
}

export function generateStory(data: StoryFormData): GeneratedStory {
  const name = data.protagonistName.trim() || 'nuestro protagonista'
  const world = STYLE_WORLDS[data.style]
  const voice = TIER_VOICES[data.ageGroup]

  const situationInfo = SITUATION_CONTENT[data.situation]
  const challengeText =
    data.situation === 'otra' && data.situationOther.trim()
      ? `${situationInfo.challenge}: ${data.situationOther.trim()}`
      : situationInfo.challenge

  const emotionInfo = EMOTION_CONTENT[data.emotion]
  const emotionText =
    data.emotion === 'otra' && data.emotionOther.trim()
      ? `sintió algo parecido a ${data.emotionOther.trim()}`
      : emotionInfo.acknowledge

  const chosenMessages = data.messages.length > 0 ? data.messages : (['pasos-cuentan'] as const)
  const messageContents = chosenMessages.map((id) => MESSAGE_CONTENT[id])

  // Párrafos
  const openingParagraph = `${world.opening(name)} ${pick(['Le encantaba pasar tiempo en ' + world.setting + '.', 'Cada día descubría algo nuevo en ' + world.setting + '.'])}`

  const challengeParagraph = `${pick(voice.leadConnectors)} a ${name}, ${challengeText}. ${name} ${emotionText}.`

  const supportParagraph = `${capitalize(world.companionName)} le ayudó a decidir ${situationInfo.smallStep}.`

  const reflectionParagraph = voice.reflection
    ? pick(voice.reflection(name, capitalize(world.symbolName)))
    : undefined

  const closingParagraph = `${pick(voice.closingLeads)} ${joinMessageClosings(name, messageContents)}. ${pick(voice.finalLine(name))}`

  let paragraphs: string[]
  if (data.duration === 'muy-corto') {
    paragraphs = [`${openingParagraph} ${challengeParagraph}`, closingParagraph]
  } else if (data.duration === 'corto') {
    paragraphs = [openingParagraph, `${challengeParagraph} ${supportParagraph}`, closingParagraph]
  } else {
    paragraphs = reflectionParagraph
      ? [openingParagraph, challengeParagraph, supportParagraph, reflectionParagraph, closingParagraph]
      : [openingParagraph, challengeParagraph, supportParagraph, closingParagraph]
  }

  if (data.extraDetails.trim()) {
    paragraphs.splice(paragraphs.length - 1, 0, `Nota añadida por el equipo de farmacia: ${data.extraDetails.trim()}`)
  }

  if (data.style === 'comic') {
    paragraphs = paragraphs.map((p, i) => `Viñeta ${i + 1}: ${p}`)
  }

  const title = pick(world.titles(name))

  const activityPool = ACTIVITIES.filter((a) => a.ageGroups.includes(data.ageGroup))
  const activity = data.includeActivity
    ? pick(activityPool.length > 0 ? activityPool : ACTIVITIES).text
    : undefined

  const parentMessage = data.includeParentMessage ? pick(PARENT_MESSAGES) : undefined

  return {
    title,
    paragraphs,
    motivationalMessage: `${joinMessageClosings(name, messageContents)}.`,
    closing: pick(voice.finalLine(name)),
    activity,
    familyQuestion: situationInfo.familyQuestion,
    parentMessage,
    disclaimer: DISCLAIMER,
  }
}
