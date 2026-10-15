# Paralin supplied-road review — 14 October 2026

Status: PENDING REVIEW. Neither road is approved. No artwork was generated or changed.

## Original files and integrity

| User-facing name | Supplied filename | Repository copy | Size | SHA-256 |
|---|---|---|---|---|
| straight_road.png | paralin_road_straight_01.png.png | roads/straight_road.png | 1536 x 1024 | ccaad41cff73f8fcd99737e677b96ff856cabf05161809f6331816ff1d4e0471 |
| round_road.png | paralin_road_corner_01.png.png | roads/round_road.png | 1536 x 1024 | 328b0829ad9b6da5e6ea194efd01982c9fbbccd23482000b8de79c50a7698800 |

Copies are byte-identical to the Downloads originals. Both passed PNG chunk CRC checks and complete scanline decoding. Both are 8-bit RGBA. Straight road has 949,096 fully transparent pixels and 623,768 partially transparent pixels; round road has 888,584 fully transparent and 684,280 partially transparent pixels. Neither contains fully opaque pixels: alpha spans 0 to 254. This near-opaque maximum has been preserved. The dark attachment preview background is not an opaque black rectangle in these PNGs. Checkerboard inspection confirms transparent surrounds; no background removal was performed.

The supplied “round” road is a curved/corner segment, not a roundabout.

## Repeatable visual checks

Use the compositor's **Straight road test** and **Two-road connection test** buttons. These replace the current placement; export first. Both preserve the corner shop and use 40% scene-width road scale at 0 degrees, retaining each authored perspective. The shop uses 22% scale. All assets fit within the camera. These are review fixtures, not an approved street composition or real-world scale specification.

- Straight road: recognizable elevated three-quarter road, fully loaded and visible beside the original corner shop. Its material texture is more realistic than the shop illustration. Its pavement runs at a steeper diagonal than the shop's nearly horizontal front plinth. A dedicated entrance/apron transition remains necessary; the test intentionally does not hide that gap using terrain or replacement art.
- Connection: straight road's upper-right end meets the curved road's lower-left end at equal scale, with the curve above the straight piece in the Roads layer. The overall direction is plausible, but the join is not naturally seamless. A visible curb step/overlap and lane-marking discontinuity remain. Pavement widths, endpoint contours and the marking rhythm need review together. The test is an approximate endpoint alignment, not a proof that no other placement could improve it.
- Scale: equal PNG widths and equal compositor scales are only a starting point; neither file supplies a physical width or authored connection anchors. Do not lock the town scale or produce more segments from this test alone.
- Rotation is a 2D screen-plane transform around the contact anchor. It preserves original bytes and aspect ratio but cannot repair a mismatch in perspective, shadows or endpoint geometry.

Screenshots: `tmp/road-review/straight.png` and `tmp/road-review/connection.png`. Exported review scenes: `tmp/road-review/straight.json` and `tmp/road-review/connection.json`.

## Integration and validation

Both assets are recorded in the environment manifest with PENDING REVIEW status. The asset API serves the two registered road paths while preserving existing architecture URLs and path checks. The Roads picker adds each independently. Movement, scale, rotation, layer/order, visibility, locking and JSON import/export remain available. Optional rotation defaults to zero for older v2 compositions; v1 import still works. Camera fitting now uses rotated PNG corners in scene pixel coordinates.

- Production build including TypeScript: passed.
- Unit tests: 28 passed across six files.
- Desktop/mobile Chromium browser tests: 10 passed, including byte-for-byte API responses, independent road transforms, v2 round-trip, both review scenes, existing buildings, camera fit and legacy imports.
- Focused ESLint: passed with no warnings/errors.
- Physical-device touch and other browser engines were not tested.

Work stays local on storypath-visual-reset. Approved building PNGs and the protected curriculum are unchanged. Main was not modified or merged. Stop here for visual review; no additional roads or neighbourhood scenery have been built.
