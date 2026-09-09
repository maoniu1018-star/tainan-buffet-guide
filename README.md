# 台南吃到飽｜自助吧餐廳搜尋

可直接部署到 GitHub Pages 的純靜態網站。

## 部署
1. 建立 GitHub Repository。
2. 將本資料夾內的 `index.html`、`data.js`、`style.css`、`app.js` 上傳到 repository 根目錄。
3. GitHub → Settings → Pages → Deploy from a branch → `main` / `/root`。
4. 儲存後等待 GitHub Pages 發布。

## 資料原則
- 只收錄「吃到飽」或「有自助吧」的店家。
- 分店獨立建卡。
- 官方網站／官方品牌頁優先於第三方整理。
- 沒有可靠訂位連結就不放訂位按鈕。
- `🟢 已核對`：截至 2026-09-10 可由官方／可靠來源交叉確認。
- `🟡 部分核對`：仍有欄位需要後續補齊；網站刻意不把未知資料偽裝成確定資訊。

## 更新
餐廳資料主要在 `data.js`。網站為純前端，不需要資料庫或後端。
