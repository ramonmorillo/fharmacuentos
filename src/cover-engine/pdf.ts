import type { jsPDF } from 'jspdf'
import { buildCover, type MeasureText } from './drawing'
import type { CoverState } from './types'

/** No screenshots: all curves and title glyphs are native PDF vectors. A4, 4 units/mm. */
export function drawCoverPdf(doc: jsPDF, cover: CoverState, title: string) {
  const mm = .25, points = 72 / 25.4 * mm
  const measure: MeasureText = (text,size,font,bold) => {
    doc.setFont(font === 'serif' ? 'times' : 'helvetica',bold ? 'bold' : 'normal')
    doc.setFontSize(size * points)
    return doc.getTextWidth(text) / mm
  }
  const drawing = buildCover(cover,title,measure)
  doc.saveGraphicsState()
  doc.setLineJoin('round')
  doc.setLineCap('round')
  for (const shape of drawing.shapes) {
    if (shape.fill !== 'none') doc.setFillColor(shape.fill)
    if (shape.stroke) { doc.setDrawColor(shape.stroke); doc.setLineWidth((shape.width ?? 2)*mm) }
    doc.path(shape.ops.map(({ op, c }) => ({ op, c: c.map((v) => v*mm) })))
    if (shape.fill !== 'none' && shape.stroke) doc.fillStroke()
    else if (shape.stroke) doc.stroke()
    else doc.fill()
  }
  for (const t of drawing.texts) {
    doc.setFont(t.font === 'serif' ? 'times' : 'helvetica',t.bold ? 'bold' : 'normal')
    doc.setFontSize(t.size * points)
    doc.setTextColor(t.color)
    doc.text(t.text,t.x*mm,t.y*mm)
  }
  doc.restoreGraphicsState()
}
