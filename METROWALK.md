# 大江購物中心：六層場館

以現有 OSM 109836992 建築多邊形保留大江實際位置與輪廓，參考桃園市觀光局與大江官方照片中的米黃色文化石、紅色屋頂／水平雨遮、青綠曲面玻璃、圓窗與 MetroWalk、SBC 招牌，以原創幾何重建，不將參考照片放進遊戲。

官方導覽列出 GBF、1F、2F、3F、4F、5F，共六個遊戲樓層：GBF 餐飲與生活、1F 服飾香氛、2F 親子選物、3F 休閒鞋包、4F 遊戲與閱讀、5F 影城。樓層主題及部分主要品牌名稱依官方導覽，商店位置、內部走道及活動為遊戲設計，不聲稱是精確實測平面或即時店家名單。各樓層以約 120 × 60 公尺的原創遊戲場景按需載入，每層有 15 個可互動店面與六位人物，電梯可選六層，手扶梯可上下相鄰樓，1F 出口返回同一街道入口並保留車輛狀態。地圖提供入口導航。4F 有三燈街機、5F 有可控制的原創動畫短片；六層護照完成可獲得客廳收藏。

驗證建築輪廓及碰撞、步行與汽車路徑、入口可到達、六層從入口可由電梯與手扶梯往返、每層商店與 NPC 可互動、出口避障與車位保留、舊任務與存檔、WebGPU/WebGL 啟動及低畫質繪製預算。執行 `node qa-metrowalk.cjs webgpu` 與 `node qa-metrowalk-driving.cjs`。取得外觀照片只供本地核對，所有畫面及內容均為原創。

參考：[桃園觀光局](https://travel.tycg.gov.tw/zh-tw/consume/detail/1772)、[官方 GBF](https://www.metrowalk.com.tw/newweb/GBF.html)、[官方 1F](https://www.metrowalk.com.tw/newweb/1F.html)、[2F](https://www.metrowalk.com.tw/newweb/2F.html)、[3F](https://www.metrowalk.com.tw/newweb/3F.html)、[4F](https://www.metrowalk.com.tw/newweb/4F.html)、[5F](https://www.metrowalk.com.tw/newweb/5F.html)。

2026-10-27 驗證：WebGL2 與原生 WebGPU 實際完成六層進出、各層互動點步行可達、電梯和雙向手扶梯、街機亮燈、動畫放映、護照領獎及重新載入存檔；Model Y 從住家導航的整條路徑逐段檢查車身碰撞，並測試入口被占用時的安全落腳及車位保留。WebGPU 低畫質六層樣本為 43–44 個繪製呼叫、約 5.3–5.6 萬三角形；這是渲染統計，非各種設備的幀率保證。
