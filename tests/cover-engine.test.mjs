import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true, watch: null, ws: false }, appType: 'custom', logLevel: 'error' })
let passed = 0
const test = (name, fn) => { fn(); passed++; console.log(`✓ ${name}`) }
try {
  const { createDefaultFormData } = await server.ssrLoadModule('/src/data/defaultFormData.ts')
  const { generateStory } = await server.ssrLoadModule('/src/lib/generator.ts')
  const { createVisualSpec } = await server.ssrLoadModule('/src/cover-engine/spec.ts')
  const { initialSeed, recipeFromSeed, createCoverRecipe, nextCoverRecipe, clearCoverHistory } = await server.ssrLoadModule('/src/cover-engine/seed.ts')
  const { buildCover, drawingSvg, titleLayout } = await server.ssrLoadModule('/src/cover-engine/drawing.ts')
  const { buildStoryPdf } = await server.ssrLoadModule('/src/lib/pdf.ts')
  const { WORLDS, COMPOSITIONS } = await server.ssrLoadModule('/src/cover-engine/catalog.ts')
  const { CHARACTERS } = await server.ssrLoadModule('/src/cover-engine/assets/characters.ts')
  const form = { ...createDefaultFormData(), protagonistName: 'Álex' }
  const oldRandom = Math.random
  let n = 42
  Math.random = () => ((n = Math.imul(n, 1664525) + 1013904223 >>> 0) / 4294967296)
  const story = generateStory(form)
  Math.random = oldRandom
  const original = JSON.stringify(story)
  const spec = createVisualSpec(story, form)
  const cover = { spec, recipe: recipeFromSeed(spec, initialSeed(spec)) }
  let store = new Map()
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: k => store.get(k) ?? null, setItem: (k,v) => store.set(k,v), removeItem: k => store.delete(k) } })
  test('story generator regression fingerprint', () => {
    const digest = createHash('sha256').update(original).digest('hex')
    console.log(`  unchanged generator fixture: ${digest}`)
    assert.equal(digest, 'b55c4d209c605b78816684d57a2edad3fb2a0c47fb6e1055b50c8cbfcb9ff2f4')
  })
  test('same seed gives identical geometry and text', () => {
    assert.deepEqual(recipeFromSeed(spec,cover.recipe.seed),cover.recipe)
    assert.equal(drawingSvg(buildCover(cover,story.title)),drawingSvg(buildCover(cover,story.title)))
  })
  test('all five ages × ten styles generate finite, bounded geometry', () => {
    for (const ageGroup of ['3-5','6-8','9-12','13-15','16-17']) for (const style of Object.keys(WORLDS)) {
      const nextSpec = createVisualSpec(story,{...form,ageGroup,style})
      for (let seed = 0; seed < 24; seed++) {
        const next = {spec:nextSpec,recipe:recipeFromSeed(nextSpec,seed)}
        const drawing = buildCover(next,story.title)
        assert.ok(COMPOSITIONS[nextSpec.coverStyle].includes(next.recipe.composition))
        for (const shape of drawing.shapes) for (const op of shape.ops) for (let i=0;i<op.c.length;i++) {
          assert.ok(Number.isFinite(op.c[i]))
          assert.ok(op.c[i] >= -1 && op.c[i] <= (i%2 ? 1189 : 841),`shape outside A4: ${ageGroup}/${style}/${seed}: ${op.c}`)
        }
      }
    }
  })
  test('variant preserves story/spec and changes composition, palette, scenery and pose', () => {
    let previous = cover.recipe
    for (let i=0;i<150;i++) {
      const next = nextCoverRecipe(spec,previous)
      for (const field of ['seed','composition','palette','scenery','pose']) assert.notEqual(next[field],previous[field])
      previous = next
    }
    assert.equal(JSON.stringify(story),original)
    assert.deepEqual(createVisualSpec(story,form),spec)
  })
  test('new stories with equivalent semantics still get different covers', () => {
    const first = createCoverRecipe(spec,false), second = createCoverRecipe(spec,false)
    assert.notEqual(first.seed,second.seed)
    assert.notEqual(first.composition,second.composition)
    assert.notEqual(first.palette,second.palette)
  })
  test('latest recipe restores exactly and bounded storage contains only uints', () => {
    const saved = createCoverRecipe(spec)
    assert.deepEqual(createCoverRecipe(spec),saved)
    const history = JSON.parse([...store.values()][0])
    assert.ok(history.recent.length <= 12 && history.saved.length <= 64)
    assert.deepEqual(Object.keys(history).sort(),['recent','saved'])
    assert.ok([...history.recent,...history.saved.flat()].every(v=>Number.isInteger(v)&&v>=0&&v<=4294967295))
  })
  test('no name or clinical/free-text field is used in seed/persistence', () => {
    const changed = {...form,protagonistName:'NOMBRE_PRIVADO_123',situation:'otra',situationOther:'DIAGNOSTICO_PRIVADO',emotion:'otra',emotionOther:'CLINICA_987',extraDetails:'HISTORIA_ABC'}
    const changedStory = {...story, title:'NOMBRE_PRIVADO_123',paragraphs:story.paragraphs.map(p=>p.replaceAll('Álex','NOMBRE_PRIVADO_123'))}
    const next = createVisualSpec(changedStory,changed)
    assert.equal(initialSeed(next),initialSeed(spec))
    createCoverRecipe(next)
    assert.ok(!JSON.stringify([...store.values()]).match(/PRIVADO|CLINICA|Álex|HISTORIA|rutina|tratamiento/))
  })
  test('blocked, malformed and oversized storage never prevent rendering', () => {
    for (const value of ['invalid','null','{}','{"recent":[null,"x"],"saved":[[1,"private"]]}','x'.repeat(10001)]) {
      store.set('fharmacuentos.cover.v1',value)
      assert.ok(createCoverRecipe(spec))
    }
    Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw new Error('blocked')}})
    assert.ok(createCoverRecipe(spec)); assert.ok(nextCoverRecipe(spec,cover.recipe)); clearCoverHistory()
  })
  test('title cannot inject markup and Spanish punctuation is preserved', () => {
    const title = '¿Álex, Íñigo y el pingüino? <script>alert("x")</script> & el árbol'
    const svg = drawingSvg(buildCover(cover,title))
    assert.ok(!svg.includes('<script>'))
    assert.ok(svg.includes('&lt;script&gt;'))
    assert.ok(svg.includes('Íñigo'))
  })
  test('long titles and unbroken words wrap without lost characters', () => {
    for (const title of ['¿Dónde está el mapa de Íñigo? Una aventura extraordinaria para descubrir juntos el camino de las pequeñas decisiones y las preguntas que todavía no nos atrevemos a hacer', 'Supercalifragilistico'.repeat(15)]) {
      const lines = titleLayout(title,{x:90,y:130,width:510,height:264},false,'#000')
      assert.equal(lines.map(l=>l.text).join('').replace(/\s/g,''),title.replace(/\s/g,''))
      assert.ok(lines.at(-1).y <= 394)
      assert.ok(lines[0].size >= 18)
    }
  })
  test('young cover cannot select album compositions', () => {
    const young = createVisualSpec(story,{...form,ageGroup:'16-17'})
    const baby = createVisualSpec(story,{...form,ageGroup:'3-5'})
    assert.notEqual(young.coverStyle,baby.coverStyle)
    for(let seed=0;seed<100;seed++) assert.ok(['minimal','graphic','diagonal'].includes(recipeFromSeed(young,seed).composition))
  })
  test('nonhuman protagonists require explicit story evidence', () => {
    const s = createVisualSpec({...story,paragraphs:['Era un pequeño dragón llamado Brisa.']},form)
    assert.equal(s.protagonist,'dragon')
    assert.equal(spec.protagonist,'explorer')
    const animal = createVisualSpec({...story,paragraphs:['Álex tenía un amigo, un búho llamado Buho.']},{...form,style:'animales'})
    assert.equal(animal.protagonist,'explorer')
    assert.equal(animal.companion,'owl')
    assert.equal(Object.keys(CHARACTERS).length,7)
  })
  test('PDF cover adds exactly one page, no raster images, selectable title', () => {
    const legacy = buildStoryPdf(story)
    const pdf = buildStoryPdf(story,{},cover)
    assert.equal(pdf.getNumberOfPages(),legacy.getNumberOfPages()+1)
    const raw = pdf.output()
    assert.ok(!raw.includes('/Subtype /Image'))
    assert.ok(raw.includes('Fharmacuentos'))
    assert.ok(raw.includes('/MediaBox [0 0 595.2799999999999727 841.8899999999999864]'))
  })
  console.log(`\n${passed} tests passed.`)
} finally { await server.close() }
