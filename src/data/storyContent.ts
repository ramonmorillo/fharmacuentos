import type { EmotionId, MessageId, SituationId, StyleId } from '../types'

// Contenido narrativo reutilizable por el motor de generación (modo sin IA).
// Todo el texto es genérico, no clínico y no identificativo: no menciona
// fármacos, dosis, diagnósticos ni pautas concretas.

export interface SituationContent {
  /** Describe la dificultad, en tercera persona, sin culpabilizar. */
  challenge: string
  /** Un paso pequeño y realista hacia adelante (estrategia, no instrucción clínica). */
  smallStep: string
  /** Pregunta abierta para comentar en familia tras la lectura. */
  familyQuestion: string
}

export const SITUATION_CONTENT: Record<SituationId, SituationContent> = {
  'cuesta-tomar': {
    challenge:
      'le cuesta encontrar las ganas para seguir su tratamiento, y algunos días ese momento se le hace cuesta arriba',
    smallStep:
      'probar pequeños trucos propios: elegir un vaso favorito, un horario que encajara mejor con su día, o pedir compañía justo en ese momento, sin prisa y sin tener que hacerlo perfecto',
    familyQuestion:
      '¿Qué pequeño truco podríamos probar juntos para que ese momento del día sea un poco más llevadero?',
  },
  'olvida-tratamiento': {
    challenge:
      'se le olvida el tratamiento entre tantas cosas, y después se siente un poco mal por eso',
    smallStep:
      'inventar una señal propia para recordarlo: una alarma con un sonido especial, un dibujo pegado en un lugar visible o una rutina que siempre iba justo antes',
    familyQuestion: '¿Qué señal o recordatorio nos podría ayudar a no olvidarlo, sin que se convierta en un agobio?',
  },
  'miedo-hospital': {
    challenge:
      'la idea de ir al hospital le llena de nervios, con esa sensación de no saber muy bien qué va a pasar',
    smallStep:
      'aprender que se puede preguntar todo lo que se quiera antes y durante la visita, y que llevar algo que dé tranquilidad puede ayudar mucho',
    familyQuestion: '¿Hay algo que le ayude a sentirse con más calma antes de ir al hospital?',
  },
  'miedo-pinchazos': {
    challenge:
      'solo con pensar en pruebas o pinchazos, el cuerpo se le pone en alerta, como si sonara una alarma por dentro',
    smallStep:
      'usar trucos que ya usan otros niños y niñas: respirar despacio contando hasta cinco, apretar la mano de alguien de confianza o mirar hacia otro lado mientras se cuenta una historia',
    familyQuestion: '¿Qué truco de respiración o distracción le gustaría tener preparado para la próxima vez?',
  },
  'cansancio-cuidarse': {
    challenge:
      'lleva tiempo cuidándose y, aunque lo hace muy bien, empieza a sentir un cansancio de fondo, como una mochila que pesa un poco más cada día',
    smallStep:
      'permitirse tener días de bajón sin sentirse culpable, y compartir ese cansancio con alguien del equipo sanitario o de la familia en lugar de guardárselo',
    familyQuestion: '¿Cómo podemos ayudarle a aligerar esa mochila cuando note que pesa más de lo normal?',
  },
  verguenza: {
    challenge:
      'a veces siente vergüenza al pensar que es diferente por su tratamiento, y prefiere que nadie lo sepa',
    smallStep:
      'descubrir que muchas otras personas también llevan su propio "equipo especial" para cuidarse, y que eso no la hace diferente en lo importante',
    familyQuestion: '¿Con quién se sentiría cómoda compartiendo esto, si algún día le apetece hacerlo?',
  },
  'quiere-autonomia': {
    challenge:
      'siente que ya tiene edad para encargarse de más cosas de su cuidado, aunque todavía no sabe muy bien por dónde empezar',
    smallStep:
      'ir asumiendo pequeñas responsabilidades, una por una, celebrando cada una como una victoria antes de pasar a la siguiente',
    familyQuestion: '¿Qué pequeña tarea de su cuidado le gustaría empezar a hacer por su cuenta?',
  },
  'tratamiento-nuevo': {
    challenge:
      'empezar algo nuevo siempre trae dudas, y esta vez toca adaptarse a un tratamiento distinto al que ya conocía',
    smallStep:
      'darse permiso para ir aprendiendo poco a poco, preguntando todas las dudas al equipo sanitario sin miedo a parecer pesada',
    familyQuestion: '¿Qué preguntas nos gustaría llevar preparadas a la próxima cita sobre esta novedad?',
  },
  'cambio-tratamiento': {
    challenge:
      'después de acostumbrarse a una forma de cuidarse, el cambio a otra distinta le genera un poco de inseguridad',
    smallStep:
      'recordar que ya ha sabido adaptarse antes, y que el equipo sanitario está para acompañar cada ajuste, paso a paso',
    familyQuestion: '¿Qué le ayudaría a sentirse con más seguridad mientras se acostumbra a esta novedad?',
  },
  'revision-proxima': {
    challenge:
      'con la revisión cada vez más cerca, le rondan por la cabeza muchas preguntas y algo de intriga',
    smallStep:
      'anotar en una libreta todo lo que quiera contar o preguntar en la consulta, para no quedarse con nada dentro',
    familyQuestion: '¿Qué le gustaría contarle al equipo sanitario en la próxima revisión?',
  },
  'dificultad-hablar': {
    challenge:
      'hay cosas que le rondan por dentro, pero encontrar las palabras para contarlas no siempre es fácil',
    smallStep:
      'probar otras formas de expresarlo además de hablar: dibujar, escribir, o simplemente decir "hoy no tengo ganas de hablar de esto, pero quiero que lo sepas"',
    familyQuestion: '¿Qué forma de contar las cosas le resulta más cómoda: hablar, escribir, dibujar u otra?',
  },
  'pedir-ayuda-positivo': {
    challenge:
      'piensa que pedir ayuda es una señal de no saber hacer las cosas por su cuenta, así que prefiere no pedirla',
    smallStep:
      'descubrir que las personas más fuertes de las historias también piden ayuda, y que eso forma parte de cuidarse bien',
    familyQuestion: '¿A quién le resulta más fácil pedirle ayuda cuando la necesita?',
  },
  otra: {
    challenge: 'atraviesa un momento que le cuesta un poco más de lo habitual',
    smallStep:
      'ir dando pasos pequeños, apoyándose en las personas de confianza que tiene cerca, sin exigirse tener todas las respuestas',
    familyQuestion: '¿Qué le ayudaría ahora mismo a sentirse un poco mejor?',
  },
}

