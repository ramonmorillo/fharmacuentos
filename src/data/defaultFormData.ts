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
    messages: ['pasos-cuentan'],
    duration: 'corto',
    includeActivity: true,
    includeParentMessage: true,
    extraDetails: '',
  }
}
