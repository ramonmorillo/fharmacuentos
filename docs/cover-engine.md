# Fharmacuentos Cover Engine

Implementación local, 28 de septiembre de 2026. La portada se compone con geometría original; no se genera mediante IA ni se descarga de una colección de imágenes.

## 1. Arquitectura y auditoría

La auditoría previa está en `docs/cover-engine-audit.md`. Se conserva la aplicación React/TypeScript/Vite, el generador síncrono de plantillas, el formulario, el texto editable, el aviso profesional y jsPDF. No se añade ninguna dependencia de producción o desarrollo. El motor está aislado en `src/cover-engine/`.

Flujo: cuento generado → especificación visual en memoria → semilla y receta → geometría compartida → SVG en pantalla / curvas y texto nativos en PDF. App conserva la portada asociada al cuento durante la sesión; no la calcula de nuevo en cada render de React.

## 2. Archivos creados

| Archivo | Responsabilidad |
|---|---|
| `src/cover-engine/types.ts` | Contratos de especificación, receta, geometría y texto |
| `src/cover-engine/catalog.ts` | Mundos, palabras narrativas, paletas, composiciones y etiquetas accesibles |
| `src/cover-engine/spec.ts` | Reutilización de datos existentes y análisis local del relato |
| `src/cover-engine/seed.ts` | Hash, PRNG, selección de variantes e historial defensivo |
| `src/cover-engine/geometry.ts` | Primitivas vectoriales y transformaciones |
| `src/cover-engine/assets/backgrounds.ts` | Siete escenarios procedurales |
| `src/cover-engine/assets/characters.ts` | Siete figuras originales y variantes de postura/vestuario |
| `src/cover-engine/assets/objects.ts` | Nueve objetos de aventura |
| `src/cover-engine/assets/nature.ts` | Árboles, hojas, coral y ramas |
| `src/cover-engine/assets/variants/forest-bridge.ts` | Extensión de ejemplo: encuadre con puente |
| `src/cover-engine/registry.ts` | Registro y descubrimiento de extensiones locales durante la compilación |
| `src/cover-engine/drawing.ts` | Composición editorial, ajuste tipográfico y serialización SVG |
| `src/cover-engine/CoverPreview.tsx` | Vista accesible y adaptable |
| `src/cover-engine/pdf.ts` | Dibujo PDF vectorial A4 |
| `src/cover-engine/index.ts` | Entrada pública del módulo |
| `tests/cover-engine.test.mjs` | Pruebas deterministas y regresión |
| `tests/browser-check.mjs` | Prueba de navegador, 35 ejemplos, móvil, impresión y desconexión |
| `docs/cover-engine-audit.md`, `docs/cover-engine.md` | Auditoría, funcionamiento, catálogo, licencias y entrega |

## 3. Archivos modificados

- `src/App.tsx`: estado de portada junto al cuento; creación después de `generateStory`; variante independiente; limpieza del historial; aviso de almacenamiento actualizado.
- `src/components/StoryResult.tsx`: portada, botón «↻ Otra portada», título editable y paso de portada al PDF.
- `src/lib/pdf.ts`: primera página opcional, conserva el resto del documento; separa construcción de descarga para poder probar el contenido.
- `src/index.css`: tamaño adaptable y salto de página de impresión A4.
- `package.json`: script `npm test`; dependencias y lockfile intactos.
- `README.md`: información sobre la nueva función y su almacenamiento local.

`src/lib/generator.ts`, `src/data/*`, `src/types.ts`, `src/lib/aiProvider.ts`, formularios y workflow de despliegue no se modifican.

## 4. Especificación visual y funcionamiento

La especificación reutiliza `ageGroup`, `style`, `emotion`, `pedagogicalCompetence` y el texto disponible. Conserva emoción y competencia únicamente en memoria como contexto; no se usan para convertir diagnósticos en iconos. El estilo selecciona un mundo compatible; un vocabulario cerrado reconoce mapas, brújulas, mochilas, puertas, diarios, señales, conchas, juego y luz. No se hashéan el título, nombres ni texto libre.

