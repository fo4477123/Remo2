# 模型、配樂、材質與青埔環景

## WebGPU 重製素材

- `assets/models/glam-velvet-sofa.glb`：Khronos Sample Assets 的 [GlamVelvetSofa](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/GlamVelvetSofa)，©2021 Wayfair, LLC／Eric Chadwick，CC BY 4.0。本案調整朝向、尺寸、奶油色及絨布光澤；來源GLB原檔不變。著作標示亦置於網頁素材說明。
- `assets/models/sheen-chair.glb`：[SheenChair](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/SheenChair)，©2020 Wayfair／Eric Chadwick，CC0，調整為大廳的現代暖色單椅。
- `assets/models/porcelain-teacup.glb`：[DiffuseTransmissionTeacup](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/DiffuseTransmissionTeacup)，Poly Haven／Eric Chadwick，CC0，調整為茶几上的實際瓷杯與杯碟，隨茶几升降。
- 逐項來源、雜湊與授權見 `assets/models/sources.json` 及相鄰原始授權文件。床品、櫃體、家電與其他家具為本案細化模型，並非宣稱全數外部掃描或FF7遊戲資產。
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

