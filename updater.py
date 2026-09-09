import datetime
import html
import json
import os
import re
from pathlib import Path

import requests
from openai import OpenAI

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data.json"
REPORT = ROOT / "update-report.md"
MODEL = os.getenv("OPENAI_MODEL", "gpt-5.6-luna")
HEADERS = {"User-Agent": "TainanBuffetGuide/1.0 (+https://github.com/maoniu1018-star/tainan-buffet-guide)"}


def fetch(url: str) -> str:
    try:
        r = requests.get(url, headers=HEADERS, timeout=30)
        r.raise_for_status()
        return r.text
    except Exception as e:
        return f"__ERROR__:{e}"


def extract_text(raw: str) -> str:
    raw = re.sub(r"<script.*?</script>|<style.*?</style>|<noscript.*?</noscript>", " ", raw, flags=re.S | re.I)
    raw = re.sub(r"<[^>]+>", " ", raw)
    return re.sub(r"\s+", " ", html.unescape(raw)).strip()


def relevant_excerpt(text: str, limit: int = 24000) -> str:
    keys = ["價格", "價目", "平日", "午餐", "晚餐", "自助", "吃到飽", "成人", "兒童", "小孩", "服務費", "加收"]
    chunks = []
    for key in keys:
        for m in re.finditer(re.escape(key), text, re.I):
            start = max(0, m.start() - 700)
            end = min(len(text), m.end() + 1200)
            chunks.append(text[start:end])
            if len(" ".join(chunks)) >= limit:
                break
        if len(" ".join(chunks)) >= limit:
            break
    if not chunks:
        return text[:limit]
    # de-duplicate while keeping order
    seen, out = set(), []
    for c in chunks:
        c = c.strip()
        if c and c not in seen:
            seen.add(c)
            out.append(c)
    return "\n\n---\n\n".join(out)[:limit]


def parse_with_ai(client: OpenAI, restaurant: dict, source_url: str, excerpt: str) -> dict:
    schema = {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "update_status": {"type": "string", "enum": ["update", "no_change", "needs_review"]},
            "confidence": {"type": "number", "minimum": 0, "maximum": 1},
            "weekday": {"type": ["string", "null"]},
            "dinner": {"type": ["string", "null"]},
            "child": {"type": ["string", "null"]},
            "service": {"type": ["string", "null"]},
            "evidence": {"type": "string"},
            "reason": {"type": "string"},
        },
        "required": ["update_status", "confidence", "weekday", "dinner", "child", "service", "evidence", "reason"],
    }
    prompt = f"""你是餐廳價格資料校對員。只可以使用我提供的官方/公開來源頁面內容，不可以自行猜測、補完或引用其他網站資訊。

餐廳：{restaurant.get('name')}
地址：{restaurant.get('address')}
目前資料：
- 平日：{restaurant.get('weekday')}
- 晚餐：{restaurant.get('dinner')}
- 兒童：{restaurant.get('child')}
- 服務費：{restaurant.get('service')}

來源網址：{source_url}

來源頁面摘錄：
{excerpt}

規則：
1. 只有在來源文字清楚對應到這一家餐廳，且能明確分辨成人、平日/午餐、晚餐、兒童、服務費時，才可提出更新。
2. 遇到節慶價、優惠價、會員價、期間限定價、模糊圖片文字、第三方評論，不要拿來覆蓋一般價格。
3. 若某欄無法確認，該欄回傳 null。
4. 只有 confidence >= 0.92 且 update_status=update 時，系統才會採用新價格。
5. evidence 要短，指出來源中的關鍵價格證據；不要虛構。
6. 若來源看起來沒有新價格或與目前資料相同，使用 no_change。
7. 若資料互相矛盾或格式不清楚，使用 needs_review。
"""

    response = client.responses.create(
        model=MODEL,
        input=prompt,
        text={"format": {"type": "json_schema", "name": "buffet_price_check", "strict": True, "schema": schema}},
    )
    return json.loads(response.output_text)


def main():
    if not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError("OPENAI_API_KEY 尚未設定，請在 GitHub Actions Repository secret 中加入。")

    data = json.loads(DATA.read_text(encoding="utf-8"))
    today = datetime.date.today().isoformat()
    client = OpenAI()
    changes = []
    reviews = []

    for restaurant in data.get("restaurants", []):
        url = restaurant.get("url", "")
        if not url or "google.com/maps" in url:
            reviews.append(f"- {restaurant['name']}：沒有可抓取的官方來源網址。")
            continue

        raw = fetch(url)
        if raw.startswith("__ERROR__"):
            reviews.append(f"- {restaurant['name']}：來源抓取失敗：{raw}")
            continue

        text = extract_text(raw)
        excerpt = relevant_excerpt(text)
        try:
            result = parse_with_ai(client, restaurant, url, excerpt)
        except Exception as e:
            reviews.append(f"- {restaurant['name']}：AI 判讀失敗：{e}")
            continue

        restaurant["sourceCheckedAt"] = today
        confidence = float(result.get("confidence", 0))
        status = result.get("update_status")
        applied = False

        if status == "update" and confidence >= 0.92:
            for field in ("weekday", "dinner", "child", "service"):
                new_value = result.get(field)
                if new_value and new_value != restaurant.get(field):
                    changes.append(f"- **{restaurant['name']}**：{field} `{restaurant.get(field)}` → `{new_value}`；信心 {confidence:.2f}；證據：{result.get('evidence','')}")
                    restaurant[field] = new_value
                    applied = True
        elif status == "needs_review" or confidence < 0.92:
            reviews.append(f"- **{restaurant['name']}**：需人工確認；信心 {confidence:.2f}；原因：{result.get('reason','')}；證據：{result.get('evidence','')}")

        if applied:
            restaurant["lastPriceChangeCheck"] = today

    data["updatedAt"] = today
    data["updateStatus"] = "AI monthly price check completed"
    DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    report = ["# 台南吃到飽｜AI 每月價格檢查報告", "", f"檢查日期：{today}", f"使用模型：{MODEL}", ""]
    report += ["## 已套用更新", ""] + (changes or ["- 本次沒有高信心價格更新。"])
    report += ["", "## 待人工確認", ""] + (reviews or ["- 沒有待確認項目。"])
    REPORT.write_text("\n".join(report), encoding="utf-8")


if __name__ == "__main__":
    main()
