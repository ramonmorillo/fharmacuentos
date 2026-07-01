interface HeaderProps {
  onGoHome: () => void
  onGoLibrary: () => void
  currentView: string
}

export function Header({ onGoHome, onGoLibrary, currentView }: HeaderProps) {
  return (
    <header className="no-print border-b border-navy-700/80 bg-navy-900/90 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <button
          onClick={onGoHome}
          className="text-left group"
          aria-label="Ir a la pantalla de inicio de FHarmacuentos"
        >
          <span className="block font-display text-2xl font-bold tracking-tight text-white group-hover:text-coral-300 transition-colors">
            FHarmacuentos
          </span>
          <span className="block text-xs sm:text-sm text-navy-300">
            Guía 2026 · Apoyo a la atención farmacéutica pediátrica
          </span>
        </button>
        <nav className="flex items-center gap-1 text-sm">
          <button
            onClick={onGoHome}
            className={`px-3.5 py-1.5 rounded-full transition-colors ${
              currentView === 'welcome'
                ? 'bg-navy-700 text-white'
                : 'text-navy-300 hover:text-white hover:bg-navy-800'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={onGoLibrary}
            className={`px-3.5 py-1.5 rounded-full transition-colors ${
              currentView === 'library'
                ? 'bg-navy-700 text-white'
                : 'text-navy-300 hover:text-white hover:bg-navy-800'
            }`}
          >
            Plantillas
          </button>
        </nav>
      </div>
    </header>
  )
}