export interface EmotionContent {
  /** Frase que reconoce y valida la emoción sin dramatizar. */
  acknowledge: string
}

export const EMOTION_CONTENT: Record<EmotionId, EmotionContent> = {
  miedo: { acknowledge: 'un nudo de miedo en el estómago' },
  tristeza: { acknowledge: 'una tristeza pequeña, como una nube gris que se posa sin avisar' },
  enfado: { acknowledge: 'un enfado que le hierve por dentro' },
  verguenza: { acknowledge: 'las mejillas calientes de vergüenza' },
  cansancio: { acknowledge: 'un cansancio que no se cura durmiendo' },
  confusion: { acknowledge: 'un lío de ideas en la cabeza' },
  preocupacion: { acknowledge: 'una preocupación que da vueltas y vueltas como una noria' },
  desmotivacion: { acknowledge: 'las ganas bajas, como si se hubieran quedado sin pilas' },
  ilusion: { acknowledge: 'una chispa de ilusión por aprender algo nuevo' },
  otra: { acknowledge: 'una mezcla de emociones difícil de poner en palabras' },
}

export interface MessageContent {
  /** Frase de cierre que retoma el mensaje elegido. */
  closing: string
}

export const MESSAGE_CONTENT: Record<MessageId, MessageContent> = {
  'pasos-cuentan': { closing: 'aprendió que cada pequeño paso cuenta, aunque algunos días esos pasos sean diminutos' },
  equipo: { closing: 'entendió que su tratamiento es, en realidad, parte de su propio equipo' },
  'pedir-ayuda-valiente': { closing: 'descubrió que pedir ayuda también es una forma de ser valiente' },
  'no-solo': { closing: 'sintió que, aunque a veces lo pareciera, nunca estaba solo/a en esto' },
  'cuidarme-ayuda': { closing: 'comprendió que cuidarse le ayuda a seguir haciendo las cosas que más le gustan' },
  'aprender-poco-a-poco': { closing: 'se dio cuenta de que podía aprender todo esto poco a poco, sin prisa' },
  'no-perfecto': { closing: 'aceptó que hay días difíciles, y que no por eso tenía que hacerlo todo perfecto' },
  'equipo-sanitario': { closing: 'recordó que su equipo sanitario está ahí precisamente para ayudarle' },
  preguntar: { closing: 'aprendió que siempre puede preguntar cuando algo no le queda claro' },
  'rutina-aliada': { closing: 'empezó a ver su rutina no como una carga, sino como una aliada' },
}

export interface StyleWorld {
  setting: string
  companion: string
  companionName: string
  symbol: string
  symbolName: string
  opening: (name: string) => string
  titles: (name: string) => string[]
}