Se diferencian protagonista y acompañantes: por ejemplo, Orbi sigue siendo un robot compañero y el búho del bosque no reemplaza a la persona protagonista. Un animal protagonista necesita una introducción narrativa explícita. Los humanos son figuras ficticias estilizadas: no representan físicamente al paciente ni deducen sexo, etnia, aspecto o fotografía a partir del formulario.

La composición reserva márgenes, título y marca. El título se escapa antes de generar SVG, conserva tildes, ñ, ü y puntuación española y se distribuye en líneas según métricas tipográficas. Las palabras sin espacios también se dividen. Cambiar el título actualiza inmediatamente la portada y el PDF. «Otra portada» no llama al generador de texto ni modifica su contenido o la fecha del documento.

## 5. Catálogo visual

- **7 escenarios:** bosque/sendero, espacio/nave, arrecife, ciudad, habitación/ventana, pista deportiva y viñetas.
- **7 figuras:** explorador, astronauta, búho, robot, tortuga, zorro y dragón. Las figuras principales y secundarias se seleccionan por contexto, no arbitrariamente.
- **9 objetos:** mapa, brújula, mochila, puerta, cuaderno, panel/señal, concha, balón y estrella de luz vectorial.
- **Naturaleza:** dos familias de árbol, hojas, tallos, coral; estrellas, órbitas y burbujas pertenecen a sus escenarios.
- **6 paletas** cálidas con texto oscuro sobre fondo claro.
- **6 composiciones:** central, lateral, panorámica, diagonal, minimalista y gráfica.
- **4 variantes** de escenario, postura y selección ornamental; espejo y escala según composición. La extensión de puente se incorpora automáticamente como una variante del bosque.
- **Tipografía:** serif para álbum/aventura y sans serif para juvenil; marca discreta y lema estable.

3–5 años usa figuras grandes, expresión visible y menor detalle. 6–8 incorpora exploración y capas. 9–12 añade viñetas, diagonales y elementos secundarios. 13–17 limita las composiciones a minimalista, gráfica y diagonal, con siluetas humanas y tipografía sans serif. No se selecciona una composición de álbum infantil para adolescentes.

No hay iconos médicos en esta primera biblioteca: las siete temáticas de prueba se representan mediante el mundo narrativo. Tampoco hay emojis usados como ilustración.

## 6. Combinaciones

La receta combina composición × 6 paletas × 4 escenarios × 4 posturas × 4 selecciones ornamentales × 2 orientaciones. Son **2.304 recetas** para los perfiles con tres composiciones y **3.072** para los que tienen cuatro, antes de cambiar de mundo, personajes, objetos o título.

No todas las recetas producen dibujos diferentes: por ejemplo, una portada minimalista no usa el escenario de fondo. Una enumeración exhaustiva de una aventura con mapa, brújula y mochila da **1.728 dibujos diferentes en 3–5, 3.072 en 6–8 y 9–12, y 1.680 en 13–17**. Estos recuentos distinguen geometría y texto exactos, no miden diversidad perceptiva ni prometen exclusividad mundial.

## 7. Semilla y almacenamiento

Hash FNV-1a de variables visuales no identificativas; PRNG determinista de 32 bits. La receta guarda versión y seed. `recipeFromSeed(spec, seed)` reproduce la misma geometría con la misma versión del catálogo. SVG y PDF comparten esa geometría.

El motor selecciona entre 96 candidatos y penaliza coincidencias recientes. Una alternativa cambia necesariamente composición, paleta, encuadre y postura respecto a la anterior. Se mantiene la especie y los compañeros de la historia: la diversidad no justifica convertir al protagonista en otro personaje.

Un cuento nuevo no reutiliza ciegamente una receta anterior, incluso con semántica equivalente. La API de restauración permite recuperar la última receta de un perfil visual; una identidad visual puede ser compartida por relatos semánticamente equivalentes. Para recuperar exactamente una portada concreta debe conservarse su seed junto con la especificación en memoria.

