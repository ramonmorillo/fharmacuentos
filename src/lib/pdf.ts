import { jsPDF } from 'jspdf'
import type { GeneratedStory } from '../types'

const MARGIN = 20
const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const MAX_WIDTH = PAGE_WIDTH - MARGIN * 2
const LINE_HEIGHT = 6.5

export interface PdfDocumentMeta {
  hospitalName?: string
  pharmacistName?: string
  generatedAt?: Date
}

export function downloadStoryPdf(story: GeneratedStory, meta: PdfDocumentMeta = {}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let y = MARGIN

  const ensureSpace = (needed: number) => {
    if (y + needed > PAGE_HEIGHT - MARGIN) {
      doc.addPage()
      y = MARGIN
    }
  }

  const addText = (text: string, fontSize: number, style: 'normal' | 'bold' | 'italic' = 'normal', gap = 4) => {
    doc.setFont('helvetica', style)
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(text, MAX_WIDTH)
    for (const line of lines) {
      ensureSpace(LINE_HEIGHT)
      doc.text(line, MARGIN, y)
      y += LINE_HEIGHT
    }
    y += gap
  }

  const addDivider = (gap = 5) => {
    ensureSpace(gap)
    doc.setDrawColor(200, 210, 208)
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y)
    y += gap
  }

  const generatedAt = meta.generatedAt ?? new Date()
  const formattedDate = generatedAt.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Cabecera del documento
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(47, 116, 106)
  doc.text('FHarmacuentos', MARGIN, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(90, 90, 90)
  doc.text(formattedDate, PAGE_WIDTH - MARGIN, y, { align: 'right' })
  y += 5
  if (meta.hospitalName) {
    doc.text(meta.hospitalName, PAGE_WIDTH - MARGIN, y, { align: 'right' })
    y += 5
  }
  doc.setTextColor(20, 20, 20)
  y += 4
  addDivider(6)

  // El cuento en sí
  addText('CUENTO', 9, 'bold', 1)
  addText(story.title, 18, 'bold', 6)
  for (const paragraph of story.paragraphs) {
    addText(paragraph, 12, 'normal', 4)
  }

  addDivider(6)

  // Bloque de acompañamiento (separado visualmente del cuento)
  addText('ACOMPAÑAMIENTO DE LA LECTURA', 9, 'bold', 3)
  addText('Qué puede trabajar este cuento', 11, 'bold', 1)
  addText(story.motivationalMessage, 12, 'italic', 5)

  if (story.activity) {
    addText('Actividad', 11, 'bold', 1)
    addText(story.activity, 11, 'normal', 4)
  }

  addText('Pregunta para abrir conversación', 11, 'bold', 1)
  addText(story.familyQuestion, 11, 'normal', 4)

  if (story.parentMessage) {
    addText('Mensaje para madres, padres o cuidadores', 11, 'bold', 1)
    addText(story.parentMessage, 11, 'normal', 4)
  }

  addDivider(6)

  // Pie: profesional responsable y aviso
  addText(`Farmacéutico/a responsable: ${meta.pharmacistName || '_______________________'}`, 10, 'normal', 4)
  addText('Aviso de uso responsable', 10, 'bold', 1)
  addText(story.disclaimer, 9, 'italic', 0)

  const safeTitle = story.title.toLowerCase().replace(/[^a-z0-9áéíóúñü\s-]/gi, '').trim().replace(/\s+/g, '-')
  doc.save(`fharmacuentos-${safeTitle || 'cuento'}.pdf`)
}
