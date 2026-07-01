interface DisclaimerBannerProps {
  text: string
  tone?: 'info' | 'warning'
}

export function DisclaimerBanner({ text, tone = 'warning' }: DisclaimerBannerProps) {
  const styles =
    tone === 'warning'
      ? 'bg-navy-800 border-sun-400/40 text-sun-200'
      : 'bg-navy-800 border-navy-600 text-navy-200'
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles}`} role="note">
      {text}
    </div>
  )
}
