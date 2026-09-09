## 目前資料量
目前收錄 **89 家**台南 Buffet／吃到飽／自助吧相關店家。

# 台南吃到飽價格大全｜GitHub Pages + AI 每月更新

這個版本會由 GitHub Pages 發布網站，GitHub Actions 每月檢查設定的公開來源頁面，再用 OpenAI 判讀餐價。

## GitHub Pages
Repository → Settings → Pages
- Source：Deploy from a branch
- Branch：main
- Folder：/(root)

網站：
https://maoniu1018-star.github.io/tainan-buffet-guide/

## 設定 OpenAI API Key
Repository → Settings → Secrets and variables → Actions → New repository secret

Name：`OPENAI_API_KEY`

Value：你的 OpenAI API key

GitHub 官方建議將 API key 放在 repository secret，而不是寫入程式碼。OpenAI 官方模型文件列出 GPT-5.6 Luna 可用於成本敏感、高量工作負載，並支援 Responses API。

## 自動更新邏輯
每月 1 日執行：
1. 抓取每間餐廳設定的公開來源。
2. 擷取價格相關文字。
3. 交給 OpenAI 判讀平日、晚餐、兒童、服務費。
4. 只有信心分數 >= 0.92 且證據清楚時才修改 data.json。
5. 不確定的資料寫入 update-report.md，避免錯誤價格直接公開。
6. GitHub Actions 自動 commit，GitHub Pages 再部署新版。


## 本次擴充
資料庫擴充至 41 家以上，新增火鍋、火烤兩吃與燒肉選項。未能核實的固定餐價不猜測，改顯示「依官方當期價目表」，並提供公開平台參考均消。


## 官方連結
資料中的 `url` 會優先使用已確認的官方網站；若品牌沒有可確認的獨立官網，則使用官方粉專或保留查詢來源，避免誤植第三方網站。
