import { useState } from 'react'
import { AGE_GROUPS, DURATIONS, EMOTIONS, MESSAGES, SITUATIONS, STYLES } from '../data/options'
import type { StoryFormData } from '../types'
import { DisclaimerBanner } from './DisclaimerBanner'

interface StoryFormProps {
  initialData: StoryFormData
  onGenerate: (data: StoryFormData) => void
  onBack: () => void
}

function FieldCard({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-brand-100 p-4 sm:p-5 shadow-sm">
      <h2 className="font-semibold text-brand-800">{title}</h2>
      {hint && <p className="text-sm text-brand-700/70 mt-0.5 mb-3">{hint}</p>}
      <div className={hint ? '' : 'mt-3'}>{children}</div>
    </div>
  )
}

function ChoiceGrid<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string; description?: string }[]
  value: T
  onChange: (id: T) => void
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-2">
      {options.map((opt) => (
        <button
          type="button"
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
            value === opt.id
              ? 'border-brand-500 bg-brand-50 text-brand-800 font-medium'
              : 'border-brand-100 text-brand-700 hover:border-brand-300'
          }`}
        >
          {opt.label}
          {opt.description && <span className="block text-xs text-brand-600/70 mt-0.5">{opt.description}</span>}
        </button>
      ))}
    </div>
  )
}

export function StoryForm({ initialData, onGenerate, onBack }: StoryFormProps) {
  const [data, setData] = useState<StoryFormData>(initialData)
  const [error, setError] = useState<string | null>(null)

  const update = <K extends keyof StoryFormData>(key: K, value: StoryFormData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }))

  const toggleMessage = (id: StoryFormData['messages'][number]) => {
    setData((prev) => ({
      ...prev,
      messages: prev.messages.includes(id) ? prev.messages.filter((m) => m !== id) : [...prev.messages, id],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!data.protagonistName.trim()) {
      setError('Indica un nombre ficticio para el protagonista del cuento.')
      return
    }
    if (data.situation === 'otra' && !data.situationOther.trim()) {
      setError('Describe brevemente la situación en el campo "Otra situación".')
      return
    }
    if (data.emotion === 'otra' && !data.emotionOther.trim()) {
      setError('Describe brevemente la emoción en el campo "Otra emoción".')
      return
    }
    setError(null)
    onGenerate(data)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-900">Crear cuento</h1>
        <button onClick={onBack} className="no-print text-sm text-brand-600 hover:underline">
          ← Volver
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FieldCard title="Edad del paciente">
          <ChoiceGrid options={AGE_GROUPS} value={data.ageGroup} onChange={(v) => update('ageGroup', v)} />
        </FieldCard>

        <FieldCard
          title="Nombre del protagonista"
          hint="Usa un nombre ficticio, no el nombre real del paciente. No incluyas apellidos ni datos identificativos."
        >
          <input
            type="text"
            value={data.protagonistName}
            onChange={(e) => update('protagonistName', e.target.value)}
            placeholder="Por ejemplo: Leo, Nora, Kai..."
            maxLength={40}
            className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </FieldCard>

        <FieldCard title="Situación principal">
          <ChoiceGrid options={SITUATIONS} value={data.situation} onChange={(v) => update('situation', v)} />
          {data.situation === 'otra' && (
            <textarea
              value={data.situationOther}
              onChange={(e) => update('situationOther', e.target.value)}
              placeholder="Describe la situación sin incluir datos identificativos ni clínicos"
              rows={2}
              className="mt-3 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          )}
        </FieldCard>

        <FieldCard title="Emoción principal">
          <ChoiceGrid options={EMOTIONS} value={data.emotion} onChange={(v) => update('emotion', v)} />
          {data.emotion === 'otra' && (
            <input
              type="text"
              value={data.emotionOther}
              onChange={(e) => update('emotionOther', e.target.value)}
              placeholder="Describe la emoción"
              className="mt-3 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          )}
        </FieldCard>

        <FieldCard title="Estilo del cuento">
          <ChoiceGrid options={STYLES} value={data.style} onChange={(v) => update('style', v)} />
        </FieldCard>

        <FieldCard title="Mensaje principal" hint="Puedes seleccionar uno o varios.">
          <div className="flex flex-wrap gap-2">
            {MESSAGES.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => toggleMessage(m.id)}
                className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                  data.messages.includes(m.id)
                    ? 'border-brand-500 bg-brand-50 text-brand-800 font-medium'
                    : 'border-brand-100 text-brand-700 hover:border-brand-300'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </FieldCard>

        <FieldCard title="Duración">
          <div className="grid sm:grid-cols-3 gap-2">
            {DURATIONS.map((d) => (
              <button
                type="button"
                key={d.id}
                onClick={() => update('duration', d.id)}
                className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                  data.duration === d.id
                    ? 'border-brand-500 bg-brand-50 text-brand-800 font-medium'
                    : 'border-brand-100 text-brand-700 hover:border-brand-300'
                }`}
              >
                {d.label}
                <span className="block text-xs text-brand-600/70">{d.words}</span>
              </button>
            ))}
          </div>
        </FieldCard>

        <FieldCard title="Elementos adicionales">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-brand-800">
              <input
                type="checkbox"
                checked={data.includeActivity}
                onChange={(e) => update('includeActivity', e.target.checked)}
                className="rounded border-brand-300 text-brand-600 focus:ring-brand-400"
              />
              Incluir actividad final
            </label>
            <label className="flex items-center gap-2 text-sm text-brand-800">
              <input
                type="checkbox"
                checked={data.includeParentMessage}
                onChange={(e) => update('includeParentMessage', e.target.checked)}
                className="rounded border-brand-300 text-brand-600 focus:ring-brand-400"
              />
              Incluir mensaje para padres/cuidadores
            </label>
          </div>
        </FieldCard>

        <FieldCard
          title="Detalles adicionales (opcional)"
          hint="No incluyas nombres reales, número de historia clínica, fecha de nacimiento ni información clínica sensible (diagnósticos, dosis o pautas)."
        >
          <textarea
            value={data.extraDetails}
            onChange={(e) => update('extraDetails', e.target.value)}
            placeholder="Por ejemplo: le gustan los dinosaurios, tiene un hermano pequeño..."
            rows={3}
            maxLength={300}
            className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </FieldCard>

        <FieldCard title="Modo con IA (próximamente)" hint="Preparado para el futuro, no disponible en esta versión.">
          <label className="flex items-center gap-2 text-sm text-brand-500">
            <input type="checkbox" disabled className="rounded border-brand-200" />
            Generar con inteligencia artificial (requerirá backend propio y no debe recibir datos
            identificativos ni clínicos sensibles)
          </label>
        </FieldCard>

        {error && <DisclaimerBanner text={error} />}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold shadow-sm hover:bg-brand-700 transition-colors"
          >
            Generar cuento
          </button>
        </div>
      </form>
    </div>
  )
}
