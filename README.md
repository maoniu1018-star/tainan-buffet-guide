# 台南吃到飽｜41 家餐廳 GitHub Pages 版

這是可直接放進 GitHub Repository 的網站版本。

## 最簡單部署方法

1. 在你的 GitHub Repository 開啟本資料夾。
2. 將 **index.html**、**README.md** 與 **.github** 整個上傳。
3. 到 GitHub → Settings → Pages。
4. 在 Build and deployment 選擇 **GitHub Actions**。
5. 回到 Actions，等待 `Deploy to GitHub Pages` 完成。
6. 完成後 GitHub 會提供網站網址。

## 檔案結構

```text
index.html
README.md
.github/
└── workflows/
    └── deploy-pages.yml
```

## 特色

- 台南吃到飽 41 家餐廳
- 粉白風格
- 搜尋
- 行政區篩選
- 類型篩選
- 價格排序
- 平日／午餐價格
- 晚餐價格
- 兒童費用
- 服務費
- 官方／來源連結
- Google 地圖
- 手機版響應式
- GitHub Pages 自動部署

## 後續更新

只要修改 `index.html` 後重新 push 到 `main`，GitHub Actions 會自動重新部署。
