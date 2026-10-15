import hillsideSnapshot from '../design/storypath/environments/paralin/scenes/paralin_hillside_neighbourhood_01.json';
import environmentRegistry from './paralin-environment-assets.json';
import {catalog, dimensions, initial, type Building} from './paralin-composition';

export const layerIds = ['background','terrain','roads','buildings','foreground','characters','interaction'] as const;
export type LayerId = typeof layerIds[number];
export type Asset = {id:string; label:string; source:string; width:number; height:number};
export type Item = {id:string; assetId:string; label:string; layer:LayerId; order:number; rotation?:number; x:number; y:number; scale:number; anchor:{x:number;y:number}};
export type Camera = {zoom:number;pan:{x:number;y:number}};
export type Scene = {schema:'storypath-paralin-composition-v2';canvas:{width:1600;height:900};camera:Camera;layers:{id:LayerId;visible:boolean;locked:boolean}[];assets:Asset[];items:Item[]};
export const buildingAssets:Asset[] = catalog.map(c=>({id:c[0],label:c[2],source:c[1],...dimensions[c[1]]}));
export const roadAssets:Asset[] = [
  {id:'road-straight',label:'Straight road (pending review)',source:'roads/straight_road.png',width:1536,height:1024},
  {id:'road-round',label:'Round road (pending review)',source:'roads/round_road.png',width:1536,height:1024},
];
export const environmentAudit = environmentRegistry;
export const environmentAssets = environmentRegistry.filter(a=>a.usable);
export const repositoryAssets:Asset[] = [...buildingAssets,...roadAssets,...environmentRegistry];
export function switchLamp(scene:Scene,itemId:string,assetId:string):Scene {
 const item=scene.items.find(i=>i.id===itemId);
 const from=environmentAssets.find(a=>a.id===item?.assetId),to=environmentAssets.find(a=>a.id===assetId);
 if(!item||!from?.lampGroup||from.lampGroup!==to?.lampGroup||scene.layers.find(l=>l.id===item.layer)?.locked)return scene;
 if(!scene.assets.some(a=>a.id===assetId)&&scene.assets.length>=200)return scene;
 return {...scene,assets:scene.assets.some(a=>a.id===assetId)?scene.assets:[...scene.assets,to],items:scene.items.map(i=>i.id===itemId?{...i,assetId}:i)};
}
export function environmentTestScene():Scene {
 const s=createScene();
 const extras:[string,number,number,number][]=[['env-straight',45,96,.38],['env-tree-palm',8,87,.11],['env-tree-mango',90,85,.12],['env-notice-front',67,88,.08],['env-bench-front',76,90,.075],['env-bin-rear',82,89,.025],['env-lamp-front',57,86,.055],['env-dirt',16,98,.14]];
 s.items.push(...extras.map(([assetId,x,y,scale])=>({id:assetId,assetId,label:environmentAssets.find(a=>a.id===assetId)!.label,layer:environmentAssets.find(a=>a.id===assetId)!.defaultLayer as LayerId,order:1,rotation:0,x,y,scale,anchor:{x:.5,y:.95}})));
 s.camera=fitCamera(s.items,s.assets);return s;
}
export const sourceUrl = (asset:Asset) => asset.source.startsWith('data:') ? asset.source : '/api/paralin-asset?file='+encodeURIComponent(asset.source);
export const clamp = (n:number,min:number,max:number) => Math.max(min,Math.min(max,n));
export function bounds(item:Item,asset:Asset) {
  const w=item.scale*1600,h=w*asset.height/asset.width;
  const angle=(item.rotation??0)*Math.PI/180,cos=Math.cos(angle),sin=Math.sin(angle);
  const points=[[0,0],[w,0],[w,h],[0,h]].map(([x,y])=>{
    const dx=x-w*item.anchor.x,dy=y-h*item.anchor.y;
    return {x:item.x+(dx*cos-dy*sin)/16,y:item.y+(dx*sin+dy*cos)/9};
  });
  return {left:Math.min(...points.map(p=>p.x)),right:Math.max(...points.map(p=>p.x)),top:Math.min(...points.map(p=>p.y)),bottom:Math.max(...points.map(p=>p.y))};
}
export function visibleItems(scene:Scene) {return scene.items.filter(i=>scene.layers.find(l=>l.id===i.layer)?.visible);}
export function fitCamera(items:Item[],assets:Asset[]):Camera {
  if(!items.length)return {zoom:1,pan:{x:0,y:0}};
  const boxes=items.map(i=>bounds(i,assets.find(a=>a.id===i.assetId)!));
  const left=Math.min(...boxes.map(b=>b.left)),right=Math.max(...boxes.map(b=>b.right));
  const top=Math.min(...boxes.map(b=>b.top)),bottom=Math.max(...boxes.map(b=>b.bottom));
  const zoom=clamp(Math.min(84/(right-left),84/(bottom-top),1),.05,2);
  return {zoom,pan:{x:(50-(left+right)/2)*zoom,y:(50-(top+bottom)/2)*zoom}};
}
export function clippedItems(scene:Scene) {
  return visibleItems(scene).filter(i=>{
    const b=bounds(i,scene.assets.find(a=>a.id===i.assetId)!);const {zoom,pan}=scene.camera;
    return (b.left-50)*zoom+50+pan.x<0 || (b.right-50)*zoom+50+pan.x>100 || (b.top-50)*zoom+50+pan.y<0 || (b.bottom-50)*zoom+50+pan.y>100;
  });
}
function migrate(buildings:Building[],camera:Camera):Scene {
  return {schema:'storypath-paralin-composition-v2',canvas:{width:1600,height:900},camera,
    layers:layerIds.map(id=>({id,visible:true,locked:false})),assets:repositoryAssets.map(a=>({...a})),
    items:buildings.map(b=>({id:b.id,assetId:catalog.find(c=>c[1]===b.file)![0],label:b.label,layer:'buildings',order:b.layer,x:b.x,y:b.y,scale:b.scale,anchor:{x:.5,y:.77}}))};
}
export function createScene():Scene {const s=migrate(initial,{zoom:1,pan:{x:0,y:0}});s.camera=fitCamera(s.items,s.assets);return s;}
const range=(n:unknown,min:number,max:number):n is number=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
const text=(s:unknown):s is string=>typeof s==='string'&&s.length>0&&s.length<=120;
function fail():never {throw Error('Invalid composition JSON');}
export function pngDimensions(source:string) {
  if(source.length>8_000_000 || !/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(source))return fail();
  const bytes=atob(source.slice(22));
  if(bytes.slice(0,8)!=='\x89PNG\r\n\x1a\n'||bytes.slice(12,16)!=='IHDR')return fail();
  const n=(offset:number)=>Array.from(bytes.slice(offset,offset+4)).reduce((v,c)=>v*256+c.charCodeAt(0),0);
  const width=n(16),height=n(20);
  if(!range(width,1,8192)||!range(height,1,8192)||width*height>32_000_000)return fail();
  return {width,height};
}
export function parseScene(value:unknown):Scene {
  if(!value||typeof value!=='object')return fail();
  const d=value as Scene & {buildings:Building[]};
  if(d.canvas?.width!==1600||d.canvas?.height!==900)return fail();
  const c=d.camera;
  if(!c||!range(c.zoom,.05,2)||!range(c.pan?.x,-1000,1000)||!range(c.pan?.y,-1000,1000))return fail();
  if((d.schema as string)==='storypath-paralin-composition-v1') {
    if(!Array.isArray(d.buildings)||d.buildings.length>200)return fail();
    const ids=new Set();
    for(const b of d.buildings){if(!b||!text(b.id)||ids.has(b.id)||!text(b.label)||!catalog.some(a=>a[1]===b.file)||!range(b.x,0,100)||!range(b.y,0,100)||!range(b.scale,.08,.5)||!range(b.layer,0,9)||!Number.isInteger(b.layer))return fail();ids.add(b.id);}
    return migrate(d.buildings,c);
  }
  if(d.schema!=='storypath-paralin-composition-v2'||!Array.isArray(d.layers)||d.layers.length!==7||!Array.isArray(d.assets)||d.assets.length>200||!Array.isArray(d.items)||d.items.length>200)return fail();
  for(const id of layerIds){const layers=d.layers.filter(l=>l?.id===id);if(layers.length!==1||typeof layers[0].visible!=='boolean'||typeof layers[0].locked!=='boolean')return fail();}
  const ids=new Set<string>();let embeddedBytes=0;
  for(const a of d.assets){
    if(!a||!text(a.id)||ids.has(a.id)||!text(a.label)||typeof a.source!=='string')return fail();
    const reserved=repositoryAssets.find(r=>r.id===a.id);
    if(reserved&&reserved.source!==a.source)return fail();
    let size;
    if(a.source.startsWith('data:')){embeddedBytes+=a.source.length;if(embeddedBytes>32_000_000)return fail();size=pngDimensions(a.source);}
    else {const registered=repositoryAssets.find(r=>r.source===a.source);if(!registered)return fail();size=registered;}
    if(a.width!==size.width||a.height!==size.height)return fail();ids.add(a.id);
  }
  const itemIds=new Set<string>();
  for(const i of d.items){if(!i||!text(i.id)||itemIds.has(i.id)||!ids.has(i.assetId)||!text(i.label)||!layerIds.includes(i.layer)||(i.rotation!==undefined&&!range(i.rotation,-180,180))||!range(i.order,0,999)||!Number.isInteger(i.order)||!range(i.x,-200,300)||!range(i.y,-200,300)||!range(i.scale,.01,2)||!range(i.anchor?.x,0,1)||!range(i.anchor?.y,0,1))return fail();itemIds.add(i.id);}
  return {schema:d.schema,canvas:d.canvas,camera:c,layers:layerIds.map(id=>d.layers.find(l=>l.id===id)!),assets:d.assets,items:d.items};
}

