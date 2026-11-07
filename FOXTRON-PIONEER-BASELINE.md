# FOXTRON Pioneer reconstruction baseline

The user selected **Pioneer for both cars**. This document pins the reference configuration so trim details are not mixed again. The current models remain incomplete photo-derived reconstructions, not exact replicas.

## Primary references

- [BRIA official 2026 brochure, version 2](https://www-assets.cloud.foxtronev.com/files/specifications/bria/en/FOXTRON-BRIA-Brochure-EN-2026-v2.pdf): page 12 dimensions, running gear and exterior equipment; page 13 upholstery and red seat belts; pages 2–5 exterior views.
- [CAVIRA official specification](https://www-assets.cloud.foxtronev.com/files/specifications/cavira/en/FOXTRON-CAVIRA-catalog-EN.pdf): page 1 dimensions, running gear and exterior equipment.
- [CAVIRA official exterior side image](https://www-assets.cloud.foxtronev.com/images/models/explore/cavira/innerAndOuter/outer.webp).
- [CAVIRA official wheel image](https://www-assets.cloud.foxtronev.com/images/models/explore/cavira/innerAndOuter/OuterDetail2.webp).
- [CAVIRA official rear image](https://www-assets.cloud.foxtronev.com/images/models/explore/cavira/detailInside/main.webp).

## Locked standard configuration

| Property | Bria Pioneer | Cavira Pioneer |
|---|---|---|
| Length / width / height | 4315 / 1885 / 1535 mm | 4695 / 1905 / 1625 mm |
| Wheelbase | 2800 mm | 2920 mm |
| Front / rear track | 1639 / 1638 mm | 1639 / 1635 mm |
| Standard tyres | 235/40 R20 | 245/45 R19 |
| Nominal rim bead-seat diameter | 508 mm | 482.6 mm |
| Calculated unloaded tyre diameter | 696 mm | 703.1 mm |
| Panoramic glass roof | Standard | Standard |
| Upholstery baseline | Black; white is optional | Black; white is optional |
| Red belts | Standard | Not adopted from Bria |

Tyre dimensions are nominal dimensions calculated from the sidewall specification. They do not establish the precise loaded shape, tread pattern, rim offset, outer rim-lip diameter or tyre brand.

## Implementation status and remaining uncertainty

Implemented nominal tyre radius, rim radius, tyre width, track and wheelbase. Added an actual glass opening in the black canopy, selected black upholstery, retained Bria red belts, and corrected the oversized Bria lower black bumper region and plate height.

Gallery QA measures the wheel-pivot tracks and tyre diameter rather than merely checking the configuration constants. It also checks rolling, LOD, apertures and finite geometry.

The bonnet, bumper, door, pillar, optical and vent surfaces still use estimated controls. The precise wheel-spoke contours also remain approximations. Promotional photographs differ in perspective and optional equipment; neither they nor the specification table establish hidden geometry. A claim of exact reproduction requires additional factory CAD, measured scans or sufficiently complete calibrated references and a verified surface comparison.


## User-requested rear identity override

Latest user instruction explicitly requests restoring the CAVIRA tailgate dot emblem. Keep it beneath the continuous light guide, above the FOXTRON wordmark. This is the requested visual configuration even though the reference production rear photographs show the wordmark without this additional emblem. Do not remove it again while refining factory details.
