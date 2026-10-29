# 模型、配樂、材質與青埔環景

## WebGPU 重製素材

- 客廳為使用者確認的[暖嶼家居伴木沙發](https://www.nuanyu.tw/treemate)，依官方照片本地重建，長220 × 深106 cm為使用者確認的客製尺寸。原通用弧背沙發已移除；沒有宣稱取得原廠CAD。官方照片只存於忽略的本機QA目錄作造型參考，未放上網站轉載。雙靠背、插銷頭枕、拉點、扶手與木腳為本案幾何。
- `assets/models/sheen-chair.glb`：[SheenChair](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/SheenChair)，©2020 Wayfair／Eric Chadwick，CC0，調整為大廳的現代暖色單椅。
- `assets/models/porcelain-teacup.glb`：[DiffuseTransmissionTeacup](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/DiffuseTransmissionTeacup)，Poly Haven／Eric Chadwick，CC0，調整為茶几上的實際瓷杯與杯碟，隨茶几升降。
- 逐項外部模型來源、雜湊與授權見 `assets/models/sources.json` 及相鄰原始授權文件。上掀床、雪板收納、任務立體獎品與「R & Y Sweet Home」公仔為本案原創幾何。雪板依使用者指定，參考 [GRAY 26–27 DESPE WOOD](https://graysnowboards.co.jp/product/) 和 [Nidecker 白色 LT Supermatic](https://www.nidecker.com/products/lt-supermatic?variant=47139286679727) 本地重建，品牌字樣僅識別指定設備，非原廠授權模型；參考照片不發布。其他床品、櫃體及家電為本案細化模型，並非宣稱全數外部掃描或FF7遊戲資產。
- 配樂為Scott Buckley的 [Reverie](https://www.scottbuckley.com.au/library/reverie/) 與 [Childhood](https://www.scottbuckley.com.au/library/childhood/)，[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。原始MP3錄音保存在 `assets/audio/`，來源及著作標示見 `assets/audio/LICENSE.md`，亦顯示於播放器與網頁素材說明。只作為可選背景音樂，未剪輯或混音；執行時調整音量及循環。
- 渲染依賴為Three.js 0.186.1／MIT，從官方npm壓縮檔保留必要執行檔及授權文件；完整性雜湊及版本見 `vendor/three/VERSION.json`，授權見 `vendor/three/LICENSE`。

## 一樓街景與全室材質增補

`assets/qingpu-ground-panorama.jpg` 為 1F 社區大廳獨立街景，鏡頭約離人行道160 cm；住宅仍用五樓環景與朝站景片。模式為 builtin imagegen 參考圖重構，原始輸出 `C:/Users/style/.codex/generated_images/01a16b99-3dc7-7470-84e3-db257abb3e22/exec-b168516e-db0c-4d28-9412-98c92999aa19.png`。三張景觀的本地恢復資料位於 `exterior-texture.js`，僅在圖片失敗時載入。

全室掃描材質保存於 `assets/pbr/`，來源為 Poly Haven，採 [CC0 授權](https://polyhaven.com/license)。使用 [Rough Linen](https://polyhaven.com/a/rough_linen)、[Oak Veneer 01](https://polyhaven.com/a/oak_veneer_01)、[Marble 01](https://polyhaven.com/a/marble_01)、[Painted Plaster Wall](https://polyhaven.com/a/painted_plaster_wall) 的2K法線、粗糙度與部分色彩貼圖。織物維持室內指定色彩，木皮維持淺橡木色；石材取單片區域以避開磁磚縫。逐檔下載網址及授權紀錄見 `assets/pbr/sources.json`。

家具幾何為本案本地重建與細化，沒有將其宣稱為整批外部掃描模型。Panasonic NR-D505XGS-W 的外尺寸依 [原廠商品頁](https://www.panasonic.com/tw/consumer/refrigerator/four-door/nr-d505xgs.html) 校正為183.4高 × 72.1寬 × 69.5深 cm，門片包括在總深度內。

網站素材：`assets/qingpu-8th-9th-panorama.jpg`。模式：builtin imagegen 新圖生成；PNG 原始輸出以 JPEG 編碼供網站載入。原始輸出位於 `C:/Users/style/.codex/generated_images/01a16b99-3dc7-7470-84e3-db257abb3e22/exec-45f07ad1-7337-4732-ba81-df8a165baf0e.png`。

位置與方向由使用者提供：青埔八街與青埔九街交叉口附近、社區後側青松街、客廳朝高鐵桃園站。樓層沿用專案的五樓假設。這張圖是區域情境，沒有宣稱還原精確門牌的建物、景觀遮擋或實拍街景。

參考查核：

- [桃園市街道地名清冊](https://ws.tycg.gov.tw/Download.ashx?n=6ZmE5Lu2NeS4gOihl%2BmBky5wZGY%3D&u=LzAwMS9VcGxvYWQvNzkvcmVsZmlsZS8xMDcyOC8xNjAxOTk4L2U2ZjU4ZDliLWE0ZTItNDU3Mi1iZDliLTUwNGZlN2FjMjEwOC5wZGY%3D)：青埔八街、青埔九街、青松街的名稱。
- [台灣高鐵桃園站資訊](https://www.thsrc.com.tw/ArticleContent/fbd828d8-b1da-4b06-a3bd-680cdca4d2cd)：高鐵桃園站，位於中壢區高鐵北路一段。

渲染以單一內向球面承接連續環景；圖中央朝 +CAD-y，對應客廳窗面，背向接續住宅街區。日光、夕暮、夜間使用同一方向與不同色調。照片本身沒有分別在四面重複貼上。

為改善窗內放大的清晰度，前方另使用 `assets/qingpu-station-facing.jpg`，以相同街區環景為參考重製約 85 度視野的景片，再投射到球面前側。模式：builtin imagegen 參考圖編輯／重構；原始輸出 `C:/Users/style/.codex/generated_images/01a16b99-3dc7-7470-84e3-db257abb3e22/exec-acc7e8ae-b029-4a73-bc71-238b69f24ca5.png`。圖片原始像素不代表施工或實景精度。

## 一樓景片提示

Use case: exterior environmental background for a FIRST-FLOOR residential community lobby game scene in Qingpu, Zhongli, Taoyuan, Taiwan.
Image 1 is only a reference for the neighbourhood's Taiwanese architecture and natural daylight. Create a NEW seamless 360-degree equirectangular panorama, 2:1 aspect ratio, camera exactly at pedestrian eye level 1.6 metres above the pavement, level horizon at 50% image height. Location context: intersection of Qingpu 8th Street and Qingpu 9th Street, with Qingsong Street on the rear side of the residential block. A plausible regional reconstruction rather than a documentary exact-address photograph.
Main central heading looks outward from the entrance of a residential community onto an ordinary modest Taiwanese local street: pale concrete sidewalk and curb in the immediate lower foreground; asphalt roadway with realistic white markings and a few small parked scooters/cars; opposite three-to-five storey tiled townhouses, varied modern apartment facades, balconies and rooftop water tanks; low street trees and a normal crossroad. Buildings RISE above the viewer. All visible roofs must be ABOVE eye level; no aerial view, no looking down on roofs. Upper panorama mostly sky between tall facades, lower half pavement/street. Taoyuan HSR station belongs in the distant district but should naturally be largely hidden from this ground-level location; no giant station, no high speed railway viaduct, no train crossing the street. Flat Taoyuan terrain.
The frame should be a clear realistic, natural-colour architectural photograph under soft bright daytime light. Modern inhabited neighbourhood, clean ordinary roads, fine facade details. No interior, no doors or window frames in front of the camera, no people close to the lens, no readable invented signage, no labels or watermark, no mountains/lake. Consistent spherical perspective, matching side seams, single continuous scene. Crucial: first-floor street-level eye height, not the elevated fifth-floor panorama in the reference.

## 前方景片提示

Use case: environmental photographic background plate for a 3D apartment, a high-detail forward-facing view.
Image 1 is a city panorama reference, NOT a target to preserve as a 360-degree map. Recompose the CENTRAL quarter/third of this panorama as one crisp, conventional rectilinear camera photograph with approximately 85 degree horizontal field of view, 2:1 aspect ratio, level camera, level horizon at 50% image height. This focused view must not cram in all 360 degrees.
Location context supplied by the apartment owner: near the intersection of Qingpu 8th Street and Qingpu 9th Street in Zhongli, Taoyuan, Taiwan; Qingsong Street is behind the apartment. Camera at a fifth floor, about 16 metres above street level, looking toward Taoyuan HSR station in the distance. This is a plausible regional reconstruction, not documentary address verification.
Preserve the quiet Taiwan residential character and plausible central sightline from image 1: nearby 3–5 storey pale tiled townhouses and rooftops at/slightly below the camera, modest narrow local intersection and street trees, urban blocks, varied neutral mid-rise apartments to the sides. SMALL, low, long pale silver roof of Taoyuan HSR station in a distant central gap, about one kilometre away, not a huge stadium filling the view. Flat landscape; no mountains, lake, monumental rail viaduct or visible HSR train. Do not copy the whole circular panorama or make roads radiate.
Camera is a level fifth-floor residential view, not a tall drone aerial: facades of taller neighbours rise above eye level. Build ordinary detailed facade textures, individual windows, balcony railings, AC units, rooftop water tanks, correctly scaled tiny cars and authentic Taiwanese road markings. Soft bright late-morning sun, neutral realistic colours, slightly hazy distant depth but SHARP near/medium architecture. No tilt, no wide spherical distortion, no interiors/window/curtains/railings, no signs with legible invented words, no labels/watermark.
Make a very detailed high resolution architectural exterior photograph, intended for a 4096 by 2048 environment plate. The principal high-detail buildings and station must lie around the central horizon so they will be visible through an apartment window.

## 環景生成提示

Use case: photorealistic environmental background for an architectural WebGL walkthrough.
Create a single seamless 360-degree equirectangular spherical panorama, 2:1 aspect ratio, level horizon exactly at image mid-height. No interior, no window frame, no balcony railing. Camera is about 16 metres above street level (fifth-floor apartment) near Qingpu 8th Street, Zhongli District, Taoyuan, Taiwan. The CENTRAL heading looks toward Taoyuan High Speed Rail station approximately a kilometre away. The opposite view belongs at left/right panorama seam. This is a plausible district reconstruction, not an exact-address documentary photo.
Scene: realistic contemporary Qingpu residential street blocks, a mixture of 3–5 storey pale tiled townhouses and scattered 10–18 storey neutral beige/grey apartment buildings, balconies, rooftop tanks, sidewalks, flat roads, modest street trees, small cars, patches of urban open land. Natural Taiwan suburban urban fabric, not a manicured fantasy city. In the central distant gap, a SMALL low broad white/silver curved-roof glass station building, believable at a distance; do not make it a giant landmark or place it immediately outside the apartment. Taoyuan HSR tracks are underground here: NO high-speed railway viaduct, NO visible high-speed train outside. Any sign unreadably small. Nearby roofs slightly below the camera, some taller buildings above the horizon. At this level most visible near ground lies in the LOWER half, distant buildings straddle the horizon. Upper half mostly softly hazy pale blue sky with light clouds. Flat Taoyuan landscape, no dramatic mountain wall and no lakes.
Lighting: bright soft late-morning daylight, neutral photographic exposure, airy Taiwanese humidity with moderate atmospheric perspective, detailed yet quiet realistic photography, natural non-saturated colours, clear varied facade details. Straight verticals, consistent spherical perspective, continuous street fabric across all 360 degrees. Do not repeat the station or clone building clusters, no fisheye frame or montage, no labels, no text overlay, no watermark.
Output as a full 2:1 equirectangular panoramic texture with complete zenith/nadir coverage and matching side seams.


## Owner-selected office furniture (2026-10-26)

- ENJOY121 enterprise 2.0 EJB2-AB-HAM: https://ergohuman.com.tw/ejb2-ab-ham/ (official front photo and dimension drawing; black nylon base).
- IKEA MITTZON 495.303.43: https://www.ikea.com.tw/zh/products/office-workspace/office-desks-and-tables/mittzon-spr-49530343 (160×80 cm walnut/white, 62–126 cm height range).

Original local mesh reconstructions. Official product photographs are not redistributed. Household footsteps, latches, hinges, lift motor/chimes and stair effects are synthesized locally with Web Audio.


## A18 focused district / owned car / adult character (2026-10-26)

- Local OSM-derived map: assets/city/a18-map.json; © OpenStreetMap contributors, ODbL 1.0. Raw API tile bounds used by prepare-a18.cjs: (121.195,24.983,121.2145,25.006), (121.2145,24.983,121.234,25.006), (121.195,25.006,121.2145,25.029), (121.2145,25.006,121.234,25.029), stored as qa-output/qingpu-0.osm through -3.osm. The checked-in derived map does not require network at runtime.
- THSR official station/exit plan: https://www.thsrc.com.tw/event/map/Taoyuan.pdf
- Gloria official site plan: https://www.gloriaoutlets.com/files/GO_CenterMap/CM_Download/MAP202501.pdf
- Zhongli water centre operator landscape references: https://www.ctci-hec.com.tw/Page2_2.aspx?Mbar=2 and images/photo/a09_2_20220528.jpg, a09_5_20220528.jpg. Landscaping is a game interpretation of the operator's plan, not a claim that every path is currently open.
- IKEA official address and facade photograph: https://www.ikea.com.tw/zh/store/tao-yuan/info and /dairyfarm/tw/pageImages/page__zh_tw_15948816000.webp. Six-storey mass and lower yellow band, green wall and glazing guide the original local mesh.
- Model Y: [Tesla Model Y 2025](https://sketchfab.com/3d-models/tesla-model-y-2025-a66f7673a09d4fcb84d37111433f05a9) by joyemeng, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), simplified, recolored and grouped for wheel animation. The original local mesh remains a fallback; see `assets/models/vehicles/MODEL-Y-CREDITS.md`.
- Adult urban character: superseded by the MIT-licensed Microsoft Rocketbox models described below. No GTA/Rockstar or Final Fantasy asset is included.

Official photos/PDFs were used as design references only and are not redistributed. Facade textures, signs and mesh details are generated locally; the game is an architectural interpretation rather than a photogrammetric replica.


## A18 adjacent venues and game interiors (2026-10-26)

- COZZI official district/address/transport guide: https://cozzi.cathayhotel.com.tw/cozzi/blu/location
- Shin Kong official complex information: https://www.skcinemas.com/mall
- Gloria official store listing: https://www.gloriaoutlets.com/files/GO_CenterMap/CM_Download/Sitemap0503.pdf
- Taoyuan tourism district reference photograph: https://travel.tycg.gov.tw/zh-tw/travel/tour/283
- Actual local OSM building ways: COZZI 823329783, cinema 823329784, Xpark 823329785, common podium 856406373, P3 parking 23557246. Canopy ways remain roof-only/open below rather than opaque estimated apartment buildings. Crossing, bus-stop and bicycle-rental nodes are included in the derived A18 dataset.
- All venue interiors, furnishings, dialogue, quests, marine life and projected short-film graphics are original local game content. Their layouts are not reproductions of official interior plans. No booking, ticket purchase, live listings or real venue service is performed. The water learning room is an interpretive game pavilion.
- No researched photographs or official PDF graphics are embedded or redistributed.

## Realistic residents (2026-10-27)

- Source: [Microsoft Rocketbox](https://github.com/microsoft/Microsoft-Rocketbox), Copyright (c) 2020 Microsoft, [MIT license](https://github.com/microsoft/Microsoft-Rocketbox/blob/master/LICENSE.md), preserved in `assets/models/residents/LICENSE.md`.
- Adults `Male_Adult_08`, `Male_Adult_01`, `Female_Adult_02`: converted from original FBX/TGA to local `urban-man.glb`, `casual-man.glb`, `urban-woman.glb`. Source geometry is respectively 7,364 / 7,440 / 8,940 triangles and 80 skin joints. Original skin, clothing and hair textures resized to 1024 (hair 512); normals retained; repeated material groups merged to three draw calls. The three GLBs total about 7.8 MB.
- Shared source motions `m_idle_neutral_01.max.fbx`, `m_walk_neutral.max.fbx`, `m_run_neutral.max.fbx`, `m_wave_01.max.fbx` from the same repository, converted to quaternion tracks in local `motions.json`. Game adds reach/seated/cycling poses relative to the actor orientation.
- Actor height normalised to175cm after updating skeleton matrices. Far street figures use locally clustered UV/skinning geometry (roughly700–800 triangles). Low quality limits full-detail street residents to two nearby people, balanced five, high eight. Shared textures and source geometry are reused across residents.
- FFXV is a visual direction, not a claim of equivalent fidelity, a copied character, or licensed Square Enix content.

## Neighbourhood detail and original stories (2026-10-27)

- Five additional Microsoft Rocketbox adults: Male_Adult_04 (street-artist), Male_Adult_14 (older-neighbour), Male_Adult_18 (hoodie-neighbour), Female_Adult_07 (casual-woman), Female_Adult_12 (sport-woman). Same original MIT license; geometry, skeletal weights, skin/clothing/hair colour and normal maps preserved. Locally converted GLBs are 6,434–8,774 triangles; Female_Adult_07 has 81 skin joints, other new models have 80. Body/normal maps use 512px, face colour 1024px; bald models do not invent opacity textures. Eight templates total; sources and file hashes in assets/models/residents/sources.json.
- Street PBR: [asphalt_02](https://polyhaven.com/a/asphalt_02), [brick_wall_001](https://polyhaven.com/a/brick_wall_001), [concrete_wall_001](https://polyhaven.com/a/concrete_wall_001), [bark_brown_01](https://polyhaven.com/a/bark_brown_01), all [CC0](https://polyhaven.com/license). Local colour, normal and roughness JPEGs and hashes are in assets/pbr/city/.
- Qingsheng Temple: [Taoyuan official registered temple list](https://cab.tycg.gov.tw/News.aspx?PageSize=20&_CSN=101&n=18319&page=2&sms=18890), OSM way 347791868; original curved-roof, column, lantern and courtyard reconstruction.
- Gongqi Park/civic centre: [Taoyuan official playground reference](https://playfulpark-taoyuan.tycg.gov.tw/playgrounds/68), [ParkGO](https://www.taoyuan-parkgo.tw/parks/43), source footprint 1056599888. Slide/green-space forms guide original meshes; game interior is fictional.
- Guangtian Temple, Qingsong Street 70: [Taoyuan official temple entry](https://cab.tycg.gov.tw/News_Content.aspx?n=18319&s=1315151), source footprints 347792112 / 347792110. The Dayuan Tower and seated Ksitigarbha statue are original sculpted geometry, interpreted from exterior references; approximate statue proportions are not a surveyed or current building plan. No research photograph is redistributed.
- Four park polygons, water polygons and bridges retain the local OSM-derived coordinates and ODbL attribution. Swimming, public access, exhibits and transport interactions are game rules rather than real-world access guidance.
- Modern scooter, step-through bicycle, generic sedan, foliage atlas, basketball/picnic/planting props and all seven side stories are original local meshes/textures/content. No proprietary traffic models are included.
- The seven-chapter mainline “青埔的未寄之信” is original fiction; all dialogue, characters and letter text are game content. Player choices stay in the existing local browser save.

## MetroWalk 大江購物中心（2026-10-27）

- 建築位置與輪廓：本地 OSM way 109836992，© OpenStreetMap contributors / ODbL。高度 28m 為依公開外觀進行的遊戲近似，非實測建築高度。
- 立面特徵參考 [桃園觀光局](https://travel.tycg.gov.tw/zh-tw/consume/detail/1772)、[觀光局外觀照片](https://travel.tycg.gov.tw/content/images/attractions/12325/1024x768_files635897459861518395.jpg)；實地外觀圖片僅用來比對，未內嵌或再散布。文化石貼圖、圓窗、玻璃曲面、招牌與模型均為原創。
- [官方樓層導覽](https://www.metrowalk.com.tw/newweb/1F.html)列出 GBF、1F–5F；GBF 餐飲生活、2F 親子、3F 休閒、4F 遊樂、5F 影城參考各樓層官網。遊戲中店舖位置、室內配置、NPC、街機及短片均為原創設計。
