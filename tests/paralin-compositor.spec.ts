import {readFile} from 'node:fs/promises';
import {test,expect,type Page} from '@playwright/test';
import {catalog,initial} from '../lib/paralin-composition';
async function range(page:Page,label:string,value:string){await page.getByLabel(label,{exact:false}).evaluate((el,value)=>{const input=el as HTMLInputElement;Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!.call(input,value);input.dispatchEvent(new Event('input',{bubbles:true}));},value);}
async function loaded(page:Page){await expect.poll(()=>page.locator('[data-item] img').evaluateAll(imgs=>imgs.every(i=>(i as HTMLImageElement).naturalWidth>0))).toBe(true);}
async function exported(page:Page){const promise=page.waitForEvent('download');await page.getByRole('button',{name:'Export JSON'}).click();const path=await (await promise).path();return {path:path!,data:JSON.parse(await readFile(path!,'utf8'))};}
test('approved PNG API and invalid paths',async({request})=>{
 for(const c of catalog){const r=await request.get('/api/paralin-asset',{params:{file:c[1]}});expect(r.status()).toBe(200);expect(r.headers()['content-type']).toBe('image/png');expect((await r.body()).subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');}
 for(const file of ['../package.json','/etc/test.png','bad.png'])expect((await request.get('/api/paralin-asset',{params:{file}})).status()).toBe(file==='bad.png'?404:400);
});
test('building controls, zoom-aware drag, camera fit and responsive preview',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/dev/paralin-compositor');await loaded(page);
 await expect(page.locator('[data-building]')).toHaveCount(5);await expect(page.locator('[data-scene-layer]')).toHaveCount(7);await expect(page.locator('[data-scene-layer=roads] [data-item]')).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await range(page,'Camera zoom','1.25');await page.getByLabel('Camera horizontal offset').fill('10');await page.getByLabel('Camera vertical offset').fill('-5');
 await page.getByLabel('Selected asset',{exact:true}).selectOption('shop-1');await range(page,'Size:','0.3');await page.getByLabel('Order within layer').fill('8');
 await page.getByLabel('X',{exact:true}).fill('50');await page.getByLabel('Y',{exact:true}).fill('60');
 const stage=page.getByTestId('stage');await stage.scrollIntoViewIfNeeded();const shop=page.locator('[data-item="shop-1"]');const b=(await shop.boundingBox())!;const w=await stage.evaluate(e=>e.clientWidth);
 await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await page.mouse.move(b.x+b.width/2+w*.125,b.y+b.height/2,{steps:5});await page.mouse.up();
 expect(Number(await page.getByLabel('X',{exact:true}).inputValue())).toBeCloseTo(60,1);
 const result=await exported(page);expect(result.data.camera).toEqual({zoom:1.25,pan:{x:10,y:-5}});expect(result.data.items.find((i:{id:string})=>i.id==='shop-1')).toMatchObject({scale:.3,order:8});
 await page.getByLabel('X',{exact:true}).fill('-100');await expect(page.getByText(/asset\(s\) extend beyond/)).toBeVisible();await page.getByRole('button',{name:'Fit visible scene'}).click();await expect(page.getByText('All visible asset bounds are inside the camera.')).toBeVisible();
 await page.getByRole('button',{name:'Reset',exact:true}).click();await loaded(page);await stage.scrollIntoViewIfNeeded();await page.screenshot({path:`test-results/compositor-${info.project.name}.png`,fullPage:true});expect(errors).toEqual([]);
});
test('PNG environment placement, contact anchors, layer locking and v2 round-trip',async({page})=>{
 await page.goto('/dev/paralin-compositor');await loaded(page);
 // Reuse an existing PNG only as a transport/alpha fixture; never claim it is road artwork.
 const path='design/storypath/environments/paralin/architecture/'+catalog[0][1];
 await page.getByLabel('PNG destination layer').selectOption('roads');await page.getByLabel('Place environment PNG',{exact:true}).setInputFiles(path);
 const road=page.locator('[data-scene-layer=roads] [data-item]');await expect(road).toHaveCount(1);await loaded(page);
 await page.getByLabel('Label',{exact:true}).fill('Transport test only');await page.getByLabel('Contact X %').fill('25');await page.getByLabel('Contact Y %').fill('90');
 await range(page,'Size:','0.4');await expect(road).toHaveCSS('transform',/matrix/);
 await page.getByLabel('Lock roads',{exact:true}).check();await expect(page.getByLabel('Size:')).toBeDisabled();await expect(road).toHaveCSS('pointer-events','none');
 await page.getByLabel('Show roads',{exact:true}).uncheck();await expect(road).toBeHidden();
 const result=await exported(page);expect(result.data.schema).toBe('storypath-paralin-composition-v2');const asset=result.data.assets.find((a:{source:string})=>a.source.startsWith('data:'));expect(asset.source).toBe('data:image/png;base64,'+(await readFile(path)).toString('base64'));
 expect(result.data.items.find((i:{layer:string})=>i.layer==='roads')).toMatchObject({scale:.4,anchor:{x:.25,y:.9}});
 await page.getByRole('button',{name:'Reset',exact:true}).click();await page.getByLabel('Import JSON',{exact:true}).setInputFiles(result.path);await expect(road).toHaveCount(1);await expect(page.getByLabel('Lock roads',{exact:true})).toBeChecked();await expect(road).toBeHidden();
 await page.getByLabel('Show roads',{exact:true}).check();await expect(road).toBeVisible();await loaded(page);
 await page.getByLabel('Import JSON',{exact:true}).setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"items":[{}]}')});await expect(page.getByText(/Invalid composition JSON or unavailable PNG/)).toBeVisible();await expect(road).toHaveCount(1);
});
test('legacy JSON import preserves building positions and rejects non-PNG upload',async({page})=>{
 await page.goto('/dev/paralin-compositor');
 const data={schema:'storypath-paralin-composition-v1',canvas:{width:1600,height:900},camera:{zoom:1,pan:{x:0,y:0}},buildings:initial};
 await page.getByLabel('Import JSON',{exact:true}).setInputFiles({name:'legacy.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});await expect(page.getByText(/Composition loaded/)).toBeVisible();
 const result=await exported(page);expect(result.data.items[0]).toMatchObject({x:68,y:53,scale:.22,layer:'buildings'});
 await page.getByLabel('Place environment PNG',{exact:true}).setInputFiles({name:'fake.png',mimeType:'image/png',buffer:Buffer.from('not a png')});await expect(page.locator('[data-item]')).toHaveCount(5);await expect(page.getByText(/Could not place PNG/)).toBeVisible();
});

test('road originals, independent transforms and reusable review scenes',async({page,request})=>{
 await page.goto('/dev/paralin-compositor');
 for(const name of ['straight_road.png','round_road.png']){const r=await request.get('/api/paralin-asset',{params:{file:'roads/'+name}});expect(r.status()).toBe(200);expect(await r.body()).toEqual(await readFile('design/storypath/environments/paralin/roads/'+name));}
 await page.getByLabel('Add road asset').selectOption('0');await page.getByLabel('Add road asset').selectOption('1');await expect(page.locator('[data-scene-layer=roads] [data-item]')).toHaveCount(2);
 await page.getByLabel('Rotation (degrees)').fill('35');await range(page,'Size:','0.35');await page.getByLabel('Order within layer').fill('9');await page.getByLabel('X',{exact:true}).fill('65');
 const result=await exported(page);const roads=result.data.items.filter((i:{layer:string})=>i.layer==='roads');expect(roads[0]).toMatchObject({rotation:0,scale:.22,order:3,x:50});expect(roads[1]).toMatchObject({rotation:35,scale:.35,order:9,x:65});
 await page.getByLabel('Import JSON',{exact:true}).setInputFiles(result.path);await expect(page.getByText(/Composition loaded/)).toBeVisible();
 await page.getByRole('button',{name:'Straight road test',exact:true}).click();await loaded(page);await expect(page.locator('[data-item]')).toHaveCount(2);await expect(page.getByText('All visible asset bounds are inside the camera.')).toBeVisible();
 await page.getByRole('button',{name:'Two-road connection test',exact:true}).click();await loaded(page);await expect(page.locator('[data-scene-layer=roads] [data-item]')).toHaveCount(2);await expect(page.locator('[data-building]')).toHaveCount(1);await expect(page.getByText('All visible asset bounds are inside the camera.')).toBeVisible();
});
