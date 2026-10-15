import environmentRegistry from '@/lib/paralin-environment-assets.json';
import {NextRequest,NextResponse} from "next/server";
import {readFile} from "node:fs/promises";
import path from "node:path";
const ROOT=path.resolve(process.cwd(),"design/storypath/environments/paralin");
export async function GET(request:NextRequest){
const file=request.nextUrl.searchParams.get("file");
if(!file||!/^[_a-z0-9/-]+\.png$/i.test(file))return new NextResponse("Invalid asset path",{status:400});
const environment=environmentRegistry.some(a=>a.source===file)||["roads/straight_road.png","roads/round_road.png"].includes(file);
const BASE=environment?ROOT:path.join(ROOT,"architecture");
if(/^(roads|ground|vegetation|street-furniture)\//.test(file)&&!environment)return new NextResponse("Asset not found",{status:404});
const resolved=path.resolve(BASE,file);
if(!resolved.startsWith(BASE+path.sep))return new NextResponse("Invalid asset path",{status:400});
try{const bytes=await readFile(resolved);return new NextResponse(bytes,{headers:{"Content-Type":"image/png","Cache-Control":"public, max-age=3600"}});}
catch{return new NextResponse("Asset not found",{status:404});}
}


