# Auditoría previa — 28 de septiembre de 2026

Repositorio: ramonmorillo/fharmacuentos. Rama de origen: `claude/fharmacuentos-tool-design-p7nt3r`.

- Aplicación estática React 19, TypeScript, Vite 8 y Tailwind 4; tipografías autoalojadas. No hay backend, base de datos, servicio de imágenes ni llamadas de red en `src`.
- `App.tsx` mantiene formulario, cuento y pantalla en memoria. `generateStory` es síncrono; combina `STYLE_WORLDS`, `STYLE_ELEMENTS`, variantes de escenas y competencias educativas. Aplica sanitización y hasta tres intentos de validación. No se cambiará ese flujo.
- Ya existen edad por intervalos (3–5, 6–8, 9–12, 13–15 y 16–17), estilo, emoción, situación, competencia, mensajes, duración y pseudónimo. No hacen falta nuevos campos. El texto generado permite reconocer objetos y compañeros narrativos concretos.
- `StoryResult` mantiene una copia editable, centro/profesional y fecha en memoria. Copiar usa texto plano. Imprimir usa CSS; descargar usa `src/lib/pdf.ts` con jsPDF y texto seleccionable. Se antepondrá una página al PDF y al documento imprimible.
- No existe recuperación de cuentos tras recargar ni almacenamiento de cuentos. El motor conservará este contrato: únicamente recetas visuales y semillas acotadas en localStorage; ningún formulario, texto, pseudónimo, diagnóstico, emoción o competencia persistirá allí.
- `aiProvider.ts` es un punto de extensión inactivo que lanza un error; no está conectado y no se tocará.
- El generador siempre devuelve las secciones educativas; respetaremos el comportamiento actual, incluidos avisos de calidad y edición.
- No hay tests ni script `test` en el repositorio. Referencia previa: `npm ci` (0 vulnerabilidades), `npm run build` y `npm run lint` correctos. Vite ya avisa de un chunk >500 kB.
- El workflow publica en push a `main`, aunque la rama predeterminada es distinta. No se modificarán despliegues ni ramas de producción.

## Integración prevista

Módulo `src/cover-engine`: especificación semántica efímera, catálogo, PRNG determinista, historial visual defensivo, primitivas geométricas propias, composiciones y renderizadores SVG/PDF. El cuento original no se modifica. Estado de portada asociado en App; botón de variante independiente en StoryResult. PDF vectorial sin librerías nuevas. Pruebas de los cinco intervalos, diez estilos, siete temas solicitados, título largo, datos privados, historia inmutable y variantes reproducibles.
