// 價格表四格修正：平日午餐／平日晚餐／假日午餐／假日晚餐
(function(){
  function parsePrice(r){
    if(r&&r.prices&&typeof r.prices==='object'){
      return {
        weekdayLunch:r.prices.weekdayLunch||'依方案',
        weekdayDinner:r.prices.weekdayDinner||'依方案',
        holidayLunch:r.prices.holidayLunch||'依方案',
        holidayDinner:r.prices.holidayDinner||'依方案'
      };
    }
    const s=String((r&&r.price)||'').trim()||'依店家公告';
    const out={weekdayLunch:'依方案',weekdayDinner:'依方案',holidayLunch:'依方案',holidayDinner:'依方案'};
    let m;
    m=s.match(/平日\s*午(?:餐)?\s*[:：]?\s*([^；，,]+)/); if(m) out.weekdayLunch=m[1].trim();
    m=s.match(/平日\s*晚(?:餐)?\s*[:：]?\s*([^；，,]+)/); if(m) out.weekdayDinner=m[1].trim();
    m=s.match(/假日\s*午(?:餐)?\s*[:：]?\s*([^；，,]+)/); if(m) out.holidayLunch=m[1].trim();
    m=s.match(/假日\s*晚(?:餐)?\s*[:：]?\s*([^；，,]+)/); if(m) out.holidayDinner=m[1].trim();
    if(/假日/.test(s)&&!(/假日\s*午/.test(s)||/假日\s*晚/.test(s))){
      m=s.match(/假日\s*[:：]?\s*([^；，,]+)/); if(m){out.holidayLunch=m[1].trim();out.holidayDinner=m[1].trim();}
    }
    if(/平日/.test(s)&&!(/平日\s*午/.test(s)||/平日\s*晚/.test(s))){
      m=s.match(/平日\s*[:：]?\s*([^；，,]+)/); if(m){out.weekdayLunch=m[1].trim();out.weekdayDinner=m[1].trim();}
    }
    // 單一價格／起價：只在沒有更細分資料時呈現為「起」價，其他餐期保留依方案，避免誤導。
    if(out.weekdayLunch==='依方案'&&out.weekdayDinner==='依方案'&&out.holidayLunch==='依方案'&&out.holidayDinner==='依方案'){
      out.weekdayLunch=s;
    }
    return out;
  }
  window.priceFour= parsePrice;

  window.budgetMatch=function(r,b){
    if(!b)return true;
    const p=parsePrice(r);
    const nums=[p.weekdayLunch,p.weekdayDinner,p.holidayLunch,p.holidayDinner]
      .map(x=>String(x).replace(/,/g,'').match(/(?:NT\$|\$)?\s*(\d{3,5})/))
      .filter(Boolean).map(m=>Number(m[1]));
    if(!nums.length)return false;
    const n=Math.min.apply(null,nums);
    return b==='under300'?n<300:b==='300to500'?n>=300&&n<=500:b==='500to800'?n>500&&n<=800:b==='800to1200'?n>800&&n<=1200:n>1200;
  };

  window.render=function(){
    const rows=filtered();
    $('#resultInfo').textContent=`目前顯示 ${rows.length} 間`;
    $('#cards').innerHTML=rows.length?rows.map(r=>{
      const p=parsePrice(r);
      const map='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(r.name+' '+r.address);
      return `<article class="card"><div class="badges"><span class="badge">${esc(r.type||'吃到飽')}</span>${(r.tags||[]).slice(0,2).map(v=>`<span class="badge">${esc(v)}</span>`).join('')}<span class="badge ${r.status&&r.status.includes('🟢')?'ok':'warn'}">${esc(r.status||'待確認')}</span></div><h3>${esc(r.name)}</h3><div class="rating">${stars(r)}</div><div class="addr">📍 ${esc(r.address||'—')}</div><div class="addr">☎️ ${r.phone&&r.phone!=='依官方最新資訊'?`<a href="tel:${esc(r.phone.replace(/-/g,''))}">${esc(r.phone)}</a>`:esc(r.phone||'—')}</div><div class="prices"><div class="pricebox"><div class="lab">平日午餐</div><div class="num">${esc(p.weekdayLunch)}</div></div><div class="pricebox"><div class="lab">平日晚餐</div><div class="num">${esc(p.weekdayDinner)}</div></div><div class="pricebox"><div class="lab">假日午餐</div><div class="num">${esc(p.holidayLunch)}</div></div><div class="pricebox"><div class="lab">假日晚餐</div><div class="num">${esc(p.holidayDinner)}</div></div></div><div class="meta"><div><b>兒童：</b>${esc(r.child||'依店家公告')}</div><div><b>服務費：</b>${esc(r.service||'依店家公告')}</div></div><div class="locbar"><a class="locbtn primary" href="${map}" target="_blank" rel="noopener">🗺️ 開啟地圖</a></div><div class="actions"><button class="main" data-name="${esc(r.name)}">完整資訊／來源</button>${r.official?`<a href="${esc(r.official)}" target="_blank" rel="noopener">🌐 官方網站</a>`:''}</div></article>`;
    }).join(''):'<div class="notice">找不到符合條件的餐廳，請清除篩選。</div>';
    $cardsButtons();
  };

  window.detail=function(r){
    const p=parsePrice(r);
    const map='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(r.name+' '+r.address);
    return `<h2>${esc(r.name)}</h2><div class="rating">${stars(r)}</div><div class="rows"><div class="row"><div class="k">價目表</div><div class="v">平日午餐：${esc(p.weekdayLunch)}<br>平日晚餐：${esc(p.weekdayDinner)}<br>假日午餐：${esc(p.holidayLunch)}<br>假日晚餐：${esc(p.holidayDinner)}<br>兒童：${esc(r.child||'依店家公告')}<br>服務費：${esc(r.service||'依店家公告')}</div></div><div class="row"><div class="k">地址</div><div class="v">${esc(r.address||'—')}</div></div><div class="row"><div class="k">電話</div><div class="v">${esc(r.phone||'—')}</div></div><div class="row"><div class="k">營業時間</div><div class="v">${esc(r.hours||'—')}</div></div><div class="row"><div class="k">特色／備註</div><div class="v">${esc(r.desc||'—')} ${esc(r.note||'')}</div></div><div class="row"><div class="k">資料來源</div><div class="v">${esc(r.source||'—')}</div></div><div class="row"><div class="k">最後核對</div><div class="v">2026/09/10</div></div></div><div class="actions"><a class="main" href="${map}" target="_blank" rel="noopener">🗺️ 開啟地圖</a>${r.phone&&/^06-\d/.test(r.phone)?`<a href="tel:${r.phone.replace(/-/g,'')}">☎️ 電話</a>`:''}${r.official?`<a href="${esc(r.official)}" target="_blank" rel="noopener">🌐 官方網站</a>`:''}${r.booking?`<a href="${esc(r.booking)}" target="_blank" rel="noopener">🔴 官方訂位</a>`:''}</div>`;
  };
  window.show=function(r){$('#detail').innerHTML=detail(r);$('#modal').classList.add('show')};
  // app.js 已完成初次 render；這裡再次依四格價格邏輯重繪。
  render();
})();
