import { useState } from 'react'
import { Header } from './components/Header'
import { WelcomeScreen } from './components/WelcomeScreen'
import { TemplateLibrary } from './components/TemplateLibrary'
import { StoryForm } from './components/StoryForm'
import { StoryResult } from './components/StoryResult'
import { createDefaultFormData } from './data/defaultFormData'
import { generateStory } from './lib/generator'
import type { StoryTemplate } from './data/templates'
import type { GeneratedStory, StoryFormData } from './types'

type View = 'welcome' | 'library' | 'form' | 'result'

function App() {
  const [view, setView] = useState<View>('welcome')
  const [formData, setFormData] = useState<StoryFormData>(createDefaultFormData)
  const [story, setStory] = useState<GeneratedStory | null>(null)

  const handleUseTemplate = (template: StoryTemplate) => {
    setFormData((prev) => ({
      ...prev,
      ageGroup: template.ageGroup,
      situation: template.situation,
      style: template.style,
    }))
    setView('form')
  }

  const handleGenerate = (data: StoryFormData) => {
    setFormData(data)
    setStory(generateStory(data))
    setView('result')
  }

  const handleRegenerate = () => {
    setStory(generateStory(formData))
  }

  const handleClear = () => {
    setFormData(createDefaultFormData())
    setStory(null)
    setView('welcome')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        currentView={view}
        onGoHome={() => setView('welcome')}
        onGoLibrary={() => setView('library')}
      />
      <main className="flex-1">
        {view === 'welcome' && (
          <WelcomeScreen onStart={() => setView('form')} onOpenLibrary={() => setView('library')} />
        )}
        {view === 'library' && (
          <TemplateLibrary onUseTemplate={handleUseTemplate} onBack={() => setView('welcome')} />
        )}
        {view === 'form' && (
          <StoryForm initialData={formData} onGenerate={handleGenerate} onBack={() => setView('welcome')} />
        )}
        {view === 'result' && story && (
          <StoryResult
            story={story}
            onRegenerate={handleRegenerate}
            onClear={handleClear}
            onBackToForm={() => setView('form')}
          />
        )}
      </main>
      <footer className="no-print text-center text-xs text-brand-600/70 py-6">
        FHarmacuentos no almacena datos en servidor. Toda la información introducida se pierde al recargar
        o limpiar la página.
      </footer>
    </div>
  )
}

export default App
