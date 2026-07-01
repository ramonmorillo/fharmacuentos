import type { AgeGroupId, SituationId, StyleId } from '../types'

export interface StoryTemplate {
  id: string
  title: string
  description: string
  ageGroup: AgeGroupId
  situation: SituationId
  style: StyleId
}

// 10 plantillas iniciales que sirven como punto de partida rápido: al
// seleccionarlas se precargan edad, situación y estilo en el formulario.
export const STORY_TEMPLATES: StoryTemplate[] = [
  {
    id: 'dragon-rutina',
    title: 'El dragón que aprendió su rutina',
    description: 'Para peques de 3 a 5 años a quienes les cuesta seguir su tratamiento diario.',
    ageGroup: '3-5',
    situation: 'cuesta-tomar',
    style: 'magico',
  },
  {
    id: 'astronauta-pasos',
    title: 'La astronauta de los pequeños pasos',
    description: 'Aventura espacial para acompañar el inicio de un tratamiento nuevo.',
    ageGroup: '6-8',
    situation: 'tratamiento-nuevo',
    style: 'espacial',
  },
  {
    id: 'equipo-invisible-leo',
    title: 'El equipo invisible de Leo',
    description: 'Ideal para trabajar la idea de "no estoy solo/a" ante una enfermedad crónica.',
    ageGroup: '6-8',
    situation: 'verguenza',
    style: 'superheroes',
  },
  {
    id: 'mochila-preguntas',
    title: 'La mochila de las preguntas',
    description: 'Ayuda a preparar dudas y preguntas antes de una revisión próxima.',
    ageGroup: '9-12',
    situation: 'revision-proxima',
    style: 'aventurero',
  },
  {
    id: 'mapa-autocuidado',
    title: 'El mapa del autocuidado',
    description: 'Apoya el paso hacia una autonomía progresiva en el cuidado propio.',
    ageGroup: '9-12',
    situation: 'quiere-autonomia',
    style: 'aventurero',
  },
  {
    id: 'capitana-dias-dificiles',
    title: 'La capitana de los días difíciles',
    description: 'Para el cansancio terapéutico y los días en que cuidarse pesa más.',
    ageGroup: '13-15',
    situation: 'cansancio-cuidarse',
    style: 'deportivo',
  },
  {
    id: 'bosque-revisiones',
    title: 'El bosque de las revisiones',
    description: 'Relato sereno para reducir el miedo o los nervios ante el hospital.',
    ageGroup: '9-12',
    situation: 'miedo-hospital',
    style: 'animales',
  },
  {
    id: 'pulsera-preguntas-valientes',
    title: 'La pulsera de las preguntas valientes',
    description: 'Fomenta preguntar sin miedo cuando algo no queda claro.',
    ageGroup: '6-8',
    situation: 'dificultad-hablar',
    style: 'magico',
  },
  {
    id: 'robot-pedir-ayuda',
    title: 'El robot que aprendió a pedir ayuda',
    description: 'Muestra que pedir ayuda también es una forma de ser valiente.',
    ageGroup: '6-8',
    situation: 'pedir-ayuda-positivo',
    style: 'espacial',
  },
  {
    id: 'liga-pequenos-cuidados',
    title: 'La liga de los pequeños cuidados',
    description: 'Relato de superhéroes para acompañar un cambio de tratamiento.',
    ageGroup: '9-12',
    situation: 'cambio-tratamiento',
    style: 'superheroes',
  },
]
