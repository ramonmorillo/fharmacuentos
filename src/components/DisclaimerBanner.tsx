interface DisclaimerBannerProps {
  text: string
  tone?: 'info' | 'warning'
}

export function DisclaimerBanner({ text, tone = 'warning' }: DisclaimerBannerProps) {
  const styles =
    tone === 'warning'
      ? 'bg-sun-100 border-sun-400 text-brand-900'
      : 'bg-brand-50 border-brand-200 text-brand-800'
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles}`} role="note">
      {text}
    </div>
  )
}
