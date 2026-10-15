# Road connection refinement — 14 October 2026

Status: NOT APPROVED. Placement-only review; original PNGs are unchanged.

## Selected placement

Nine combinations were compared in the actual compositor: curve scales 44%, 44.8%, 46%, 41.6%, 42.6%, 43.6%, 41.2%, 41.2%, 40.6%, with respective rotations 0, -1, -2, 0, 0, 0, 3, 5, 3 degrees. Endpoint positions were adjusted between comparison groups. This is the best visual compromise among those candidates, not a claim of exhaustive mathematical optimization.

| Instance | X % | Y % | Width scale | Rotation | Within-layer order |
|---|---:|---:|---:|---:|---:|
| Straight road | 38 | 74 | 40% | 0 degrees | 1 |
| Curved road | 67.2373 | 41.8120 | 40.6% | +3 degrees | 2 |
| Corner shop | 23 | 63.5 | 22% (unchanged) | 0 degrees | 1, buildings layer |

Road anchors remain (0.5, 0.5); shop anchor remains (0.5, 0.77). The curved road is only 1.5% wider than the straight road in scene scale. Normal view is the editor's 1x world-camera baseline, with pan (0, -8); this is not a newly approved gameplay-camera specification. Close-up uses 2x and pan (-4.75, -16.11). The close-up intentionally crops distant assets to inspect the joint. No guide or selection overlay covers the artwork in these screenshots.

The shop was moved down and left from the previous (28,47) placement. Its right-hand plinth corner now reaches the rear pavement edge. Its entire frontage/doorway cannot connect naturally by translation alone: the baked plinth edge and road pavement run in different directions. That remaining wedge is exposed, not filled with artificial scenery.

## Artwork changes needed for a truly modular join

The seam is between the straight road's upper-right end and the curved road's lower-left end.

1. **Shared connection cross-section:** author both ends against the same six alignment points: outer pavement edges, inner kerb/asphalt edges, and lane-centre/tangent references. Match the pavement widths, asphalt width, kerb height and projected depth at that plane. Uniform scale currently improves one edge while leaving the other slightly stepped.
2. **Connecting ends must not look like terminal ends:** the curve has a shaded pavement end face at the upper side of this join, plus a notch/end treatment on the lower side. Provide a flush connecting-end variant without those terminal faces. Keep the existing supplied PNGs intact as originals.
3. **Lane marking continuity:** the straight segment's last dash is cut into a short fragment at the seam while the curve begins a longer dash with a different tangent. Match centreline position, dash width, spacing and phase at the shared endpoint. Use a defined half-dash or deliberate shared gap at the connection, not independent painted endings.
4. **Road surface continuity:** match asphalt tone, grain scale, gutter dirt and baked edge shading across a small seam band. The current join has a conspicuous diagonal dark boundary and a roughness/value change. Align crack/detail treatment only where it crosses the join; do not hide it with an overlay.
5. **Pavement continuity:** align slab boundaries and gutter profiles where feasible. Drain placement should not force two terminal drain details into the same junction area. Decide whether each drain belongs in the modular piece or a separately approved detail later; nothing has been removed here.
6. **Shop approach:** supply an approved entrance/apron piece whose shop-side edge matches the existing plinth and whose street-side edge matches the road's oblique rear pavement. The doorway needs a coherent walkable surface, not merely a corner touching the kerb. Preserve the approved building PNG. No apron has been generated in this task.

A 2D rotation cannot change the authored camera elevation or the differing pavement profiles. Larger rotations improved some edge tangents but worsened the rest of the joint. Both roads remain pending review.

## Review artifacts and validation

- Normal-scale screenshot: `tmp/road-refinement/normal.png`.
- Road connection close-up: `tmp/road-refinement/close-up.png`.
- Re-importable scene: `tmp/road-refinement/revised.json`.
- Updated compositor button: **Two-road connection test**.
- Production build: passed; desktop and mobile road-function tests: both passed before the final 3.5-percentage-point shop Y adjustment. This last placement-only adjustment was visually inspected in the running compositor and rebuilt.
- Original road SHA-256 values still match the recorded manifest. No building or road image edits, additional scenery, masking overlays, or changes to main.

Stop here for visual review. This supersedes the placement values in ROAD-REVIEW.md, not the original asset integrity audit.
