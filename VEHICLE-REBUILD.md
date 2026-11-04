# Vehicle rebuild — 2026-11-03

## 2026-11-04 coachwork v5

Revised all passenger bodies with stronger lower-door concavity, a rounded glass cross-section, narrower window surrounds and continuous surface normals at the bonnet/shoulder joins. Rounded detail normals are welded across the split BoxGeometry faces. Transparent batches no longer cast opaque shadows. Paint uses a stronger metallic clearcoat, while painted shells skip self-shadow reception to avoid shadow-map striping; they still cast ground shadows.

Passenger wheels now use solid swept spoke geometry with machined edge strips, drilled brake discs and alternating tread blocks. Tiny tread details use a lower subdivision count. T/K receive revised paint/glass and smoother corner tessellation. Geometry remains original procedural interpretation; this revision does not establish manufacturer-level exterior accuracy or equivalence to the imported Model Y.

Validation: `node qa-vehicle-rebuild.cjs`, including all 13 street vehicles and the imported Y from front/side/rear, wheel rotation, detail switching, headlight material isolation and mobile gallery layout. Screenshots remain in local ignored `qa-output/`.

User outcome: add Foxtron Model D and Tesla Model 3 and bring all road vehicles closer to the owned Model Y's realistic presentation. Keep the owned Quicksilver Model Y, saves, WebGL2 default and takeover controls.

## Scope and design

- Thirteen street vehicle identities: Focus, Altis, Sentra, Kicks, Kuga, Corolla Cross, Foxtron A/B/C/D/T/K and Tesla Model 3. Model Y remains the separate imported owned vehicle.
- Passenger coachwork uses independent longitudinal silhouettes and face profiles, continuous wheel openings, curved bumper projection, enclosed interiors and articulated wheels. Bus and truck require their own construction.
- Nearby detail is capped by quality setting; distant traffic uses inexpensive bodies. Templates share geometry and materials.
- Reference photos are for visual comparison, not redistributed textures. Original procedural meshes remain interpretations, not manufacturer CAD or scanned production assets. Triangle count is not a fidelity criterion.

## Acceptance and validation

- New models appear in the traffic registry and work with takeover, driving and exit; owned Model Y is preserved.
- Each model renders from front, side and rear without runtime errors or visible floating lamps, protruding seats, disconnected panels or stepped wheel openings.
- Distinct silhouettes, grille/light signatures and body types. Check actual screenshots against references, especially the Model D continuous light bar/vertical lower lamps and Model 3 low nose/glass roof.
- Check all models for finite geometry and four rotating wheels; check close/far switching and detail budgets. Browser QA must exercise the actual application as well as the standalone model viewer.
- Do not claim equivalence to the imported Model Y unless the visual comparison supports it. Record remaining gaps explicitly.

## References

- Tesla Model 3 dimensions: https://www.tesla.com/ownersmanual/model3/en_pr/GUID-56562137-FC31-4110-A13C-9A9FC6657BF0.html
- Model 3 reference image (Tesla press photo): https://media.electrive.com/2023/09/tesla-model-3-highland-2023-09-min.jpg
- Model D exterior photograph: https://cars-asset.tvbs.com.tw/uploads/2024/10/08141840/241009_HHTD-24_023_PhotoChen.jpg
- Model D dimensions: Foxtron 2024 sustainability report, product section p.43, 5195 × 1995 × 1785 mm, wheelbase 3200 mm: https://www.foxtronev.com/s3/tw/esg/Management/01_Foxtron_2024%E6%B0%B8%E7%BA%8C%E5%A0%B1%E5%91%8A%E6%9B%B8Year%20Report%20Full%28CH%29_202508.pdf
- Original six-car source links remain in `studio-vehicle-faces.js`; owned Model Y attribution remains in `assets/models/vehicles/MODEL-Y-CREDITS.md`.

## Implemented and checked

- Added D/3 and replaced the A/B/C alias bodies with separate silhouettes. T/K now have their own bus/cab-and-bed builder. K is a compact Kei-class interpretation (340 × 148 × 190 cm); A has a taller 180 cm passenger pod. A/K dimensions are explicitly estimated.
- Passenger body/end-cap surfaces and lamp projections now share the same curvature. Wheel arches use a continuous lower boundary instead of discarding rectangular grid faces. Glass lower edges are sealed and headrests stay below the roof.
- Concave tail lamps use ear-clipped triangulation. Front plates stand in front of grille slats. Grille perforations use dark recess shapes instead of floating bright rings.
- Headlight material clones belong to each instance after batching. Vehicle takeover creates a replacement traffic instance, preserves the owned Y, and displays the correct name. Commercial chase cameras scale with body length.
- Public `vehicle-gallery.html` uses the actual game constructors, with rotation/zoom, front/side/rear views and a Model Y comparison. Original reference photographs stay in ignored local QA output and are not deployed.

Validation on Windows / local Edge:

- `node qa-vehicle-rebuild.cjs`: 13 street types plus the imported Model Y render from all three angles; finite vertices, four wheels, LOD/rotation, independent headlight material, comparison UI and phone-width layout.
- `node qa-vehicle-driving.cjs`: D/3/K/T takeover, actual W-key travel (about 4.8 m in each test), exit/re-entry, named speed HUD, unchanged owned Model Y, traffic replenishment, low-quality detail budget and gallery link. No browser exceptions.
- `node qa-engine-default.cjs`: ordinary URL defaults to WebGL2.
- `node qa-city-layout.cjs`: existing road/building intersection audit passes.

**Remaining fidelity gap:** the original procedural models still lack the compound panel shaping, refined trim and physically convincing material/texture treatment of the imported Model Y. Visual inspection does not support claiming that every model has reached that quality bar. Current screenshots and the public comparison viewer make this gap reviewable; passing functional tests is not visual acceptance of that target. FPS was not benchmarked on a physical integrated-GPU laptop.

Additional references: [Model A photograph](https://api.sicar.com.tw/public/uploads/ori/editor/2025/11/20251121142822109200068.jpeg), [Model B photograph](https://api.sicar.com.tw/public/uploads/ori/editor/2025/04/20250423143422106924129.jpeg), [Model C photograph](https://image.u-car.com.tw/5277/photo_139627.jpg), [Model T photograph](https://img.carstuff.com.tw/images/stories/2021/Jason/10/18/ModelT3.jpg), [Model K announcement](https://www.honhai.com/zh-tw/press-center/press-releases/latest-news/2134).
