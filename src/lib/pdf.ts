import { jsPDF } from 'jspdf'
import type { GeneratedStory } from '../types'

const MARGIN = 20
const PAGE_WIDTH = 210
const MAX_WIDTH = PAGE_WIDTH - MARGIN * 2
const LINE_HEIGHT = 6.5

export function downloadStoryPdf(story: GeneratedStory) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let y = MARGIN

  const addText = (text: string, fontSize: number, style: 'normal' | 'bold' | 'italic' = 'normal', gap = 4) => {
    doc.setFont('helvetica', style)
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(text, MAX_WIDTH)
    for (const line of lines) {
      if (y > 297 - MARGIN) {
        doc.addPage()
        y = MARGIN
      }
      doc.text(line, MARGIN, y)
      y += LINE_HEIGHT
    }
    y += gap
  }

  addText('FHarmacuentos', 11, 'bold', 2)
  addText(story.title, 18, 'bold', 6)

  for (const paragraph of story.paragraphs) {
    addText(paragraph, 12, 'normal', 4)
  }

  addText('Mensaje motivacional', 13, 'bold', 2)
  addText(story.motivationalMessage, 12, 'italic', 6)

  if (story.activity) {
    addText('Actividad para comentar o realizar juntos', 13, 'bold', 2)
    addText(story.activity, 12, 'normal', 6)
  }

  addText('Para comentar en familia', 13, 'bold', 2)
  addText(story.familyQuestion, 12, 'normal', 6)

  if (story.parentMessage) {
    addText('Mensaje para madres, padres o cuidadores', 13, 'bold', 2)
    addText(story.parentMessage, 12, 'normal', 6)
  }

  addText(story.disclaimer, 9, 'italic', 0)

  const safeTitle = story.title.toLowerCase().replace(/[^a-z0-9áéíóúñü\s-]/gi, '').trim().replace(/\s+/g, '-')
  doc.save(`fharmacuentos-${safeTitle || 'cuento'}.pdf`)
}
