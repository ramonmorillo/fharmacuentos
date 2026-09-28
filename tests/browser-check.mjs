import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const output = path.resolve(process.env.ARTIFACT_DIR || '../cover-qa')
await mkdir(output,{recursive:true})
const browser = await chromium.launch({headless:true,...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {})})
const errors = [], external = []
const context = await browser.newContext({viewport:{width:1280,height:1000},acceptDownloads:true})
const page = await context.newPage()
page.on('pageerror',error=>errors.push(error.message))
page.on('request',request=>{if (!new URL(request.url()).hostname.match(/^(127\.0\.0\.1|localhost)$/)) external.push(request.url())})
try {
  await page.goto(process.env.APP_URL || 'http://127.0.0.1:5173/fharmacuentos/')
  await page.getByRole('button',{name:'Crear cuento',exact:true}).click()
  await page.getByPlaceholder('Por ejemplo: Leo, Nora, Kai...').fill('Íñigo')
  await page.getByRole('radio',{name:/3 a 5 años/}).click()
  await page.getByRole('button',{name:'Generar cuento',exact:true}).click()
  await page.locator('.story-cover svg').waitFor()
  const before = await page.locator('#printable-story').innerText()
  const art = await page.locator('.story-cover').innerHTML()
  await page.getByRole('button',{name:'Otra portada para el mismo cuento'}).click()
  assert.equal(await page.locator('#printable-story').innerText(),before)
  assert.notEqual(await page.locator('.story-cover').innerHTML(),art)
  const after = await page.locator('.story-cover').innerHTML()
  await page.getByRole('button',{name:/Editar formulario/}).click()
  // Header result navigation does not exist; back-to-form regeneration is explicitly a new story.
  await page.getByRole('button',{name:'Generar cuento',exact:true}).click()
  await page.locator('.story-cover svg').waitFor()
  assert.ok(after.length > 1000)
  await page.getByText('Título',{exact:true}).locator('..').locator('input').fill('¿Íñigo y el pingüino? El mapa de las pequeñas decisiones')
  assert.ok((await page.locator('.story-cover svg').textContent()).includes('pingüino'))
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button',{name:'Descargar PDF',exact:true}).click()
  await (await downloadPromise).saveAs(path.join(output,'ui-download.pdf'))
  await page.locator('.story-cover').screenshot({path:path.join(output,'desktop-cover.png')})
  for (const width of [375,768,1280]) {
    await page.setViewportSize({width,height:1000})
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth),`horizontal overflow at ${width}`)
    await page.locator('.story-cover').screenshot({path:path.join(output,`cover-${width}.png`)})
  }
  await page.pdf({path:path.join(output,'browser-print.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true})
  const fixtures = await page.evaluate(async()=>{
    const [{createDefaultFormData},{generateStory},{createVisualSpec},{recipeFromSeed,initialSeed},{buildCover,drawingSvg},{buildStoryPdf}] = await Promise.all([
      import('/fharmacuentos/src/data/defaultFormData.ts'), import('/fharmacuentos/src/lib/generator.ts'), import('/fharmacuentos/src/cover-engine/spec.ts'), import('/fharmacuentos/src/cover-engine/seed.ts'), import('/fharmacuentos/src/cover-engine/drawing.ts'), import('/fharmacuentos/src/lib/pdf.ts')
    ])
    const topics = [
      ['adherencia','olvida-tratamiento','aventurero','crear-rutina','El mapa de las pequeñas decisiones'],
      ['inhaladores','otra','espacial','participar-autocuidado','Un rumbo entre las estrellas'],
      ['hospital','miedo-hospital','magico','afrontar-revision','La puerta al otro lado del bosque'],
      ['enfermedad crónica','cansancio-cuidarse','submarino','expresar-cansancio','Donde las corrientes se encuentran'],
      ['autocuidado','quiere-autonomia','diario','participar-autocuidado','Las páginas que quedan por escribir'],
      ['miedo al tratamiento','miedo-pinchazos','animales','pedir-ayuda','El bosque de las preguntas'],
      ['medicación','cuesta-tomar','deportivo','crear-rutina','La próxima jugada'],
    ]
    const all = [], times=[]
    for(const [age,ageGroup] of [[4,'3-5'],[7,'6-8'],[10,'9-12'],[13,'13-15'],[16,'16-17']]) {
      for(const [topic,situation,style,pedagogicalCompetence,title] of topics) {
        const form = {...createDefaultFormData(),protagonistName:'Íñigo',ageGroup,situation,style,pedagogicalCompetence,situationOther:topic==='inhaladores'?'aprender a usar su inhalador con acompañamiento':''}
        const story=generateStory(form); story.title=title
        const start=performance.now()
        const spec=createVisualSpec(story,form),recipe=recipeFromSeed(spec,initialSeed(spec))
        const svg=drawingSvg(buildCover({spec,recipe},story.title))
        times.push(performance.now()-start)
        const pdf=topic==='adherencia'?Array.from(new Uint8Array(buildStoryPdf(story,{}, {spec,recipe}).output('arraybuffer'))):null
        all.push({age,topic,title,svg,pdf,composition:recipe.composition})
      }
    }
    return {all,times}
  })
  await context.setOffline(true)
  await page.getByRole('button',{name:'Otra portada para el mismo cuento'}).click()
  const offlineDownload = page.waitForEvent('download')
  await page.getByRole('button',{name:'Descargar PDF',exact:true}).click()
  await (await offlineDownload).saveAs(path.join(output,'offline.pdf'))
  await page.getByRole('button',{name:'Limpiar datos',exact:true}).click()
  assert.equal(await page.evaluate(()=>localStorage.getItem('fharmacuentos.cover.v1')),null)
  assert.equal(await page.locator('.story-cover').count(),0)
  for(const f of fixtures.all) if(f.pdf) await writeFile(path.join(output,`ejemplo-${f.age}-anos.pdf`),Buffer.from(f.pdf))
  const cards = fixtures.all.map(f=>`<article data-age="${f.age}"><p>${f.age} años · ${f.topic}</p>${f.svg}</article>`).join('')
  const style = 'body{margin:0;padding:40px;background:#e9e7e0;color:#233f3d;font-family:Arial,sans-serif}h1{font-size:32px;margin:0 0 12px}header p{max-width:850px;line-height:1.5}main{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:24px}article p{font-size:13px}svg{width:100%;height:auto;box-shadow:0 7px 18px #0001}section{margin:28px 0}button{padding:10px 18px;background:#233f3d;color:white;border:0;border-radius:4px;margin:4px;cursor:pointer}@media(max-width:850px){main{grid-template-columns:repeat(2,minmax(0,1fr))}body{padding:18px}}@media print{button{display:none}}'
  const html = `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fharmacuentos · 35 portadas</title><style>${style}</style><header><p>FHARMACUENTOS / COVER ENGINE</p><h1>Una historia. Un pequeño libro propio.</h1><p>35 ejemplos sintéticos: cinco edades y siete temáticas. Ilustración procedural y texto vectorial, sin imágenes generadas por IA ni recursos externos. La portada representa el mundo del relato; la temática clínica solo identifica estas pruebas.</p></header><section><button onclick="filter(0)">Todas</button>${[4,7,10,13,16].map(age=>`<button onclick="filter(${age})">${age} años</button>`).join('')}</section><main>${cards}</main><script>function filter(age){document.querySelectorAll('article').forEach(e=>e.hidden=age!==0&&Number(e.dataset.age)!==age)}</script></html>`
  await writeFile(path.join(output,'galeria-portadas.html'),html)
  await page.setViewportSize({width:1600,height:1200})
  await page.setContent(html)
  assert.ok(await page.evaluate(()=>[...document.querySelectorAll('svg text')].every(el=>{const b=el.getBBox();return b.x>=32&&b.x+b.width<=808&&b.y>=32&&b.y+b.height<=1156})), 'title overflow')
  await page.screenshot({path:path.join(output,'galeria-35.png'),fullPage:true})
  const pair=fixtures.all.filter(f=>[4,16].includes(f.age)&&f.topic==='adherencia')
  await page.setContent(`<html><style>${style}main{grid-template-columns:1fr 1fr;gap:50px}body{padding:36px}</style><h1>La misma aventura, dos edades</h1><main>${pair.map(f=>`<article><p>${f.age} AÑOS</p>${f.svg}</article>`).join('')}</main></html>`)
  await page.setViewportSize({width:1200,height:950})
  await page.screenshot({path:path.join(output,'comparacion-4-16.png'),fullPage:true})
  assert.deepEqual(errors,[])
  assert.deepEqual(external,[])
  const times=fixtures.times.sort((a,b)=>a-b)
  const report={examples:fixtures.all.length,milliseconds:{median:times[Math.floor(times.length/2)],max:times.at(-1)},pageErrors:errors,externalRequests:external,viewports:[375,768,1280],offlineRegenerationAndPdf:true,clearRemovesHistory:true}
  await writeFile(path.join(output,'browser-results.json'),JSON.stringify(report,null,2))
  console.log(JSON.stringify(report,null,2))
} finally { await browser.close() }
