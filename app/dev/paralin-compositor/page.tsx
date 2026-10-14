"use client";
import {useEffect,useMemo,useRef,useState} from "react";

type Building={id:string;file:string;x:number;y:number;scale:number;layer:number;label:string};
const ROOT="/api/paralin-asset?file=";
const catalog=[
["shop","commercial/corner-shop/paralin-shop-corner-01-base.png","Corner shop"],
["mixed","mixed-use/restaurant-residence/paralin-mixed-use-restaurant-residence-01-base.png","Restaurant / residence"],
["yellow","residential/small-single-storey/paralin-house-small-01-base.png","Yellow house"],
["blue","residential/small-single-storey/paralin-house-small-02-base.png","Blue house"],
["coral","residential/small-single-storey/paralin-house-small-03-base.png","Coral house"],
["raised","residential/raised/paralin-house-raised-01-base.png","Raised house"],
["two","residential/two-storey/paralin-house-two-storey-01-base.png","Two-storey house"],
["hill","residential/hillside/paralin-house-hillside-01-base.png","Hillside assembly"]
] as const;
const initial:Building[]=[
{id:"shop-1",file:catalog[0][1],x:68,y:53,scale:.22,layer:3,label:"Corner Shop"},
{id:"mixed-1",file:catalog[1][1],x:24,y:42,scale:.22,layer:2,label:"Restaurant"},
{id:"house-1",file:catalog[2][1],x:15,y:19,scale:.19,layer:1,label:"Home"},
{id:"house-2",file:catalog[3][1],x:49,y:17,scale:.19,layer:1,label:"Home"},
{id:"house-3",file:catalog[6][1],x:81,y:15,scale:.18,layer:1,label:"Home"}
];
export default function ParalinCompositor(){
const [items,setItems]=useState<Building[]>(initial);
const [selected,setSelected]=useState("shop-1");
const [zoom,setZoom]=useState(1);
const [pan,setPan]=useState({x:0,y:0});
const [guides,setGuides]=useState(true);
const [drag,setDrag]=useState<{id:string;px:number;py:number;x:number;y:number}|null>(null);
const [notice,setNotice]=useState("");
const stage=useRef<HTMLDivElement>(null);
const current=items.find(i=>i.id===selected);
const sorted=useMemo(()=>[...items].sort((a,b)=>a.layer-b.layer||a.y-b.y),[items]);
function change(id:string,patch:Partial<Building>){setItems(v=>v.map(i=>i.id===id?{...i,...patch}:i));}
function add(index:number){const c=catalog[index];const id=c[0]+"-"+Date.now();setItems(v=>[...v,{id,file:c[1],label:c[2],x:50,y:48,scale:.2,layer:3}]);setSelected(id);}
function download(){const data={schema:"storypath-paralin-composition-v1",canvas:{width:1600,height:900},camera:{zoom,pan},buildings:items};const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));a.download="paralin-village-centre.json";a.click();URL.revokeObjectURL(a.href);}
async function load(file:File){try{const d=JSON.parse(await file.text());if(!Array.isArray(d.buildings))throw Error("Missing buildings");setItems(d.buildings);setZoom(d.camera?.zoom??1);setPan(d.camera?.pan??{x:0,y:0});setSelected(d.buildings[0]?.id??"");setNotice("Composition loaded");}catch{setNotice("Invalid composition JSON");}}
function move(e:React.PointerEvent<HTMLDivElement>){if(!drag||!stage.current)return;const rect=stage.current.getBoundingClientRect();const dx=(e.clientX-drag.px)/rect.width*100/zoom;const dy=(e.clientY-drag.py)/rect.height*100/zoom;change(drag.id,{x:Math.max(0,Math.min(100,drag.x+dx)),y:Math.max(0,Math.min(100,drag.y+dy))});}
const control:React.CSSProperties={background:"#fff",border:"1px solid #c6d4cf",borderRadius:7,padding:"7px",width:"100%"};
return <main style={{minHeight:"100vh",background:"#edf3ee",color:"#193b35",fontFamily:"system-ui,sans-serif",padding:20}}>
<header style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"center",flexWrap:"wrap",marginBottom:16}}><div><h1 style={{margin:0,fontSize:24}}>Paralin · Scene Compositor</h1><p style={{margin:"5px 0",fontSize:13}}>Village Centre · composition prototype · original PNGs unchanged</p></div><div style={{display:"flex",gap:8}}><button onClick={()=>{setItems(initial);setZoom(1);setPan({x:0,y:0});}} style={control}>Reset</button><button onClick={download} style={{...control,background:"#155a49",color:"white",cursor:"pointer"}}>Export JSON</button><label style={{...control,cursor:"pointer",whiteSpace:"nowrap"}}>Import JSON<input type="file" accept=".json,application/json" hidden onChange={e=>{const f=e.target.files?.[0];if(f)load(f);}}/></label></div></header>
<div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) 280px",gap:16,alignItems:"start"}}>
<section><div ref={stage} onPointerMove={move} onPointerUp={()=>setDrag(null)} onPointerCancel={()=>setDrag(null)} style={{position:"relative",width:"100%",aspectRatio:"16/9",overflow:"hidden",touchAction:"none",border:"3px solid #294b3b",borderRadius:12,background:"linear-gradient(#9acbd9 0%,#d6e4c5 34%,#88b97a 35%,#81aa70 100%)",boxShadow:"0 10px 30px #1b3a2825"}}>
<div style={{position:"absolute",inset:0,transform:`translate(${pan.x}%,${pan.y}%) scale(${zoom})`,transformOrigin:"50% 50%"}}>
<div style={{position:"absolute",left:"-20%",top:"38%",width:"140%",height:"30%",background:"#797b72",transform:"rotate(-12deg)",borderTop:"9px solid #d8d0ad",borderBottom:"9px solid #d8d0ad"}}/>
<div style={{position:"absolute",left:"28%",top:"28%",width:"13%",height:"110%",background:"#7a7b73",transform:"rotate(38deg)",borderLeft:"8px solid #d8d0ad",borderRight:"8px solid #d8d0ad"}}/>
{guides&&<div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(#ffffff33 1px,transparent 1px),linear-gradient(90deg,#ffffff33 1px,transparent 1px)",backgroundSize:"5% 5%",pointerEvents:"none"}}/>}
{sorted.map(item=><div key={item.id} onPointerDown={e=>{e.stopPropagation();e.currentTarget.setPointerCapture(e.pointerId);setSelected(item.id);setDrag({id:item.id,px:e.clientX,py:e.clientY,x:item.x,y:item.y});}} style={{position:"absolute",left:item.x+"%",top:item.y+"%",width:(item.scale*100)+"%",transform:"translate(-50%,-77%)",cursor:"grab",zIndex:item.layer*100+Math.round(item.y),outline:selected===item.id?"2px dashed #ffdd4b":"none",borderRadius:5}}>
<img src={ROOT+encodeURIComponent(item.file)} draggable={false} alt={item.label} style={{width:"100%",height:"auto",display:"block",pointerEvents:"none"}}/>
{guides&&<span style={{position:"absolute",bottom:-15,left:"50%",transform:"translateX(-50%)",background:"#ffffffdc",padding:"2px 5px",borderRadius:3,fontSize:10,whiteSpace:"nowrap"}}>{item.label}</span>}
</div>)}
{guides&&<div style={{position:"absolute",left:"48%",top:"72%",background:"#ffefac",padding:7,borderRadius:8,fontWeight:700,fontSize:12}}>Player spawn / school route ↗</div>}
</div></div>
<p style={{fontSize:12,color:"#4d625a"}}>Drag buildings to place them. The roads and terrain are temporary schematic guides, not approved artwork. Building PNGs are loaded directly from the repository.</p></section>
<aside style={{background:"white",padding:16,borderRadius:12,boxShadow:"0 3px 16px #1b3a2817",display:"grid",gap:12}}>
<strong>Scene controls</strong>
<label>Camera zoom: {zoom.toFixed(2)}×<input type="range" min=".65" max="1.6" step=".05" value={zoom} onChange={e=>setZoom(+e.target.value)} style={{width:"100%"}}/></label>
<label>Camera horizontal offset<input type="range" min="-30" max="30" value={pan.x} onChange={e=>setPan(v=>({...v,x:+e.target.value}))} style={{width:"100%"}}/></label>
<label>Camera vertical offset<input type="range" min="-30" max="30" value={pan.y} onChange={e=>setPan(v=>({...v,y:+e.target.value}))} style={{width:"100%"}}/></label>
<label><input type="checkbox" checked={guides} onChange={e=>setGuides(e.target.checked)}/> Show composition guides</label>
<hr style={{width:"100%",border:"none",borderTop:"1px solid #dde6df"}}/>
<strong>Add approved asset</strong>
<select style={control} defaultValue="" onChange={e=>{if(e.target.value!=="")add(+e.target.value);e.target.value="";}}><option value="">Choose a building…</option>{catalog.map((c,i)=><option key={c[0]} value={i}>{c[2]}</option>)}</select>
<strong>Selected building</strong>
<select style={control} value={selected} onChange={e=>setSelected(e.target.value)}>{items.map(i=><option key={i.id} value={i.id}>{i.label} ({i.id})</option>)}</select>
{current&&<><label>Label<input style={control} value={current.label} onChange={e=>change(selected,{label:e.target.value})}/></label><label>Size: {Math.round(current.scale*100)}%<input type="range" min=".08" max=".5" step=".01" value={current.scale} onChange={e=>change(selected,{scale:+e.target.value})} style={{width:"100%"}}/></label><label>Layer<input type="number" min="0" max="9" style={control} value={current.layer} onChange={e=>change(selected,{layer:+e.target.value})}/></label><div style={{display:"flex",gap:8}}><label style={{flex:1}}>X<input type="number" min="0" max="100" style={control} value={Math.round(current.x)} onChange={e=>change(selected,{x:+e.target.value})}/></label><label style={{flex:1}}>Y<input type="number" min="0" max="100" style={control} value={Math.round(current.y)} onChange={e=>change(selected,{y:+e.target.value})}/></label></div><button style={{...control,color:"#a13232"}} onClick={()=>{setItems(v=>v.filter(i=>i.id!==selected));setSelected(items.find(i=>i.id!==selected)?.id??"");}}>Remove selected</button></>}
{notice&&<p role="status">{notice}</p>}
</aside></div>
</main>;
}
