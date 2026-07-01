import type { AgeGroupId, PedagogicalCompetenceId, SituationId, StyleId } from '../types'

export type NarrativePattern =
  | 'misión'
  | 'búsqueda'
  | 'diario'
  | 'carta'
  | 'entrenamiento'
  | 'mapa'
  | 'conversación'
  | 'misterio sencillo'
  | 'cómic narrativo'
  | 'reto de equipo'

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
  ageGroups: AgeGroupId[]
  styles: StyleId[]
  competencies: PedagogicalCompetenceId[]
  situations?: SituationId[]
  pattern: NarrativePattern
  title: (ctx: NarrativeContext) => string
  paragraphs: (ctx: NarrativeContext) => string[]
  question: (ctx: NarrativeContext) => string
  activity: (ctx: NarrativeContext) => string
  caregiverMessage: (ctx: NarrativeContext) => string
}

const teenLine = 'Hay días en los que cuidarse cansa; poder decirlo sin culpa también ayuda a seguir.'

export const NARRATIVE_TEMPLATES: NarrativeTemplate[] = [
  {
    id: 'space-help-button',
    ageGroups: ['6-8', '9-12'],
    styles: ['espacial'],
    competencies: ['pedir-ayuda', 'compartir-dudas-familia'],
    pattern: 'misión',
    title: ({ name }) => `${name} y el botón azul de la nave`,
    paragraphs: ({ name, emotion, companion }) => [
      `${name} revisaba el panel de la nave Pequeños Pasos. Una luz verde marcaba el desayuno, otra luz amarilla parpadeaba cerca de la mochila y una luz roja hacía bip, bip, bip.`,
      `La misión era sencilla en el mapa, pero no en la barriga: tocaba prepararse para un momento de cuidado y ${name} notó ${emotion}. Primero intentó tapar la luz roja con una pegatina de planetas. El bip siguió sonando, un poco más bajito, pero siguió.`,
      `${companion} apareció en la pantalla.
—¿Quieres apagarla tú solo/a o buscamos una coordenada de ayuda?
${name} miró sus manos. No quería una charla. Quería que el panel dejara de parecer tan grande.`,
      `Entonces pulsó el botón azul. No arregló toda la misión, pero abrió una llamada con alguien de confianza. ${name} dijo una frase corta: “Esto me está costando”. Con esa frase, la luz roja cambió a naranja.`,
      `La nave no llegó antes a la base, pero voló más tranquila. En el cristal quedó reflejado un botón azul pequeñito, listo para la siguiente vez.`,
    ],
    question: () => '¿Cuál sería tu botón azul cuando algo se hace demasiado grande?',
    activity: () => 'Dibuja el panel de tu nave: una luz para lo que haces bien, otra para lo que cuesta y un botón azul para pedir ayuda.',
    caregiverMessage: () => 'Refuerce la petición concreta de ayuda sin convertirla en interrogatorio. Una frase breve puede ser suficiente para iniciar conversación.',
  },
  {
    id: 'submarine-emotion-current',
    ageGroups: ['3-5', '6-8'],
    styles: ['submarino', 'animales'],
    competencies: ['reconocer-emocion'],
    pattern: 'búsqueda',
    title: ({ name }) => `${name} y la corriente de colores`,
    paragraphs: ({ name, emotion, companion }) => [
      `${name} nadaba por el arrecife. Había peces rojos, conchas amarillas y una corriente azul que hacía cosquillas en los pies.`,
      `De pronto, la corriente empujó fuerte. ${name} se quedó quieto/a. Notó ${emotion}. No era un monstruo. Era una emoción grande.`,
      `${companion} no dijo “no pasa nada”. Se acercó despacio y preguntó:
—¿De qué color es eso que sientes?`,
      `${name} señaló una concha. “Azul oscuro”, dijo. Luego sopló burbujas: una, dos, tres. La corriente siguió allí, pero ya tenía nombre y color.`,
      `Antes de volver, ${name} guardó una concha azul en el bolsillo. Cuando una emoción volviera a empujar, podría mirarla primero.`,
    ],
    question: () => 'Si tu emoción tuviera un color hoy, ¿cuál sería?',
    activity: () => 'Dibuja un semáforo de emociones: rojo para lo que asusta, amarillo para lo que dudas y verde para lo que te ayuda.',
    caregiverMessage: () => 'Nombrar una emoción reduce la confusión. En edades pequeñas conviene usar colores, gestos o dibujos antes que explicaciones largas.',
  },
  {
    id: 'magic-routine-door', ageGroups: ['3-5','6-8'], styles: ['magico'], competencies: ['crear-rutina'], pattern: 'mapa',
    title: () => `La puerta que se abría con tres pasos`,
    paragraphs: ({ name, companion }) => [`En el bosque de ${name} había una puerta redonda. No se abría con fuerza. Se abría con tres pasos pequeños.`, `El primer día, ${name} corrió de un lado a otro y olvidó el orden. La puerta hizo “cloc” y siguió cerrada.`, `${companion} se sentó en una piedra.
—¿Qué paso va primero? —preguntó, sin prisa.`, `${name} dibujó una señal: mirar, preparar, avisar. Hizo los tres pasos con una palmada entre cada uno. La puerta se abrió solo un poquito, lo justo para pasar.`, `Desde entonces, la señal quedó colgada de una rama. No hacía magia por ${name}; le recordaba por dónde empezar.`],
    question: () => '¿Qué tres pasos pequeños te ayudan a empezar tu rutina?', activity: () => 'Diseña una señal secreta que te ayude a recordar tu rutina.', caregiverMessage: () => 'Una rutina visible y breve ayuda más que repetir órdenes. Revísenla juntos y ajusten lo que no funcione.'
  },
  {
    id: 'sports-tired-backpack', ageGroups: ['9-12','13-15'], styles: ['deportivo','realista'], competencies: ['expresar-cansancio'], situations: ['cansancio-cuidarse'], pattern: 'entrenamiento',
    title: ({ name }) => `${name} pide tiempo muerto`,
    paragraphs: ({ name, emotion }) => [`El marcador no iba mal, pero ${name} sentía las piernas pesadas antes de empezar. En el banquillo, la mochila parecía llena de piedras invisibles.`, `Durante el entrenamiento dijo “bien” tres veces, aunque por dentro notaba ${emotion}. Intentó seguir como siempre. Falló un pase fácil y se enfadó con la botella de agua.`, `La entrenadora no gritó. Solo levantó la mano en forma de T.
—Tiempo muerto. ¿Qué pesa hoy?`, `${name} abrió la mochila y nombró tres piedras: estar pendiente de todo, repetir explicaciones y sonreír cuando no apetecía. Nadie quitó la mochila entera, pero una piedra pasó al banco.`, `Volvió al campo para una jugada corta. No fue el mejor entrenamiento del año. Fue uno en el que ${name} no tuvo que fingir todo el rato.`],
    question: () => '¿Qué pesa más en tu mochila algunos días?', activity: () => 'Dibuja tu mochila de días difíciles. Dentro pon tres cosas que pesan y fuera tres personas o cosas que te ayudan.', caregiverMessage: () => 'Validen el cansancio sin alarmarse ni minimizarlo. Preguntar “¿qué pesa hoy?” puede abrir más que pedir explicaciones completas.'
  },
  {
    id: 'realistic-question-card', ageGroups: ['9-12','13-15','16-17'], styles: ['realista','diario'], competencies: ['preparar-preguntas-consulta'], situations: ['revision-proxima','tratamiento-nuevo','cambio-tratamiento'], pattern: 'conversación',
    title: ({ name }) => `La tarjeta de ${name}`,
    paragraphs: ({ name, emotion, ageGroup }) => [`La revisión estaba apuntada en el calendario. ${name} la veía cada vez que abría la nevera, como si el número estuviera escrito más grande que los demás.`, `Tenía preguntas, pero cuando alguien decía “¿alguna duda?”, las frases se escondían. ${name} notaba ${emotion} y contestaba demasiado rápido: “No”.`, `Esa tarde dobló una tarjeta en tres partes. En la primera escribió: “quiero contar”. En la segunda: “me preocupa”. En la tercera: “quiero preguntar”.`, `En la consulta no leyó todo. Solo enseñó la tarjeta. La farmacéutica esperó. Esa espera hizo sitio para la primera pregunta.`, ageGroup === '16-17' ? `Al salir, ${name} no sintió que tuviera todo controlado. Sintió algo más útil: había llevado su propia voz a la mesa.` : `Al salir, la tarjeta estaba arrugada por una esquina. A ${name} le gustó verla así: parecía una herramienta usada de verdad.`],
    question: () => '¿Qué te gustaría llevar escrito para que no se escape en la consulta?', activity: () => 'Prepara una tarjeta con tres apartados: quiero contar, me preocupa y quiero preguntar.', caregiverMessage: () => 'Permita que el menor formule al menos una pregunta con sus palabras. La tarjeta puede ayudar a respetar su ritmo.'
  },
  {
    id: 'comic-shame-speech-bubble', ageGroups: ['9-12','13-15'], styles: ['comic'], competencies: ['hablar-tratamiento-sin-verguenza'], situations: ['verguenza','dificultad-hablar'], pattern: 'cómic narrativo',
    title: ({ name }) => `${name} en viñetas pequeñas`,
    paragraphs: ({ name, emotion }) => [`Viñeta 1: ${name} guarda una parte de su cuidado en una mochila y mira alrededor para comprobar que nadie pregunta.`, `Viñeta 2: aparece un bocadillo enorme sobre su cabeza: “¿Y si piensan raro?”. ${name} nota ${emotion} y borra el bocadillo con la manga.`, `Viñeta 3: una amiga señala otro bocadillo vacío.
—Puedes escribir solo lo que quieras contar —dice.`, `Viñeta 4: ${name} escribe: “A veces necesito hacer una pausa”. No cuenta todo. No da detalles. Solo una frase que le pertenece.`, `Viñeta 5: el bocadillo ya no ocupa toda la página. Queda sitio para el partido, los mensajes, los deberes y una risa torcida al final.`],
    question: () => '¿Qué frase corta te gustaría tener preparada si alguien pregunta?', activity: () => 'Escribe o dibuja tres cosas que forman parte de ti además de tu tratamiento.', caregiverMessage: () => 'Ayude a preparar respuestas breves que respeten la privacidad. No es necesario que el niño o adolescente explique más de lo que desea.'
  },
  {
    id: 'teen-diary-ambivalence', ageGroups: ['13-15','16-17'], styles: ['diario','realista'], competencies: ['participar-autocuidado','expresar-cansancio'], pattern: 'diario',
    title: ({ name }) => `Página sin título de ${name}`,
    paragraphs: () => [`No iba a escribir nada, pero aquí estoy. Hoy me cansó tener que acordarme de cosas que otra gente ni piensa. ${teenLine}`, `En casa preguntaron si todo bien. Dije que sí porque era más rápido. Luego abrí el móvil para distraerme y la alarma apareció encima de todo, como si quisiera ganar la discusión.`, `No hice un plan perfecto. Solo cambié el nombre de la alarma por una frase menos pesada y dejé una nota para preguntar algo en la próxima consulta.`, `También le dije a una persona de confianza: “recuérdamelo sin sermón”. Suena pequeño, pero fue una decisión mía.`, `Mañana puede que me vuelva a molestar. Aun así, hoy no desaparecí de mi propio cuidado.`],
    question: ({ name }) => `¿Qué recordatorio le resultaría menos invasivo a ${name}?`, activity: () => 'Escribe dos formas de recibir ayuda: una que sí te sirve y una que prefieres evitar.', caregiverMessage: () => 'En adolescentes, negocie apoyos concretos y respete la privacidad. Acompañar no significa controlar cada gesto.'
  },
  {
    id: 'super-team-training', ageGroups: ['6-8','9-12'], styles: ['superheroes'], competencies: ['celebrar-avances','participar-autocuidado'], pattern: 'reto de equipo',
    title: ({ name }) => `${name} y el entrenamiento de lo posible`,
    paragraphs: ({ name, companion }) => [`La liga de superhéroes no entrenaba solo saltos gigantes. También practicaba cosas pequeñas: preparar la mochila, decir dudas y descansar antes de enfadarse.`, `${name} quería dominarlo todo el primer día. Al tercer intento, el cinturón de misión se abrió y las tarjetas salieron volando.`, `${companion} recogió una tarjeta.
—Elige una para hoy. Solo una.`, `${name} eligió “preguntar si no entiendo”. Durante la misión levantó la mano una vez. El cielo no explotó. Nadie se rió. La misión siguió.`, `Al final no recibió una medalla enorme. Recibió una pegatina pequeña en el cinturón. Era suficiente para recordar que un superpoder también puede entrenarse despacio.`],
    question: () => '¿Qué pequeño superpoder de autocuidado quieres entrenar esta semana?', activity: () => 'Haz una tarjeta de entrenamiento con una sola misión para esta semana y un espacio para marcar cuándo la intentas.', caregiverMessage: () => 'Evite exigir varios objetivos a la vez. Una tarea observable permite celebrar avances sin presionar.'
  },
]