`localStorage['fharmacuentos.cover.v1']` contiene **solo números enteros**: hasta 12 semillas recientes y 64 pares clave visual/seed. No contiene edad explícita, estilo explícito, emoción, competencia, nombre, texto, diagnóstico ni metadatos profesionales. Lectura validada y acotada; JSON corrupto, almacenamiento bloqueado o cuota llena no impiden generar. «Limpiar datos» elimina también este historial.

**La app original no permite reabrir cuentos tras recargar.** Se conserva esa privacidad: no se introduce una biblioteca persistente de historias. La portada permanece con el cuento mientras la sesión conserva su estado; la reproducción se ofrece en la API del motor, sin inventar un sistema de guardado del texto.

## 8. PDF e impresión

La portada ocupa la página 1 de un A4 vertical (210 × 297 mm). El cuento y sus apartados empiezan en la página 2, con la maquetación previa. Sin portada, `buildStoryPdf(story)` conserva el formato anterior.

Las curvas Bézier se convierten directamente a comandos PDF. El título es texto seleccionable, nunca una captura ni un raster. La geometría usa un espacio de 840 × 1188 unidades y conversión de 0,25 mm/unidad. No existe límite de resolución ni interpolación al imprimir. Marco a 8 mm del borde, título a 22,5 mm; elementos principales dentro de márgenes.

El SVG de pantalla también mantiene el título como texto. La impresión del navegador aplica A4 y un salto de página tras la portada. El fondo puede llegar al borde del papel: en impresoras sin impresión a sangre quedará el margen físico de la impresora, sin afectar al título ni a la marca.

Se utilizan fuentes estándar del sistema en SVG y las fuentes básicas Times/Helvetica de PDF; no se añaden descargas. Puede haber pequeñas diferencias tipográficas entre sistemas o lectores PDF. El ajuste mide el texto en cada destino.

## 9. Pruebas

Antes de cambios: `npm ci` correcto (0 vulnerabilidades), build y lint correctos. No existía suite de tests.

Después:

- `npm test`: **13 pruebas**, incluyendo 1.200 combinaciones (5 edades × 10 estilos × 24 seeds), geometría finita dentro de A4, 150 variantes consecutivas, restauración, corrupción/cuota de almacenamiento, privacidad, títulos largos, escape XML, diferencia por edad y PDF.
- Huella de regresión del cuento con aleatoriedad controlada: `b55c4d209c605b78816684d57a2edad3fb2a0c47fb6e1055b50c8cbfcb9ff2f4`. Generador y datos narrativos sin cambios.
- `npm run build` y `npm run lint` correctos. Se mantiene el aviso preexistente de Vite sobre el tamaño del bundle. El motor añade aproximadamente 9,5 kB gzip al JS principal; cero nuevas dependencias.
- Chrome real: creación, edición del título español, cambio de portada manteniendo texto, descarga PDF y limpieza. Anchos 375/768/1280 px, sin desbordamiento horizontal.
- **35 muestras**: edades 4, 7, 10, 13 y 16 × adherencia, inhaladores, hospital, enfermedad crónica, autocuidado, miedo al tratamiento y medicación. Datos y títulos sintéticos de prueba; usan las opciones ya existentes, incluida «Otra situación» para inhaladores.
- Comparación visual 4 vs. 16; galería completa inspeccionada. Se corrigió la interpretación de un búho acompañante como protagonista durante la revisión.
- Cero errores JavaScript y **cero solicitudes externas** observadas. Cambio de portada y descarga PDF también correctos con el navegador sin conexión tras cargar la app.
- Composición SVG medida en esta máquina: mediana aproximada **0,3 ms**, máximo observado por debajo de **1 ms** en las 35 muestras. Es tiempo de composición, no tiempo de carga inicial ni garantía de todos los dispositivos.
- PDFs abiertos, extraídos y renderizados para revisar primera página y transición al cuento. Texto español seleccionable; portada sin objetos de imagen raster.

Ejecutar `npm ci && npm test && npm run build && npm run lint`. Para repetir la prueba visual, ejecutar la app local y `node tests/browser-check.mjs` con Playwright instalado en el entorno de QA. Opcionales: `PLAYWRIGHT_MODULE` (ruta a Playwright), `CHROME_PATH`, `APP_URL`, `ARTIFACT_DIR`. Playwright no forma parte de la aplicación ni de sus dependencias.

