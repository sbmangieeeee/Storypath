# Paralin environmental integration audit — 2026-10-14

Branch: storypath-visual-reset. All 23 originals found in C:/Users/angel/Desktop/Paralin (the stated Downloads paths no longer contain them). Copied byte-for-byte, normalized filenames only. SHA-256 values and full pixel measurements are recorded in environment-audit.json and asset-manifest.json. Existing building PNGs, curriculum, initial building positions and road review presets were preserved. No artwork was generated, stretched, cropped or recoloured.

## Results

23 PNGs fully decoded. 20 contain actual transparent pixels and are registered as review candidates. Three are fully opaque and excluded from the placement library: pavement, crossroads and roundabout. Their unchanged source files remain available for reference audit. A valid alpha channel does not establish production suitability.

Locations below are relative to design/storypath/environments/paralin/. Runtime URLs use /api/paralin-asset?file=<relative path>. Buildings retain their existing architecture/ convention. Existing roads/straight_road.png and roads/round_road.png remain backward-compatible aliases; canonical road copies are byte-identical. The curved road is not the roundabout.

| Supplied filename | Dimensions | Transparency | Repository location | Integration status |
|---|---|---|---|---|
| paralin_village_noticeboard_01_back.png.png | 1312 × 1199 | 36.57% fully transparent; alpha 0–255 | street-furniture/paralin_village_noticeboard_01_rear.png | Registered — pending visual approval |
| paralin_village_noticeboard_01_front.png.png | 1312 × 1199 | 37.75% fully transparent; alpha 0–255 | street-furniture/paralin_village_noticeboard_01_front.png | Registered — pending visual approval |
| paralin_street_bin_01.png.png | 1024 × 1536 | 34.57% fully transparent; alpha 0–254 | street-furniture/paralin_street_bin_01.png | Registered — pending visual approval |
| paralin_street_bin_01_rear.pn.png | 1024 × 1536 | 36.37% fully transparent; alpha 0–254 | street-furniture/paralin_street_bin_01_rear.png | Registered — pending visual approval |
| paralin_street_lamp_01_rear.png.png | 1024 × 1536 | 87.22% fully transparent; alpha 0–254 | street-furniture/paralin_street_lamp_01_rear.png | Registered — pending visual approval |
| paralin_street_lamp_01_rear_lit.png.png | 1024 × 1536 | 85.97% fully transparent; alpha 0–254 | street-furniture/paralin_street_lamp_01_rear_lit.png | Registered — pending visual approval |
| paralin_street_lamp_01_lit.png.png | 1024 × 1536 | 88.86% fully transparent; alpha 0–254 | street-furniture/paralin_street_lamp_01_lit.png | Registered — pending visual approval |
| paralin_street_lamp_01.png.png | 1024 × 1536 | 90.68% fully transparent; alpha 0–254 | street-furniture/paralin_street_lamp_01.png | Registered — pending visual approval |
| paralin_street_bench_01_rear.png.png | 1536 × 1024 | 52.54% fully transparent; alpha 0–254 | street-furniture/paralin_street_bench_01_rear.png | Registered — pending visual approval |
| paralin_street_bench_01_front.png.png | 1536 × 1024 | 55.61% fully transparent; alpha 0–254 | street-furniture/paralin_street_bench_01_front.png | Registered — pending visual approval |
| paralin_tree_shade_01.png.png | 1215 × 1295 | 37.77% fully transparent; alpha 0–255 | vegetation/paralin_tree_shade_01.png | Registered — pending visual approval |
| paralin_plant_tropical_shrub_01.png.png | 1312 × 1199 | 38.52% fully transparent; alpha 0–255 | vegetation/paralin_shrub_tropical_01.png | Registered — pending visual approval |
| paralin_tree_mango_01.png.png | 1145 × 1374 | 39.49% fully transparent; alpha 0–255 | vegetation/paralin_tree_mango_01.png | Registered — pending visual approval |
| paralin_tree_coconut_palm_01.png.png | 1268 × 1241 | 59.45% fully transparent; alpha 0–255 | vegetation/paralin_tree_coconut_palm_01.png | Registered — pending visual approval |
| paralin_ground_dirt_01.png | 1536 × 1024 | 53.64% fully transparent; alpha 0–255 | ground/paralin_ground_dirt_01.png | Registered — pending visual approval |
| paralin_ground_grass_01.png.png | 1536 × 1024 | 51.42% fully transparent; alpha 0–254 | ground/paralin_ground_grass_01.png | Registered — pending visual approval |
| paralin_drain_short_01.png.png | 1536 × 1024 | 52.19% fully transparent; alpha 0–254 | ground/paralin_roadside_drain_short_01.png | Registered — pending visual approval |
| paralin_pavement_straight_01.png.png | 1774 × 887 | 0% fully transparent; alpha 255–255 | ground/paralin_pavement_straight_01.png | Blocked — opaque checkerboard |
| paralin_road_crossroads_01.png.png | 1536 × 1024 | 0% fully transparent; alpha 255–255 | roads/paralin_road_crossroads_01.png | Blocked — opaque checkerboard |
| paralin_road_roundabout_01.png.png | 1536 × 1024 | 0% fully transparent; alpha 255–255 | roads/paralin_road_roundabout_01.png | Blocked — opaque checkerboard |
| paralin_road_tjunction_01.png.png | 1536 × 1024 | 47.23% fully transparent; alpha 0–254 | roads/paralin_road_t_junction_01.png | Registered — pending visual approval |
| paralin_road_corner_01.png.png | 1536 × 1024 | 56.49% fully transparent; alpha 0–254 | roads/paralin_road_curve_01.png | Registered — pending visual approval |
| paralin_road_straight_01.png.png | 1536 × 1024 | 60.34% fully transparent; alpha 0–254 | roads/paralin_road_straight_01.png | Registered — pending visual approval |

