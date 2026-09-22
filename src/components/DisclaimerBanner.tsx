interface DisclaimerBannerProps {
  text: string
  tone?: 'info' | 'warning' | 'alert'
  /** Lista opcional de puntos concretos a mostrar bajo el texto principal. */
  items?: string[]
}

export function DisclaimerBanner({ text, tone = 'warning', items }: DisclaimerBannerProps) {
  const styles =
    tone === 'alert'
      ? 'bg-navy-800 border-coral-400/60 text-coral-200'
      : tone === 'warning'
        ? 'bg-navy-800 border-sun-400/40 text-sun-200'
        : 'bg-navy-800 border-navy-600 text-navy-200'
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles}`} role="note">
      <p>{text}</p>
      {items && items.length > 0 && (
        <ul className="mt-2 list-disc list-inside space-y-0.5">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
