import { DisclaimerBanner } from './DisclaimerBanner'

interface WelcomeScreenProps {
  onStart: () => void
  onOpenLibrary: () => void
}

export function WelcomeScreen({ onStart, onOpenLibrary }: WelcomeScreenProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-16">
      <div className="text-center space-y-4">
        <span className="inline-block text-xs font-semibold uppercase tracking-wide text-brand-600 bg-brand-100 px-3 py-1 rounded-full">
          Herramienta de apoyo a la Farmacia Hospitalaria pediátrica
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-900">FHarmacuentos</h1>
        <p className="text-lg text-brand-700">
          Cuentos motivacionales para acompañar la atención farmacéutica pediátrica
        </p>
        <p className="text-brand-800/90 max-w-xl mx-auto">
          FHarmacuentos ayuda a farmacéuticos/as de hospital a crear, en pocos minutos, un cuento breve
          y personalizado para acompañar a un niño, niña o adolescente ante su tratamiento, sus visitas
          al hospital o sus emociones alrededor de la enfermedad. El resultado se adapta a la edad, a la
          situación y al estilo elegidos, y siempre queda en tus manos antes de compartirlo.
        </p>
      </div>

      <div className="mt-8">
        <DisclaimerBanner
          text="Uso responsable: esta herramienta no recoge datos identificativos, no genera indicaciones clínicas y no sustituye la valoración del equipo sanitario. Revisa siempre el cuento generado antes de entregarlo al paciente o a su familia."
        />
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onStart}
          className="px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold shadow-sm hover:bg-brand-700 transition-colors"
        >
          Crear cuento
        </button>
        <button
          onClick={onOpenLibrary}
          className="px-6 py-3 rounded-xl border border-brand-300 text-brand-700 font-semibold hover:bg-brand-50 transition-colors"
        >
          Ver biblioteca de plantillas
        </button>
      </div>

      <div className="mt-12 grid sm:grid-cols-3 gap-4 text-sm">
        <div className="bg-white rounded-xl border border-brand-100 p-4 shadow-sm">
          <p className="font-semibold text-brand-800 mb-1">Adaptado por edad</p>
          <p className="text-brand-700/80">De 3 a 17 años, con lenguaje y extensión propios de cada etapa.</p>
        </div>
        <div className="bg-white rounded-xl border border-brand-100 p-4 shadow-sm">
          <p className="font-semibold text-brand-800 mb-1">Sin datos personales</p>
          <p className="text-brand-700/80">No se piden nombres reales, historias clínicas ni fechas de nacimiento.</p>
        </div>
        <div className="bg-white rounded-xl border border-brand-100 p-4 shadow-sm">
          <p className="font-semibold text-brand-800 mb-1">Listo para imprimir</p>
          <p className="text-brand-700/80">Copia, imprime o descarga en PDF el material para la consulta.</p>
        </div>
      </div>
    </div>
  )
}
