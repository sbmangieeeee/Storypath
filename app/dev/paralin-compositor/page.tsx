"use client";
import {useRef,useState} from 'react';
import {type Scene,type Item,type Asset,type LayerId,approvedHillsideScene,villageComposition01,villageDraftScene,environmentAudit,environmentAssets,environmentTestScene,switchLamp,layerIds,buildingAssets,roadAssets,roadTestScene,createScene,parseScene,sourceUrl,pngDimensions,fitCamera,visibleItems,clippedItems,clamp} from '@/lib/paralin-scene';
import './compositor.css';

export default function ParalinCompositor(){
  const [scene,setScene]=useState<Scene>(createScene);
  const [selected,setSelected]=useState('shop-1');
  const [targetLayer,setTargetLayer]=useState<LayerId>('roads');
  const [guides,setGuides]=useState(true);
  const [notice,setNotice]=useState('');
  const [busy,setBusy]=useState(false);
  const stage=useRef<HTMLDivElement>(null);
  const drag=useRef<{id:string;px:number;py:number;x:number;y:number}|null>(null);
  const current=scene.items.find(i=>i.id===selected);
  const lampGroup=environmentAssets.find(a=>a.id===current?.assetId)?.lampGroup;
  const activeLayer=scene.layers.find(l=>l.id===current?.layer);
  const clipped=clippedItems(scene);
  const {zoom,pan}=scene.camera;
  function patch(id:string,changes:Partial<Item>){setScene(s=>({...s,items:s.items.map(i=>i.id===id?{...i,...changes}:i)}));}
  function camera(changes:Partial<Scene['camera']>){setScene(s=>({...s,camera:{...s.camera,...changes}}));}
  function frame(){setScene(s=>({...s,camera:fitCamera(visibleItems(s),s.assets)}));}
  function add(asset:Asset,layer:LayerId){
    const id=crypto.randomUUID();
    setScene(s=>{
      if(s.items.length>=200||(!s.assets.some(a=>a.id===asset.id)&&s.assets.length>=200)||s.layers.find(l=>l.id===layer)?.locked){return s;}
      const next={...s,assets:s.assets.some(a=>a.id===asset.id)?s.assets:[...s.assets,asset],items:[...s.items,{id,assetId:asset.id,label:asset.label,layer,order:3,rotation:0,x:50,y:60,scale:layer==='background'||layer==='terrain'?1:.22,anchor:{x:.5,y:layer==='buildings'?.77:1}}],layers:s.layers.map(l=>l.id===layer?{...l,visible:true}:l)};
      return {...next,camera:fitCamera(visibleItems(next),next.assets)};
    });setSelected(id);
  }
  function download(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(scene,null,2)],{type:'application/json'}));a.download='paralin-village-centre-v2.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
  async function decode(asset:Asset){const img=new Image();img.src=sourceUrl(asset);await img.decode();if(img.naturalWidth!==asset.width||img.naturalHeight!==asset.height)throw Error('PNG dimensions do not match');}
  async function load(file:File){setBusy(true);try{
    if(file.size>40_000_000)throw Error('Composition exceeds 40 MB');
    const next=parseScene(JSON.parse(await file.text()));
    await Promise.all(next.assets.filter(a=>next.items.some(i=>i.assetId===a.id)).map(decode));
    setScene(next);setSelected(next.items[0]?.id??'');setNotice('Composition loaded. Camera and layer settings restored.');
  }catch{setNotice('Invalid composition JSON or unavailable PNG. Current scene preserved.');}finally{setBusy(false);}}
  async function upload(file:File){setBusy(true);try{
    if(file.size>6_000_000)throw Error('PNG must be smaller than 6 MB');
    const source=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result as string);reader.onerror=reject;reader.readAsDataURL(file);});
    const asset={id:crypto.randomUUID(),label:file.name.replace(/\.png$/i,'').slice(0,120)||'PNG asset',source,...pngDimensions(source)};
    await decode(asset);
    if(scene.assets.reduce((n,a)=>n+(a.source.startsWith('data:')?a.source.length:0),0)+source.length>32_000_000)throw Error('Embedded PNG budget reached (32 MB)');
    add(asset,targetLayer);setNotice('PNG placed in '+targetLayer+'. Imported files are review candidates; approval is not implied.');
  }catch(e){setNotice('Could not place PNG: '+(e instanceof Error?e.message:'Could not read PNG'));}finally{setBusy(false);}}
  function move(e:React.PointerEvent<HTMLDivElement>){const d=drag.current;if(!d||!stage.current)return;patch(d.id,{x:clamp(d.x+(e.clientX-d.px)/stage.current.clientWidth*100/zoom,-200,300),y:clamp(d.y+(e.clientY-d.py)/stage.current.clientHeight*100/zoom,-200,300)});}
  return <main className="compositor">
    <header><div><p className="editor-kicker">STORYPATH / DEVELOPMENT TOOL</p><h1>Paralin · Layered Scene Compositor</h1><p>Village Centre · construction workspace · composition awaiting review</p></div><div className="editor-actions"><button disabled={busy} onClick={()=>{setScene(createScene());setSelected('shop-1');setNotice('');}}>Reset</button><button onClick={download}>Export JSON</button><label className="file-button">Import JSON<input aria-label="Import JSON" type="file" accept=".json,application/json" disabled={busy} onChange={e=>{const f=e.target.files?.[0];if(f)void load(f);e.target.value='';}}/></label></div></header>
    <div className="compositor-layout"><section className="scene-workspace">
      <div className="canvas-toolbar"><strong>Scene preview</strong><button onClick={frame}>Fit visible scene</button><label><input type="checkbox" checked={guides} onChange={e=>setGuides(e.target.checked)}/> Ground contacts & guides</label></div>
      <div data-testid="stage" ref={stage} className="scene-stage" onPointerMove={move} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}} onLostPointerCapture={()=>{drag.current=null;}}>
        <div className="scene-camera" data-testid="camera" style={{transform:`translate(${pan.x}%,${pan.y}%) scale(${zoom})`}}>
          {scene.layers.map((layer,layerIndex)=><div key={layer.id} data-scene-layer={layer.id} className="scene-layer" style={{zIndex:layerIndex,display:layer.visible?'block':'none'}}>
            {scene.items.filter(i=>i.layer===layer.id).sort((a,b)=>a.order-b.order||a.y-b.y).map((item,index)=>{
              const asset=scene.assets.find(a=>a.id===item.assetId)!;
              return <div key={item.id} data-item={item.id} data-building={item.layer==='buildings'?item.id:undefined} className={`scene-item ${selected===item.id?'selected':''}`} onPointerDown={e=>{
                if(e.button!==0||layer.locked||busy)return;e.stopPropagation();e.currentTarget.setPointerCapture(e.pointerId);setSelected(item.id);drag.current={id:item.id,px:e.clientX,py:e.clientY,x:item.x,y:item.y};
              }} style={{left:item.x+'%',top:item.y+'%',width:item.scale*100+'%',transform:`translate(${-item.anchor.x*100}%,${-item.anchor.y*100}%) rotate(${item.rotation??0}deg)`,transformOrigin:`${item.anchor.x*100}% ${item.anchor.y*100}%`,zIndex:index+1,pointerEvents:layer.locked?'none':'auto'}}>
                {/* Original PNGs are deliberately rendered without image optimization. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sourceUrl(asset)} alt={item.label} draggable={false} onError={()=>setNotice('Could not load PNG: '+asset.label)} />
              </div>;
            })}
          </div>)}
          {guides&&<div className="contact-overlay" data-testid="contact-overlay">{visibleItems(scene).map(i=><div className="ground-contact" key={i.id} style={{left:i.x+'%',top:i.y+'%'}}><span className="contact-cross"/><span className="contact-label">{i.label} · {i.x.toFixed(1)}, {i.y.toFixed(1)}</span></div>)}</div>}
        </div>
        {guides&&<div className="safe-frame" aria-hidden="true"/>}
      </div>
      <p className="canvas-caption">Neutral transparency workspace. Empty layers remain transparent until PNG assets are placed. Contact crosses mark each PNG’s editable anchor; they are editor guides, not scenery.</p>
      <p role="status" className={clipped.length?'editor-warning':'editor-status'}>{clipped.length?`${clipped.length} asset(s) extend beyond the camera. Use Fit visible scene before review.`:'All visible asset bounds are inside the camera.'}</p>
      <div className="road-tests"><strong>Saved scenes - replaces current placement</strong><button onClick={()=>{setScene(approvedHillsideScene());setSelected('');setGuides(false);setNotice('Approved hillside snapshot loaded as an editable copy. Permanent preset remains unchanged.');}}>paralin_hillside_neighbourhood_01</button><button onClick={()=>{setScene(villageComposition01());setSelected('');setGuides(false);setNotice('Paralin Village Centre — Composition 01. Review only: terrain tile boundaries, road seam and shop entrance join remain visible.');}}>Paralin Village Centre — Composition 01</button><button onClick={()=>{setScene(villageDraftScene());setSelected('');setGuides(false);setNotice('Draft only: pavement has a baked checkerboard; road and building joins remain incompatible. Artwork is unchanged.');}}>Village Centre draft</button><button onClick={()=>{setScene(environmentTestScene());setSelected('env-lamp-front');}}>Environment integration test</button><div className="editor-actions"><button disabled={busy} onClick={()=>{setScene(roadTestScene());setSelected('straight-test');}}>Straight road test</button><button disabled={busy} onClick={()=>{setScene(roadTestScene(true));setSelected('round-test');}}>Two-road connection test</button></div><small>Export your composition before switching tests. Both road PNGs are pending review.</small></div><div className="missing-assets"><strong>Environment layers awaiting approved artwork</strong><p>Background panorama • transparent pavement and junction exports • compatible road terminals • entrance joins • long roadside drain • character placement poses.</p><p>Buildings retain their baked lighting, plants and paving. Ground contacts require visual calibration against future road and terrain assets.</p></div>
    </section><aside>
      <section><h2>Camera</h2><label>Camera zoom: {zoom.toFixed(2)}×<input type="range" min=".05" max="2" step=".01" value={zoom} onChange={e=>camera({zoom:+e.target.value})}/></label><div className="editor-pair"><label>Camera horizontal offset<input type="number" min="-1000" max="1000" step="1" value={+pan.x.toFixed(2)} onChange={e=>camera({pan:{...pan,x:clamp(+e.target.value,-1000,1000)}})}/></label><label>Camera vertical offset<input type="number" min="-1000" max="1000" step="1" value={+pan.y.toFixed(2)} onChange={e=>camera({pan:{...pan,y:clamp(+e.target.value,-1000,1000)}})}/></label></div></section>
      <section><h2>Scene layers <small>back → front</small></h2><div className="layer-list">{scene.layers.map(l=><div className="layer-row" key={l.id}><label><input type="checkbox" aria-label={`Show ${l.id}`} checked={l.visible} onChange={e=>setScene(s=>({...s,layers:s.layers.map(x=>x.id===l.id?{...x,visible:e.target.checked}:x)}))}/><span>{l.id}</span><small>{scene.items.filter(i=>i.layer===l.id).length}</small></label><label className="lock-control"><input type="checkbox" aria-label={`Lock ${l.id}`} checked={l.locked} onChange={e=>setScene(s=>({...s,layers:s.layers.map(x=>x.id===l.id?{...x,locked:e.target.checked}:x)}))}/>Lock</label></div>)}</div></section>
      <section><h2>Add asset</h2><label>Existing building PNG<select aria-label="Add approved asset" disabled={busy||scene.items.length>=200||scene.layers.find(l=>l.id==='buildings')?.locked} value="" onChange={e=>{const a=buildingAssets[+e.target.value];if(a)add(a,'buildings');}}><option value="" disabled>Choose a building…</option>{buildingAssets.map((a,i)=><option key={a.id} value={i}>{a.label}</option>)}</select></label><label>Road asset<select aria-label="Add road asset" disabled={busy||scene.items.length>=200||scene.layers.find(l=>l.id==='roads')?.locked} value="" onChange={e=>{const a=roadAssets[+e.target.value];if(a)add(a,'roads');}}><option value="" disabled>Choose a road (pending review)-</option>{roadAssets.map((a,i)=><option key={a.id} value={i}>{a.label}</option>)}</select></label><label>Validated environment PNG<select aria-label="Add environment asset" value="" disabled={busy||scene.items.length>=200} onChange={e=>{const a=environmentAssets.find(a=>a.id===e.target.value);if(a){add(a,a.defaultLayer as LayerId);setNotice(a.notes);}}}><option value="" disabled>Choose a review candidate…</option>{environmentAssets.map(a=><option key={a.id} value={a.id} disabled={scene.layers.find(l=>l.id===a.defaultLayer)?.locked}>{a.label} — {a.defaultLayer}</option>)}</select></label><details><summary>Needs repair: 3 opaque PNGs</summary><label>Place repair candidate<select aria-label="Add repair candidate" value="" onChange={e=>{const a=environmentAudit.find(a=>a.id===e.target.value);if(a){add(a,a.defaultLayer as LayerId);setNotice(a.notes);}}}><option value="" disabled>Review only — opaque background</option>{environmentAudit.filter(a=>!a.usable).map(a=><option key={a.id} value={a.id} disabled={scene.layers.find(l=>l.id===a.defaultLayer)?.locked}>{a.label}</option>)}</select></label>{environmentAudit.filter(a=>!a.usable).map(a=><p key={a.id}>{a.label}: {a.notes}</p>)}<p>All other assets are review candidates, not production approvals. Long roadside drain and entrance joins are still missing.</p></details><label>PNG destination layer<select value={targetLayer} onChange={e=>setTargetLayer(e.target.value as LayerId)}>{layerIds.map(l=><option key={l}>{l}</option>)}</select></label><label className="file-button">Place environment PNG<input aria-label="Place environment PNG" type="file" accept="image/png,.png" disabled={busy||scene.items.length>=200||scene.assets.length>=200||scene.layers.find(l=>l.id===targetLayer)?.locked} onChange={e=>{const f=e.target.files?.[0];if(f)void upload(f);e.target.value='';}}/></label><small>Original PNG bytes embedded in JSON. Up to 6 MB each / 32 MB combined. No artwork is generated.</small></section>
      <section><h2>Selected asset</h2><select aria-label="Selected asset" value={selected} onChange={e=>setSelected(e.target.value)}><option value="">None</option>{scene.items.map(i=><option key={i.id} value={i.id}>{i.label} ({i.layer})</option>)}</select>
        {current&&<fieldset disabled={busy||activeLayer?.locked}>{lampGroup&&<label>Lamp lighting<select aria-label="Lamp lighting" value={current.assetId} onChange={e=>setScene(s=>switchLamp(s,current.id,e.target.value))}>{environmentAssets.filter(a=>a.lampGroup===lampGroup).map(a=><option key={a.id} value={a.id}>{a.label}</option>)}</select><small>Placement retained. Source silhouettes differ; review the base alignment.</small></label>}<label>Label<input maxLength={120} value={current.label} onChange={e=>patch(selected,{label:e.target.value||'Asset'})}/></label><label>Scene layer<select value={current.layer} onChange={e=>patch(selected,{layer:e.target.value as LayerId})}>{layerIds.map(l=><option key={l} disabled={scene.layers.find(x=>x.id===l)?.locked}>{l}</option>)}</select></label><label>Size: {Math.round(current.scale*100)}%<input type="range" min=".01" max="2" step=".01" value={current.scale} onChange={e=>patch(selected,{scale:+e.target.value})}/></label><label>Rotation (degrees)<input type="number" min="-180" max="180" step="1" value={current.rotation??0} onChange={e=>patch(selected,{rotation:clamp(+e.target.value,-180,180)})}/></label><small>2D rotation around contact; does not change the authored camera perspective.</small><label>Order within layer<input type="number" min="0" max="999" value={current.order} onChange={e=>patch(selected,{order:clamp(Math.round(+e.target.value),0,999)})}/></label><div className="editor-pair">{(['x','y'] as const).map(axis=><label key={axis}>{axis.toUpperCase()}<input type="number" min="-200" max="300" step=".1" value={+current[axis].toFixed(2)} onChange={e=>patch(selected,{[axis]:clamp(+e.target.value,-200,300)})}/></label>)}</div><div className="editor-pair">{(['x','y'] as const).map(axis=><label key={axis}>Contact {axis.toUpperCase()} %<input type="number" min="0" max="100" step="1" value={Math.round(current.anchor[axis]*100)} onChange={e=>patch(selected,{anchor:{...current.anchor,[axis]:clamp(+e.target.value,0,100)/100}})}/></label>)}</div><small>Contact position inside the PNG. X/Y place that contact in the scene.</small><button onClick={()=>{setScene(s=>({...s,items:s.items.filter(i=>i.id!==selected)}));setSelected('');}}>Remove selected</button></fieldset>}
        {activeLayer?.locked&&<p>Unlock this layer to edit or drag its assets.</p>}
      </section>{busy&&<p role="status">Checking PNG data…</p>}{notice&&<p role="status">{notice}</p>}
    </aside></div>
  </main>;
}
