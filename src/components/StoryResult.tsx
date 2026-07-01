import { useEffect, useState } from 'react'
import type { GeneratedStory } from '../types'
import { downloadStoryPdf } from '../lib/pdf'
import { DisclaimerBanner } from './DisclaimerBanner'

interface StoryResultProps {
  story: GeneratedStory
  onRegenerate: () => void
  onClear: () => void
  onBackToForm: () => void
}

interface EditableStory {
  title: string
  body: string
  motivationalMessage: string
  activity: string
  familyQuestion: string
  parentMessage: string
}

function toEditable(story: GeneratedStory): EditableStory {
  return {
    title: story.title,
    body: story.paragraphs.join('\n\n'),
    motivationalMessage: story.motivationalMessage,
    activity: story.activity ?? '',
    familyQuestion: story.familyQuestion,
    parentMessage: story.parentMessage ?? '',
  }
}

function toGenerated(editable: EditableStory, disclaimer: string): GeneratedStory {
  return {
    title: editable.title,
    paragraphs: editable.body
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean),
    motivationalMessage: editable.motivationalMessage,
    closing: '',
    activity: editable.activity.trim() || undefined,
    familyQuestion: editable.familyQuestion,
    parentMessage: editable.parentMessage.trim() || undefined,
    disclaimer,
  }
}

function toPlainText(story: GeneratedStory): string {
  const parts = [
    story.title,
    '',
    ...story.paragraphs,
    '',
    'Mensaje motivacional:',
    story.motivationalMessage,
  ]
  if (story.activity) parts.push('', 'Actividad final:', story.activity)
  parts.push('', 'Para comentar en familia:', story.familyQuestion)
  if (story.parentMessage) parts.push('', 'Mensaje para madres, padres o cuidadores:', story.parentMessage)
  parts.push('', story.disclaimer)
  return parts.join('\n')
}

export function StoryResult({ story, onRegenerate, onClear, onBackToForm }: StoryResultProps) {
  const [editable, setEditable] = useState<EditableStory>(() => toEditable(story))
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setEditable(toEditable(story))
  }, [story])

  const update = <K extends keyof EditableStory>(key: K, value: EditableStory[K]) =>
    setEditable((prev) => ({ ...prev, [key]: value }))

  const currentStory = toGenerated(editable, story.disclaimer)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(toPlainText(currentStory))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => window.print()
  const handleDownloadPdf = () => downloadStoryPdf(currentStory)

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="no-print flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-900">Tu cuento</h1>
        <button onClick={onBackToForm} className="text-sm text-brand-600 hover:underline">
          ← Editar formulario
        </button>
      </div>

      <div id="printable-story" className="bg-white rounded-xl border border-brand-100 p-6 sm:p-8 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-brand-500 mb-1">FHarmacuentos</p>
        <h2 className="text-2xl font-bold text-brand-900 mb-4">{currentStory.title}</h2>
        <div className="space-y-3 text-brand-900/90 leading-relaxed">
          {currentStory.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-5 p-3 rounded-lg bg-brand-50 text-brand-800 text-sm italic">
          {currentStory.motivationalMessage}
        </div>
        {currentStory.activity && (
          <div className="mt-4">
            <p className="font-semibold text-brand-800 text-sm">Actividad para comentar o realizar juntos</p>
            <p className="text-sm text-brand-800/90 mt-1">{currentStory.activity}</p>
          </div>
        )}
        <div className="mt-4">
          <p className="font-semibold text-brand-800 text-sm">Para comentar en familia</p>
          <p className="text-sm text-brand-800/90 mt-1">{currentStory.familyQuestion}</p>
        </div>
        {currentStory.parentMessage && (
          <div className="mt-4">
            <p className="font-semibold text-brand-800 text-sm">Mensaje para madres, padres o cuidadores</p>
            <p className="text-sm text-brand-800/90 mt-1">{currentStory.parentMessage}</p>
          </div>
        )}
        <p className="mt-6 text-xs text-brand-600/80 border-t border-brand-100 pt-3">{currentStory.disclaimer}</p>
      </div>

      <div className="no-print mt-4 flex flex-wrap gap-2">
        <button
          onClick={handleCopy}
          className="px-4 py-2 rounded-lg border border-brand-300 text-brand-700 text-sm font-medium hover:bg-brand-50"
        >
          {copied ? 'Copiado ✓' : 'Copiar'}
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-lg border border-brand-300 text-brand-700 text-sm font-medium hover:bg-brand-50"
        >
          Imprimir
        </button>
        <button
          onClick={handleDownloadPdf}
          className="px-4 py-2 rounded-lg border border-brand-300 text-brand-700 text-sm font-medium hover:bg-brand-50"
        >
          Descargar PDF
        </button>
        <button
          onClick={onRegenerate}
          className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
        >
          Generar nueva versión
        </button>
        <button
          onClick={onClear}
          className="px-4 py-2 rounded-lg border border-coral-400 text-coral-500 text-sm font-medium hover:bg-coral-100 ml-auto"
        >
          Limpiar datos
        </button>
      </div>

      <div className="no-print mt-8">
        <h3 className="font-semibold text-brand-800 mb-2">Editar cuento</h3>
        <p className="text-sm text-brand-700/70 mb-3">
          Ajusta el texto libremente antes de entregarlo. Los cambios se reflejan arriba al momento.
        </p>
        <div className="space-y-3">
          <label className="block text-sm">
            <span className="text-brand-700 font-medium">Título</span>
            <input
              type="text"
              value={editable.title}
              onChange={(e) => update('title', e.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </label>
          <label className="block text-sm">
            <span className="text-brand-700 font-medium">Historia</span>
            <textarea
              value={editable.body}
              onChange={(e) => update('body', e.target.value)}
              rows={10}
              className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </label>
          <label className="block text-sm">
            <span className="text-brand-700 font-medium">Mensaje motivacional</span>
            <textarea
              value={editable.motivationalMessage}
              onChange={(e) => update('motivationalMessage', e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </label>
          <label className="block text-sm">
            <span className="text-brand-700 font-medium">Actividad final</span>
            <textarea
              value={editable.activity}
              onChange={(e) => update('activity', e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </label>
          <label className="block text-sm">
            <span className="text-brand-700 font-medium">Pregunta para comentar en familia</span>
            <textarea
              value={editable.familyQuestion}
              onChange={(e) => update('familyQuestion', e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </label>
          <label className="block text-sm">
            <span className="text-brand-700 font-medium">Mensaje para madres, padres o cuidadores</span>
            <textarea
              value={editable.parentMessage}
              onChange={(e) => update('parentMessage', e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </label>
        </div>
      </div>

      <div className="no-print mt-6">
        <DisclaimerBanner text={story.disclaimer} />
      </div>
    </div>
  )
}