## Edge and padding inspection

Full-resolution alpha scan plus browser rendering on light and dark backgrounds. Transparent area percentages include silhouette cutouts, so they are not equivalent to wasted padding. Lamp canvases are mostly empty around narrow poles; preserve these canvases for variant registration. No automatic trimming was applied. Except the curve, usable assets have no alpha >=200 pixels touching the image boundary. This does not prove that no source detail was cropped before export. Vegetation and noticeboards have tight bounds and fine coloured fringes visible at close inspection. Dirt has real transparency: the apparent checkerboard in its attachment preview is not an opaque canvas.

- **Noticeboard rear:** Real alpha; saturated edge fringes visible in supplied preview. Tight silhouette bounds need close-up review. Strong-content bounds [left, top, right, bottom]: 27, 5, 1295, 1184; strong boundary pixels: 0.
- **Noticeboard front:** Real alpha; saturated edge fringes visible in supplied preview. Tight silhouette bounds need close-up review. Strong-content bounds [left, top, right, bottom]: 43, 10, 1294, 1183; strong boundary pixels: 0.
- **Bin front:** Real alpha; soft edge/shadow pixels and contact position require visual review. Strong-content bounds [left, top, right, bottom]: 79, 10, 950, 1502; strong boundary pixels: 0.
- **Bin rear:** Real alpha; soft edge/shadow pixels and contact position require visual review. Strong-content bounds [left, top, right, bottom]: 92, 13, 953, 1494; strong boundary pixels: 0.
- **Lamp rear unlit:** Real alpha. Lit/unlit silhouettes and base proportions differ; switching preserves the transform, but artwork registration needs review. Strong-content bounds [left, top, right, bottom]: 228, 14, 888, 1524; strong boundary pixels: 0.
- **Lamp rear lit:** Real alpha. Lit/unlit silhouettes and base proportions differ; switching preserves the transform, but artwork registration needs review. Strong-content bounds [left, top, right, bottom]: 228, 10, 889, 1526; strong boundary pixels: 0.
- **Lamp front lit:** Real alpha. Lit/unlit silhouettes and base proportions differ; switching preserves the transform, but artwork registration needs review. Strong-content bounds [left, top, right, bottom]: 188, 11, 752, 1519; strong boundary pixels: 0.
- **Lamp front unlit:** Real alpha. Lit/unlit silhouettes and base proportions differ; switching preserves the transform, but artwork registration needs review. Strong-content bounds [left, top, right, bottom]: 213, 29, 727, 1509; strong boundary pixels: 0.
- **Bench rear:** Real alpha; soft edge/shadow pixels and contact position require visual review. Strong-content bounds [left, top, right, bottom]: 30, 13, 1501, 1012; strong boundary pixels: 0.
- **Bench front:** Real alpha; soft edge/shadow pixels and contact position require visual review. Strong-content bounds [left, top, right, bottom]: 74, 31, 1484, 999; strong boundary pixels: 0.
- **Shade tree:** Real alpha; saturated edge fringes visible in supplied preview. Tight silhouette bounds need close-up review. Strong-content bounds [left, top, right, bottom]: 19, 13, 1204, 1279; strong boundary pixels: 0.
- **Tropical shrub:** Real alpha; saturated edge fringes visible in supplied preview. Tight silhouette bounds need close-up review. Strong-content bounds [left, top, right, bottom]: 21, 12, 1297, 1163; strong boundary pixels: 0.
- **Mango tree:** Real alpha; saturated edge fringes visible in supplied preview. Tight silhouette bounds need close-up review. Strong-content bounds [left, top, right, bottom]: 14, 12, 1129, 1360; strong boundary pixels: 0.
- **Coconut palm:** Real alpha; saturated edge fringes visible in supplied preview. Tight silhouette bounds need close-up review. Strong-content bounds [left, top, right, bottom]: 130, 10, 1178, 1216; strong boundary pixels: 0.
- **Dirt ground:** Real alpha despite checkerboard-looking attachment preview; inspect residual pale edge pixels on contrasting backgrounds. Strong-content bounds [left, top, right, bottom]: 40, 27, 1493, 1002; strong boundary pixels: 0.
- **Grass ground:** Real alpha; soft edge/shadow pixels and contact position require visual review. Strong-content bounds [left, top, right, bottom]: 53, 33, 1485, 985; strong boundary pixels: 0.
- **Short roadside drain:** Real alpha; soft edge/shadow pixels and contact position require visual review. Strong-content bounds [left, top, right, bottom]: 81, 139, 1476, 933; strong boundary pixels: 0.
- **Straight pavement:** BLOCKED: fully opaque baked checkerboard. Requires a genuine transparent PNG export. Strong-content bounds [left, top, right, bottom]: 0, 0, 1773, 886; strong boundary pixels: 5318.
- **Crossroads:** BLOCKED: fully opaque baked checkerboard. Requires a genuine transparent PNG export. Strong-content bounds [left, top, right, bottom]: 0, 0, 1535, 1023; strong boundary pixels: 5116.
- **Roundabout:** BLOCKED: fully opaque baked checkerboard. Requires a genuine transparent PNG export. Strong-content bounds [left, top, right, bottom]: 0, 0, 1535, 1023; strong boundary pixels: 5116.
- **T junction:** Real alpha; axis-aligned projection differs from diagonal straight/curve. Requires matched camera, road width and terminal geometry. Strong-content bounds [left, top, right, bottom]: 8, 75, 1526, 948; strong boundary pixels: 0.
- **Curved road:** Real alpha; 45 strong boundary pixels indicate right-edge clipping. Terminal curb faces, asphalt tone and dash phase do not join seamlessly. Strong-content bounds [left, top, right, bottom]: 30, 9, 1535, 1023; strong boundary pixels: 45.
- **Straight road:** Real alpha; terminal curb faces and lane dash phase need a shared modular seam specification. Strong-content bounds [left, top, right, bottom]: 16, 34, 1519, 1008; strong boundary pixels: 0.

