# Qingpu neighbourhood / mainline validation — 2026-10-27

Release cache version: `20261027-neighbourhood1`. Static deployment uses the existing GitHub Pages master-branch workflow.

## Completed checks

| Check | Evidence |
| --- | --- |
| JavaScript and assets | 73 root JS/CJS files parse; eight MIT character GLBs contain local embedded textures; all model and twelve CC0 PBR-map SHA-256 hashes match their manifests. |
| Geography | Footprint round-trips, east/north handedness, heading-up minimap, old parking migration and obstacle-avoiding approaches pass. Road/pavement footprint audit covers 27,740 checks. |
| Water geometry | Fourteen water bodies, circle-aware shoreline exclusion and 22 mapped bridge crossings pass Node checks. |
| Playable terrain — WebGL2 + native WebGPU | Actual grass driving; car/scooter/bicycle rejected by water; swept-path shore collision; actual animated swimming, wake, slower speed, swim exit and mounting rejection; solid trees/buildings and visible mapped bridge decks. |
| New neighbourhood — WebGL2 + native WebGPU | Eight textured templates actually placed, 64 detailed facade fronts, four source-anchored parks, two temple sites, ten clear venue entries. All seven new physical side stories pass, including miss/retry, swimming targets, inventory/save round-trip, 800 coins exactly once and seven physical home memory cards. |
| Mainline — WebGL2 + native WebGPU | Seven ordered physical chapters completed using E interactions, wrong-clue retry, future chapter lock, actual page reload during chapter six, choices affecting the letter, final return, 415 coins and 1,550 XP exactly once, seven home cards, fitted souvenir and real gaze/E reading; side-story display released after mainline. Alternate ending and 390px mobile dialog checked. |
| Existing venues — native WebGPU | Ten actual E-key entries/exits, flood-fill access to every room target, clear return points, original inventory/activities/quests, all ten continuous walking routes with zero blocked samples. Interiors are built on first entry. |
| Existing street life — native WebGPU | 37 street people, 19 named residents plus 18 walkers; real skinned joint response, dialogue, near/far LOD, entry hint and ten-entry guide. |
| Existing six stories — native WebGPU | Physical photography, sorting/retry, moving delivery, cycle-only checkpoints, NPC quiz/stories, venue visits, save round-trip and 630 coins exactly once. |
| Minimap — native WebGPU | Actual canvas pixels for north/east/south/west, fixed upward player arrow, rotating compass, vehicle heading and north-up full map. |
| Driving — native WebGPU | Adult height 174.63cm, animated knees, mapped-road acceleration reaches exactly 100km/h; Space braking reaches 0.032km/h. |

New story/scenery low-quality outdoor samples: 83–266 render calls, approximately 250k–348k triangles. Original six busy street samples: 85–285 calls, 323k–419k triangles, at most two full-detail street residents. Ten interior samples: 17–35 calls. These are measured render budgets, not a claimed frame rate on every laptop.

## Visual review and retained constraints

Inspected game screenshots of Qingsheng Temple, Dayuan Tower/Ksitigarbha statue, civic centre, parks, new room activities and modern vehicles. Removed generic high-rise balcony details from custom landmark footprints after spotting floating balcony slabs above the civic centre. Fixed the secretary mainline interaction across the existing reception counter. The final letter fits inside the approved second TV-wall niche above its books and below the upper cabinet, with a separate reachable reading point.

Park fixtures remain within the mapped park polygons and clear of mapped roads/buildings. Local coordinates, household dimensions/layout, the existing Sweet Home figurine unlock, first/third-person selection and previous save fields remain in use. Temple/statue and venue interiors are original game interpretations; fictional NPCs, exhibits and stories are not attributed to real people or venues. Asset provenance is recorded in `ASSET-SOURCES.md` and local manifests.

QA artifacts remain local under ignored `qa-output/run-*`; source tests are checked into the repository.
