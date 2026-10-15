import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import registry from '../lib/paralin-environment-assets.json';
test('environment originals, variants and preview',async({page,request},info)=>{
 for(const a of registry){const response=await request.get('/api/paralin-asset',{params:{file:a.source}});expect(response.status()).toBe(200);expect((await response.body()).equals(await readFile('design/storypath/environments/paralin/'+a.source))).toBe(true);}
 await page.goto('/dev/paralin-compositor');await page.getByRole('button',{name:'Environment integration test',exact:true}).click();
 await expect(page.locator('[data-building]')).toHaveCount(5);
 await expect.poll(()=>page.locator('[data-item] img').evaluateAll(imgs=>imgs.every(i=>(i as HTMLImageElement).naturalWidth>0))).toBe(true);
 const lamp=page.locator('[data-item="env-lamp-front"]');const before=await lamp.getAttribute('style');await page.getByLabel('Lamp lighting').selectOption('env-lamp-front-lit');expect(await lamp.getAttribute('style')).toBe(before);
 await expect(lamp.locator('img')).toHaveAttribute('src',/lamp_01_lit/);
 await page.getByLabel('Add environment asset').selectOption('env-bench-rear');await expect(page.locator('[data-item]')).toHaveCount(14);
 expect(await page.getByLabel('Add environment asset').locator('option').count()).toBe(21);
 await page.getByRole('button',{name:'Environment integration test',exact:true}).click();await page.getByLabel('Ground contacts & guides').uncheck();await page.getByLabel('Selected asset',{exact:true}).selectOption('');
 await expect.poll(()=>page.locator('[data-item] img').evaluateAll(imgs=>imgs.every(i=>(i as HTMLImageElement).complete&&(i as HTMLImageElement).naturalWidth>0))).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByTestId('stage').screenshot({path:`tmp/environment-review/scene-${info.project.name}.png`});
});


test('Village Centre draft retains required originals and repair warnings',async({page},info)=>{
 await page.goto('/dev/paralin-compositor');await page.getByRole('button',{name:'Village Centre draft',exact:true}).click();
 await expect(page.getByText('Draft only: pavement has a baked checkerboard; road and building joins remain incompatible. Artwork is unchanged.')).toBeVisible();
 await expect.poll(()=>page.locator('[data-item] img').evaluateAll(imgs=>imgs.every(i=>(i as HTMLImageElement).complete&&(i as HTMLImageElement).naturalWidth>0))).toBe(true);
 for(const id of ['straight-test','round-test','shop-test','home-blue','home-yellow','grass-west','pavement-review','drain','palm','lamp','bin','noticeboard'])await expect(page.locator(`[data-item="${id}"]`)).toHaveCount(1);
 await page.getByTestId('stage').screenshot({path:`tmp/environment-review/village-draft-${info.project.name}.png`});
 const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Export JSON'}).click();const download=await pending;await page.getByLabel('Import JSON',{exact:true}).setInputFiles((await download.path())!);await expect(page.getByText('Composition loaded. Camera and layer settings restored.')).toBeVisible();
});