// Review fixtures only: no approval or new artwork is implied.
export function roadTestScene(connection=false):Scene {
  const scene=createScene();
  scene.items=[
    {id:'straight-test',assetId:'road-straight',label:'Straight road',layer:'roads',order:1,rotation:0,x:38,y:74,scale:.4,anchor:{x:.5,y:.5}},
    {id:'shop-test',assetId:'shop',label:'Corner shop',layer:'buildings',order:1,rotation:0,x:23,y:63.5,scale:.22,anchor:{x:.5,y:.77}},
  ];
  if(connection)scene.items.push({id:'round-test',assetId:'road-round',label:'Round road',layer:'roads',order:2,rotation:3,x:67.2373,y:41.8120,scale:.406,anchor:{x:.5,y:.5}});
  scene.camera=connection?{zoom:1,pan:{x:0,y:-8}}:fitCamera(scene.items,scene.assets);return scene;
}

// Explicit review draft; original presets and artwork remain unchanged.
export function villageDraftScene():Scene {
 const s=roadTestScene(true);
 const placements:[string,string,number,number,number,LayerId,number][]=[
 ['grass-west','env-grass',20,73,.39,'terrain',0],['grass-east','env-grass',70,47,.4,'terrain',0],
 ['home-blue','blue',48,39,.17,'buildings',2],['home-yellow','yellow',75,24,.16,'buildings',2],
 ['pavement-review','env-pavement',38,48,.19,'roads',0],
 ['drain','env-drain-short',36,69,.045,'foreground',1],
 ['palm','env-tree-palm',11,58,.095,'foreground',2],['mango','env-tree-mango',86,43,.11,'foreground',2],
 ['lamp','env-lamp-front',49,65,.055,'foreground',3],['bin','env-bin-front',28,67,.023,'foreground',3],
 ['noticeboard','env-notice-front',22,75,.075,'foreground',3]];
 for(const [id,assetId,x,y,scale,layer,order] of placements)s.items.push({id,assetId,label:s.assets.find(a=>a.id===assetId)!.label,layer,order,rotation:0,x,y,scale,anchor:{x:.5,y:layer==='buildings'?.77:1}});
 s.camera=fitCamera(s.items,s.assets);return s;
}

