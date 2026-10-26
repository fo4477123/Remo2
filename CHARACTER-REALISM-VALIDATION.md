# Realistic characters / A18 stories validation

Release cache: `20261027-realpeople1`.

- All 63 root JS/CJS files pass `node --check`; `git diff --check` passes.
- `qa-city-geo.cjs`: geographic round-trips, source/CAD handedness, legacy parking migration and heading-up cardinal/oblique maths pass.
- `qa-a18-layout.cjs`: 10,923 footprint/road/pavement intersection checks pass.
- `qa-street-life.cjs webgpu`, artifacts `qa-output/run-wGZWAw`: actual WebGPU, 14 named street residents plus18 walking neighbours, weighted skeleton wave responses at six locations, six NPC dialogues, distance LOD, clickable entrance hint, actual IKEA entry/exit and eight-venue guide pass. Measured low-quality views:83–251 draw calls,427,597–476,638 triangles; this is a rendering budget observation, not a universal frame-rate guarantee.
- `qa-street-life.cjs webgl`, `run-1ZPb5o`: equivalent compatibility checks pass. Runtime exceptions:0.
- `qa-minimap.cjs webgpu`, `run-JyAFhI`: actual station-dot pixels rotate to four expected screen positions; centre arrow stays up; compass, driving heading and north-up full map pass.
- `qa-a18-events.cjs webgpu`, `run-QOf4w6`: all six complete stories, actual venue visits, wrong-bin/furniture/quiz retries, walking rejection at bicycle checkpoints, inventory/save round-trip,630 coins awarded once and six visible home memory cards pass. Scene JPEGs were captured in the actual WebGPU renderer.
- Final photography framing, first-person capture and JPEG pixel-variance checks additionally pass in WebGL (`run-CyB5Ka`). Saved scene images are512×288; album photographs and partial progress stay in local storage.
- `qa-adult-driving.cjs`, `run-fVmN61`: actual rendered adult bounds57.49×174.63×37.04cm, articulated walk poses, indoor third-person framing and mapped-road100km/h acceleration/0.032km/h after braking pass.
- Isolated portrait and seated-pose rendering: three variants inspected; final foot-placement/leg IK check passes (`run-VCqBRE`). The default A-pose bound was initially measured before skeleton update, causing inflated bodies; initial world/skeleton matrices are now updated before height normalisation. Seated feet are placed with two-bone IK relative to the actor's orientation and floor height.

Models are licensed Rocketbox assets with three shared appearance templates, not individually scanned local residents. This improves the geometric placeholder figures; FFXV remains an artistic reference, not an achieved AAA fidelity claim. Venue interiors remain original game layouts, not surveyed commercial interiors.
