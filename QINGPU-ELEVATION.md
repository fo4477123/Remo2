# Qingpu elevation terrain

## Outcome
Replace the flat A17–A19 Qingpu ground with terrain derived from real public elevation measurements, at 1:1 vertical scale. Driving, walking and swimming follow the same height field.

## Scope and design
- Use the Ministry of the Interior 2026 release of Taoyuan 20 m DEM tiles (TWD97 / TM2 121, TWVD2001). Release year is not the survey date; retain selected tile metadata.
- Crop offline to the existing map plus a border. Ship a small local JSON grid with provenance; no API keys or live elevation requests while playing.
- Preserve the existing east/south map and east/north CAD transforms. Subtract the elevation at the community as a numerical datum; expose actual metres above the source vertical datum separately.
- Bilinear DEM sampling, continuous roads and graded banks. Flatten building foundations locally at their measured centre elevation, with a short transition outside. Water bodies remain level and have a depressed bed. Bridge roadways remain above water.
- Drape subdivided ground and road geometry; keep buildings and props upright. Apply elevation to instances and static world geometry once. Moving actors, traffic, owned vehicles, train and camera query the shared field every update.
- The base mesh uses a 10 m triangulation of the 20 m source interpolation (109,461 vertices / 217,600 triangles). This adds smooth presentation, not new survey precision. Ground-level road/paving triangles are clipped to exactly the same grid planes; walking and driving sample those planes. This avoids roads disappearing beneath a differently tessellated ground mesh. Also correct the existing asphalt winding to face upward.
- Indoor/community scenes retain their local floor coordinates. Scene transitions keep the existing entry positions and recompute the outdoor height.

## Acceptance
1. The shipped grid covers the whole playable region, has no missing cells, and reproduces retained source checkpoints to interpolation precision. No invented hills or vertical exaggeration.
2. A17, A18, A19 and home expose different measured elevations where the data differs; north/east orientation remains correct.
3. Road and terrain meshes contain intermediate vertices and follow the height API; cars lean with slope, people and cameras remain above the surface.
4. Buildings retain level roofs/foundations; water is level per body, vehicles still cannot enter water, bridges remain passable, swimming follows the water surface.
5. Existing WebGL2 default, quality modes, saved horizontal positions and home floor heights remain compatible. Elevation load failure is visible and does not silently pretend to be measured terrain.

## Validation
Dependency-free source/grid/interpolation tests; existing coordinate and water-mask tests; headless WebGL gameplay checks for walking, driving, traffic, water, bridge, train and scene return; inspect terrain and street-level screenshots. Verify deployment release marker after commit/push.

## Limits
20 m terrain data describes regional ground relief, not surveyed curbs, individual steps or the exact geometry of engineered viaducts. Building platforms, water-bank grading and rail clearances are game adaptations and must remain distinguished from raw DEM elevations.

## Reproduction and source records
Download the Taoyuan archive linked in `assets/city/qingpu-elevation.json`, then run `node prepare-qingpu-elevation.cjs <archive.zip>`. The preparer parses the official XYZ records directly, rejects missing crop cells, and retains the ZIP SHA-256, tile headers, vertical datum and source checkpoints. It uses only Node built-ins.

The six selected tile headers identify surveys on 2021-06-18 and 2021-08-30, TWD97[2020] / TWVD2001. The release is 2026; the landscape is not a 2026 street survey. Map WGS84 coordinates are approximated to TWD97 for the existing OSM model, not cadastral alignment.

Raw DEM elevations near the model's station centres: A17 65.87 m, HSR Taoyuan 83.64 m, A19 86.76 m. Entrances/platforms can have different elevations because they are at different coordinates and use local building/rail adaptations.

Run `node qa-elevation.cjs`, `node qa-city-geo.cjs`, `node qa-terrain-geo.cjs`, and `node qa-elevation-runtime.cjs`. The runtime QA also supports `--missing-elevation` to block the actual height-file request and verify the visible fallback warning. QA screenshots/reports remain in ignored `qa-output/run-*` directories.

Validated WebGL2 run `run-oAzNQj`: A17/A18/A19 camera/player heights, 705 upward road-ray samples matching the base planes, sloped owned vehicle and traffic, walking NPCs, level water/swimming wake, a level building roof, indoor/city return, train body elevation and an actual simulated A17→A19 boarding/arrival. No runtime exceptions. Failure run `run-WxGJd2` blocks the actual DEM request and verifies a visible fallback warning. Earlier `qa-playable-terrain.cjs` run `run-4TaJW7` covers grass driving, continuous shoreline vehicle rejection, swim entry/exit and solid tree/building collisions.
