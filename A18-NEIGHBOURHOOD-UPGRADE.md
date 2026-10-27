# A18 neighbourhood quality and playable terrain

## Outcome and scope

Bring street architecture and vehicles closer to the textured human characters; expand the cast beyond three templates; add real local temples and parks with physical interactions and new persistent stories. Keep the existing home, community, eight venue interiors, saves and 100km/h owned Model Y.

## Terrain contract

- Grass and planted ground are traversable by car, scooter and bicycle. Movement is no longer confined to the street-centre corridor or broad invisible landmark exclusion polygons.
- Buildings, tree trunks, seats and other solid fixtures block both pedestrians and vehicles, using geometry-aligned colliders. Vehicle motion checks the entire swept path so speed does not tunnel through objects.
- Mapped natural water polygons and the ornamental pond render visibly with ripples and a shoreline. They reject vehicle entry. Mapped bridges remain passable above the water.
- A pedestrian entering water changes automatically to swimming locomotion, slower water movement, a horizontal animated body and a surface wake; leaving the water restores normal movement. No separate teleport or reset is required. Mounting a vehicle from the water is rejected.

## Design

Use existing OSM polygon coordinates and government/venue references. Add Qingpu Qingsheng Temple and its adjacent park, Gongqi Park/civic centre and nearby neighbourhood parks within the existing A18 bounds. Custom facade and temple details replace their generic footprint shells; no mirrored coordinate conversion or enlarged road footprint. New park paths, seating and vegetation remain in the mapped park boundary. New stories join the existing accepted/claimed quest and home memory-card systems.

Keep shared PBR maps, spatial batches, distance LOD and instancing. Diversify realistic skeleton templates while reusing motions. Retain the owned Tesla dimensions and replace the crude generic scooter/bicycle/traffic bodies with detailed modern meshes and rotating wheels. Asset sources and licenses must be stored locally; no third-party runtime dependency.

## Acceptance and validation

Verify actual grass driving, building/tree/bench impacts, vehicle rejection at shore, pedestrian water entry/swim/exit and bridge passage. Inspect close-range facade/vehicle/temple/park screenshots; test NPC variety, physical new-story objectives and save/reward idempotence. Run WebGPU and WebGL QA and rendering budgets, preserve old venue entry, minimap handedness, car speed and home interactions. Commit, deploy and verify the published version after checks.
