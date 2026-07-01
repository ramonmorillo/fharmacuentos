import type { StoryFormData } from '../types'

export function createDefaultFormData(): StoryFormData {
  return {
    ageGroup: '6-8',
    protagonistName: '',
    situation: 'cuesta-tomar',
    situationOther: '',
    emotion: 'preocupacion',
    emotionOther: '',
    style: 'aventurero',
    messages: ['rutina-aliada'],
    pedagogicalCompetence: 'crear-rutina',
    duration: 'estandar',
    includeActivity: true,
    includeParentMessage: true,
    extraDetails: '',
  }
}
