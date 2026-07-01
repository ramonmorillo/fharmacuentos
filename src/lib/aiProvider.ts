import type { GeneratedStory, StoryFormData } from '../types'

// Punto de extensión preparado para una futura generación asistida por IA.
//
// IMPORTANTE (seguridad y privacidad):
// - Esta función NO está conectada a ningún servicio externo en la versión
//   actual. FHarmacuentos funciona siempre en "modo sin IA" (generateStory
//   en src/lib/generator.ts), con plantillas locales y sin llamadas de red.
// - Si en el futuro se conecta una API de IA, hazlo desde un backend propio:
//   nunca incluyas claves de API en el código del frontend ni las expongas
//   en el navegador. Usa variables de entorno del lado servidor
//   (por ejemplo, un endpoint serverless que guarde la clave como secreto).
// - Antes de enviar cualquier dato a una API externa, recuerda a la persona
//   usuaria que NO debe introducir nombres reales, números de historia
//   clínica, fechas de nacimiento ni ninguna otra información identificativa
//   o clínica sensible. El formulario de FHarmacuentos ya está diseñado para
//   no recoger ese tipo de datos.
// - El cuento generado por IA, igual que el generado por plantillas, debe
//   pasar siempre por la revisión del farmacéutico antes de entregarse.

export interface AiStoryProvider {
  generate(data: StoryFormData): Promise<GeneratedStory>
}

/**
 * Implementación de referencia, deshabilitada por defecto. Lanza un error
 * explicativo si se invoca, para dejar claro que requiere configuración
 * explícita de un backend propio antes de poder usarse.
 */
export const disabledAiProvider: AiStoryProvider = {
  async generate() {
    throw new Error(
      'El modo con IA no está configurado en esta instalación de FHarmacuentos. ' +
        'Usa el modo sin IA (plantillas locales) o configura un backend propio ' +
        'que gestione la clave de API de forma segura.',
    )
  },
}
