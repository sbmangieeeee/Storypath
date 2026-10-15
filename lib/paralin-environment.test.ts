import {describe,it,expect} from 'vitest';
import {environmentAssets,environmentAudit,environmentTestScene,switchLamp,parseScene,clippedItems} from './paralin-scene';
describe('environment integration',()=>{
 it('keeps opaque checkerboards out of scene library',()=>{expect(environmentAssets).toHaveLength(20);expect(environmentAudit.filter(a=>!a.usable).map(a=>a.id)).toEqual(['env-pavement','env-crossroads','env-roundabout']);});
 it('preserves every placement field when toggling lamps and round trips JSON',()=>{const s=environmentTestScene();const before=s.items.find(i=>i.id==='env-lamp-front')!;const next=switchLamp(s,before.id,'env-lamp-front-lit');expect(next.items.find(i=>i.id===before.id)).toEqual({...before,assetId:'env-lamp-front-lit'});expect(parseScene(JSON.parse(JSON.stringify(next)))).toEqual(next);expect(clippedItems(next)).toHaveLength(0);});
 it('rejects unrelated variants and respects layer locks',()=>{const s=environmentTestScene();expect(switchLamp(s,'env-lamp-front','env-lamp-rear')).toBe(s);s.layers.find(l=>l.id==='foreground')!.locked=true;expect(switchLamp(s,'env-lamp-front','env-lamp-front-lit')).toBe(s);});
});
