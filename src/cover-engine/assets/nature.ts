import { ellipse, line, path, transform } from '../geometry'
import type { Palette, Shape } from '../types'

export function leaf(p: Palette, variant = 0): Shape[] {
  return [path('M0 0 C-44 -24 -40 -90 0 -120 C42 -81 40 -30 0 0Z', variant % 2 ? p.mid : p.light), line(0, -8, 0, -95, p.dark, 2)]
}
export function tree(p: Palette, variant = 0): Shape[] {
  if (variant % 2) return [path('M0 -280 L-82 -106 L-43 -106 L-100 -25 L100 -25 L43 -106 L82 -106 Z', p.mid), path('M-9 0 L-5 -240 L5 -240 L9 0Z', p.dark), line(-2, -99, -53, -154, p.dark, 3), line(0, -60, 59, -115, p.dark, 3)]
  return [ellipse(-33, -159, 62, 108, p.mid), ellipse(32, -209, 67, 100, p.mid), ellipse(74, -117, 41, 64, p.light), path('M-10 0 L-3 -266 L6 -266 L11 0Z', p.dark), line(0, -134, -43, -197, p.dark, 3), line(0, -89, 58, -147, p.dark, 3)]
}
export function coral(p: Palette): Shape[] {
  return [path('M-10 0 C-9 -45 -60 -45 -60 -93 L-44 -93 C-44 -65 -18 -62 -9 -44 L-9 -124 L8 -124 L8 -75 C18 -86 33 -97 30 -127 L46 -127 C50 -74 20 -68 9 -50 L9 0Z', p.accent)]
}
export function sprig(p: Palette, variant: number): Shape[] {
  return [line(0, 0, 0, -115, p.dark, 3), ...transform(leaf(p, variant), 0, -18, .33, .4, -47), ...transform(leaf(p, variant + 1), 0, -55, .28, .36, 42)]
}
