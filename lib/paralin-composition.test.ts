import {describe,it,expect} from 'vitest';
import {initial} from './paralin-composition';
import {roadTestScene,createScene,parseScene,fitCamera,clippedItems,layerIds,bounds} from './paralin-scene';
const legacy=()=>({schema:'storypath-paralin-composition-v1',canvas:{width:1600,height:900},camera:{zoom:1,pan:{x:10,y:-5}},buildings:structuredClone(initial)});
describe('layered composition',()=>{
 it('migrates v1 without losing placements, scale, camera or stacking',()=>{const s=parseScene(legacy());expect(s.schema).toBe('storypath-paralin-composition-v2');expect(s.camera).toEqual(legacy().camera);expect(s.items[0]).toMatchObject({id:'shop-1',layer:'buildings',order:3,x:68,y:53,scale:.22,anchor:{x:.5,y:.77}});expect(s.layers.map(l=>l.id)).toEqual(layerIds);});
 it('round-trips v2 with empty layers and layer settings',()=>{const s=createScene();s.layers[2].locked=true;s.layers[4].visible=false;expect(parseScene(JSON.parse(JSON.stringify(s)))).toEqual(s);s.items=[];expect(parseScene(s).items).toEqual([]);});
 it.each([null,{}, {...legacy(),schema:'other'}, {...legacy(),camera:{zoom:0,pan:{x:0,y:0}}}, {...legacy(),buildings:[initial[0],initial[0]]}])('rejects malformed document %j',data=>expect(()=>parseScene(data)).toThrow());
 it.each([{x:NaN},{y:301},{scale:-1},{order:1.5},{assetId:'missing'},{layer:'unknown'},{anchor:{x:2,y:1}}])('rejects invalid item %j',patch=>{const d=createScene();Object.assign(d.items[0],patch);expect(()=>parseScene(d)).toThrow();});
 it('rejects duplicate layers, arbitrary sources and false dimensions',()=>{const s=createScene();s.layers[0]=s.layers[1];expect(()=>parseScene(s)).toThrow();const a=createScene();a.assets[0].source='../../secret.png';expect(()=>parseScene(a)).toThrow();const b=createScene();b.assets[0].width=1;expect(()=>parseScene(b)).toThrow();});
 it('fits full image bounds including negative origins and tall assets',()=>{const s=createScene();s.items[0].x=-100;s.items[0].scale=1.8;expect(clippedItems(s).length).toBeGreaterThan(0);s.camera=fitCamera(s.items,s.assets);expect(clippedItems(s)).toEqual([]);});
 it('uses contact anchors and ignores hidden assets when checking clipping',()=>{const s=createScene();const i=s.items[0],a=s.assets.find(a=>a.id===i.assetId)!;i.anchor={x:0,y:1};expect(bounds(i,a).left).toBe(i.x);expect(bounds(i,a).bottom).toBe(i.y);i.x=300;expect(clippedItems(s).length).toBeGreaterThan(0);s.layers.find(l=>l.id==='buildings')!.visible=false;expect(clippedItems(s)).toEqual([]);});
});

describe('road transforms',()=>{
 it('fits a rotated road in pixel space and retains rotation through JSON',()=>{const s=roadTestScene(true);s.items[0].rotation=90;const asset=s.assets.find(a=>a.id===s.items[0].assetId)!;const b=bounds(s.items[0],asset);expect(b.right-b.left).toBeCloseTo(.4*100*1024/1536);expect(b.bottom-b.top).toBeCloseTo(.4*1600/9);s.camera=fitCamera(s.items,s.assets);expect(clippedItems(s)).toEqual([]);expect(parseScene(JSON.parse(JSON.stringify(s))).items[0].rotation).toBe(90);});
 it('accepts old v2 scenes with omitted rotation and rejects invalid angles',()=>{const s=createScene();expect(parseScene(s).items[0].rotation).toBeUndefined();s.items[0].rotation=Infinity;expect(()=>parseScene(s)).toThrow();});
});

