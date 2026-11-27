const fs = require("node:fs");

const queries = [
  "台南 吃到飽 新開幕",
  "台南 自助吧 改裝 餐廳",
  "台南 火鍋 自助吧 新店",
  "台南 牛排 自助吧 吃到飽",
  "台南 buffet 自助餐 開幕",
  "台南 現切肉 自助吧"
];
const today = new Date();
const cutoff = new Date(today.getTime() - 14 * 86400000);

function field(block, name) {
  const pattern = new RegExp("<" + name + ">([\\s\\S]*?)</" + name + ">");
  const found = block.match(pattern);
  return found ? found[1]
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim() : "";
}

async function fetchFeed(query) {
  const url = "https://news.google.com/rss/search?q=" + encodeURIComponent(query) + "&hl=zh-TW&gl=TW&ceid=TW:zh-Hant";
  const response = await fetch(url, { headers: { "User-Agent": "TainanBuffetGuide/1.0" } });
  if (!response.ok) throw new Error("RSS " + response.status + "：" + query);
  const xml = await response.text();
  const blocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(match => match[1]);
  return blocks.map(block => ({
    title: field(block, "title"),
    link: field(block, "link"),
    pubDate: field(block, "pubDate"),
    source: field(block, "source"),
    query
  })).filter(item => item.title && item.link && item.pubDate &&
    !isNaN(Date.parse(item.pubDate)) && new Date(item.pubDate) >= cutoff);
}

async function main() {
  const results = await Promise.allSettled(queries.map(fetchFeed));
  const items = results.filter(x => x.status === "fulfilled").flatMap(x => x.value);
  const failed = results.filter(x => x.status === "rejected");
  if (!items.length && failed.length === queries.length) {
    throw new Error("所有 Google News RSS 查詢均失敗：" + failed.map(x => x.reason.message).join("；"));
  }
  const unique = [...new Map(items.map(item => [item.title, item])).values()]
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, 60);
  const lines = [
    "# 台南吃到飽新店／改裝動態追蹤",
    "",
    "更新日期：" + today.toISOString().slice(0, 10),
    "監控範圍：近14天；分別搜尋吃到飽新開幕、自助吧改裝、火鍋自助吧、牛排自助吧、Buffet及現切肉店型。",
    "成功查詢：" + (queries.length - failed.length) + "／" + queries.length + " 組",
    "",
    "> 本清單是新聞線索，不代表已確認營業或收費。需逐家核對店家官方公告、電話及現場菜單後，才可加入正式餐廳資料。",
    "",
    "找到 " + unique.length + " 則近期線索。",
    ""
  ];
  if (failed.length) lines.push("## 查詢異常", "", ...failed.map(x => "- " + x.reason.message), "");
  if (!unique.length) lines.push("- 本次沒有找到近14天符合條件的新聞線索。");
  for (const item of unique) {
    lines.push("## " + item.title, "", "- 日期：" + item.pubDate, "- 來源：" + (item.source || "Google News"), "- 關鍵字：" + item.query, "- 連結：" + item.link, "");
  }
  fs.writeFileSync("buffet-watch-report.md", lines.join("\n"), "utf8");
  console.log("完成：成功查詢 " + (queries.length - failed.length) + "/" + queries.length + " 組，找到 " + unique.length + " 則近14天線索。");
}
main().catch(error => { console.error(error); process.exit(1); });
