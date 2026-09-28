import { ellipse, line, path, rect } from '../geometry'
import type { ObjectId, Palette, Shape } from '../types'

type Drawing = (p: Palette) => Shape[]
export const OBJECTS: Record<ObjectId, Drawing> = {
  map: (p) => [path('M-75 -58 L-26 -72 L23 -54 L72 -71 L72 56 L23 73 L-26 55 L-75 72Z', p.paper, p.dark, 3), line(-26,-72,-26,55,p.light,2), line(23,-54,23,73,p.light,2), path('M-53 35 C-21 49 -32 -21 4 -12 C40 0 14 38 49 -25', 'none', p.accent, 4), ellipse(-53,35,5,5,p.dark), path('M40 -34 L57 -17 M57 -34 L40 -17', 'none', p.dark, 4)],
  compass: (p) => [ellipse(0,0,63,63,p.sun), ellipse(0,0,53,53,p.paper,p.dark,2), path('M0 -42 L14 0 L0 42 L-14 0Z',p.dark),path('M0 -42 L14 0 L0 0Z',p.accent),ellipse(0,0,5,5,p.paper),line(-44,0,-34,0,p.dark,2),line(34,0,44,0,p.dark,2)],
  backpack: (p) => [path('M-20 -50 C-27 -91 27 -91 20 -50', 'none',p.dark,8),path('M-51 -37 C-51 -73 51 -73 51 -37 L56 60 L-56 60Z',p.accent),rect(-35,1,70,43,p.sun),line(-35,10,35,10,p.dark,3),line(-34,-34,34,-34,p.paper,3)],
  door: (p) => [path('M-56 80 L-56 -26 C-56 -104 56 -104 56 -26 L56 80Z',p.dark),path('M-43 80 L-43 -24 C-43 -82 43 -82 43 -24 L43 80Z',p.sun),path('M-43 80 L-43 -23 C-43 -62 -19 -76 2 -68 L2 80Z',p.accent),ellipse(-9,14,4,4,p.paper)],
  notebook: (p) => [path('M-68 -71 L57 -59 L68 78 L-57 65Z',p.dark),path('M-57 -59 L46 -49 L57 64 L-47 55Z',p.paper),line(-34,-23,27,-16,p.mid,3),line(-31,-6,29,1,p.mid,3),line(-27,12,31,19,p.mid,3),path('M13 41 L59 -55 L66 -52 L21 45Z',p.accent)],
  signal: (p) => [rect(-65,-51,130,102,p.dark),rect(-54,-41,108,76,p.paper),ellipse(-28,-3,12,12,p.accent),line(-2,-19,34,-19,p.mid,4),line(-2,-3,28,-3,p.mid,4),line(-2,13,18,13,p.mid,4),rect(-7,51,14,28,p.dark),rect(-36,77,72,6,p.dark)],
  shell: (p) => [path('M0 65 C-84 35 -97 -12 -61 -43 C-48 -78 -23 -69 0 -81 C23 -69 48 -78 61 -43 C97 -12 84 35 0 65Z',p.accent),path('M0 57 L0 -65 M0 57 L-46 -41 M0 57 L46 -41 M0 57 L-65 -9 M0 57 L65 -9', 'none',p.paper,3)],
  ball: (p) => [ellipse(0,0,58,58,p.sun,p.dark,3),path('M-57 0 L57 0 M0 -57 L0 57 M-43 -39 C-1 -23 -1 23 -43 39 M43 -39 C1 -23 1 23 43 39','none',p.dark,3)],
  star: (p) => [path('M0 -71 C9 -21 20 -9 66 0 C20 9 9 21 0 71 C-9 21 -20 9 -66 0 C-20 -9 -9 -21 0 -71Z',p.sun),ellipse(0,0,11,11,p.paper)],
}
