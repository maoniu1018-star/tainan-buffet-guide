# 台南吃到飽｜價格大全

GitHub Pages 靜態網站。

## 本版重點
- 保留奶油白＋蜜桃粉的價格大全 UI
- 不使用餐廳實物照片
- 移除重複餐廳資料（同名只保留一筆）
- 卡片直接呈現平日／午餐、晚餐／假日、兒童、服務費
- 支援搜尋、行政區、預算、類型與排序
- 保留 Chung NING 與 Instagram： https://www.instagram.com/h.ning1018/

## 檔案說明

`index.html` 目前透過 `data.js` 載入餐廳資料，首頁筆數會依資料檔動態計算。`data.json` 是舊版資料檔，首頁未引用；維護目前網站時請以 `data.js` 為主要資料來源。

## GitHub Pages
將根目錄檔案上傳至既有 repository 的 `main` 分支，Pages 使用 `main / root`。


### Google 星評
網站星評欄位採 Google Maps 的目前評分與評論數；未取得可靠 Google 資料的店家不填假評分。
