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
  openingScene: (ctx: NarrativeContext) => string
  challengeScene: (ctx: NarrativeContext) => string
  failedAttempt: (ctx: NarrativeContext) => string
  companionDialogue: (ctx: NarrativeContext) => string
  protagonistAction: (ctx: NarrativeContext) => string
  realisticOutcome: (ctx: NarrativeContext) => string
  closingImage: (ctx: NarrativeContext) => string
  readingGuide: (ctx: NarrativeContext) => string
  conversationQuestion: (ctx: NarrativeContext) => string
  activity: (ctx: NarrativeContext) => string
  caregiverMessage: (ctx: NarrativeContext) => string
  requiredElements: string[]
  actionWords: string[]
}

const teenCaregiver = 'En adolescentes, conviene negociar apoyos concretos y respetar su privacidad. Una acción pequeña elegida por la persona joven suele ser más útil que una lista de instrucciones.'

export const NARRATIVE_TEMPLATES: NarrativeTemplate[] = [
  {
    id: 'sports-hospital-question-card', ageGroups: ['6-8','9-12'], styles: ['deportivo'], competencies: ['preparar-preguntas-consulta','afrontar-revision'], situations: ['miedo-hospital','revision-proxima'], pattern: 'entrenamiento', requiredElements: ['entrenamiento','banquillo','tarjeta','equipo','jugada'], actionWords: ['escribió','dibujó','dijo'],
    title: ({ name }) => `${name} y la tarjeta de jugadas`,
    openingScene: ({ name }) => `${name} entrenaba con el equipo Adelante. El balón rodaba rápido, pero se quedó en el banquillo atándose los cordones una y otra vez.`,
    challengeScene: ({ name }) => `Al día siguiente tocaba ir al hospital. Cuando el entrenador pidió un pase, ${name} miró la puerta del polideportivo como si fuera la entrada de la consulta.`,
    failedAttempt: ({ name }) => `${name} intentó jugar sin pensar en eso, chutó demasiado fuerte y el balón salió por la banda. No era falta de ganas; la cabeza estaba en otro sitio.`,
    companionDialogue: ({ companion }) => `${companion} se sentó a su lado y preguntó: “¿Preparamos una jugada para mañana, solo una tarjeta, sin resolver todo ahora?”.`,
    protagonistAction: ({ name }) => `${name} dobló una cartulina y escribió tres casillas: “quiero preguntar”, “me da nervios” y “me ayuda”. En la última dibujó su pulsera azul.`,
    realisticOutcome: () => `En la consulta siguió con nervios, pero sacó la tarjeta y dijo: “He traído tres cosas apuntadas”. La primera pregunta salió bajita, suficiente para empezar.`,
    closingImage: () => `La tarjeta volvió arrugada en la mochila, como una jugada ensayada que ya había pisado campo.`,
    readingGuide: () => 'Subraya cómo el entrenamiento se convierte en ensayo para preparar preguntas.',
    conversationQuestion: () => '¿Qué pondrías tú en una tarjeta de jugadas antes de ir al hospital?',
    activity: () => 'Preparad una tarjeta con tres apartados: quiero preguntar, me da nervios y me ayuda.',
    caregiverMessage: () => 'Anticipar la visita con preguntas sencillas puede reducir incertidumbre y facilitar la participación. No hace falta expresarlo todo; basta con abrir una forma segura de comunicar lo que necesita.',
  },
  {
    id: 'space-help-button', ageGroups: ['6-8','9-12'], styles: ['espacial'], competencies: ['pedir-ayuda','compartir-dudas-familia'], pattern: 'misión', requiredElements: ['nave','panel','botón','misión','base'], actionWords: ['pulsó','dijo'],
    title: ({ name }) => `${name} y el botón azul de la nave`, openingScene: ({ name }) => `La nave de ${name} esperaba junto a la base lunar con el panel encendido. La misión del día tenía tres luces y una parpadeaba en rojo.`, challengeScene: ({ name }) => `${name} tenía que contar en casa que algo le preocupaba de su cuidado, pero la frase no salía. La luz roja hacía bip cada vez que tragaba saliva.`, failedAttempt: ({ name }) => `${name} tapó el piloto con una pegatina de estrellas. Durante un minuto pareció funcionar, hasta que el bip volvió a sonar desde debajo.`, companionDialogue: ({ companion }) => `${companion} apareció por la radio y preguntó: “¿Quieres probar el botón de ayuda o prefieres que espere contigo diez segundos?”.`, protagonistAction: ({ name }) => `${name} pulsó el botón azul y dijo por la radio: “Necesito que me escuches antes de hacer preguntas”.`, realisticOutcome: () => `La misión no cambió de destino, pero el panel dejó de gritar. La conversación empezó con una pausa y una silla cerca.`, closingImage: () => `Al despegar, el botón azul quedó iluminado, pequeño y fácil de encontrar.`, readingGuide: () => 'Observa que pedir ayuda se muestra como una acción en el panel de la nave.', conversationQuestion: () => '¿Cuál sería tu botón azul cuando algo se hace demasiado grande?', activity: () => 'Dibuja un panel con tres luces: lo que puedo hacer, lo que cuesta y a quién puedo llamar.', caregiverMessage: () => 'Refuerce peticiones concretas de ayuda sin interrogatorio. Una frase breve puede iniciar una conversación cuidadosa.'
  },
  {
    id: 'submarine-emotion-map', ageGroups: ['3-5','6-8'], styles: ['submarino'], competencies: ['reconocer-emocion'], pattern: 'búsqueda', requiredElements: ['arrecife','corriente','concha','burbuja','mapa'], actionWords: ['señaló','sopló'],
    title: ({ name }) => `${name} y el mapa de burbujas`, openingScene: ({ name }) => `${name} nadaba por el arrecife con un mapa de conchas. La corriente movía las algas como cintas verdes.`, challengeScene: ({ name, emotion }) => `Al acercarse a la zona profunda, ${name} notó ${emotion}. La corriente empujó fuerte y el mapa se dobló.`, failedAttempt: ({ name }) => `${name} quiso nadar más deprisa, pero chocó con una roca suave y soltó un montón de burbujas torcidas.`, companionDialogue: ({ companion }) => `${companion} nadó a su lado y preguntó: “¿Qué color tiene esta corriente por dentro?”.`, protagonistAction: ({ name }) => `${name} señaló una concha azul oscuro y sopló tres burbujas lentas para marcar el lugar en el mapa.`, realisticOutcome: () => `La corriente siguió moviéndose, aunque ya no parecía invisible. Podían rodearla despacio.`, closingImage: () => `La concha quedó en el mapa como una señal de “aquí necesito ir con cuidado”.`, readingGuide: () => 'La emoción aparece como corriente: no desaparece, se localiza.', conversationQuestion: () => 'Si tu emoción tuviera un color hoy, ¿cuál sería?', activity: () => 'Haced un mapa de burbujas con tres zonas: me asusta, puedo probar y me acompaña.', caregiverMessage: () => 'Nombrar emociones con colores o dibujos ayuda en edades pequeñas más que pedir explicaciones largas.'
  },
  {
    id: 'magic-routine-door', ageGroups: ['3-5','6-8'], styles: ['magico'], competencies: ['crear-rutina'], pattern: 'mapa', requiredElements: ['bosque','puerta','mapa','hechizo','prueba'], actionWords: ['dibujó','ordenó'],
    title: ({ name }) => `${name} y la puerta de tres pasos`, openingScene: ({ name }) => `En el bosque de ${name} había una puerta redonda dibujada en un mapa. Solo se abría con un hechizo muy corto.`, challengeScene: ({ name }) => `${name} quería empezar su rutina de cuidado, pero mezcló las cosas sobre la mesa y la puerta hizo cloc.`, failedAttempt: ({ name }) => `${name} dijo palabras inventadas y dio vueltas alrededor del árbol. La puerta no se enfadó; simplemente siguió cerrada.`, companionDialogue: ({ companion }) => `${companion} se sentó en una piedra y preguntó: “¿Qué tres pasos caben hoy en tu hechizo?”.`, protagonistAction: ({ name }) => `${name} dibujó en el mapa: preparar, avisar y guardar. Luego ordenó la mesa siguiendo esas tres señales.`, realisticOutcome: () => `La puerta se abrió solo un poco, lo justo para pasar sin correr. Mañana quizá habría que mirar el mapa otra vez.`, closingImage: () => `El mapa quedó colgado de una rama baja, a la altura de las manos pequeñas.`, readingGuide: () => 'La rutina se convierte en prueba mágica con pasos visibles.', conversationQuestion: () => '¿Qué tres dibujos pondrías en tu rutina?', activity: () => 'Cread una tira con tres viñetas de rutina: antes, durante y después.', caregiverMessage: () => 'Una rutina visible y breve suele ayudar más que repetir órdenes. Revisen juntos qué paso estorba y ajústenlo.'
  },
  {
    id: 'realist-consult-agenda', ageGroups: ['9-12','13-15','16-17'], styles: ['realista'], competencies: ['preparar-preguntas-consulta','afrontar-revision'], situations: ['revision-proxima','tratamiento-nuevo','cambio-tratamiento'], pattern: 'conversación', requiredElements: ['casa','agenda','consulta','mochila','conversación'], actionWords: ['escribió','enseñó'],
    title: ({ name }) => `La página doblada de ${name}`, openingScene: ({ name }) => `En casa, ${name} vio la palabra “consulta” escrita en la agenda. La mochila estaba abierta junto a la mesa.`, challengeScene: () => `Tenía una duda, pero cada vez que imaginaba la sala, la pregunta se escondía detrás de un “no sé”.`, failedAttempt: ({ name }) => `${name} intentó memorizarla mientras buscaba un lápiz. Diez minutos después recordaba el color del lápiz, no la pregunta.`, companionDialogue: ({ companion }) => `${companion} preguntó desde la cocina: “¿Quieres escribir una sola frase para llevarla, aunque luego no la leas entera?”.`, protagonistAction: ({ name }) => `${name} escribió la duda en una página, la dobló y la guardó en el bolsillo pequeño de la mochila.`, realisticOutcome: ({ name }) => `En la consulta, ${name} enseñó la hoja antes de hablar. Alguien esperó y la pregunta encontró sitio.`, closingImage: () => `La hoja volvió con una esquina marcada, como las páginas que se usan de verdad.`, readingGuide: () => 'El papel permite participar sin exigir un discurso perfecto.', conversationQuestion: () => '¿Qué pregunta te gustaría llevar por escrito?', activity: () => 'Preparad una nota de consulta con una duda y una cosa que conviene contar.', caregiverMessage: () => 'Permita que formule al menos una pregunta con sus palabras. La nota ayuda a respetar su ritmo.'
  },
  {
    id: 'comic-privacy-bubble', ageGroups: ['9-12','13-15'], styles: ['comic'], competencies: ['hablar-tratamiento-sin-verguenza'], situations: ['verguenza','dificultad-hablar'], pattern: 'cómic narrativo', requiredElements: ['viñeta','bocadillo','página','rotulador'], actionWords: ['escribió','eligió'],
    title: ({ name }) => `${name} y el bocadillo pequeño`, openingScene: ({ name }) => `Viñeta uno: ${name} dibuja una página con un bocadillo gigante sobre la cabeza. Ocupa casi todo el margen.`, challengeScene: () => `Viñeta dos: alguien pregunta por qué hoy necesita una pausa. El bocadillo gigante se llena de rayas negras.`, failedAttempt: ({ name }) => `Viñeta tres: ${name} intenta borrar toda la página con la manga, pero el papel se arruga y el bocadillo sigue ahí.`, companionDialogue: ({ companion }) => `Viñeta cuatro: ${companion} señala un bocadillo pequeño y pregunta: “¿Qué frase sí quieres que quepa aquí?”.`, protagonistAction: ({ name }) => `Viñeta cinco: ${name} escribe con rotulador: “A veces necesito parar un momento”. Luego elige no explicar más.`, realisticOutcome: () => `La página no queda perfecta, pero ahora hay sitio para el recreo, los mensajes y una risa en la esquina.`, closingImage: () => `El bocadillo pequeño queda pegado como una pegatina que protege la privacidad.`, readingGuide: () => 'El cuento muestra una frase preparada que no obliga a contar detalles.', conversationQuestion: () => '¿Qué frase corta te gustaría tener preparada si alguien pregunta?', activity: () => 'Dibuja tres bocadillos: una frase que sí dirías, una que no quieres decir y una persona segura.', caregiverMessage: () => 'Ayude a preparar respuestas breves que respeten la privacidad. No es necesario explicar más de lo que se desea.'
  },
  {
    id: 'diary-reminder', ageGroups: ['13-15','16-17'], styles: ['diario'], competencies: ['participar-autocuidado','expresar-cansancio'], pattern: 'diario', requiredElements: ['diario','móvil','alarma','nota'], actionWords: ['cambió','escribió','pidió'],
    title: ({ name }) => `Página sin título de ${name}`, openingScene: ({ name }) => `${name} abre el diario tarde, con el móvil boca abajo y una alarma que acaba de sonar.`, challengeScene: () => `La alarma no era el problema entero. Lo pesado era sentir que todo el día tenía recordatorios pegados.`, failedAttempt: () => `Primero deslizó la notificación sin mirarla. A los cinco minutos volvió la duda y el enfado ocupó la habitación.`, companionDialogue: () => `Una persona de confianza preguntó desde la puerta: “¿Quieres que te recuerde algo de otra manera, o prefieres pensarlo y me dices luego?”.`, protagonistAction: ({ name }) => `${name} cambió el nombre de la alarma, escribió una nota para la consulta y pidió: “Recuérdamelo sin sermón”.`, realisticOutcome: () => `No apareció una motivación brillante. Apareció algo más práctico: una forma de participar sin sentirse perseguido por el móvil.`, closingImage: () => `El diario quedó abierto con una frase subrayada y la alarma sonó más baja al día siguiente.`, readingGuide: () => 'El foco está en negociar apoyos, no en obedecer sin más.', conversationQuestion: () => '¿Qué tipo de recordatorio ayuda y cuál molesta?', activity: () => 'Escribe dos formas de recibir ayuda: una que sí sirve y una que prefieres evitar.', caregiverMessage: () => teenCaregiver
  },
  {
    id: 'adventure-map-review', ageGroups: ['6-8','9-12'], styles: ['aventurero'], competencies: ['afrontar-revision'], situations: ['revision-proxima','miedo-hospital'], pattern: 'mapa', requiredElements: ['mapa','puente','mochila','ruta'], actionWords: ['marcó','guardó'],
    title: ({ name }) => `${name} y el puente del mapa`, openingScene: ({ name }) => `${name} desplegó un mapa de aventura sobre la cama. La ruta pasaba por casa, mochila, sala de espera y vuelta.`, challengeScene: () => `El puente de la sala de espera parecía demasiado largo en el dibujo. Allí se juntaban preguntas, olores y sonidos nuevos.`, failedAttempt: ({ name }) => `${name} quiso borrar el puente entero, pero entonces el mapa quedó con un agujero justo en medio.`, companionDialogue: ({ companion }) => `${companion} preguntó: “¿Qué llevarías en la mochila para cruzar solo el primer tramo?”.`, protagonistAction: ({ name }) => `${name} marcó tres señales en el mapa y guardó un libro, una pregunta escrita y un objeto pequeño de calma.`, realisticOutcome: () => `El día de la revisión el puente siguió siendo largo, pero ya no era un sitio sin nombre. Había señales para avanzar.`, closingImage: () => `Al volver, una pegatina quedó pegada sobre el primer tramo cruzado.`, readingGuide: () => 'La revisión se transforma en ruta con tramos manejables.', conversationQuestion: () => '¿Qué señal pondrías en el tramo que más cuesta?', activity: () => 'Dibujad la ruta de la próxima revisión y elegid un apoyo para cada tramo.', caregiverMessage: () => 'Anticipar por tramos evita prometer que todo será fácil y permite preparar apoyos concretos.'
  },
  {
    id: 'superhero-single-card', ageGroups: ['6-8','9-12'], styles: ['superheroes'], competencies: ['celebrar-avances','participar-autocuidado'], pattern: 'reto de equipo', requiredElements: ['liga','cinturón','misión','tarjeta'], actionWords: ['eligió','levantó'],
    title: ({ name }) => `${name} y la tarjeta del cinturón`, openingScene: ({ name }) => `En la liga de superhéroes, ${name} llevaba un cinturón con tarjetas de misión. No todas brillaban el mismo día.`, challengeScene: () => `Había una misión de cuidado y demasiadas tarjetas sueltas: preguntar, preparar, avisar, descansar.`, failedAttempt: ({ name }) => `${name} quiso usarlas todas a la vez. El cinturón se abrió y las tarjetas cayeron como confeti.`, companionDialogue: ({ companion }) => `${companion} recogió una y preguntó: “¿Cuál entrenamos hoy, solo una?”.`, protagonistAction: ({ name }) => `${name} eligió la tarjeta “preguntar si no entiendo” y levantó la mano una vez durante la misión.`, realisticOutcome: () => `No ganó una capa nueva. Ganó una marca pequeña en la tarjeta, hecha con lápiz, porque había que poder intentarlo otra vez.`, closingImage: () => `La tarjeta volvió al cinturón, un poco doblada por haber sido usada.`, readingGuide: () => 'Celebrar avance significa mirar una acción observable.', conversationQuestion: () => '¿Qué tarjeta pequeña entrenarías esta semana?', activity: () => 'Crea una tarjeta de misión con una sola acción y un espacio para marcar el intento.', caregiverMessage: () => 'Un objetivo observable permite reconocer avances sin presionar con grandes resultados.'
  },
  {
    id: 'animals-family-doubt', ageGroups: ['3-5','6-8'], styles: ['animales'], competencies: ['compartir-dudas-familia','pedir-ayuda'], pattern: 'conversación', requiredElements: ['madriguera','huellas','nido','bellota'], actionWords: ['puso','preguntó'],
    title: ({ name }) => `${name} y la bellota de las dudas`, openingScene: ({ name }) => `${name} vivía cerca de una madriguera con huellas pequeñas alrededor y un nido sobre la rama baja.`, challengeScene: () => `Tenía una duda guardada como una bellota en el carrillo. Pesaba al merendar y pesaba al ponerse el pijama.`, failedAttempt: ({ name }) => `${name} escondió la bellota bajo una hoja. Al rato volvió a buscarla, porque seguía pensando en ella.`, companionDialogue: ({ companion }) => `${companion} olfateó la hoja y preguntó: “¿La ponemos en el cuenco de hablar o la miramos mañana?”.`, protagonistAction: ({ name }) => `${name} puso la bellota en un cuenco y preguntó: “¿Puedes escucharme primero?”.`, realisticOutcome: () => `La duda no se convirtió en una respuesta completa, pero dejó de estar escondida en la boca.`, closingImage: () => `El cuenco quedó junto a la madriguera para otras bellotas difíciles.`, readingGuide: () => 'La duda se comparte mediante un objeto concreto.', conversationQuestion: () => '¿Qué duda pondrías en el cuenco de hablar?', activity: () => 'Dibujad un cuenco y escribid o dibujad dentro una duda para compartir.', caregiverMessage: () => 'En edades pequeñas, usar un objeto para iniciar la conversación puede ser más fácil que preguntar directamente qué ocurre.'
  },
]

