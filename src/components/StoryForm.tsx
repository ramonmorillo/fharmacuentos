import { useState } from 'react'
import { AGE_GROUPS, DURATIONS, EMOTIONS, MESSAGES, PEDAGOGICAL_COMPETENCES, SITUATIONS, STYLES } from '../data/options'
import type { StoryFormData } from '../types'
import { DisclaimerBanner } from './DisclaimerBanner'

interface StoryFormProps {
  initialData: StoryFormData
  onGenerate: (data: StoryFormData) => void
  onBack: () => void
}

function FieldCard({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="bg-navy-800/60 rounded-xl border border-navy-700 p-4 sm:p-5">
      <h2 className="font-semibold text-white">{title}</h2>
      {hint && <p className="text-sm text-navy-300 mt-0.5 mb-3">{hint}</p>}
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
              ? 'border-coral-400 bg-coral-500/10 text-white font-medium'
              : 'border-navy-700 text-navy-200 hover:border-navy-500'
          }`}
        >
          {opt.label}
          {opt.description && <span className="block text-xs text-navy-400 mt-0.5">{opt.description}</span>}
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

  const inputClasses =
    'w-full rounded-lg border border-navy-600 bg-navy-900 text-navy-100 placeholder-navy-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400'

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-white">Crear cuento</h1>
        <button onClick={onBack} className="no-print text-sm text-navy-300 hover:text-white">
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
            className={inputClasses}
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
              className={`mt-3 ${inputClasses}`}
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
              className={`mt-3 ${inputClasses}`}
            />
          )}
        </FieldCard>

        <FieldCard title="Estilo del cuento">
          <ChoiceGrid options={STYLES} value={data.style} onChange={(v) => update('style', v)} />
        </FieldCard>

        <FieldCard title="Competencia que se quiere trabajar" hint="Elige una competencia concreta para que el cuento tenga un foco pedagógico claro.">
          <ChoiceGrid
            options={PEDAGOGICAL_COMPETENCES}
            value={data.pedagogicalCompetence}
            onChange={(v) => update('pedagogicalCompetence', v)}
          />
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
                    ? 'border-coral-400 bg-coral-500/10 text-white font-medium'
                    : 'border-navy-700 text-navy-200 hover:border-navy-500'
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
                    ? 'border-coral-400 bg-coral-500/10 text-white font-medium'
                    : 'border-navy-700 text-navy-200 hover:border-navy-500'
                }`}
              >
                {d.label}
                <span className="block text-xs text-navy-400">{d.words}</span>
              </button>
            ))}
          </div>
        </FieldCard>

        <FieldCard title="Elementos adicionales">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-navy-200">
              <input
                type="checkbox"
                checked={data.includeActivity}
                onChange={(e) => update('includeActivity', e.target.checked)}
                className="rounded border-navy-500 text-coral-500 focus:ring-coral-400"
              />
              Incluir actividad final
            </label>
            <label className="flex items-center gap-2 text-sm text-navy-200">
              <input
                type="checkbox"
                checked={data.includeParentMessage}
                onChange={(e) => update('includeParentMessage', e.target.checked)}
                className="rounded border-navy-500 text-coral-500 focus:ring-coral-400"
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
            className={inputClasses}
          />
        </FieldCard>

        <FieldCard title="Modo con IA (próximamente)" hint="Preparado para el futuro, no disponible en esta versión.">
          <label className="flex items-center gap-2 text-sm text-navy-500">
            <input type="checkbox" disabled className="rounded border-navy-600" />
            Generar con inteligencia artificial (requerirá backend propio y no debe recibir datos
            identificativos ni clínicos sensibles)
          </label>
        </FieldCard>

        {error && <DisclaimerBanner text={error} />}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-coral-500 text-white font-semibold shadow-lg shadow-coral-900/30 hover:bg-coral-600 transition-colors"
          >
            Generar cuento
          </button>
        </div>
      </form>
    </div>
  )
}
