const fs = require("node:fs");

const query = encodeURIComponent("台南 吃到飽 自助吧 buffet 改裝 新開幕 餐廳");
const url = "https://news.google.com/rss/search?q=" + query + "&hl=zh-TW&gl=TW&ceid=TW:zh-Hant";
const today = new Date();
const cutoff = new Date(today.getTime() - 14 * 86400000);

async function main() {
  const response = await fetch(url, { headers: { "User-Agent": "TainanBuffetGuide/1.0" } });
  if (!response.ok) throw new Error("Google News RSS 回應錯誤：" + response.status);
  const xml = await response.text();
  const blocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(match => match[1]);
  const field = (block, name) => {
    const pattern = new RegExp("<" + name + ">([\\s\\S]*?)</" + name + ">");
    const found = block.match(pattern);
    return found ? found[1].replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim() : "";
  };
  const items = blocks.map(block => ({
    title: field(block, "title"),
    link: field(block, "link"),
    pubDate: field(block, "pubDate"),
    source: field(block, "source")
  })).filter(item => item.title && item.link && item.pubDate && !isNaN(Date.parse(item.pubDate)) && new Date(item.pubDate) >= cutoff);
  const unique = [...new Map(items.map(item => [item.title, item])).values()].slice(0, 40);
  const lines = [
    "# 台南吃到飽新店／改裝動態追蹤",
    "",
    "更新日期：" + today.toISOString().slice(0, 10),
    "監控範圍：近14天公開報導；包含吃到飽、自助吧、Buffet、改裝及新開幕關鍵字。",
    "",
    "> 本清單是線索，不代表已確認營業或收費。需逐家核對店家官方公告、電話及現場菜單後，才可加入正式餐廳資料。",
    "",
    "找到 " + unique.length + " 則近期線索。",
    ""
  ];
  if (!unique.length) lines.push("- 本次沒有找到近14天符合條件的新聞線索。");
  for (const item of unique) {
    lines.push("## " + item.title, "", "- 日期：" + item.pubDate, "- 來源：" + (item.source || "Google News"), "- 連結：" + item.link, "");
  }
  fs.writeFileSync("buffet-watch-report.md", lines.join("\n"), "utf8");
  console.log("完成：找到 " + unique.length + " 則近14天線索。");
}
main().catch(error => { console.error(error); process.exit(1); });
