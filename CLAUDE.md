# Storypath — Current Development Instructions

> Current founder-approved direction: 17 October 2026. This document supersedes conflicting historical Bridgepath, Kairana, Arouca Grove/Groove and October 7 reset instructions. Work on `storypath-visual-reset`; do not change or merge `main` without explicit founder approval.

## Canon (non-negotiable)
- Product: **Storypath**. Tagline: **Learn Along the Way.**
- First community: **Paralin**, a fictional Trinidad-inspired town, with subtle Arouca, Gasparillo and Lopinot influences. **Arouca Grove**, the misspelling **Arouca Groove**, and **Kairana** are historical concepts, never current player-facing names.
- Playable child protagonists: **Aaliyah** and **Theo**. The child selects one for lessons and missions. Both appear together on the welcome screen. **Niko and Zuri are NOT playable protagonists**; retain old character research/art as historical or possible supporting-cast material, not as a replacement or reskin of Aaliyah and Theo. No final adult cast identities are assumed without approval.
- Preserve the exact ordered **18 Standard 3 Mathematics stops**, beginning with **The Grand Library Book Hunt**, as defined in `STANDARD-3-MATHEMATICS-TOWN-LEARNING-JOURNEY.md`. Mathematics first; English later. First public release requires all 18 missions and parent dashboard, but the first internal playable vertical slice is Grand Library.

## Founder-approved gameplay
- Classic illustrated 2D point-and-click adventure *presentation*, inspired by the feel of Monkey Island; create original art and original Trinidadian environments. No full free-roaming town or inventory-puzzle engine is required.
- Flow: child profile → interactive welcome clubhouse → interactive classroom teaching → independent readiness check → Paralin destination map → illustrated mission dialogue and focused hands-on Mathematics → resolution, evidence and saved progress.
- Child controls the consequential mathematical decisions. Targeted non-shaming help, independent vs supported evidence, strict sequential mission unlock, replayable completed destinations, and checkpoint resume.
- Fully voiced dialogue with matching visible text and replay; expressive lightly animated characters, subtle environment movement. Desktop and tablet, mouse and touch. Accessible by default with optional per-child settings.
- Parent-managed account, separate child profiles, protected parent dashboard with progress, misconceptions, independence and practical at-home recommendations. Do not mistake current browser-only storage for production-safe child-data handling.

## First production target: interactive clubhouse welcome screen
- Aaliyah and Theo **together** in a homemade **backyard clubhouse** naturally situated within a recognisably Trinidadian Paralin residential neighbourhood.
- Inspired by Bookworm Adventures' environmental menu composition; no copied artwork. Interactive objects for **Continue**, **Map**, **Learning Journal** and **Settings**. Desktop hover reveals labels/highlights; touch must not depend on hover. Continue resumes the child's saved checkpoint.
- Keep clubhouse environment stable for now. No customisation, collectible decorating system or evolving souvenirs in this initial slice.
- The existing generated mockups are concept references, **not** approved production-ready layered assets. Preserve established Paralin identity, perspective and approved scene compositions.

## Production workflow
1. Inspect the actual current code/assets, including local Codex work not yet pushed, before claiming a feature exists or is missing.
2. Reuse suitable existing assets; adapt or selectively rebuild only where needed.
3. Define one scene, create/prepare its assets, integrate in Codex, test desktop/tablet interactions, then refine before moving on.
4. Prioritise **playable, testable game progress** over more documents and standalone images.
5. Keep historical documents and cast material for reference; mark superseded assumptions rather than mass deleting files.
6. Never present legacy `arouca-groove` internal paths, storage keys or test names as current story/world canon. Migrate internal identifiers carefully to avoid breaking tests or existing progress.

## Documentation authority
1. Explicit latest founder decisions recorded here and in current Storypath decisions.
2. Protected 18-stop curriculum and mathematical evidence requirements.
3. `STORYPATH-WORLD-IDENTITY.md`, current Paralin spatial/asset documents and approved compositions.
4. Older Bridgepath documents only as research and historical context where they do not conflict.

See `PROJECT-STATUS.md` for current production priorities. Earlier instructions saying no gameplay is authorised or that all visual direction is still open are **superseded** by the founder's October 2026 decisions.
