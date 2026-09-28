import { useMemo } from 'react'
import { buildCover, drawingSvg } from './drawing'
import type { CoverState } from './types'

export function CoverPreview({ cover, title }: { cover: CoverState; title: string }) {
  const svg = useMemo(() => drawingSvg(buildCover(cover,title)), [cover,title])
  // All dynamic text is XML-escaped; graphics come exclusively from the local typed catalog.
  return <div className="story-cover" dangerouslySetInnerHTML={{ __html: svg }} />
}
