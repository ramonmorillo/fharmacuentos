import { background, character, object } from './registry'
import { OBJECTS } from './assets/objects'
import { leaf } from './assets/nature'
import { CHARACTER_LABELS, PALETTES, SETTING_LABELS } from './catalog'
import { ellipse, line, path, rect, transform } from './geometry'
import type { CoverDrawing, CoverState, CoverText, Shape } from './types'

export type MeasureText = (text: string, size: number, font: 'serif' | 'sans', bold: boolean) => number
let context: CanvasRenderingContext2D | null | undefined
export const measureText: MeasureText = (text, size, font, bold) => {
  if (context === undefined) context = typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d')
  if (context) {
    context.font = `${bold ? 'bold' : 'normal'} ${size}px ${font === 'serif' ? '"Times New Roman", Times, serif' : 'Arial, Helvetica, sans-serif'}`
    return context.measureText(text).width
  }
  // Only for headless unit tests; browser and PDF use actual font metrics.
  return Array.from(text).reduce((sum, c) => sum + (/[ilI.,!\s]/u.test(c) ? .3 : /[MWÁÉÓÚÑ]/u.test(c) ? .85 : .57), 0) * size
}
function wrap(text: string, size: number, width: number, font: 'serif' | 'sans', measure: MeasureText): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of text.trim().split(/\s+/u)) {
    if (measure(`${line}${line ? ' ' : ''}${word}`, size, font, true) <= width) { line += `${line ? ' ' : ''}${word}`; continue }
    if (line) { lines.push(line); line = '' }
    for (const char of Array.from(word)) {
      if (line && measure(line + char, size, font, true) > width) { lines.push(line); line = '' }
      line += char
    }
  }
  if (line) lines.push(line)
  return lines
}
export function titleLayout(title: string, box: { x: number; y: number; width: number; height: number }, mature: boolean, color: string, measure = measureText): CoverText[] {
  const font = mature ? 'sans' : 'serif'
  const content = title.trim() || 'Una historia por descubrir'
  let size = mature ? 66 : 70
  let lines = wrap(content, size, box.width, font, measure)
  // No truncation. For pathological book-length titles, reduce proportionally as well.
  while (size > 1 && lines.length * size * 1.12 > box.height) { size = Math.max(1, size - 1); lines = wrap(content, size, box.width, font, measure) }
  return lines.map((text, i) => ({ text, x: box.x, y: box.y + size * .8 + i * size * 1.12, size, color, font, bold: true, width: box.width }))
}
export function buildCover(state: CoverState, title: string, measure = measureText): CoverDrawing {
  const { spec, recipe: r } = state, p = PALETTES[r.palette]
  const mature = spec.coverStyle === 'young', simple = spec.coverStyle === 'album'
  const minimal = r.composition === 'minimal', lateral = r.composition === 'lateral', panorama = r.composition === 'panorama'
  const graphic = r.composition === 'graphic', diagonal = r.composition === 'diagonal'
  const shapes: Shape[] = [rect(0,0,840,1188,p.paper), rect(32,32,776,1124,'none',p.ink,1)]
  const titleBox = { x: 90, y: mature ? 133 : 126, width: lateral ? 510 : 660, height: 264 }
  if (lateral) shapes.push(...transform(OBJECTS.star(p),716,177,.42))
  const texts: CoverText[] = [
    { text: simple ? 'UNA PEQUEÑA GRAN HISTORIA' : mature ? 'HISTORIAS CON VOZ PROPIA' : 'UN MUNDO POR DESCUBRIR', x:90, y:85, size:13, color:p.ink, font:'sans', bold:true, width:660 },
    ...titleLayout(title,titleBox,mature,p.ink,measure),
    { text:'Fharmacuentos', x:90, y:1092, size:22, color:p.ink, font:'serif', bold:true, width:660 },
    { text:'Historias para entender, aprender y cuidarse', x:90, y:1120, size:13, color:p.ink, font:'sans', bold:false, width:660 },
  ]
  shapes.push(line(90,1048,750,1048,p.ink,1))
  const objectId = spec.objects[r.ornament % spec.objects.length]
  if (minimal) {
    shapes.push(ellipse(425,701,248,248,p.light),ellipse(425,701,222,222,'none',p.ink,1))
    shapes.push(...transform(object(objectId,p,r.ornament,mature),425,690,2.15,2.15,r.mirror ? -12 : 12))
    shapes.push(path('M90 944 L282 944 L347 899 L544 899 L617 947 L750 947','none',p.accent,5))
    shapes.push(...transform(character(spec.protagonist,p,r.pose,true),658,944,.66))
    shapes.push(rect(90,444,8,94,p.accent),line(116,444,173,444,p.ink,2))
  } else {
    const sceneY = graphic ? 441 : 457
    shapes.push(...transform(background(spec.setting,p,r.scenery,simple),80,sceneY,1))
    if (graphic) {
      shapes.push(rect(80,sceneY,680,560,'none',p.ink,3),line(80,sceneY+174,760,sceneY+174,p.paper,7))
    }
    const heroX = lateral ? 563 : panorama ? 277 : diagonal ? 543 : 414
    const heroY = panorama ? 953 : 977
    const scale = simple ? 1.65 : mature ? 1.24 : panorama ? 1.2 : 1.4
    shapes.push(...transform(character(spec.protagonist,p,r.pose,mature),heroX,heroY,r.mirror ? -scale : scale,scale,diagonal ? -8 : 0))
    const objX = lateral || diagonal ? 251 : panorama ? 598 : 156
    const objY = panorama ? 825 : 807
    shapes.push(...transform(object(objectId,p,r.ornament,mature),objX,objY,simple ? .67 : .85,simple ? .67 : .85,r.mirror ? 12 : -12))
    if (spec.companion && spec.companion !== spec.protagonist) shapes.push(...transform(character(spec.companion,p,r.pose,mature),lateral ? 393 : 624,972,simple ? .64 : .7))
    if (!simple && spec.setting === 'forest') shapes.push(...transform(leaf(p,r.ornament),126,997,.55,.62,-25),...transform(leaf(p,r.ornament+1),714,996,.6,.7,30))
  }
  // Collection mark is geometry, never an emoji or an externally loaded image.
  shapes.push(...transform(OBJECTS.star(p),732,1092,.18))
  return { shapes, texts, description: `Portada ilustrada: ${SETTING_LABELS[spec.setting]}, ${CHARACTER_LABELS[spec.protagonist]}${spec.companion ? ` y ${CHARACTER_LABELS[spec.companion]}` : ''}.` }
}
export function escapeXml(value: string) { return value.replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&apos;' })[c]!) }
export function drawingSvg(drawing: CoverDrawing): string {
  const shapes = drawing.shapes.map((s) => `<path d="${s.ops.map(({op,c})=>`${op === 'h' ? 'Z' : op.toUpperCase()}${c.map((n)=>Number(n.toFixed(3))).join(' ')}`).join(' ')}" fill="${s.fill}"${s.stroke ? ` stroke="${s.stroke}" stroke-width="${s.width}" stroke-linejoin="round" stroke-linecap="round"` : ''}/>`).join('')
  const texts = drawing.texts.map((t) => `<text x="${t.x}" y="${t.y}" font-size="${t.size}" font-family="${t.font === 'serif' ? 'Times New Roman,Times,serif' : 'Arial,Helvetica,sans-serif'}" font-weight="${t.bold ? 700 : 400}" fill="${t.color}">${escapeXml(t.text)}</text>`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 1188" width="840" height="1188" role="img" aria-label="${escapeXml(drawing.description)}"><title>${escapeXml(drawing.description)}</title>${shapes}${texts}</svg>`
}
