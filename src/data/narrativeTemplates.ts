import type { AgeGroupId, PedagogicalCompetenceId, SituationId, StyleId } from '../types'

export interface NarrativeContext {
  name: string
  ageGroup: AgeGroupId
  situation: SituationId
  situationText: string
  emotion: string
  style: StyleId
  competence: PedagogicalCompetenceId
  competenceLabel: string
  companion: string
  extraDetail?: string
}

export interface StyleWorld {
  elements: string[]
  place: string
  companion: string
}

export const STYLE_ELEMENTS: Record<StyleId, StyleWorld> = {
  aventurero: { elements: ['mapa', 'sendero', 'puente', 'mochila', 'brújula', 'señal', 'refugio'], place: 'un sendero con un puente estrecho y un refugio al fondo', companion: 'Guía' },
  espacial: { elements: ['nave', 'misión', 'panel', 'señales', 'botón', 'base', 'coordenadas', 'gravedad'], place: 'una nave con panel de señales junto a la base', companion: 'Control' },
  submarino: { elements: ['arrecife', 'corriente', 'concha', 'burbuja', 'mapa', 'luz', 'profundidad'], place: 'un arrecife atravesado por una corriente de burbujas', companion: 'Nerea' },
  deportivo: { elements: ['entrenamiento', 'banquillo', 'jugada', 'equipo', 'pase', 'tarjeta', 'entrenador', 'marcador'], place: 'una pista de entrenamiento con banquillo y marcador', companion: 'Entrenador Sol' },
  superheroes: { elements: ['entrenamiento', 'capa', 'poder', 'equipo', 'misión', 'descanso'], place: 'una sala de entrenamiento de misiones con capas colgadas', companion: 'Capitana Cerca' },
  magico: { elements: ['bosque', 'puerta', 'objeto mágico', 'mapa', 'hechizo', 'prueba'], place: 'un bosque con una puerta antigua y un mapa vivo', companion: 'Luma' },
  realista: { elements: ['casa', 'colegio', 'consulta', 'mochila', 'agenda', 'móvil', 'familia', 'conversación'], place: 'la casa, el colegio y una consulta apuntada en la agenda', companion: 'una persona de confianza' },
  diario: { elements: ['diario', 'móvil', 'agenda', 'nota', 'conversación'], place: 'una habitación con diario abierto, móvil boca abajo y agenda encima de la mesa', companion: 'una persona de confianza' },
  animales: { elements: ['madriguera', 'huellas', 'nido', 'bellota', 'rama', 'sendero'], place: 'una madriguera con huellas cerca de un nido', companion: 'Topo' },
  comic: { elements: ['viñeta', 'bocadillo', 'página', 'rotulador', 'margen'], place: 'una página de cómic con viñetas y bocadillos por completar', companion: 'Tinta' },
}

export interface StyleObject {
  word: string
  gender: 'm' | 'f'
}

/**
 * Sustantivos singulares y concretos de cada estilo, con su género, para poder concordar
 * artículos ("el"/"la", "un"/"una") y participios ("guardado"/"guardada") correctamente al
 * elegir el objeto protagonista de la escena. Se excluyen a propósito palabras en plural
 * (p. ej. "señales") o demasiado abstractas para funcionar como "el objeto que se guarda".
 */
