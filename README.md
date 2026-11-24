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

`index.html` 目前透過 `data.js` 載入餐廳資料，首頁筆數會依資料檔動態計算。`data.json` 是舊版資料檔，首頁未引用；維護目前網站時請以 `data.js` 為主要資料來源。`restore-82.js` 與後續修正腳本會在首頁載入時補充或正規化部分資料。

## GitHub Pages
將根目錄檔案上傳至既有 repository 的 `main` 分支，Pages 使用 `main / root`。


### Google 星評
網站星評欄位採 Google Maps 的目前評分與評論數；未取得可靠 Google 資料的店家不填假評分。


## 自動更新注意事項

- 公開首頁實際載入的是 `data.js`，不是 `data.json`。
- `updater.py` 與 `.github/workflows/monthly-update.yml` 目前只檢查及寫入舊版 `data.json`，不會改變公開首頁資料。
- 為避免把舊資料檔的更新誤認為網站已更新，月更工作流程改為手動觸發；正式餐廳資料仍須依可查證來源更新 `data.js`。


## 每週新店／改裝動態追蹤與資料健檢

- `buffet-watch.js` 每週搜尋近 14 天台南「吃到飽、自助吧、Buffet、改裝、新開幕」公開報導，產生 `buffet-watch-report.md` 作為待核實線索。
- 新聞線索不會自動變成正式餐廳資料；必須核對店家官方資訊、電話、地址及實際收費後才加入 `data.js`。
- GitHub Actions 每天台灣時間上午 8:00 執行追蹤與資料健檢，也可手動執行。

## 正式資料健檢（data.js）

- `audit-data.js` 直接載入首頁使用的 `data.js`，檢查必要欄位、重複店名、價格核對日期、待確認價格文字與官方網址格式。
- `Weekly Tainan Buffet Watch and Data Audit` 每週執行一次，也可在 GitHub Actions 手動執行。
- 報告寫入 `data-audit-report.md`。此流程只產生健檢報告，不會自行改寫價格、營業狀態或電話；資料變更必須有可追溯證據。