const fallbackStyles: StyleId[] = ['aventurero', 'magico', 'superheroes', 'animales', 'espacial', 'deportivo', 'submarino', 'realista', 'comic', 'diario']
const fallbackCompetencies: PedagogicalCompetenceId[] = ['reconocer-emocion','pedir-ayuda','preparar-preguntas-consulta','crear-rutina','afrontar-revision','expresar-cansancio','hablar-tratamiento-sin-verguenza','participar-autocuidado','compartir-dudas-familia','celebrar-avances']

for (let i = 0; i < 12; i += 1) {
  const style = fallbackStyles[i % fallbackStyles.length]
  const competence = fallbackCompetencies[i % fallbackCompetencies.length]
  NARRATIVE_TEMPLATES.push({
    id: `adaptive-${i + 1}`,
    ageGroups: [['3-5'], ['6-8'], ['9-12'], ['13-15'], ['16-17']][i % 5] as AgeGroupId[],
    styles: [style],
    competencies: [competence],
    pattern: ['misión','búsqueda','carta','mapa','misterio sencillo','conversación'][i % 6] as NarrativePattern,
    title: ({ name }) => `${name} y ${style === 'realista' ? 'la nota doblada' : 'la señal escondida'}`,
    paragraphs: ({ name, emotion, companion, competenceLabel }) => [`${name} encontró una señal pequeña justo al empezar el día. No brillaba mucho, pero indicaba un reto: ${competenceLabel.toLowerCase()}.`, `Al principio intentó seguir como si nada. Entonces apareció ${emotion}, y la señal se movió hasta el centro del camino.`, `${companion} se acercó y preguntó qué paso cabía en ese momento. No dio una solución mágica; esperó la respuesta.`, `${name} eligió una acción concreta: decir una frase, marcar una casilla o pedir compañía. El reto no desapareció, pero dejó de ocupar todo el paisaje.`, `Al guardar la señal, ${name} no pensó en ganar para siempre. Pensó en recordar el camino cuando volviera a hacer falta.`],
    question: () => '¿Qué señal te avisaría de que necesitas parar, preguntar o pedir compañía?',
    activity: () => 'Crea una tarjeta de señal: por un lado dibuja el reto y por el otro un paso pequeño que puedas probar.',
    caregiverMessage: () => 'Use el cuento para elegir una conducta concreta y realista. Evite convertirlo en una lista de obligaciones.',
  })
}