export const STYLE_OBJECTS: Record<StyleId, StyleObject[]> = {
  aventurero: [{ word: 'mapa', gender: 'm' }, { word: 'sendero', gender: 'm' }, { word: 'puente', gender: 'm' }, { word: 'mochila', gender: 'f' }, { word: 'brújula', gender: 'f' }, { word: 'señal', gender: 'f' }, { word: 'refugio', gender: 'm' }],
  espacial: [{ word: 'nave', gender: 'f' }, { word: 'misión', gender: 'f' }, { word: 'panel', gender: 'm' }, { word: 'botón', gender: 'm' }, { word: 'base', gender: 'f' }],
  submarino: [{ word: 'arrecife', gender: 'm' }, { word: 'corriente', gender: 'f' }, { word: 'concha', gender: 'f' }, { word: 'burbuja', gender: 'f' }, { word: 'mapa', gender: 'm' }, { word: 'luz', gender: 'f' }],
  deportivo: [{ word: 'entrenamiento', gender: 'm' }, { word: 'banquillo', gender: 'm' }, { word: 'jugada', gender: 'f' }, { word: 'pase', gender: 'm' }, { word: 'tarjeta', gender: 'f' }, { word: 'marcador', gender: 'm' }],
  superheroes: [{ word: 'entrenamiento', gender: 'm' }, { word: 'capa', gender: 'f' }, { word: 'poder', gender: 'm' }, { word: 'misión', gender: 'f' }, { word: 'descanso', gender: 'm' }],
  magico: [{ word: 'puerta', gender: 'f' }, { word: 'objeto mágico', gender: 'm' }, { word: 'mapa', gender: 'm' }, { word: 'hechizo', gender: 'm' }, { word: 'prueba', gender: 'f' }],
  realista: [{ word: 'mochila', gender: 'f' }, { word: 'agenda', gender: 'f' }, { word: 'móvil', gender: 'm' }, { word: 'conversación', gender: 'f' }],
  diario: [{ word: 'diario', gender: 'm' }, { word: 'móvil', gender: 'm' }, { word: 'agenda', gender: 'f' }, { word: 'nota', gender: 'f' }, { word: 'conversación', gender: 'f' }],
  animales: [{ word: 'nido', gender: 'm' }, { word: 'bellota', gender: 'f' }, { word: 'rama', gender: 'f' }, { word: 'sendero', gender: 'm' }],
  comic: [{ word: 'viñeta', gender: 'f' }, { word: 'bocadillo', gender: 'm' }, { word: 'página', gender: 'f' }, { word: 'rotulador', gender: 'm' }, { word: 'margen', gender: 'm' }],
}

