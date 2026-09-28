import { ellipse, line, path, rect, transform } from '../geometry'
import { coral, sprig, tree } from './nature'
import type { Palette, Setting, Shape } from '../types'

type Drawing = (p: Palette, variant: number, simple: boolean) => Shape[]
/** Local scene coordinates: 0..680 x 0..560. All authored curves are cubic. */
const forest: Drawing = (p, v, simple) => [
  ellipse(490 - v*38, 112, simple ? 68 : 44, simple ? 68 : 44,p.sun),
  path('M0 335 C130 241 231 283 355 278 C498 262 575 161 680 244 L680 560 L0 560Z',p.light),
  path('M0 411 C170 281 343 412 485 355 C569 319 623 335 680 355 L680 560 L0 560Z',p.mid),
  path(`M${330+v*22} 293 C260 353 515 355 440 411 C385 462 241 457 210 560 L385 560 C390 497 556 475 531 408 C506 355 311 351 ${350+v*22} 293Z`,p.paper),
  ...transform(tree(p,v),93,450,simple ? .8 : 1),
  ...transform(tree(p,v+1),595,405,simple ? .65 : .86),
  ...(!simple ? transform(tree(p,v+1),170,350,.45) : []),
  ...transform(sprig(p,v),620,545,.8),
]
const space: Drawing = (p,v,simple) => [
  rect(0,0,680,560,p.dark),
  ellipse(510-v*47,139,81,81,p.sun),
  path(`M${390-v*47} 168 C${472-v*47} 112 ${584-v*47} 112 ${621-v*47} 136 C${579-v*47} 169 ${450-v*47} 199 ${390-v*47} 168Z`,'none',p.accent,9),
  ...Array.from({length:simple?9:24},(_,i)=>ellipse(30+(i*173+v*21)%620,25+(i*97)%390,i%3?2:4,i%3?2:4,p.paper)),
  path('M0 469 C185 370 463 404 680 468 L680 560 L0 560Z',p.light),
  ellipse(121,491,54,12,p.mid),ellipse(530,461,42,9,p.mid),
  path('M95 328 L125 240 L180 202 L204 275 L175 360Z',p.paper),
  path('M108 308 L73 316 L57 378 L111 352Z M182 277 L220 294 L220 354 L177 333Z',p.accent),
  ellipse(157,267,18,22,p.dark),
]
const reef: Drawing = (p,v,simple) => [
  rect(0,0,680,560,p.light),
  path('M0 112 C160 50 284 184 447 100 C561 41 617 67 680 92 L680 560 L0 560Z',p.mid),
  path('M0 269 C221 175 326 360 680 239 L680 560 L0 560Z',p.dark),
  path('M0 483 C189 433 388 502 680 450 L680 560 L0 560Z',p.light),
  ...transform(coral(p),99,503,1.5), ...transform(coral(p),592,499,1,1,-15),
  ...Array.from({length:simple?4:12},(_,i)=>ellipse(70+(i*117+v*35)%550,46+(i*67)%330,5+i%3*4,5+i%3*4,'none',p.paper,2)),
  ...transform(sprig(p,v),526,524,1.1),
]
const city: Drawing = (p,v,simple) => [
  ellipse(477-v*35,117,68,68,p.sun),
  ...Array.from({length:simple?4:7},(_,i)=>{
    const x = i*(simple?168:98), h = 120+(i*67+v*39)%150
    return rect(x,375-h,simple?140:85,h,p.light)
  }),
  path('M0 379 L680 379 L680 560 L0 560Z',p.mid),
  path('M0 487 L680 421 L680 482 L0 553Z',p.paper),
  ...transform(tree(p,v),107,416,.66),
  ...(!simple ? [line(509,168,509,398,p.dark,6),path('M509 173 C509 145 558 145 558 173', 'none',p.dark,5),ellipse(558,178,19,9,p.sun)] : []),
]
const room: Drawing = (p,v) => [
  rect(0,0,680,560,p.light),rect(90+v*20,35,372,321,p.dark),
  ellipse(315+v*17,136,61,61,p.sun),
  path('M100 278 C227 192 352 271 450 202 L450 345 L100 345Z',p.mid),
  line(279+v*10,35,279+v*10,356,p.paper,9),line(90+v*20,199,462+v*20,199,p.paper,9),
  path('M0 424 L680 374 L680 560 L0 560Z',p.accent),
  path('M360 429 L568 412 L609 492 L399 510Z',p.paper),
  line(397,456,550,443,p.mid,3),line(406,474,563,462,p.mid,3),
  ...transform(sprig(p,v),96,436,.9),path('M61 403 L136 403 L125 471 L74 471Z',p.dark),
]
const court: Drawing = (p,v,simple) => [
  ...city(p,v,simple).slice(0,1),rect(0,220,680,340,p.mid),
  path('M57 496 L192 265 L592 265 L665 496Z','none',p.paper,3),
  path('M136 361 L621 361 M399 265 L430 496','none',p.paper,3),
  ellipse(413,369,60,28,'none',p.paper,3),
  rect(94,95,112,85,p.paper,p.dark,3),rect(133,179,11,87,p.dark),
  path('M120 161 L183 161 L169 204 L137 204Z','none',p.accent,4),
]
const panels: Drawing = (p,v) => [
  rect(0,0,326,245,p.light),rect(342,0,338,245,p.sun),rect(0,261,680,299,p.mid),
  path('M360 211 L631 38 M380 228 L651 55','none',p.accent,7),
  path(`M${70+v*15} 80 L258 80 L258 164 L154 164 L131 193 L132 164 L70 164Z`,p.paper),
  path('M0 517 L255 338 L417 416 L680 293 L680 560 L0 560Z',p.dark),
]
export const BACKGROUNDS: Record<Setting, Drawing> = { forest, space, reef, city, room, court, panels }
