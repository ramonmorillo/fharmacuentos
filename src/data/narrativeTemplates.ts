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

export interface NarrativeTemplate {
  id: string
  ageGroup: AgeGroupId
  style: StyleId
  situation: SituationId | 'any'
  competence: PedagogicalCompetenceId
  title: string
  scenes: string[]
  activity: string
  conversationQuestion: string
  caregiverMessage: string
  requiredElements: string[]
  actionWords: string[]
}

type Seed = Omit<NarrativeTemplate, 'id' | 'scenes' | 'activity' | 'conversationQuestion' | 'caregiverMessage' | 'requiredElements' | 'actionWords'> & {
  object: string
  place: string
}

const byStyle: Record<StyleId, { elements: string[]; place: string; companion: string }> = {
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

function scenes(seed: Seed): string[] {
  const style = byStyle[seed.style]
  if (seed.style === 'diario') {
    return [
      `Escribo en mi diario desde ${seed.place || style.place}. Hay ${style.elements.slice(0, 4).join(', ')} y un ${seed.object} que no puedo ignorar aunque intente dejarlo en una esquina.`,
      `El reto aparece cuando {{situationText}}. Noto {{emotion}} y el ${seed.object} cambia de sitio, como si la página me obligara a mirar lo que pasa de verdad.`,
      `Primero intento evitarlo. Desbloqueo el móvil, cierro el diario o escribo cualquier cosa para no entrar en el tema. No funciona: la nota queda a medias y la cabeza sigue dando vueltas.`,
      `{{companion}} se acerca sin sermón. No corrige ni decide por mí. Solo escucha y pregunta: “¿Qué parte podrías probar ahora, una sola, usando lo que tienes delante?”. La pregunta no suena infantil y eso ayuda.`,
      `Entonces {{competenceAction}}. Uso el ${seed.object} y lo convierto en {{competenceArtifact}}. La acción se ve desde fuera: hay manos que dibujan, una tarjeta que se levanta, una nota que se dobla o una señal que queda puesta.`,
      `El resultado es realista. El reto no desaparece y todavía puedo sentir {{emotion}}, pero la escena cambia: hay una ruta, una frase, un objeto o una marca que permite continuar sin resolverlo todo de golpe.`,
      `Al final, el ${seed.object} queda guardado en un lugar visible. Cierro el diario con una imagen concreta, no con una lección: algo que he probado y que podría volver a usar.`
    ]
  }
  return [
    `{{name}} llega a ${seed.place || style.place}. Allí hay ${style.elements.slice(0, 4).join(', ')} y un ${seed.object} que parece importante desde el principio. El mundo no está de adorno: para avanzar hay que mirar sus señales, tocar sus objetos y decidir por dónde seguir.`,
    `El reto aparece cuando {{situationText}}. {{name}} nota {{emotion}} y el ${seed.object} cambia de sitio, como si dijera que no basta con seguir andando. Algo concreto bloquea la escena y obliga a detenerse.`,
    `Primero, {{name}} intenta evitarlo. Mira hacia otro lado, guarda el ${seed.object} demasiado rápido o finge que la señal no está ahí. El intento no sale bien: el camino se enreda, el panel parpadea o la página queda llena de tachones.`,
    `{{companion}} se acerca sin sermón. No corrige ni decide por {{name}}. Solo escucha y pregunta: “¿Qué parte podrías probar ahora, una sola, usando lo que tienes delante?”. La pregunta deja espacio para respirar y elegir.`,
    `Entonces {{name}} {{competenceAction}}. Usa el ${seed.object} y lo convierte en {{competenceArtifact}}. La acción se ve desde fuera: hay manos que dibujan, una tarjeta que se levanta, una nota que se dobla o una señal que queda puesta.`,
    `El resultado es realista. El reto no desaparece y {{name}} todavía puede sentir {{emotion}}, pero la escena cambia: hay una ruta, una frase, un objeto o una marca que permite continuar sin tener que resolverlo todo a la vez.`,
    `Al final, el ${seed.object} queda guardado en un lugar visible. {{name}} mira la escena de nuevo y encuentra una imagen para recordar: no una lección explicada, sino una huella concreta de lo que se atrevió a intentar.`
  ]
}

const seeds: Seed[] = []
const styles: StyleId[] = ['aventurero','espacial','submarino','deportivo','superheroes','magico','realista','diario','animales','comic']
const competencies = Object.keys(COMPETENCE_ACTIONS) as PedagogicalCompetenceId[]
const ages: AgeGroupId[] = ['3-5','6-8','9-12','13-15','16-17']
const situations: (SituationId | 'any')[] = ['cuesta-tomar','revision-proxima','miedo-hospital','verguenza','cansancio-cuidarse','dificultad-hablar','olvida-tratamiento','quiere-autonomia','tratamiento-nuevo','any']
for (let i = 0; i < 30; i += 1) {
  const style = styles[i % styles.length]
  const competence = competencies[i % competencies.length]
  const styleData = byStyle[style]
  const titleCore = COMPETENCE_ACTIONS[competence].artifact
  seeds.push({
    ageGroup: ages[i % ages.length],
    style,
    situation: situations[i % situations.length],
    competence,
    title: `{{name}} y ${titleCore}`,
    object: styleData.elements[(i + 2) % styleData.elements.length],
    place: styleData.place,
  })
}

export const NARRATIVE_TEMPLATES: NarrativeTemplate[] = seeds.map((seed, index) => {
  const comp = COMPETENCE_ACTIONS[seed.competence]
  const style = byStyle[seed.style]
  return {
    id: `scene-template-${index + 1}`,
    ...seed,
    scenes: scenes(seed),
    activity: comp.activity,
    conversationQuestion: comp.question,
    caregiverMessage: comp.caregiver,
    requiredElements: style.elements,
    actionWords: comp.keywords,
  }
})