export const COMPETENCE_ACTIONS: Record<PedagogicalCompetenceId, { action: string; artifact: string; activity: string; question: string; caregiver: string; keywords: string[] }> = {
  'reconocer-emocion': { action: 'elige un color para la emoción y lo marca con una palabra o un dibujo', artifact: 'semáforo de colores', activity: 'Dibuja un semáforo de emociones con tres colores y escribe qué ayuda en cada color.', question: '¿Qué color tendría lo que has sentido en la parte más difícil?', caregiver: 'Poner color o forma a una emoción facilita hablar sin exigir explicaciones largas.', keywords: ['color', 'semáforo', 'dibujo', 'emoción'] },
  'pedir-ayuda': { action: 'pulsa una señal, levanta una tarjeta y dice una frase breve para pedir compañía', artifact: 'tarjeta de ayuda', activity: 'Preparad una tarjeta con una frase para pedir ayuda y una persona a quien acudir.', question: '¿Qué frase corta te serviría para pedir ayuda cuando cuesta empezar?', caregiver: 'Valide la petición concreta antes de hacer preguntas. Escuchar primero suele abrir mejor la conversación.', keywords: ['ayuda', 'tarjeta', 'frase', 'persona'] },
  'preparar-preguntas-consulta': { action: 'crea una tarjeta con tres apartados: quiero contar, me preocupa y quiero preguntar', artifact: 'tarjeta de tres apartados', activity: 'Cread una tarjeta con tres apartados: quiero contar, me preocupa y quiero preguntar.', question: '¿Qué pregunta te gustaría llevar escrita para que no se escape?', caregiver: 'Llevar preguntas escritas permite participar aunque la voz salga baja o haya nervios.', keywords: ['preguntar', 'tarjeta', 'consulta', 'apartados'] },
  'crear-rutina': { action: 'diseña una señal, una canción corta, una pegatina o un mapa del día para iniciar la rutina', artifact: 'mapa de rutina', activity: 'Dibuja tu mapa de la cuesta difícil. Añade una señal, una persona y un truco que podrían ayudarte.', question: '¿Qué parte del día se parece más a una cuesta?', caregiver: 'Cuando una rutina pesa, ayuda convertirla en una acción visible, previsible y elegida.', keywords: ['rutina', 'señal', 'mapa', 'pegatina'] },
  'afrontar-revision': { action: 'prepara una mochila con una lista, una pregunta y un objeto de calma', artifact: 'mochila de revisión', activity: 'Dibujad la mochila de la revisión con una lista, una pregunta y un objeto que ayude.', question: '¿Qué tramo de la revisión necesitaría una señal o un apoyo?', caregiver: 'Anticipar por tramos ayuda a prepararse sin prometer que todo será fácil.', keywords: ['revisión', 'mochila', 'lista', 'calma'] },
  'expresar-cansancio': { action: 'dibuja una mochila con cosas que pesan y apoyos que ayudan a llevarlas', artifact: 'mochila de pesos y apoyos', activity: 'Dibuja una mochila: en un lado pon lo que pesa y en otro los apoyos que ayudan.', question: '¿Qué meterías hoy en la parte que pesa y qué apoyo añadirías?', caregiver: 'Reconocer el cansancio no es rendirse. Ayuda a ajustar expectativas y repartir apoyos.', keywords: ['cansancio', 'mochila', 'pesa', 'apoyos'] },
  'hablar-tratamiento-sin-verguenza': { action: 'prepara una frase breve para contar solo una parte de su historia a alguien de confianza', artifact: 'frase preparada', activity: 'Escribe tres frases: una que sí dirías, una que prefieres guardar y una persona segura.', question: '¿Qué parte de tu historia sí te gustaría poder explicar con tus palabras?', caregiver: 'Respete cuánto quiere contar. Una frase breve protege la privacidad y reduce presión.', keywords: ['tratamiento', 'frase', 'historia', 'confianza'] },
  'participar-autocuidado': { action: 'elige una responsabilidad pequeña y realista para probar durante ese día', artifact: 'responsabilidad elegida', activity: 'Elige una responsabilidad pequeña para esta semana y dibuja cómo sabrás que la probaste.', question: '¿Qué parte podrías elegir tú sin cargar con todo?', caregiver: 'Una responsabilidad concreta funciona mejor que pedir que controle todo de golpe.', keywords: ['autocuidado', 'elige', 'responsabilidad', 'probar'] },
  'compartir-dudas-familia': { action: 'deja una nota, abre una conversación o completa una tarjeta con ayuda', artifact: 'nota de dudas', activity: 'Completad una nota con dos columnas: duda que quiero compartir y cómo quiero que me escuchen.', question: '¿Qué duda sería más fácil dejar por escrito antes de hablar?', caregiver: 'Una nota puede iniciar conversación cuando hablar de frente resulta demasiado difícil.', keywords: ['duda', 'nota', 'familia', 'conversación'] },
  'celebrar-avances': { action: 'crea un marcador, álbum, mapa o colección de logros observables', artifact: 'marcador de avances', activity: 'Crea un marcador de avances con casillas para acciones reales que se puedan ver.', question: '¿Qué avance pequeño merece quedar guardado esta semana?', caregiver: 'Celebrar acciones observables evita comparaciones y ayuda a reconocer esfuerzo real.', keywords: ['avance', 'marcador', 'logro', 'colección'] },
}

/**
 * Cada escena tiene varias variantes independientes (tercera persona, para todos los estilos
 * salvo "diario") para que la combinación de frases cambie de una generación a otra, en vez de
 * repetir siempre el mismo esqueleto narrativo con solo un par de palabras distintas.
 */