const variants: Array<[StyleId, PedagogicalCompetenceId, string, string[], string[]]> = [
  ['deportivo','crear-rutina','El entrenamiento de las tres señales',['entrenamiento','pase','banquillo','silbato'],['ensayó','marcó']],
  ['espacial','preparar-preguntas-consulta','La misión de las tres preguntas',['nave','panel','base','señal'],['escribió','activó']],
  ['submarino','pedir-ayuda','La concha que pedía compañía',['arrecife','concha','burbuja','corriente'],['levantó','tocó']],
  ['magico','reconocer-emocion','El frasco del bosque',['bosque','frasco','hechizo','mapa'],['nombró','guardó']],
  ['realista','crear-rutina','La mochila de los lunes',['casa','colegio','mochila','agenda'],['ordenó','pegó']],
  ['comic','celebrar-avances','La viñeta marcada',['viñeta','bocadillo','rotulador','página'],['marcó','dibujó']],
  ['diario','compartir-dudas-familia','Entrada con una pregunta',['diario','móvil','nota','conversación'],['escribió','envió']],
  ['aventurero','participar-autocuidado','La brújula elegida',['mapa','brújula','sendero','mochila'],['eligió','marcó']],
  ['superheroes','pedir-ayuda','La señal en el cielo',['misión','señal','liga','equipo'],['encendió','dijo']],
  ['animales','expresar-cansancio','El nido pesado',['nido','huellas','rama','bellota'],['dejó','contó']],
]

