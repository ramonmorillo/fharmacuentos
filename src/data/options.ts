import type {
  AgeGroupId,
  DurationId,
  EmotionId,
  MessageId,
  OptionMeta,
  PedagogicalCompetenceId,
  SituationId,
  StyleId,
} from '../types'

export const AGE_GROUPS: (OptionMeta<AgeGroupId> & { range: string })[] = [
  {
    id: '3-5',
    label: '3 a 5 años',
    range: '3-5',
    description: 'Frases muy cortas, personajes animales o mágicos, emociones básicas.',
  },
  {
    id: '6-8',
    label: '6 a 8 años',
    range: '6-8',
    description: 'Pequeña aventura, metáforas claras y refuerzo positivo.',
  },
  {
    id: '9-12',
    label: '9 a 12 años',
    range: '9-12',
    description: 'El niño o niña protagoniza decisiones, retos y autoestima.',
  },
  {
    id: '13-15',
    label: '13 a 15 años',
    range: '13-15',
    description: 'Tono menos infantil: identidad, autonomía y cansancio terapéutico.',
  },
  {
    id: '16-17',
    label: '16 a 17 años',
    range: '16-17',
    description: 'Estilo maduro: autocuidado, transición y responsabilidad progresiva.',
  },
]

export const SITUATIONS: OptionMeta<SituationId>[] = [
  { id: 'cuesta-tomar', label: 'Le cuesta tomar la medicación' },
  { id: 'olvida-tratamiento', label: 'Se olvida del tratamiento' },
  { id: 'miedo-hospital', label: 'Tiene miedo al hospital' },
  { id: 'miedo-pinchazos', label: 'Tiene miedo a los pinchazos o pruebas' },
  { id: 'cansancio-cuidarse', label: 'Está cansado/a de tener que cuidarse' },
  { id: 'verguenza', label: 'Siente vergüenza por su enfermedad o tratamiento' },
  { id: 'quiere-autonomia', label: 'Quiere aprender a ser más autónomo/a' },
  { id: 'tratamiento-nuevo', label: 'Va a empezar un tratamiento nuevo' },
  { id: 'cambio-tratamiento', label: 'Ha cambiado de tratamiento' },
  { id: 'revision-proxima', label: 'Tiene una revisión próxima' },
  { id: 'dificultad-hablar', label: 'Tiene dificultades para hablar de lo que le pasa' },
  { id: 'pedir-ayuda-positivo', label: 'Necesita entender que pedir ayuda también es positivo' },
  { id: 'otra', label: 'Otra situación' },
]

export const EMOTIONS: OptionMeta<EmotionId>[] = [
  { id: 'miedo', label: 'Miedo' },
  { id: 'tristeza', label: 'Tristeza' },
  { id: 'enfado', label: 'Enfado' },
  { id: 'verguenza', label: 'Vergüenza' },
  { id: 'cansancio', label: 'Cansancio' },
  { id: 'confusion', label: 'Confusión' },
  { id: 'preocupacion', label: 'Preocupación' },
  { id: 'desmotivacion', label: 'Desmotivación' },
  { id: 'ilusion', label: 'Ilusión por aprender' },
  { id: 'otra', label: 'Otra' },
]

export const STYLES: OptionMeta<StyleId>[] = [
  { id: 'aventurero', label: 'Aventurero' },
  { id: 'magico', label: 'Mágico' },
  { id: 'superheroes', label: 'Superhéroes' },
  { id: 'animales', label: 'Animales' },
  { id: 'espacial', label: 'Espacial' },
  { id: 'deportivo', label: 'Deportivo' },
  { id: 'submarino', label: 'Mundo submarino' },
  { id: 'realista', label: 'Realista y cotidiano' },
  { id: 'comic', label: 'Cómic narrativo' },
  { id: 'diario', label: 'Diario personal para adolescentes' },
]

export const MESSAGES: OptionMeta<MessageId>[] = [
  { id: 'pasos-cuentan', label: 'Cada pequeño paso cuenta' },
  { id: 'equipo', label: 'Mi tratamiento forma parte de mi equipo' },
  { id: 'pedir-ayuda-valiente', label: 'Pedir ayuda también es ser valiente' },
  { id: 'no-solo', label: 'No estoy solo/a' },
  { id: 'cuidarme-ayuda', label: 'Cuidarme me ayuda a seguir haciendo cosas que me gustan' },
  { id: 'aprender-poco-a-poco', label: 'Puedo aprender poco a poco' },
  { id: 'no-perfecto', label: 'Hay días difíciles, pero no tengo que hacerlo perfecto' },
  { id: 'equipo-sanitario', label: 'Mi equipo sanitario está para ayudarme' },
  { id: 'preguntar', label: 'Puedo preguntar cuando no entiendo algo' },
  { id: 'rutina-aliada', label: 'La rutina puede convertirse en una aliada' },
]


export const PEDAGOGICAL_COMPETENCES: OptionMeta<PedagogicalCompetenceId>[] = [
  { id: 'reconocer-emocion', label: 'Reconocer una emoción' },
  { id: 'pedir-ayuda', label: 'Pedir ayuda' },
  { id: 'preparar-preguntas-consulta', label: 'Preparar preguntas para la consulta' },
  { id: 'crear-rutina', label: 'Crear una rutina' },
  { id: 'afrontar-revision', label: 'Afrontar una revisión' },
  { id: 'expresar-cansancio', label: 'Expresar cansancio' },
  { id: 'hablar-tratamiento-sin-verguenza', label: 'Hablar del tratamiento sin vergüenza' },
  { id: 'participar-autocuidado', label: 'Participar más en su autocuidado' },
  { id: 'compartir-dudas-familia', label: 'Compartir dudas con la familia' },
  { id: 'celebrar-avances', label: 'Celebrar pequeños avances' },
]

export const DURATIONS: (OptionMeta<DurationId> & { words: string })[] = [
  { id: 'muy-corto', label: 'Muy corto', words: '~150-250 palabras', description: 'Ideal para lecturas rápidas en consulta.' },
  { id: 'corto', label: 'Corto', words: '~300-500 palabras', description: 'Un equilibrio entre brevedad y desarrollo.' },
  { id: 'estandar', label: 'Estándar', words: 'Longitud completa según la edad', description: 'Desarrollo narrativo completo.' },
]