const SCENE_VARIANTS: string[][] = [
  [
    '{{name}} llega a {{place}}. Allí hay {{elementsList}} y {{anObject}} que parece importante desde el principio. El mundo no está de adorno: para avanzar hay que mirar sus señales, tocar sus objetos y decidir por dónde seguir.',
    '{{name}} pisa {{place}} sin saber muy bien qué va a encontrar. Entre {{elementsList}} destaca {{anObject}}, como si llevara ahí esperando justo esta visita.',
    'Todo empieza en {{place}}. {{name}} se fija en {{elementsList}}, pero es {{anObject}} lo que capta su atención de verdad, como si tuviera algo que contar.',
  ],
  [
    'El reto aparece cuando {{situationText}}. {{name}} nota {{emotion}} y {{theObject}} cambia de sitio, como si dijera que no basta con seguir andando. Algo concreto bloquea la escena y obliga a detenerse.',
    'Entonces llega el momento difícil: {{situationText}}. {{name}} siente {{emotion}}, y hasta {{theObject}} parece pesar más de lo normal. No hay forma de rodear lo que está pasando.',
    'De pronto todo se complica: {{situationText}}. Con {{emotion}} todavía presente, {{name}} mira {{theObject}} y entiende que esta vez no puede seguir como si nada.',
  ],
  [
    'Primero, {{name}} intenta evitarlo. Mira hacia otro lado, guarda {{theObject}} demasiado rápido o finge que la señal no está ahí. El intento no sale bien: el camino se enreda, el panel parpadea o la página queda llena de tachones.',
    '{{name}} prueba a hacer como si nada. Aparta {{theObject}}, cambia de tema o acelera el paso. No funciona: la sensación sigue ahí, más terca de lo que esperaba.',
    'Lo primero que hace {{name}} es evitarlo: deja {{theObject}} a un lado y sigue adelante sin mirar atrás. Pero la escena no se deja ignorar tan fácilmente.',
  ],
  [
    '{{companion}} se acerca sin sermón. No corrige ni decide por {{name}}. Solo escucha y pregunta: "¿Qué parte podrías probar ahora, una sola, usando lo que tienes delante?". La pregunta deja espacio para respirar y elegir.',
    'Es entonces cuando aparece {{companion}}, sin prisa ni reproches. No da la solución hecha: solo pregunta qué parte, aunque sea pequeña, {{name}} se atrevería a probar ahora mismo.',
    '{{companion}} se sienta cerca, sin invadir. No hay sermón ni lista de instrucciones, solo una pregunta sencilla sobre qué trocito de todo esto podría intentar {{name}} ya mismo.',
  ],
  [
    'Entonces {{name}} {{competenceAction}}. Usa {{theObject}} y {{objPronoun}} convierte en {{competenceArtifact}}. La acción se ve desde fuera: hay manos que dibujan, una tarjeta que se levanta, una nota que se dobla o una señal que queda puesta.',
    'Con eso en mente, {{name}} {{competenceAction}}, y {{theObject}} se transforma en {{competenceArtifact}}. No es un truco de magia: es un gesto pequeño que cualquiera podría ver hacer.',
    '{{name}} decide {{competenceAction}}, y de repente {{theObject}} tiene un nuevo sentido: es {{competenceArtifact}}, algo real que queda ahí, a la vista.',
  ],
  [
    'El resultado es realista. El reto no desaparece y {{name}} todavía puede sentir {{emotion}}, pero la escena cambia: hay una ruta, una frase, un objeto o una marca que permite continuar sin tener que resolverlo todo a la vez.',
    'Nada se arregla del todo de golpe. {{name}} sigue notando {{emotion}}, pero ahora hay algo concreto a lo que agarrarse para seguir adelante, paso a paso.',
    'No es un final perfecto: {{emotion}} sigue ahí, en menor medida. Pero {{name}} ya tiene algo que antes no tenía: una forma de sostener lo difícil sin cargar con todo de golpe.',
  ],
  [
    'Al final, {{theObject}} queda {{storedForm}} en un lugar visible. {{name}} mira la escena de nuevo y encuentra una imagen para recordar: no una lección explicada, sino una huella concreta de lo que se atrevió a intentar.',
    '{{name}} guarda {{theObject}} en un sitio donde pueda volver a ver{{objPronoun}}. No hace falta resumirlo en una moraleja: basta con recordar que hoy se atrevió a probar algo.',
    '{{TheObject}} se queda ahí, a la vista, como recordatorio silencioso. {{name}} no necesita una gran conclusión: le basta con saber que la próxima vez podrá volver a intentarlo.',
  ],
]

