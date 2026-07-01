# FHarmacuentos

**Cuentos motivacionales para acompañar la atención farmacéutica pediátrica.**

FHarmacuentos es una herramienta web pensada para farmacéuticos/as de hospital, residentes de
Farmacia Hospitalaria y profesionales de consultas externas pediátricas. Permite generar, en pocos
minutos, un cuento breve, personalizado y educativo para acompañar a un niño, niña o adolescente
ante su tratamiento, sus visitas al hospital o las emociones asociadas a su enfermedad.

> ⚠️ **FHarmacuentos no sustituye la información clínica del equipo sanitario.** El contenido
> generado es un apoyo educativo y motivacional, no genera indicaciones clínicas y **siempre debe
> ser revisado por el farmacéutico o farmacéutica** antes de entregarse al paciente o a su familia.

## Índice

- [¿Qué hace la herramienta?](#qué-hace-la-herramienta)
- [Principios de seguridad y privacidad](#principios-de-seguridad-y-privacidad)
- [Stack técnico](#stack-técnico)
- [Puesta en marcha](#puesta-en-marcha)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo funciona el generador (modo sin IA)](#cómo-funciona-el-generador-modo-sin-ia)
- [Modo con IA (preparado para el futuro)](#modo-con-ia-preparado-para-el-futuro)
- [Publicar en GitHub Pages](#publicar-en-github-pages)
- [Checklist de seguridad antes de usarla con pacientes](#checklist-de-seguridad-antes-de-usarla-con-pacientes)
- [Mejoras futuras](#mejoras-futuras)

## ¿Qué hace la herramienta?

A partir de un formulario breve, FHarmacuentos genera un cuento con:

- Título.
- Historia adaptada a la edad (3-5, 6-8, 9-12, 13-15 o 16-17 años), a la situación elegida
  (miedo al hospital, dificultad para tomar el tratamiento, autonomía progresiva, etc.), a la
  emoción principal y al estilo narrativo (aventurero, mágico, espacial, diario personal...).
- Mensaje motivacional que retoma el mensaje principal elegido (uno o varios).
- Actividad final opcional para realizar junto al niño, niña o adolescente.
- Pregunta para comentar en familia.
- Mensaje opcional para madres, padres o cuidadores.
- Aviso de revisión profesional.

El resultado se muestra en una pantalla limpia y editable, con botones para copiar, imprimir,
descargar en PDF, generar una nueva versión o limpiar todos los datos.

También incluye una **biblioteca de plantillas** con 10 puntos de partida ya pensados para
situaciones frecuentes (por ejemplo, "El dragón que aprendió su rutina" o "La mochila de las
preguntas"), que precargan edad, situación y estilo en el formulario.

## Principios de seguridad y privacidad

- No se solicitan datos identificativos: ni nombre real, ni apellidos, ni número de historia
  clínica, ni fecha de nacimiento. El campo "nombre del protagonista" recomienda explícitamente
  usar un nombre ficticio.
- No se generan dosis, pautas ni indicaciones clínicas concretas, ni se afirma que un tratamiento
  cura o garantiza resultados.
- El lenguaje evita la culpabilización, el miedo o la presión ("si no te lo tomas te pondrás muy
  enfermo/a" nunca aparece en el contenido generado).
- Todo cuento generado incluye el aviso: *"Este cuento es un apoyo educativo y motivacional. No
  sustituye la información proporcionada por el equipo sanitario. Revise siempre el contenido
  antes de entregarlo al paciente o familia."*
- **No hay backend ni base de datos.** La aplicación es 100 % estática y todo el estado vive en la
  memoria del navegador: recargar la página o pulsar "Limpiar datos" elimina el contenido generado.
  No se usa `localStorage` ni `sessionStorage` para el contenido de los cuentos.
- El modo con IA está **deshabilitado por defecto** y preparado solo como punto de extensión futuro
  (ver más abajo).

## Stack técnico

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) para el diseño
- [jsPDF](https://github.com/parallax/jsPDF) para la exportación a PDF
- Sin backend, sin base de datos, sin dependencias de servicios externos en tiempo de ejecución

## Puesta en marcha

Requisitos: Node.js 20+ y npm.

```bash
npm install
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173/fharmacuentos/`.

Otros comandos disponibles:

```bash
npm run build     # compila TypeScript y genera la build de producción en dist/
npm run preview   # sirve la build de producción localmente
npm run lint      # analiza el código con oxlint
```

## Estructura del proyecto

```
src/
  components/        Pantallas y componentes de interfaz (React)
  data/               Contenido y catálogos: opciones de formulario, plantillas,
                      mundos narrativos por estilo, actividades, mensajes para familias
  lib/
    generator.ts      Motor de generación de cuentos (modo sin IA, basado en plantillas)
    aiProvider.ts      Punto de extensión preparado para una futura generación con IA
    pdf.ts             Exportación del cuento a PDF con jsPDF
  types.ts             Tipos compartidos (formulario, cuento generado, catálogos)
  App.tsx              Máquina de estados de las pantallas (bienvenida, biblioteca,
                      formulario, resultado)
```

## Cómo funciona el generador (modo sin IA)

FHarmacuentos funciona siempre en **modo sin IA**: el cuento se construye combinando fragmentos de
texto ya escritos y revisados (en `src/data/storyContent.ts`, `src/data/activities.ts` y
`src/data/parentMessages.ts`) según las respuestas del formulario:

1. Se elige un "mundo narrativo" según el estilo (personaje, escenario, acompañante y símbolo).
2. Se incorpora el reto asociado a la situación seleccionada y el reconocimiento de la emoción
   elegida, con una voz y complejidad de frase distintas según el grupo de edad.
3. Se añade un pequeño paso de afrontamiento (no clínico) y, en las edades 9-12, 13-15 y 16-17,
   un párrafo de reflexión.
4. Se cierra retomando el o los mensajes principales elegidos.
5. Según la duración elegida (muy corto, corto o estándar) se combinan o se omiten párrafos.

Todo el texto resultante es **editable** en la pantalla de resultado antes de copiar, imprimir o
descargar.

## Modo con IA (preparado para el futuro)

El archivo `src/lib/aiProvider.ts` define la interfaz `AiStoryProvider` como punto de extensión,
pero **no realiza ninguna llamada de red** en esta versión: llamarlo lanza un error explicativo.

Si en el futuro se conecta una API de IA:

- Hazlo desde un **backend propio** (por ejemplo, una función serverless). Nunca incluyas claves
  de API en el código del frontend ni las expongas en el navegador; usa variables de entorno del
  lado del servidor.
- Recuerda a la persona usuaria, en la propia interfaz, que **no debe introducir nombres reales,
  números de historia clínica, fechas de nacimiento ni información clínica sensible** al usar el
  modo con IA.
- Mantén siempre la revisión profesional del cuento generado antes de entregarlo.

## Publicar en GitHub Pages

El proyecto incluye un workflow (`.github/workflows/deploy.yml`) que compila y publica la
aplicación automáticamente en GitHub Pages en cada push a `main`.

Pasos para activarlo:

1. En GitHub, ve a **Settings → Pages** y selecciona **GitHub Actions** como origen de despliegue.
2. Haz push a la rama `main`: el workflow compilará el proyecto y lo publicará.
3. La aplicación quedará disponible en `https://<usuario>.github.io/fharmacuentos/`.

`vite.config.ts` ya usa `base: '/fharmacuentos/'` para que las rutas de los recursos funcionen
correctamente en GitHub Pages. Si despliegas en la raíz de un dominio propio, cambia ese valor a
`'/'`.

## Checklist de seguridad antes de usarla con pacientes

- [ ] El nombre del protagonista introducido es ficticio, no el nombre real del paciente.
- [ ] No se ha introducido ningún dato identificativo (nombre completo, número de historia
      clínica, fecha de nacimiento, dirección, etc.) en ningún campo, incluido "Detalles
      adicionales".
- [ ] No se ha introducido información clínica sensible (diagnóstico, dosis, pauta concreta).
- [ ] El farmacéutico o farmacéutica ha leído el cuento completo generado antes de entregarlo.
- [ ] El tono del cuento resulta adecuado para la edad y la situación del paciente concreto.
- [ ] Si se ha editado el texto, se ha revisado que el aviso de revisión profesional sigue presente.
- [ ] Se entrega el material como apoyo complementario, explicando que no sustituye la información
      del equipo sanitario.

## Mejoras futuras

- Conectar un modo con IA opcional a través de un backend propio, con las salvaguardas descritas
  arriba.
- Añadir más plantillas e idiomas (por ejemplo, catalán, euskera, gallego).
- Permitir ilustraciones sencillas o pictogramas de apoyo.
- Añadir un modo de exportación en formato "díptico" para imprimir en papel plegado.
- Recopilar (de forma anónima y opcional) qué combinaciones de plantillas resultan más útiles para
  priorizar mejoras de contenido, siempre sin almacenar datos identificativos ni clínicos.
