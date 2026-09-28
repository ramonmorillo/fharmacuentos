import type { Op, Shape } from './types'

/** Deliberately small common vector vocabulary: move, line, cubic Bézier, close. */
export function path(d: string, fill: string, stroke?: string, width = 2): Shape {
  const tokens = d.match(/[MLCZ]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? []
  const ops: Op[] = []
  for (let i = 0; i < tokens.length;) {
    const command = tokens[i++].toUpperCase()
    const n = command === 'C' ? 6 : command === 'Z' ? 0 : 2
    const c = tokens.slice(i, i + n).map(Number)
    if (!['M', 'L', 'C', 'Z'].includes(command) || c.some((v) => !Number.isFinite(v))) throw new Error('Invalid local vector path')
    ops.push({ op: ({ M: 'm', L: 'l', C: 'c', Z: 'h' } as const)[command as 'M'], c })
    i += n
  }
  return { ops, fill, stroke, width }
}
export function rect(x: number, y: number, w: number, h: number, fill: string, stroke?: string, width = 2): Shape {
  return path(`M${x} ${y} L${x+w} ${y} L${x+w} ${y+h} L${x} ${y+h} Z`, fill, stroke, width)
}
export function ellipse(x: number, y: number, rx: number, ry: number, fill: string, stroke?: string, width = 2): Shape {
  const k = .55228475
  return path(`M${x-rx} ${y} C${x-rx} ${y-ry*k} ${x-rx*k} ${y-ry} ${x} ${y-ry} C${x+rx*k} ${y-ry} ${x+rx} ${y-ry*k} ${x+rx} ${y} C${x+rx} ${y+ry*k} ${x+rx*k} ${y+ry} ${x} ${y+ry} C${x-rx*k} ${y+ry} ${x-rx} ${y+ry*k} ${x-rx} ${y} Z`, fill, stroke, width)
}
export function transform(shapes: Shape[], x: number, y: number, sx = 1, sy = sx, angle = 0): Shape[] {
  const r = angle * Math.PI / 180, co = Math.cos(r), si = Math.sin(r)
  return shapes.map((shape) => ({ ...shape, width: (shape.width ?? 2) * Math.sqrt(Math.abs(sx * sy)), ops: shape.ops.map(({ op, c }) => {
    const points: number[] = []
    for (let i = 0; i < c.length; i += 2) points.push(x + c[i] * sx * co - c[i+1] * sy * si, y + c[i] * sx * si + c[i+1] * sy * co)
    return { op, c: points }
  }) }))
}
export function line(x: number, y: number, x2: number, y2: number, stroke: string, width = 2) { return path(`M${x} ${y} L${x2} ${y2}`, 'none', stroke, width) }
