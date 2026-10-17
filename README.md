# Storypath

Storypath is a 2D Caribbean-inspired educational adventure in which curriculum concepts become meaningful real-world gameplay.

## Current working world

The first Storypath community is **Paralin**. Its two working child protagonists are **Aaliyah and Theo**.

Paralin is fictional. Its cultural and environmental DNA may draw subtly from Trinidad and Tobago and from places meaningful to Storypath's founders, including Arouca, Gasparillo, and Lopinot, without reproducing them literally.

See `STORYPATH-WORLD-IDENTITY.md` for current identity decisions.

## Current direction

The product is undergoing a controlled experience and visual reset. The curriculum, pedagogy, learning architecture, progression concepts, research, and useful product documentation are being retained. Previous character art, environment art, classroom art, hub art, geography assumptions, and other visual explorations are no longer authoritative.

As of 7 October 2026, all existing artwork and visual references have been removed, including character sheets, environments, hub art, screen mockups, and the brand guide. The homepage is a plain concept checkpoint, not a proposed design. The old visual prototype and character gallery are retired. Curriculum source PDFs and educational documentation remain intact.

The next design phase will rebuild Storypath's world layout, character relationships, interaction system, screen relationships, and visual language around the core principle that learning should be experienced and applied rather than presented as worksheets with game decoration.

## Product principle

**Learn the concept → understand why it matters → use it in a meaningful situation → practise → transfer → demonstrate mastery.**

**Learn Along the Way.**

## Protected curriculum

The complete 18-stop Standard 3 Mathematics educational architecture remains protected during the rebuild. Community names, character identities, visual design, navigation, and child-facing location names may evolve without silently changing curriculum coverage, dependencies, transfer, or mastery evidence.

## Run locally

```bash
npm install
npm run dev
```

## Validation

```bash
npm test
npm run lint
npm run build
npm run test:e2e
```

## New Paralin asset intake

18 newly supplied building PNGs are stored under `design/storypath/environments/paralin/architecture/`, separate from the application. They passed with notes for complete decorative assemblies; they are not clean modular bases or a final art-direction approval. See [the audit](design/storypath/environments/paralin/AUDIT.md) and [asset manifest](ASSET-MANIFEST.md).