## 10–12. Confirmaciones expresas

- **No existe ninguna API externa en el funcionamiento del Cover Engine.** Ni generación de imágenes, ni IA, ni backend; el punto de extensión antiguo `aiProvider.ts` permanece inactivo.
- **No existe ningún coste recurrente añadido por esta funcionalidad**, suscripción, clave, cuenta ni servicio de terceros requerido.
- **Los datos del cuento y del paciente no abandonan el navegador a través de esta funcionalidad.** El motor no realiza llamadas de red. La carga inicial descarga los archivos estáticos de la propia aplicación; no transmite texto introducido. Exportar copia el documento al dispositivo del usuario.

## 13. Procedencia y licencias

Todos los trazados del motor se han escrito expresamente para Fharmacuentos como código vectorial original. No se incorpora clipart, fotografías, paquetes de iconos, imágenes remotas ni contenido gráfico de terceros. No requieren atribución a proveedores externos ni pagos.

Se conserva el aviso de derechos de autor del proyecto; no se sustituye por una licencia abierta no autorizada. Las fuentes del motor son referencias a fuentes instaladas y fuentes PDF básicas: no se redistribuyen archivos tipográficos nuevos. Las fuentes Figtree/Fraunces ya presentes en la interfaz quedan intactas y no se usan como archivos nuevos del motor. jsPDF ya era una dependencia; no se añade ni cambia su licencia.

## 14. Limitaciones actuales

- Interpretación semántica por reglas y vocabulario cerrado: no comprende cualquier relato como un modelo de lenguaje. Un mundo narrativo editado radicalmente requiere generar un cuento nuevo; editar el título sí se refleja al instante.
- Los títulos de longitud editorial razonable y los ejemplos largos están probados. Un título de cientos o miles de caracteres terminará con tipografía pequeña para conservar todo el contenido.
- No hay recuperación de historias tras recargar. El historial visual es finito y privado; borrar el almacenamiento elimina las elecciones recordadas. Es posible que dos relatos compartan especificación visual.
- La reproducción exacta exige misma versión de catálogo, especificación y seed. Ampliar o sustituir trazados debe versionar el catálogo si se quiere conservar la reproducción de versiones anteriores.
- Las formas son ilustración vectorial editorial sencilla, no ilustración pintada ni representación literal de cada detalle. Los humanos son figuras ficticias genéricas; no se intenta hacer retratos.
- No se inventa otro protagonista para cumplir la diversidad. Algunas poses de figuras secundarias tienen menos diferencias; recetas distintas no implican siempre imágenes perceptivamente distintas.
- Verificado en Chrome sobre macOS y tamaños móviles emulados. No se ha realizado impresión física ni prueba en Safari/iOS o equipos Android reales.
- No se modifican los avisos de calidad, las limitaciones del generador de cuentos ni el flujo de despliegue preexistentes.

## 15. Ampliación de biblioteca

`registry.ts` descubre automáticamente archivos `assets/variants/*.ts` al compilar. Para incorporar una variante basta **un archivo** con exportación `AssetVariant`, como `forest-bridge.ts`: tipo (`background`, `character`, `object`), destino, slot 0–3 y función de dibujo. No se editan App, pantalla, SVG o exportador PDF. Un slot duplicado falla durante desarrollo para evitar sustituciones silenciosas.

Se usa geometría tipada propia (move, line, cubic, close), no SVG externo arbitrario: así una sola ilustración funciona en pantalla y PDF sin rasterizar ni introducir scripts, imágenes enlazadas o fuentes remotas. Los SVG de autor se pueden convertir a estas primitivas. Para un mundo narrativo completamente nuevo sí hay que extender el catálogo semántico y su tipo, además de sus ilustraciones.

Ampliaciones razonables: nuevas poses, vehículos, paisajes nocturnos y de montaña; familias juveniles con más geometría abstracta; objetos narrativos de viento/vuelo; revisión editorial por ilustrador pediátrico; pruebas visuales automatizadas en WebKit y dispositivos reales. Conservar recursos locales, versionados y con procedencia documentada.
