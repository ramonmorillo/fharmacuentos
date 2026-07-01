import { useEffect, useState } from 'react'
import type { GeneratedStory } from '../types'
import { downloadStoryPdf } from '../lib/pdf'
import { DisclaimerBanner } from './DisclaimerBanner'
import { APP_AUTHOR, APP_VERSION } from '../data/appInfo'

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

interface DocumentMeta {
  hospitalName: string
  pharmacistName: string
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

function toPlainText(story: GeneratedStory, meta: DocumentMeta, generatedAt: Date): string {
  const parts = [
    'FHarmacuentos',
    meta.hospitalName.trim() && `Centro: ${meta.hospitalName.trim()}`,
    meta.pharmacistName.trim() && `Farmacéutico/a responsable: ${meta.pharmacistName.trim()}`,
    `Fecha: ${generatedAt.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`,
    '',
    story.title,
    '',
    ...story.paragraphs,
    '',
    'Qué puede trabajar este cuento:',
    story.motivationalMessage,
  ].filter((line): line is string => Boolean(line))
  if (story.activity) parts.push('', 'Actividad:', story.activity)
  parts.push('', 'Pregunta para abrir conversación:', story.familyQuestion)
  if (story.parentMessage) parts.push('', 'Mensaje para madres, padres o cuidadores:', story.parentMessage)
  parts.push('', 'Aviso de uso responsable:', story.disclaimer)
  return parts.join('\n')
}

/** Pequeño motivo decorativo (estrella suave), coherente con la paleta de marca. */
function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2.5c.6 3.7 1.8 5.9 3.5 7.5 1.9 1.7 4 2.7 6 3-2 .3-4.1 1.3-6 3-1.7 1.6-2.9 3.8-3.5 7.5-.6-3.7-1.8-5.9-3.5-7.5-1.9-1.7-4-2.7-6-3 2-.3 4.1-1.3 6-3 1.7-1.6 2.9-3.8 3.5-7.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function StoryResult({ story, onRegenerate, onClear, onBackToForm }: StoryResultProps) {
  const [editable, setEditable] = useState<EditableStory>(() => toEditable(story))
  const [generatedAt, setGeneratedAt] = useState<Date>(() => new Date())
  const [meta, setMeta] = useState<DocumentMeta>({ hospitalName: '', pharmacistName: '' })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setEditable(toEditable(story))
    setGeneratedAt(new Date())
  }, [story])

  const update = <K extends keyof EditableStory>(key: K, value: EditableStory[K]) =>
    setEditable((prev) => ({ ...prev, [key]: value }))

  const updateMeta = <K extends keyof DocumentMeta>(key: K, value: DocumentMeta[K]) =>
    setMeta((prev) => ({ ...prev, [key]: value }))

  const currentStory = toGenerated(editable, story.disclaimer)
  const formattedDate = generatedAt.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const handleCopy = async () => {
    await navigator.clipboard.writeText(toPlainText(currentStory, meta, generatedAt))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => window.print()
  const handleDownloadPdf = () =>
    downloadStoryPdf(currentStory, {
      hospitalName: meta.hospitalName.trim(),
      pharmacistName: meta.pharmacistName.trim(),
      generatedAt,
    })

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="no-print flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-white">Tu cuento</h1>
        <button onClick={onBackToForm} className="text-sm text-navy-300 hover:text-white">
          ← Editar formulario
        </button>
      </div>

      <div
        id="printable-story"
        className="bg-white rounded-2xl border border-brand-100 shadow-2xl shadow-black/40 overflow-hidden"
      >
        {/* Cabecera del documento: centro, profesional y fecha */}
        <div className="bg-brand-700 text-brand-50 px-6 sm:px-8 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SparkleIcon className="w-5 h-5 text-sun-400 shrink-0" />
            <span className="font-bold tracking-tight">FHarmacuentos</span>
          </div>
          <div className="text-right text-xs leading-snug text-brand-100">
            {meta.hospitalName.trim() && <p className="font-medium text-white">{meta.hospitalName.trim()}</p>}
            <p>{formattedDate}</p>
          </div>
        </div>

        {/* El cuento en sí: tarjeta diferenciada, tipo "papel" */}
        <div className="px-6 sm:px-10 py-8 bg-brand-50/40 relative">
          <SparkleIcon className="w-8 h-8 text-brand-200 absolute top-4 right-4 sm:top-6 sm:right-8" />
          <p className="text-xs uppercase tracking-widest text-brand-500 font-semibold mb-2">Cuento</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 mb-5 pr-10">{currentStory.title}</h2>
          <div className="space-y-3 text-brand-900/90 leading-relaxed text-[15px] sm:text-base">
            {currentStory.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        {/* Separador visual entre el cuento y las tareas/acompañamiento */}
        <div className="h-px bg-brand-100" />

        {/* Bloque de acompañamiento: mensaje, actividad, familia */}
        <div className="px-6 sm:px-10 py-6 bg-white space-y-4">
          <p className="text-xs uppercase tracking-widest text-brand-500 font-semibold">
            Acompañamiento de la lectura
          </p>
          <div className="p-3 rounded-lg bg-sun-100 text-brand-900 text-sm italic border border-sun-200">
            {currentStory.motivationalMessage}
          </div>
          {currentStory.activity && (
            <div>
              <p className="font-semibold text-brand-800 text-sm">Actividad</p>
              <p className="text-sm text-brand-800/90 mt-1">{currentStory.activity}</p>
            </div>
          )}
          <div>
            <p className="font-semibold text-brand-800 text-sm">Pregunta para abrir conversación</p>
            <p className="text-sm text-brand-800/90 mt-1">{currentStory.familyQuestion}</p>
          </div>
          {currentStory.parentMessage && (
            <div>
              <p className="font-semibold text-brand-800 text-sm">Mensaje para madres, padres o cuidadores</p>
              <p className="text-sm text-brand-800/90 mt-1">{currentStory.parentMessage}</p>
            </div>
          )}
        </div>

        {/* Pie del documento: profesional responsable y aviso */}
        <div className="px-6 sm:px-10 py-4 bg-brand-50 border-t border-brand-100 text-xs text-brand-700 space-y-2">
          <p>
            Farmacéutico/a responsable:{' '}
            <span className="font-medium">{meta.pharmacistName.trim() || '_______________________'}</span>
          </p>
          <p className="font-semibold text-brand-700">Aviso de uso responsable</p>
          <p className="text-brand-600/90">{currentStory.disclaimer}</p>
        </div>
      </div>

      <div className="no-print mt-4 flex flex-wrap gap-2">
        <button
          onClick={handleCopy}
          className="px-4 py-2 rounded-lg border border-navy-600 text-navy-100 text-sm font-medium hover:bg-navy-800"
        >
          {copied ? 'Copiado ✓' : 'Copiar'}
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-lg border border-navy-600 text-navy-100 text-sm font-medium hover:bg-navy-800"
        >
          Imprimir
        </button>
        <button
          onClick={handleDownloadPdf}
          className="px-4 py-2 rounded-lg border border-navy-600 text-navy-100 text-sm font-medium hover:bg-navy-800"
        >
          Descargar PDF
        </button>
        <button
          onClick={onRegenerate}
          className="px-4 py-2 rounded-lg bg-coral-500 text-white text-sm font-medium hover:bg-coral-600"
        >
          Generar nueva versión
        </button>
        <button
          onClick={onClear}
          className="px-4 py-2 rounded-lg border border-coral-400/60 text-coral-300 text-sm font-medium hover:bg-coral-500/10 ml-auto"
        >
          Limpiar datos
        </button>
      </div>

      <div className="no-print mt-8">
        <h3 className="font-semibold text-white mb-2">Datos del documento (opcional)</h3>
        <p className="text-sm text-navy-300 mb-3">
          Se muestran en la cabecera y el pie del documento imprimible/PDF. No introduzcas datos del
          paciente aquí: son datos del centro y del profesional que entrega el material.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <label className="block text-sm">
            <span className="text-navy-200 font-medium">Hospital o centro</span>
            <input
              type="text"
              value={meta.hospitalName}
              onChange={(e) => updateMeta('hospitalName', e.target.value)}
              placeholder="Por ejemplo: Servicio de Farmacia Hospitalaria"
              className="mt-1 w-full rounded-lg border border-navy-600 bg-navy-900 text-navy-100 placeholder-navy-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400"
            />
          </label>
          <label className="block text-sm">
            <span className="text-navy-200 font-medium">Farmacéutico/a responsable</span>
            <input
              type="text"
              value={meta.pharmacistName}
              onChange={(e) => updateMeta('pharmacistName', e.target.value)}
              placeholder="Nombre de quien entrega el cuento"
              className="mt-1 w-full rounded-lg border border-navy-600 bg-navy-900 text-navy-100 placeholder-navy-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400"
            />
          </label>
        </div>

        <h3 className="font-semibold text-white mb-2">Editar cuento</h3>
        <p className="text-sm text-navy-300 mb-3">
          Ajusta el texto libremente antes de entregarlo. Los cambios se reflejan arriba al momento.
        </p>
        <div className="space-y-3">
          <label className="block text-sm">
            <span className="text-navy-200 font-medium">Título</span>
            <input
              type="text"
              value={editable.title}
              onChange={(e) => update('title', e.target.value)}
              className="mt-1 w-full rounded-lg border border-navy-600 bg-navy-900 text-navy-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400"
            />
          </label>
          <label className="block text-sm">
            <span className="text-navy-200 font-medium">Historia</span>
            <textarea
              value={editable.body}
              onChange={(e) => update('body', e.target.value)}
              rows={10}
              className="mt-1 w-full rounded-lg border border-navy-600 bg-navy-900 text-navy-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400"
            />
          </label>
          <label className="block text-sm">
            <span className="text-navy-200 font-medium">Qué puede trabajar este cuento</span>
            <textarea
              value={editable.motivationalMessage}
              onChange={(e) => update('motivationalMessage', e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-navy-600 bg-navy-900 text-navy-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400"
            />
          </label>
          <label className="block text-sm">
            <span className="text-navy-200 font-medium">Actividad final</span>
            <textarea
              value={editable.activity}
              onChange={(e) => update('activity', e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-navy-600 bg-navy-900 text-navy-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400"
            />
          </label>
          <label className="block text-sm">
            <span className="text-navy-200 font-medium">Pregunta para abrir conversación</span>
            <textarea
              value={editable.familyQuestion}
              onChange={(e) => update('familyQuestion', e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-navy-600 bg-navy-900 text-navy-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400"
            />
          </label>
          <label className="block text-sm">
            <span className="text-navy-200 font-medium">Mensaje para madres, padres o cuidadores</span>
            <textarea
              value={editable.parentMessage}
              onChange={(e) => update('parentMessage', e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-navy-600 bg-navy-900 text-navy-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400"
            />
          </label>
        </div>
      </div>

      <div className="no-print mt-6">
        <DisclaimerBanner text={story.disclaimer} />
      </div>

      <p className="no-print text-center text-[11px] text-navy-500 mt-6">
        FHarmacuentos v{APP_VERSION} · {APP_AUTHOR}
      </p>
    </div>
  )
}
