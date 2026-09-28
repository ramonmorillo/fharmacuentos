import type { AssetVariant } from '../../registry'
import { BACKGROUNDS } from '../backgrounds'
import { line, path } from '../../geometry'

/** First extension: one authored file adds a bridge framing, shared by SVG and PDF. */
export default {
  kind: 'background', target: 'forest', slot: 3,
  draw: (p, variant, simple) => [
    ...BACKGROUNDS.forest(p,variant,simple),
    path('M292 410 C339 385 400 385 453 410 L453 428 C400 403 339 403 292 428Z',p.dark),
    path('M292 391 C339 366 400 366 453 391','none',p.dark,4),
    ...[300,330,363,396,445].map((x,i)=>line(x,390-(i===0||i===4?0:12),x,413-(i===0||i===4?0:12),p.dark,3)),
  ],
} satisfies AssetVariant
