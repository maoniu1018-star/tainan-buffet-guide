const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("data.js", "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { timeout: 1500, filename: "data.js" });

const rows = sandbox.window.RESTAURANTS;
if (!Array.isArray(rows)) throw new Error("data.js 未產生 window.RESTAURANTS 陣列");

const today = new Date().toISOString().slice(0, 10);
const required = ["name", "type", "area", "price", "address", "phone", "source", "status"];
const missing = [];
const duplicates = [];
const seen = new Map();
const noPriceDate = [];
const oldPriceDate = [];
const weakPriceEvidence = [];
const invalidOfficialUrls = [];

for (const [i, row] of rows.entries()) {
  const label = row.name || `第 ${i + 1} 筆`;
  for (const key of required) {
    if (row[key] === undefined || row[key] === null || String(row[key]).trim() === "") {
      missing.push(`- ${label}：缺少 ${key}`);
    }
  }
  if (seen.has(label)) duplicates.push(`- ${label}：第 ${seen.get(label) + 1} 筆與第 ${i + 1} 筆重複`);
  else seen.set(label, i);

  if (!row.priceVerified) noPriceDate.push(label);
  else {
    const match = String(row.priceVerified).match(/^(\\d{4})[/-](\\d{1,2})[/-](\\d{1,2})$/);
    if (!match) oldPriceDate.push(`- ${label}：核對日期格式不正確（${row.priceVerified}）`);
    else {
      const stamp = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
      const age = Math.floor((Date.now() - stamp) / 86400000);
      if (age > 90) oldPriceDate.push(`- ${label}：價格核對已超過 90 天（${row.priceVerified}）`);
    }
  }

  if (/待確認|待查|未確認/.test(String(row.price || ""))) weakPriceEvidence.push(label);
  if (row.official) {
    try { new URL(row.official); }
    catch { invalidOfficialUrls.push(`- ${label}：官方網址格式錯誤`); }
  }
}

const lines = [
  "# 台南吃到飽｜正式網站資料健檢",
  "",
  `檢查日期：${today}`,
  `正式資料檔：data.js`,
  `資料筆數：${rows.length}`,
  "",
  "> 本報告只檢查資料完整性與核對日期，不會自動改寫餐廳價格、營業狀態或電話。需有官方或可追溯證據才可修改。",
  "",
  "## 檢查摘要",
  `- 缺少必要欄位：${missing.length}`,
  `- 重複店名：${duplicates.length}`,
  `- 未標示價格核對日期：${noPriceDate.length}`,
  `- 超過 90 天或日期格式異常：${oldPriceDate.length}`,
  `- 價格文字含待確認字樣：${weakPriceEvidence.length}`,
  `- 官方網址格式錯誤：${invalidOfficialUrls.length}`,
  "",
  "## 缺少必要欄位",
  ...(missing.length ? missing : ["- 無"]),
  "",
  "## 重複店名",
  ...(duplicates.length ? duplicates : ["- 無"]),
  "",
  "## 價格核對日期待補",
  ...(noPriceDate.length ? noPriceDate.map(x => `- ${x}`) : ["- 無"]),
  "",
  "## 價格核對日期過舊或格式異常",
  ...(oldPriceDate.length ? oldPriceDate : ["- 無"]),
  "",
  "## 價格文字待查",
  ...(weakPriceEvidence.length ? weakPriceEvidence.map(x => `- ${x}`) : ["- 無"]),
  "",
  "## 官方網址格式錯誤",
  ...(invalidOfficialUrls.length ? invalidOfficialUrls : ["- 無"]),
  ""
];

fs.writeFileSync("data-audit-report.md", lines.join("\n"), "utf8");
console.log(lines.slice(0, 16).join("\n"));

if (missing.length || duplicates.length || invalidOfficialUrls.length) {
  console.error("資料結構健檢未通過，請先修正必要欄位、重複店名或網址格式。");
  process.exitCode = 1;
}