/** Variantes en primera persona, exclusivas del estilo "diario". */
const SCENE_VARIANTS_DIARIO: string[][] = [
  [
    'Escribo en mi diario desde {{place}}. Hay {{elementsList}} y {{anObject}} que no puedo ignorar aunque intente dejarlo en una esquina.',
    'Hoy toca escribir desde {{place}}. Entre {{elementsList}} hay {{anObject}} que se me queda mirando, como esperando que le haga caso.',
    'Abro el diario en {{place}}. De todo lo que hay alrededor —{{elementsList}}— es {{anObject}} lo que se lleva mi atención.',
  ],
  [
    'El reto aparece cuando {{situationText}}. Noto {{emotion}} y {{theObject}} cambia de sitio, como si la página me obligara a mirar lo que pasa de verdad.',
    'Y entonces llega: {{situationText}}. Siento {{emotion}}, y hasta {{theObject}} parece más pesado de lo normal.',
    'De golpe todo se complica: {{situationText}}. Con {{emotion}} todavía encima, miro {{theObject}} y sé que esta vez no puedo pasar de largo.',
  ],
  [
    'Primero intento evitarlo. Desbloqueo el móvil, cierro el diario o escribo cualquier cosa para no entrar en el tema. No funciona: la nota queda a medias y la cabeza sigue dando vueltas.',
    'Pruebo a hacer como si nada. Aparto {{theObject}}, cambio de página. No sirve de mucho: la sensación sigue ahí, escribiéndose sola entre líneas.',
    'Lo primero que hago es evitarlo: dejo {{theObject}} a un lado y sigo escribiendo de otra cosa. Pero no hay forma de ignorarlo del todo.',
  ],
  [
    '{{companion}} se acerca sin sermón. No corrige ni decide por mí. Solo escucha y pregunta: "¿Qué parte podrías probar ahora, una sola, usando lo que tienes delante?". La pregunta no suena infantil y eso ayuda.',
    'Es entonces cuando aparece {{companion}}, sin prisa. No me da la solución hecha, solo pregunta qué trocito de todo esto me atrevería a probar ahora mismo.',
    '{{companion}} se sienta cerca, sin invadir la página. Solo una pregunta sencilla: qué parte pequeña podría intentar ya.',
  ],
  [
    'Entonces {{competenceAction}}. Uso {{theObject}} y {{objPronoun}} convierto en {{competenceArtifact}}. La acción se ve desde fuera: hay manos que dibujan, una tarjeta que se levanta, una nota que se dobla o una señal que queda puesta.',
    'Con eso decidido, {{competenceAction}}, y {{theObject}} se convierte en {{competenceArtifact}}. No es magia, es solo un gesto pequeño que cualquiera podría ver.',
    'Decido {{competenceAction}}, y de pronto {{theObject}} tiene otro sentido: ahora es {{competenceArtifact}}, algo real que queda escrito en la página.',
  ],
  [
    'El resultado es realista. El reto no desaparece y todavía puedo sentir {{emotion}}, pero la escena cambia: hay una ruta, una frase, un objeto o una marca que permite continuar sin resolverlo todo de golpe.',
    'Nada se arregla de golpe. Sigo notando {{emotion}}, pero ahora tengo algo concreto a lo que agarrarme para seguir, línea a línea.',
    'No es un final perfecto: {{emotion}} sigue ahí, aunque menos. Pero ya tengo algo que antes no tenía: una forma de sostener esto sin cargar con todo junto.',
  ],
  [
    'Al final, {{theObject}} queda {{storedForm}} en un lugar visible. Cierro el diario con una imagen concreta, no con una lección: algo que he probado y que podría volver a usar.',
    'Guardo {{theObject}} donde pueda volver a ver{{objPronoun}}. No hace falta resumirlo en una moraleja: basta con recordar que hoy me atreví a probar algo.',
    '{{TheObject}} se queda ahí, a la vista, como recordatorio silencioso. No necesito una gran conclusión: me basta con saber que la próxima vez podré volver a intentarlo.',
  ],
]

/** Elige al azar un objeto propio del estilo elegido (siempre el estilo del usuario, nunca otro). */
export function pickStyleObject(style: StyleId): StyleObject {
  const objects = STYLE_OBJECTS[style]
  return objects[Math.floor(Math.random() * objects.length)]
}

/**
 * Construye las 7 escenas base combinando, para cada una, una variante elegida al azar de forma
 * independiente. Con 3 variantes por escena hay más de 2000 combinaciones posibles por estilo,
 * así que dos generaciones con las mismas opciones no producen el mismo texto.
 */
export function buildSceneTexts(style: StyleId): string[] {
  const variants = style === 'diario' ? SCENE_VARIANTS_DIARIO : SCENE_VARIANTS
  return variants.map((options) => options[Math.floor(Math.random() * options.length)])
}
