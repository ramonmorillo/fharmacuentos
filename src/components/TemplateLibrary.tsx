import { AGE_GROUPS, SITUATIONS } from '../data/options'
import { STORY_TEMPLATES, type StoryTemplate } from '../data/templates'

interface TemplateLibraryProps {
  onUseTemplate: (template: StoryTemplate) => void
  onBack: () => void
}

export function TemplateLibrary({ onUseTemplate, onBack }: TemplateLibraryProps) {
  const ageLabel = (id: string) => AGE_GROUPS.find((a) => a.id === id)?.label ?? id
  const situationLabel = (id: string) => SITUATIONS.find((s) => s.id === id)?.label ?? id

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Biblioteca de plantillas</h1>
          <p className="text-navy-300 text-sm mt-1">
            Puntos de partida ya pensados para situaciones frecuentes. Al elegir una, se precargan la
            edad, la situación y el estilo en el formulario, y podrás ajustar el resto.
          </p>
        </div>
        <button onClick={onBack} className="no-print text-sm text-navy-300 hover:text-white whitespace-nowrap">
          ← Volver
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {STORY_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className="bg-navy-800/60 rounded-xl border border-navy-700 p-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="font-semibold text-white">{template.title}</h2>
              <p className="text-sm text-navy-300 mt-1">{template.description}</p>
              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                <span className="bg-navy-700 text-navy-200 px-2 py-1 rounded-full">
                  {ageLabel(template.ageGroup)}
                </span>
                <span className="bg-navy-700 text-navy-200 px-2 py-1 rounded-full">
                  {situationLabel(template.situation)}
                </span>
              </div>
            </div>
            <button
              onClick={() => onUseTemplate(template)}
              className="mt-4 self-start px-4 py-2 rounded-lg bg-coral-500 text-white text-sm font-medium hover:bg-coral-600 transition-colors"
            >
              Usar esta plantilla
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
