# Imported Model 3 integration

Outcome: replace the near-detail `model-3` street car with Ameer Studio's licensed 2018 Model 3. Preserve its stable ID, traffic takeover, driving and saves. Label the year accurately. Include pending Cavira/Bria/Model T corrections in this release.

Design: preprocess the downloaded GLB into game coordinates (+Z front, Y up, centimetres), separate left/right wheel geometry into four pivots, preserve texture and material assignments, and simplify only where visual inspection allows. Batch static geometry by material. Load once, share geometry/textures between instances and clone mutable paint/headlight materials. Keep the existing low-detail and procedural failure fallback. Await imported asset readiness before creating the city/gallery fleet.

Acceptance: the licensed model appears in both the gallery and actual street game; all four wheel pivots rotate in place; headlight changes are isolated per car; scale and direction match driving/collision dimensions; low-detail switching still works; failed asset loading leaves a usable fallback. Original owned Model Y remains unchanged. Attribution includes the original source and redistributed copy.

Validation: front/side/rear gallery captures, geometry/pivot/material assertions, actual F/W-key takeover-driving-exit test in the city, failure-fallback test, and deployed version verification. No claim of Forza-equivalent fidelity or measured integrated-GPU FPS.

## Validation completed

- `node qa-vehicle-rebuild.cjs`: passed. All 13 street types and owned Y rendered from front/side/rear; imported Model 3 identity, centimetre length, four populated pivots, LOD, rotation and independent headlight materials passed. Captures visually inspected.
- `node qa-vehicle-driving.cjs`: passed in the actual city with F/W input, driving, exit/re-entry, traffic replenishment and low-quality near-detail cap. Imported Model 3 drove about 4.8 metres; owned Y remained unchanged. No browser exceptions.
- `node qa-vehicle-rebuild.cjs --fallback`: passed with the Model 3 asset request deliberately blocked. Gallery remains usable and labels the procedural fallback.
- JavaScript syntax and `git diff --check` passed. Hardware FPS on an integrated-GPU laptop was not measured.