variants.forEach(([style, competence, label, elements, actions], index) => {
  NARRATIVE_TEMPLATES.push({
    id: `complete-variant-${index + 1}`,
    ageGroups: index % 3 === 0 ? ['3-5','6-8'] : index % 3 === 1 ? ['9-12','13-15'] : ['13-15','16-17'],
    styles: [style], competencies: [competence], pattern: index % 2 === 0 ? 'mapa' : 'misión', requiredElements: elements, actionWords: actions,
    title: ({ name }) => `${name} y ${label.toLowerCase()}`,
    openingScene: ({ name }) => `${name} entró en la escena de ${label.toLowerCase()} con ${elements[0]} cerca y ${elements[1]} a la vista.`,
    challengeScene: ({ competenceLabel }) => `El reto era ${competenceLabel.toLowerCase()}, pero no aparecía como una lección: se notaba cuando ${elements[2]} parecía demasiado lejos.`,
    failedAttempt: ({ name }) => `${name} intentó pasar por encima del problema deprisa. Entonces ${elements[3]} quedó fuera de sitio y hubo que parar.`,
    companionDialogue: ({ companion }) => `${companion} se acercó sin sermón y preguntó: “¿Qué acción pequeña cabe ahora mismo?”.`,
    protagonistAction: ({ name }) => `${name} ${actions[0]} una señal y ${actions[1]} un paso concreto para probarlo antes de seguir.`,
    realisticOutcome: () => `El reto no desapareció. La escena quedó más ordenada y el siguiente paso se pudo mirar de frente.`,
    closingImage: () => `Al final, la señal quedó visible para recordarla en otra ocasión.`,
    readingGuide: () => 'Identifica la acción concreta y cómo cambia la escena después de hacerla.',
    conversationQuestion: () => '¿Qué acción pequeña probarías tú en una situación parecida?',
    activity: ({ competenceLabel }) => `Preparad una tarjeta para ${competenceLabel.toLowerCase()} con una señal, una frase y una persona de apoyo.`,
    caregiverMessage: () => 'Acompañe la acción pequeña sin exigir que resuelva todo el problema. Lo importante es practicar una forma segura de participar.',
  })
})
