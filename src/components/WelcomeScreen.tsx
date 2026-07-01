import { DisclaimerBanner } from './DisclaimerBanner'

interface WelcomeScreenProps {
  onStart: () => void
  onOpenLibrary: () => void
}

const PILLARS = [
  {
    color: 'bg-brand-400',
    label: 'ADAPTADO POR EDAD',
    labelColor: 'text-brand-300',
    text: 'De 3 a 17 años, con lenguaje y extensión propios de cada etapa evolutiva.',
  },
  {
    color: 'bg-sun-400',
    label: 'SIN DATOS PERSONALES',
    labelColor: 'text-sun-300',
    text: 'No se piden nombres reales, historias clínicas ni fechas de nacimiento.',
  },
  {
    color: 'bg-coral-400',
    label: 'LISTO PARA IMPRIMIR',
    labelColor: 'text-coral-300',
    text: 'Copia, imprime o descarga en PDF un material profesional para la consulta.',
  },
]

export function WelcomeScreen({ onStart, onOpenLibrary }: WelcomeScreenProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20">
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-navy-300 mb-6">
            <span className="inline-block w-6 h-px bg-coral-400" />
            HERRAMIENTA DE APOYO PROFESIONAL · FHARMACUENTOS · 2026
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-[1.1] mb-6">
            Cuentos que acompañan
            <br />
            la atención farmacéutica
            <br />
            <span className="text-coral-400">pediátrica</span>
          </h1>

          <p className="text-navy-200 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
            FHarmacuentos ayuda a farmacéuticos/as de hospital a crear, en pocos minutos, un cuento
            breve y personalizado para acompañar a un niño, niña o adolescente ante su tratamiento,
            sus visitas al hospital o sus emociones alrededor de la enfermedad.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <button
              onClick={onStart}
              className="px-6 py-3 rounded-xl bg-coral-500 text-white font-semibold shadow-lg shadow-coral-900/30 hover:bg-coral-600 transition-colors"
            >
              Crear cuento
            </button>
            <button
              onClick={onOpenLibrary}
              className="px-6 py-3 rounded-xl border border-navy-500 text-navy-100 font-semibold hover:bg-navy-800 hover:border-navy-400 transition-colors"
            >
              Ver biblioteca de plantillas
            </button>
          </div>

          <DisclaimerBanner text="Uso responsable: esta herramienta no recoge datos identificativos, no genera indicaciones clínicas y no sustituye la valoración del equipo sanitario. Revisa siempre el cuento generado antes de entregarlo al paciente o a su familia." />
        </div>

        <div className="bg-navy-800/60 border border-navy-700 rounded-2xl p-5 sm:p-6">
          <p className="text-xs font-semibold tracking-widest text-navy-400 mb-4">
            POR QUÉ FHARMACUENTOS — TRES PRINCIPIOS
          </p>
          <div className="space-y-3">
            {PILLARS.map((pillar) => (
              <div key={pillar.label} className="bg-navy-800 border border-navy-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`w-2 h-2 rounded-full ${pillar.color}`} />
                  <p className={`text-xs font-bold tracking-wide ${pillar.labelColor}`}>{pillar.label}</p>
                </div>
                <p className="text-sm text-navy-200 leading-relaxed">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