export const STYLE_WORLDS: Record<StyleId, StyleWorld> = {
  aventurero: {
    setting: 'un camino lleno de senderos por descubrir',
    companion: 'un viejo mapa que siempre encontraba una ruta nueva',
    companionName: 'El mapa',
    symbol: 'una brújula que señalaba hacia adelante, paso a paso',
    symbolName: 'la brújula',
    opening: (name) => `${name} llevaba siempre su mochila lista para la próxima aventura.`,
    titles: (name) => [`${name} y el camino de los pasos valientes`, `La brújula de ${name}`],
  },
  magico: {
    setting: 'un bosque encantado donde los árboles susurraban ánimos',
    companion: 'una lucecita llamada Chispa que aparecía en los momentos difíciles',
    companionName: 'Chispa',
    symbol: 'una varita pequeña que no hacía magia de verdad, pero ayudaba a pensar mejor',
    symbolName: 'la varita',
    opening: (name) => `${name} guardaba un secreto mágico: en su bolsillo vivía una chispa de luz llamada Chispa.`,
    titles: (name) => [`${name} y la luz de Chispa`, `El bosque encantado de ${name}`],
  },
  superheroes: {
    setting: 'la Ciudad de los Pequeños Grandes Momentos',
    companion: 'el Capitán Rutina, un compañero que nunca fallaba a su lado',
    companionName: 'El Capitán Rutina',
    symbol: 'un cinturón con un compartimento especial para las cosas importantes del día',
    symbolName: 'el cinturón',
    opening: (name) => `${name} tenía un traje especial guardado en el armario, listo para los días en que hacía falta un poco de superpoder.`,
    titles: (name) => [`${name}, superhéroe de los pequeños pasos`, `El equipo invisible de ${name}`],
  },
  animales: {
    setting: 'el Bosque Susurrante',
    companion: 'Buho, un amigo sabio que siempre escuchaba sin prisa',
    companionName: 'Buho',
    symbol: 'una hoja brillante que Buho regalaba después de cada paso valiente',
    symbolName: 'la hoja brillante',
    opening: (name) => `${name} tenía un amigo muy especial en el Bosque Susurrante: un búho llamado Buho.`,
    titles: (name) => [`${name} y el bosque de las revisiones`, `La hoja brillante de ${name}`],
  },
  espacial: {
    setting: 'la estación espacial Pequeños Pasos',
    companion: 'Orbi, un robot amigable con luces parpadeantes',
    companionName: 'Orbi',
    symbol: 'un mapa de estrellas que marcaba cada avance conseguido',
    symbolName: 'el mapa de estrellas',
    opening: (name) => `${name} pilotaba, en su imaginación, la nave Pequeños Pasos junto a Orbi, su robot de confianza.`,
    titles: (name) => [`${name} y la estación de los pequeños pasos`, `El mapa de estrellas de ${name}`],
  },
  deportivo: {
    setting: 'el campo de entrenamiento del equipo Adelante',
    companion: 'Ana, la entrenadora que siempre animaba desde la banda',
    companionName: 'Ana',
    symbol: 'un silbato que sonaba cada vez que se cumplía un pequeño objetivo',
    symbolName: 'el silbato',
    opening: (name) => `${name} formaba parte del equipo Adelante, con Ana, su entrenadora, siempre cerca.`,
    titles: (name) => [`${name} y el equipo Adelante`, `El silbato de los pequeños logros de ${name}`],
  },
  submarino: {
    setting: 'el arrecife de los colores',
    companion: 'Coral, una tortuga muy sabia y paciente',
    companionName: 'Coral',
    symbol: 'una concha que, según decían, escuchaba todo lo que se le contaba',
    symbolName: 'la concha',
    opening: (name) => `${name} exploraba el arrecife de los colores junto a Coral, una tortuga muy sabia.`,
    titles: (name) => [`${name} y el arrecife de los colores`, `La concha que escuchaba a ${name}`],
  },
  realista: {
    setting: 'su casa, su colegio y su barrio de siempre',
    companion: 'su familia y las personas de confianza de su día a día',
    companionName: 'Su familia',
    symbol: 'una libreta donde apuntaba las cosas importantes',
    symbolName: 'la libreta',
    opening: (name) => `${name} vivía su día a día entre el colegio, la familia y sus propias ideas.`,
    titles: (name) => [`Un día cualquiera de ${name}`, `${name} y la libreta de las cosas importantes`],
  },
  comic: {
    setting: 'la Ciudad de Papel, dibujada en viñetas',
    companion: 'un compañero de viñetas que aparecía justo cuando hacía falta un empujón',
    companionName: 'Su compañero de viñetas',
    symbol: 'un bocadillo de cómic donde escribía sus pensamientos más importantes',
    symbolName: 'el bocadillo de cómic',
    opening: (name) => `Viñeta uno: ${name} aparece con una libreta de superpoderes bajo el brazo.`,
    titles: (name) => [`Las viñetas de ${name}`, `${name}: una historia en cómic`],
  },
  diario: {
    setting: 'las páginas de un diario personal',
    companion: 'ese diario, que guardaba cada pensamiento sin juzgar nunca',
    companionName: 'Su diario',
    symbol: 'un bolígrafo que ya conocía todos sus secretos',
    symbolName: 'el bolígrafo',
    opening: (name) => `Querido diario: hoy quiero contarte lo que me está pasando a mí, ${name}.`,
    titles: (name) => [`El diario de ${name}`, `Páginas de ${name}`],
  },
}
