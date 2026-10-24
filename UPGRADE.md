# 暖木日常：手機即時漫遊

## Outcome and scope
Improve the existing local Three.js site without changing hosting or introducing Unity.
Use the supplied CAD coordinates and accepted furnishing choices. This is an interactive
design visualisation, not a measured digital twin or a photograph of the finished home.
Public UI identifies Qingpu / fifth-floor context only; the owner's full address is not published.
The existing generated exterior is illustrative, not an address-specific sightline.

## Corrections and assumptions
- Window positions from paired TO / WALL endpoints: guest x391.1 y309.7–429.7;
  kitchen x231.1 y574.7–654.7; master x453.6–633.6 y1067.2;
  media x763.6–883.6 y1067.2; living x998.6–1178.6 y1002.2.
- User-specified sill heights: guest/kitchen 150 cm, remaining three 50 cm.
  Heads remain provisional 235/232 cm, room height 260 cm.
- Restore sill and lintel solids in CAD gaps and preserve elevations through cutaway toggles.
- Separate bathroom fixture footprints and model hollow sanitary ware; preserve entry.
- Balcony slats on exposed west/north edges, not across the laundry doorway.
- Remove floating decor, contain bath fixtures within walls, and show realistic table/book scale.
- Preserve standard beds and full wardrobe; improve bed-end clearance without moving walls.
  Remaining narrow furnishing clearances are documented, not represented as construction approval.

## Interaction and rendering
Phone: left thumb movement, right canvas drag look, room picker, immersive view, portrait/landscape,
stacked plan comparison, safe-area spacing, stopped movement on blur/cancel/visibility change.
Desktop: keyboard/mouse, room changes and full-height/cutaway round trip continue working.
Use roughness, ceramic interiors, seams, softer warm lighting, window daylight and local textures.
Batch floor geometry; cap mobile pixel ratio; reuse static shadows and limit light count.

## Acceptance and validation
Node syntax checks plus a local Chromium browser run: no JS exceptions, finite scene transforms,
reachable room stops, 50/150 cm sill solids, correct wall elevations after mode switching,
door collision, touch movement and look concurrently, pointer cancellation, stacked comparison,
and screenshots at desktop, phone portrait and landscape sizes. Device emulation is not physical
iPhone/Android hardware validation. Publish existing Pages repo and refresh local ZIP after checks.

## Implemented and checked
- Added actual vessel interiors, second-bathroom shower/toilet/vanity, kitchen sink/faucet/hood,
  soft cushions and seam piping, HDR contact shading and antialiasing.
- Restored missing exterior returns omitted from CAD layer 3F. Existing generated backdrop
  now covers all viewing directions; repeated context imagery is still not a surveyed panorama.
- Browser QA uses Chromium with 390×844 and 844×390 touch emulation, checks two simultaneous
  touches, cancellation, all free room stops, door/dining-leaf collision, mode round trips,
  zero runtime/console errors and plan stacking; saves screenshots and JSON under qa-output/.
- No dependency install or framework change. `node qa-home.cjs` runs the focused browser check.
- Remaining constraints: bed-foot clearance about 66 cm; sofa/table about 29 cm;
  table/TV cabinet about 55 cm. These are explicitly shown as tight in the UI. Retained purchased
  sofa and table footprints; no claim that these are approved circulation or installation sizes.
- Not a laser scan, construction plan, fully photoreal path-traced scene, or physical-phone benchmark.

## Current render pipeline extension
- Preserve the existing single-page entry point, DWG-coordinate room plan, sidebar, day/night mode, camera reset, plan comparison and mobile walkthrough. No Unity or replacement UI is introduced.
- Keep the real-time renderer on local Three r160; add an optional ES-module GLTFLoader bridge pinned to Three 0.160.1. It lazily loads a PBR sofa and window plant from the public Khronos sample-asset CDN. Measured local geometry remains as an offline fallback and is only hidden after the respective model succeeds.
- Final material targets: whitewashed oak SPC planks roughness 0.4 / metalness 0.1; cream mineral walls roughness 0.9 / metalness 0.0; ACES filmic output exposure 1.2; 2048px PCF soft directional shadows plus hemisphere bounce light.
- Acceptance: loader failure cannot produce runtime exceptions or remove measured furniture; imported meshes cast and receive shadows; existing desktop and touch QA still passes; bathroom corridor storage reports a 14 cm niche and closed living-room face.

## Premium furniture refresh — approved implementation brief
- Outcome: present a calmer, higher-end warm Japanese / Nordic home, without a tree or a mismatched sofa. Primary loose furniture uses selected CC0 external GLB models when online, while locally modelled, CAD-sized equivalents remain as a reliable offline fallback.
- Scope: replace the living-room composition with a cream curved-back modular sofa and rounded stone lift table; refresh the primary beds, media work setting, dining table and storage styling with consistent oak, mineral, woven-fabric and dark-metal details. The media workstation is a 200 × 65 cm sit-stand desk. Rebalance the living-room pieces to give the sofa/table and table/TV wall clearer separation.
- Bathroom: swap the guest-bath dry fixtures: toilet in the upper-left bay (798,318) and vanity in the lower-left bay (772,432). The tub, shower enclosure and walkable route remain in their existing CAD-aligned bays.
- Non-goals: this remains a centimetre-scale interactive design study, not a construction drawing or a procurement schedule. No dependency or hosting change is introduced.
- Acceptance: no tree is present; selected CC0 GLTF models only replace their matching local fallback after success; plan labels and collision footprints match the revised furniture; all room stops stay walkable; the revised guest-bath coordinates are exposed to QA; desktop and phone browser checks complete without runtime errors.