## Connection findings and required artwork work

- Straight / curve: retained prior best-fit review preset (curve scale .406, rotation 3 degrees). Road surfaces and curb terminals still have a seam; dash spacing/phase is not continuous. Curve has 45 strong pixels at the image boundary. Author matching terminal cross-sections, curb heights, pavement widths, asphalt tone and dash phase using one shared camera. See roads/CONNECTION-REFINEMENT.md.
- T junction / straight: transparent, but the junction has screen-horizontal/vertical arms while the straight uses diagonal projected axes. Rotating the straight approximately 33 degrees aligns its travel axis but not its transverse curb edges or vertical faces. Uniform scaling cannot satisfy both. Redraw/re-export the junction under the same elevated camera and modular road width; provide matched terminal anchors.
- Crossroads and roundabout: both have opaque checkerboards, plus the same axis/projection incompatibility. They are references only. Require true transparent exports AND camera/terminal matching before connection approval. The roundabout's central planting is baked into its artwork and is not independently placeable.
- Pavement: opaque checkerboard blocks integration. Its long-axis slope and slab/end geometry differ from the straight road curb. Export alpha and align pavement width, slab cadence, curb height and both projected axes with the road kit. No stretching or masking was used.
- Short drain: alpha passes. The close-up block has a shallower long-axis angle and much heavier curb section than the road's built-in drains. A roughly -19 degree in-plane rotation changes its direction but also tilts the vertical faces. It is available for independent placement, not certified as a seamless curb insert. Supply a road-camera drain module with matching cross-section and optional matching pavement socket.
- These are visual connection probes, not an exhaustive optimizer or a seamless-town approval. Screenshots in tmp/environment-review/connection-probes.png show mismatches openly. No artificial seam covers were added.

## Variants and missing files

Front/rear benches, bins and noticeboards are independent assets. Four lamps are independently selectable; the selected lamp has a lighting dropdown constrained to its front/rear family. The switch preserves item ID, label, x/y, scale, rotation, order, layer and contact anchor; locked layers cannot switch. Front lit/unlit artwork changes the base/head silhouette and apparent proportions, so source frames need pixel registration for a visually motionless toggle. Rear variants also need close-up registration review. No automatic compensation alters artwork or placement.

Not supplied: paralin_roadside_drain_01.png (long drain). Also still needed for a connected neighbourhood: compatible transparent pavement/junction exports, modular terminal specifications and shop entrance/apron joins. No existing approved scenery was replaced.

## Validation and review

- Production build: PASS.
- Unit tests: 31 PASS across 7 files, including registry gating, lamp transform preservation, JSON round trip and camera fit.
- Existing compositor browser suite: 10 PASS (desktop/mobile).
- Environmental browser suite: 2 PASS (desktop/mobile), all 23 API responses byte-identical to saved originals, five existing buildings retained, front/rear placement, lamp toggle and responsive preview.
- Targeted ESLint: PASS.
- Initial sandbox unit run was blocked by Windows temporary-file EPERM; rerun outside sandbox passed. Initial environment browser tests timed out on expensive generic Buffer equality; efficient Buffer.equals checks passed in the rerun.

Open http://127.0.0.1:3115/dev/paralin-compositor and select Environment integration test. Export any current composition first: review buttons replace the in-memory scene. Reset retains the original five-building layout. The new preset is an asset staging test, not a proposed final neighbourhood layout or approval. No main changes or merge. Stop for visual review.
