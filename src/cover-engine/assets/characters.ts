import { ellipse, line, path, rect, transform } from '../geometry'
import type { Character, Palette, Shape } from '../types'

type Drawing = (p: Palette, pose: number, mature: boolean) => Shape[]
const explorer: Drawing = (p, pose, mature) => {
  const stride = [0, 22, 10, -8][pose]
  const handX = [51, 64, 73, 47][pose], handY = [-148, -156, -121, -181][pose]
  if (mature) return [
    path(`M-19 -89 L20 -89 L34 -42 L${29+stride} 0 L${12+stride} 0 L10 -43 L-2 -52 L-25 0 L-42 0 L-21 -61Z`, p.ink),
    path('M-28 -173 C-44 -142 -31 -119 -30 -82 L29 -82 C29 -122 44 -145 24 -173Z', p.ink),
    ellipse(0, -201, 22, 28, p.ink), path(pose % 2 ? 'M-25 -214 L-28 -230 L2 -243 L26 -228 L24 -213Z' : 'M-23 -216 C-25 -248 19 -246 25 -216Z', p.ink),
    path('M-27 -163 C-55 -167 -53 -109 -31 -105Z', p.accent),
    path(`M21 -159 L${pose % 2 ? 60 : 37} -111 L${[25,90,77,50][pose]} ${[-129,-129,-101,-171][pose]}`, 'none', p.ink, 12),
    line(-13, -181, 21, -180, p.sun, 5),
  ]
  return [
    ellipse(0, 0, 63, 10, p.light),
    path(`M-31 -59 L-5 -57 L-12 -10 L-43 -9Z M8 -58 L32 -59 L${43+stride} -10 L${17+stride} -10Z`, p.dark),
    ellipse(-29, -7, 26, 10, p.ink), ellipse(31+stride, -7, 25, 10, p.ink),
    path('M-39 -145 C-52 -124 -43 -86 -49 -52 C-17 -36 29 -37 49 -54 C41 -96 48 -129 34 -148Z', p.accent),
    path('M-38 -139 C-67 -145 -72 -90 -45 -77Z', p.sun),
    path(`M34 -130 C55 -119 62 -113 ${handX} ${handY}`, 'none', p.accent, 19),
    ellipse(handX, handY, 10, 12, p.ink),
    ellipse(0, -173, 54, 53, p.accent), ellipse(4, -169, 39, 34, p.dark),
    ellipse(-9, -173, 3.5, 5, p.paper), ellipse(17, -173, 3.5, 5, p.paper),
    path(pose % 2 ? 'M-7 -157 C0 -147 10 -147 17 -157' : 'M-6 -154 C1 -150 9 -150 15 -154', 'none', p.paper, 2.5),
    path('M-40 -137 L35 -135 L24 -119 L-25 -123Z', p.sun), line(0, -112, 0, -62, p.paper, 2),
    ellipse(13, -88, 3, 3, p.paper),
    ...(pose > 1 ? [rect(12,-76,20,13,p.sun)] : []),
    ...(pose % 2 ? [path('M22 -127 L64 -123 L42 -108 L22 -117Z',p.sun)] : []),
  ]
}
const astronaut: Drawing = (p, pose, mature) => [
  ...explorer(p, pose, mature).slice(0, mature ? 2 : 4),
  rect(-49, -165, 98, 83, p.light),
  path('M-34 -149 L34 -149 L45 -61 L-40 -61Z', p.paper, p.ink, 3),
  ellipse(0, -186, mature ? 38 : 55, mature ? 40 : 51, p.paper, p.ink, 3),
  ellipse(4, -187, mature ? 28 : 42, mature ? 28 : 35, p.dark),
  path('M-22 -203 C-8 -221 11 -217 22 -204', 'none', p.light, 4),
  rect(-17, -127, 34, 27, p.accent), line(-8, -114, 8, -114, p.paper, 3),
  path('M31 -142 C58 -137 61 -125 70 -145', 'none', p.paper, 16),
]
const owl: Drawing = (p, pose, mature) => [
  path('M-46 -100 L-53 -181 L-22 -157 C-8 -165 11 -165 25 -158 L49 -181 L46 -94 C48 -23 -47 -23 -46 -100Z', p.dark),
  ellipse(0, -79, 37, 41, p.mid),
  ellipse(-22, -127, mature ? 17 : 22, 25, p.paper), ellipse(22, -127, mature ? 17 : 22, 25, p.paper),
  ellipse(-19 + pose, -125, 5, 8, p.ink), ellipse(19 + pose, -125, 5, 8, p.ink),
  path('M-9 -108 L9 -108 L0 -91Z', p.sun),
  line(-20, -41, -29, -29, p.accent, 5), line(20, -41, 29, -29, p.accent, 5),
  path('M-48 -106 C-70 -68 -52 -44 -26 -52Z M48 -106 C70 -68 52 -44 26 -52Z', p.mid),
]
const robot: Drawing = (p, pose, mature) => [
  line(-24, -30, -27, 0, p.ink, 12), line(24, -30, 27, 0, p.ink, 12),
  rect(-42, -118, 84, 87, p.mid), rect(-48, -190, 96, 64, p.paper, p.dark, 3),
  rect(-35, -176, 70, 31, p.dark), ellipse(-17, -160, mature ? 3 : 6, 6, p.sun), ellipse(17, -160, mature ? 3 : 6, 6, p.sun),
  line(0, -190, 0, -213, p.dark, 3), ellipse(0, -215, 7, 7, p.accent),
  line(-43, -104, -62, -63, p.dark, 9), line(44, -104, 65, pose % 2 ? -146 : -62, p.dark, 9),
  ellipse(0, -75, 19, 19, p.sun), line(-11, -75, 11, -75, p.dark, 3),
]
const turtle: Drawing = (p, pose, mature) => [
  ellipse(45, -41, 38, 11, p.mid), ellipse(-44, -42, 33, 12, p.mid),
  ellipse(62, -72, 23, 22, p.mid), ellipse(69, -79, mature ? 2.5 : 4, 4, p.ink),
  ellipse(0, -78, 60, 47, p.dark),
  path('M-21 -105 L17 -111 L37 -84 L12 -61 L-21 -69 L-34 -89Z', p.light),
  line(-21, -105, -35, -115, p.light, 3), line(17, -111, 27, -119, p.light, 3),
  line(37, -84, 55, -87, p.light, 3), line(12, -61, 16, -34, p.light, 3),
  path(`M-55 -76 L-79 ${-66-pose*3} L-58 -63Z`, p.mid),
]
const fox: Drawing = (p, pose, mature) => [
  path('M25 -76 C113 -125 109 -7 34 -24 C106 -27 49 -60 25 -76Z', p.accent),
  path('M-28 -117 L32 -117 L38 -22 L-43 -22Z', p.accent),
  path('M-43 -163 L-47 -217 L-12 -183 L17 -183 L44 -218 L47 -158 L0 -116Z', p.accent),
  path('M-38 -160 L0 -142 L38 -160 L0 -120Z', p.paper), ellipse(0, -139, 6, 5, p.ink),
  ellipse(-21, -165, mature ? 3 : 5, 5, p.ink), ellipse(21, -165, mature ? 3 : 5, 5, p.ink),
  line(-23, -31, -27, 0, p.dark, 13), line(23, -31, 27 + pose*2, 0, p.dark, 13),
]
const dragon: Drawing = (p, pose, mature) => [
  path('M-24 -112 C-105 -166 -99 -62 -41 -48Z M24 -112 C105 -166 99 -62 41 -48Z', p.accent),
  ellipse(0, -74, 43, 64, p.mid), ellipse(0, -150, 48, 37, p.mid),
  path('M-33 -177 L-22 -210 L-6 -182 L13 -209 L30 -177Z', p.sun),
  ellipse(-17, -153, mature ? 3 : 5, 5, p.ink), ellipse(18, -153, mature ? 3 : 5, 5, p.ink),
  ellipse(0, -135, 26, 14, p.light), ellipse(-8, -137, 2, 3, p.ink), ellipse(8, -137, 2, 3, p.ink),
  ...transform([ellipse(-26, -12, 21, 12, p.dark), ellipse(26, -12, 21, 12, p.dark)], pose % 2 ? 5 : 0, 0),
]
/** New character = one drawing and one registry entry; renderers need no changes. */
export const CHARACTERS: Record<Character, Drawing> = { explorer, astronaut, owl, robot, turtle, fox, dragon }
