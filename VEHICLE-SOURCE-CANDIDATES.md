# Vehicle source acquisition — 2026-11-04

This is an acquisition record, not a claim that these models are integrated or deployed.

## Tesla Model 3 2018 — downloaded and container checked

- Original: https://sketchfab.com/3d-models/tesla-2018-model-3-5ef9b845aaf44203b6d04e2c677e444f
- Author: Ameer Studio (https://sketchfab.com/uchiha.321abc).
- License: CC BY 4.0, https://creativecommons.org/licenses/by/4.0/.
- Public redistributed copy: https://github.com/jamesalmeida/tesla-infotainment/blob/main/public/car-models/tesla-model-3-2018.glb
- Download: https://raw.githubusercontent.com/jamesalmeida/tesla-infotainment/main/public/car-models/tesla-model-3-2018.glb
- Local staging: `qa-output/model3-2018-source.glb` (ignored, 4,585,928 bytes).
- Valid GLB 2 container. Embedded asset extras retain original author, license, source URL and title. 176 meshes / 36 materials; uses EXT_meshopt_compression, EXT_texture_webp and KHR_mesh_quantization.
- This is the 2018 body, not Highland. Still needs visual inspection, orientation/scale normalization, wheel pivots, game loader integration and performance verification before publication.
- Another public copy with attribution: https://github.com/nesdesignco/FormDrive/tree/main/public/models (22,671,680-byte GLB; not downloaded).

## Toyota Corolla 2020 — alternate derivative located, not acquired

- Original: https://sketchfab.com/3d-models/toyota-corolla-2020-6d7d34ee42734d1ab28a6b1f1c5fc4fc
- Author: ItsDiyor; original listing labels CC BY 4.0 and downloadable.
- Derivative: https://www.zaptric.in/credits/
- Detailed notices: https://www.zaptric.in/media/fleet/notices/c9e42bf/licenses/models-corolla-LICENSE.txt
- This derivative removes Toyota badges and adds Zaptric branding. It is not yet a suitable unchanged Corolla source; do not import the site's corporate branding as a road-car asset.

## Other five supplied models — official metadata checked, no alternate binary verified

All five are uploaded by Ddiaz Design and marked downloadable with CC BY-NC-SA in the Sketchfab public API. Preserve these distinctions; they do not have the same license as Model 3 / Corolla.

| Model | Sketchfab ID | Source description |
| --- | --- | --- |
| 2022 Ford Focus ST | ddf810d2f4154fd4a4515ec5cb915a36 | Explicitly based on a Real Racing 3 model |
| 2022 Ford Kuga PHEV ST-Line | 1cbe629451bc4283b62b881258f54762 | Based on Ford model; GameModels community credit |
| 2021 Toyota Corolla Cross | 6412b1bba68848af88169be2c75e10a6 | Based on Toyota model; GameModels community credit |
| 2021 Nissan Kicks | 942244be457745678c54a7ff5330ba8d | Based on Nissan model; VK album credit |
| 2020 Nissan Sentra Sylphy | 74de3cda4e0c4d3eb493ea1ebc7c72e4 | Based on Nissan model; VK album credit |

Public API metadata is saved in ignored `qa-output/sketchfab-*.json`. The official Sketchfab download endpoint requested authentication. No viewer extraction or authentication bypass was used. No files from these five are downloaded or deployed.

## Integration update

The downloaded Model 3 is now prepared as `assets/models/vehicles/model-3-2018.glb` and connected to the city and gallery via `studio-vehicle-imports.js`. See `MODEL-3-INTEGRATION.md` for acceptance and `assets/models/vehicles/MODEL-3-CREDITS.md` for attribution. No other externally sourced street model has been acquired in this update.
