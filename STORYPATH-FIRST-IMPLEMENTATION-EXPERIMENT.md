# Storypath first implementation experiment

The first vertical slice is intentionally small: Entry → Paralin → Corner Shop (Stop 5) → contextual money task → return to Paralin. The 18-stop `PARALIN_STOPS` sequence remains the source of truth.

## Reference audit

- `paralin.png` and `paralin_mock_up.png` are reference-only aerial compositions. Their baked labels, pins, compass, and map detail are not runtime UI.
- `wide_colorful_cartoon_illustration_game_ui_mocku.png` and `storypath_mock_up.png` are duplicate north-star experience boards, not production screens.
- The schoolboy and schoolgirl images are used as provisional Theo/Aaliyah portrait references in this prototype; identity, pose, and cutout production treatment still need review.
- The clipboard schoolgirl image is a byte-identical duplicate and was not imported separately.

## Routes

- `/` — Storypath entry and protected 18-stop journey.
- `/paralin` — living-community transition.
- `/paralin/corner-shop` — direct-manipulation Stop 5 money task.

The corner shop image remains a decorative assembly. Products and money are independent interface objects, so the learning interaction is not baked into the environment.