export function villageComposition01():Scene {
 const s=roadTestScene(true);
 // Feet share the buildings layer so y-order handles tree/building occlusion.
 const placements:[string,string,number,number,number,LayerId][]=[
 ['terrain-west','env-grass',22,78,.43,'terrain'],['terrain-centre','env-grass',47,62,.43,'terrain'],['terrain-east','env-grass',73,43,.43,'terrain'],
 ['shop-yard','env-dirt',21,66,.25,'terrain'],['home-yard','env-dirt',57,39,.25,'terrain'],
 ['restaurant','mixed',41,42,.2,'buildings'],['home-blue','blue',60,24,.18,'buildings'],['home-yellow','yellow',80,13,.17,'buildings'],
 ['palm-west','env-tree-palm',10,58,.14,'buildings'],['mango-north','env-tree-mango',49,22,.15,'buildings'],['palm-east','env-tree-palm',92,34,.13,'buildings'],
 ['shrub-shop','env-shrub',12,67,.045,'buildings'],['shrub-home','env-shrub',73,27,.055,'buildings'],
 ['noticeboard','env-notice-front',32,66,.055,'buildings'],['bench','env-bench-front',41,55,.06,'buildings'],
 ['bin','env-bin-front',30,69,.022,'buildings'],['lamp','env-lamp-front',48,52,.07,'buildings']];
 s.items=s.items.map(i=>i.layer==='buildings'?{...i,order:0}:i);
 for(const [id,assetId,x,y,scale,layer] of placements)s.items.push({id:'c01-'+id,assetId,label:s.assets.find(a=>a.id===assetId)!.label,layer,order:0,rotation:0,x,y,scale,anchor:{x:.5,y:['shop','mixed','blue','yellow'].includes(assetId)?.77:.96}});
 s.camera=fitCamera(s.items,s.assets);return s;
}

export function approvedHillsideScene():Scene {return parseScene(structuredClone(hillsideSnapshot));}
