import type { AgeGroupId } from '../types'

export interface Activity {
  id: string
  text: string
  /** Franjas de edad para las que esta actividad resulta adecuada. */
  ageGroups: AgeGroupId[]
}

// 10 actividades finales, pensadas para reforzar el cuento sin exigir
// materiales especiales ni datos personales.
export const ACTIVITIES: Activity[] = [
  {
    id: 'dibuja-companero',
    text: 'Dibuja a tu compañero de esta historia y ponle un nombre especial.',
    ageGroups: ['3-5', '6-8'],
  },
  {
    id: 'tres-cosas-bien',
    text: 'Piensa en tres cosas que se te dan bien y dibuja una medalla para cada una.',
    ageGroups: ['3-5', '6-8', '9-12'],
  },
  {
    id: 'mapa-pasos',
    text: 'Dibuja un mapa con los pequeños pasos que ya has conseguido hasta hoy.',
    ageGroups: ['6-8', '9-12'],
  },
  {
    id: 'frasco-preguntas',
    text: 'Crea un "frasco de preguntas": escribe en papelitos todo lo que te gustaría preguntar en tu próxima cita.',
    ageGroups: ['9-12', '13-15'],
  },
  {
    id: 'carta-yo-futuro',
    text: 'Escribe una carta corta a la persona que serás dentro de un año, contándole cómo te sientes hoy.',
    ageGroups: ['13-15', '16-17'],
  },
  {
    id: 'lista-apoyos',
    text: 'Haz una lista de las personas a las que podrías pedir ayuda si un día lo necesitas.',
    ageGroups: ['9-12', '13-15', '16-17'],
  },
  {
    id: 'senal-recordatorio',
    text: 'Inventa una señal, dibujo o sonido que te ayude a recordar tu rutina de cuidado.',
    ageGroups: ['6-8', '9-12'],
  },
  {
    id: 'diario-una-semana',
    text: 'Durante una semana, anota en pocas palabras cómo te has sentido cada día.',
    ageGroups: ['13-15', '16-17'],
  },
  {
    id: 'cuento-al-reves',
    text: 'Cuenta la historia con tus propias palabras a alguien de tu familia, cambiando el final si quieres.',
    ageGroups: ['3-5', '6-8', '9-12'],
  },
  {
    id: 'plan-proxima-visita',
    text: 'Prepara junto a tu familia una pequeña lista de lo que te gustaría contar en la próxima visita.',
    ageGroups: ['9-12', '13-15', '16-17'],
  },
]
