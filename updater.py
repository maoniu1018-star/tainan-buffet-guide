import json, datetime, re, html
from pathlib import Path
import requests

ROOT=Path(__file__).resolve().parent
DATA=ROOT/"data.json"
REPORT=ROOT/"update-report.md"
H={"User-Agent":"TainanBuffetGuide/1.0"}

def fetch(url):
    try:
        r=requests.get(url,headers=H,timeout=25)
        r.raise_for_status()
        return r.text
    except Exception as e:
        return f"__ERROR__:{e}"

def textify(raw):
    raw=re.sub(r"<script.*?</script>|<style.*?</style>"," ",raw,flags=re.S|re.I)
    raw=re.sub(r"<[^>]+>"," ",raw)
    return re.sub(r"\s+"," ",html.unescape(raw)).strip()

def main():
    data=json.loads(DATA.read_text(encoding="utf-8"))
    today=datetime.date.today().isoformat()
    lines=[f"# 每月資料檢查報告","",f"檢查日期：{today}","",
           "安全模式：本次只檢查來源頁面與更新日期，不直接用模糊抓取結果覆蓋餐價。"]
    for r in data["restaurants"]:
        url=r.get("url","")
        if not url or "google.com/maps" in url:
            lines.append(f"- {r['name']}：無可抓取來源頁，請人工確認。")
            continue
        raw=fetch(url)
        if raw.startswith("__ERROR__"):
            lines.append(f"- {r['name']}：抓取失敗 → {raw}")
        else:
            t=textify(raw)
            hits=[k for k in ["平日","午餐","晚餐","兒童","服務費","價目","價格"] if k in t]
            lines.append(f"- {r['name']}：來源可讀；關鍵字命中：{', '.join(hits) or '無'}")
            r["sourceCheckedAt"]=today
    data["updatedAt"]=today
    data["updateStatus"]="Monthly source check completed"
    DATA.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding="utf-8")
    REPORT.write_text("\n".join(lines),encoding="utf-8")

if __name__=="__main__": main()
