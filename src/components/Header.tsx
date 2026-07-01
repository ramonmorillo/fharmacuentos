interface HeaderProps {
  onGoHome: () => void
  onGoLibrary: () => void
  currentView: string
}

export function Header({ onGoHome, onGoLibrary, currentView }: HeaderProps) {
  return (
    <header className="no-print border-b border-brand-100 bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <button
          onClick={onGoHome}
          className="text-left group"
          aria-label="Ir a la pantalla de inicio de FHarmacuentos"
        >
          <span className="block text-2xl font-bold tracking-tight text-brand-700 group-hover:text-brand-600">
            FHarmacuentos
          </span>
          <span className="block text-xs sm:text-sm text-brand-600/80">
            Cuentos motivacionales para acompañar la atención farmacéutica pediátrica
          </span>
        </button>
        <nav className="flex items-center gap-2 text-sm">
          <button
            onClick={onGoHome}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              currentView === 'welcome' ? 'bg-brand-600 text-white' : 'text-brand-700 hover:bg-brand-50'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={onGoLibrary}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              currentView === 'library' ? 'bg-brand-600 text-white' : 'text-brand-700 hover:bg-brand-50'
            }`}
          >
            Plantillas
          </button>
        </nav>
      </div>
    </header>
  )
}
