// Tipos centrales de FHarmacuentos.
// No se modela ningún campo identificativo (nombre real, historia clínica,
// fecha de nacimiento...): solo datos narrativos no sensibles.

export type AgeGroupId = '3-5' | '6-8' | '9-12' | '13-15' | '16-17'

export type SituationId =
  | 'cuesta-tomar'
  | 'olvida-tratamiento'
  | 'miedo-hospital'
  | 'miedo-pinchazos'
  | 'cansancio-cuidarse'
  | 'verguenza'
  | 'quiere-autonomia'
  | 'tratamiento-nuevo'
  | 'cambio-tratamiento'
  | 'revision-proxima'
  | 'dificultad-hablar'
  | 'pedir-ayuda-positivo'
  | 'otra'

export type EmotionId =
  | 'miedo'
  | 'tristeza'
  | 'enfado'
  | 'verguenza'
  | 'cansancio'
  | 'confusion'
  | 'preocupacion'
  | 'desmotivacion'
  | 'ilusion'
  | 'otra'

export type StyleId =
  | 'aventurero'
  | 'magico'
  | 'superheroes'
  | 'animales'
  | 'espacial'
  | 'deportivo'
  | 'submarino'
  | 'realista'
  | 'comic'
  | 'diario'

export type MessageId =
  | 'pasos-cuentan'
  | 'equipo'
  | 'pedir-ayuda-valiente'
  | 'no-solo'
  | 'cuidarme-ayuda'
  | 'aprender-poco-a-poco'
  | 'no-perfecto'
  | 'equipo-sanitario'
  | 'preguntar'
  | 'rutina-aliada'

export type DurationId = 'muy-corto' | 'corto' | 'estandar'

export type PedagogicalCompetenceId =
  | 'reconocer-emocion'
  | 'pedir-ayuda'
  | 'preparar-preguntas-consulta'
  | 'crear-rutina'
  | 'afrontar-revision'
  | 'expresar-cansancio'
  | 'hablar-tratamiento-sin-verguenza'
  | 'participar-autocuidado'
  | 'compartir-dudas-familia'
  | 'celebrar-avances'

export interface StoryFormData {
  ageGroup: AgeGroupId
  protagonistName: string
  situation: SituationId
  situationOther: string
  emotion: EmotionId
  emotionOther: string
  style: StyleId
  messages: MessageId[]
  pedagogicalCompetence: PedagogicalCompetenceId
  duration: DurationId
  includeActivity: boolean
  includeParentMessage: boolean
  extraDetails: string
}

export interface GeneratedStory {
  title: string
  paragraphs: string[]
  motivationalMessage: string
  closing: string
  activity?: string
  familyQuestion: string
  parentMessage?: string
  disclaimer: string
}

export interface OptionMeta<T extends string> {
  id: T
  label: string
  description?: string
}
