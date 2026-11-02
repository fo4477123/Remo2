# 青埔車輛與車流

目標：可辨識的台灣常見車與 Foxtron Model A、B、C、T、K，並可從街上攔車接管駕駛，保留玩家的 Model Y。

以各車公開外觀作建模參考；概念車與未公布細節標示為遊戲中的詮釋。Model T 使用巴士比例，Model K 使用小貨卡比例。街上車輛依長寬配置碰撞空間，避免在橋梁、水面與建築中生成。雙向道路雙向行駛，單行道路遵守圖資方向。

按 F 靠近車輛接管；離車後可再次進入。駕駛中無法由車流系統重新生成或移走車輛。玩家的 Model Y 及其存檔位置不被覆寫。車輛互動與交通狀態需在 WebGL2、低品質設定及存讀檔後驗證。

來源：[鴻海電動車平台](https://www.honhai.com.tw/zh-tw/products-and-services/event-highlights/strategy-blueprint/electric-vehicle-platform)、[Model T 官方資訊](https://www.honhai.com.tw/zh-tw/press-center/events/csr-events/1895)、[2026 Model K 報導](https://news.u-car.com.tw/news/article/90107)。
