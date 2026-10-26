# A18 focused district

Replace the broad A17–A19 game with five requested anchors (expanded with adjacent venues in A18-LIFE-EXPANSION.md): THSR Taoyuan station, its forecourt, Gloria Outlets, Zhongli Water Resources Recycling Center park, and IKEA Taoyuan. Preserve home/community, saved rewards and owned vehicles.

All positions, road centre lines and principal building footprints use the local attributed OSM dataset in metres. Correct the old station marker (an underground parking node) to building way 23547222. IKEA uses way 823329786 at 高鐵站前東路一段1號. Station entrance numbers come from mapped door nodes. Official station/site plans and operator images guide architectural interpretation; unmeasured facade details are a game reconstruction, not a survey.

Five destinations have accessible interaction points, navigation, map labels and passport stamps. Retail shops retain collectible stamps. Replace cross-station and distant-art quests with A18 activities while retaining existing quest IDs and claimed rewards. No A17/A19 travel or distant landmark requirements remain active.

Use batched static geometry, spatial detail groups, restrained NPC counts and quality-dependent detail distances. Keep real footprints for rendered structures and collision; pedestrian plazas and landscaped paths prohibit driving. Outdoor high quality uses direct PBR rendering instead of indoor screen-space GI. Target low quality district draw calls below 300 in normal street views; measure actual calls/triangles and frame intervals, without claiming hardware-independent FPS.

Latest character/driving request: replace the large-headed hero with an original adult urban character (approximately 175 cm, smaller head, fitted jacket, long limbs, articulated hands). Pull the outdoor third-person camera back to 460 cm so the character occupies less screen area. Preserve walking/running/gestures and seated interactions. Set car forward maximum to 100 km/h, reduce steering rate as speed rises, and retain swept collision/braking. Other vehicle limits remain unchanged. This is an original lightweight character, not an imported GTA asset.

Validate five site IDs/coordinates and footprint/road clearance in Node; run browser interaction, route, movement, vehicle, saved quest and render-budget checks on WebGL and native WebGPU. Inspect screenshots of all five destinations. Run the owned Model Y and home/community continuity checks. Publish using the existing GitHub Pages workflow after checks pass.

Sources: [OSM](https://www.openstreetmap.org/copyright), [THSR plan](https://www.thsrc.com.tw/event/map/Taoyuan.pdf), [Gloria plan](https://www.gloriaoutlets.com/files/GO_CenterMap/CM_Download/MAP202501.pdf), [water centre operator](https://www.ctci-hec.com.tw/Page2_2.aspx?Mbar=2), [IKEA store](https://www.ikea.com.tw/zh/store/tao-yuan/info).
