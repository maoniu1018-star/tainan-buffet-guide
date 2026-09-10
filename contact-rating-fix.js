/* 2026-09-10: final contact/rating/button normalizer */
(function(){
  'use strict';

  const googleRatings={
    '兩餐 Dookki 台南店':{rating:4.1,reviewCount:2351},
    '牧鍋 頂級熟成牛鍋物':{rating:4.5,reviewCount:1731},
    '桂田酒店 阿力海百匯餐廳':{rating:4.6,reviewCount:16970},
    '甘粹餐廳（台南老爺行旅）':{rating:3.9,reviewCount:1400}
  };
  const phones={
    '億品鍋 成大勝利店':'06-200-3168',
    '武灰鍋 平價個人小火鍋':'06-358-3988',
    '武灰鍋平價個人小火鍋':'06-358-3988',
    '桂田酒店 阿力海百匯餐廳':'06-243-4017',
    '甘粹餐廳（台南老爺行旅）':'06-238-3868'
  };
  const booking={
    '饗麻饗辣 台南永華旗艦店':'https://www.google.com/maps/reserve/v/dine/c/Q6nNFjolahk',
    '串家物語 台南三井店':'https://inline.app/booking/-L3RNFbAlXuITYXJJ3v7/-MuAhjlIDbmHRz8OWmzH',
    '灼花燒肉 HIBANA × 深煙酒吧 SHINEN':'https://www.google.com/maps/reserve/v/dine/c/9lWr4zKJXqc',
    '甘粹餐廳（台南老爺行旅）':'https://lihi2.com/aJVIz'
  };
  const data=window.RESTAURANTS||[];

  for(const r of data){
    const x=googleRatings[r.name];
    if(x){
      r.rating=x.rating;
      r.reviewCount=x.reviewCount;
      r.ratingSource='Google Maps';
    }
    if(phones[r.name])r.phone=phones[r.name];
    if(booking[r.name])r.bookingUrl=booking[r.name];
    if(/可以訂位|訂位/.test((r.tags||[]).join(' ')))r.__bookable=true;
  }

  const tel=v=>String(v||'').replace(/[^0-9+]/g,'');
  const mapUrl=r=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent((r.name||'')+' '+(r.address||'台南'));
  const googleSearchUrl=r=>'https://www.google.com/search?q='+encodeURIComponent((r.name||'')+' 台南 Google 評分');
  const isTel=a=>/^tel:/i.test(a.getAttribute('href')||'');
  const isBooking=a=>/電話訂位|線上訂位|官方訂位|booking|reserve/i.test((a.textContent||'')+' '+(a.getAttribute('href')||''));
  const isMap=a=>{
    const href=a.getAttribute('href')||'';
    const text=a.textContent||'';
    return /google\.com\/maps\/search/i.test(href) || /開啟地圖|Google地圖/i.test(text);
  };

  function normalizeCard(card,r){
    const anchors=[...card.querySelectorAll('a')];

    // 1) 電話：只留一個真正的「電話」，移除所有「電話訂位」按鈕。
    const phoneLinks=anchors.filter(isTel);
    if(phoneLinks.length){
      const preferred=phoneLinks.find(a=>/電話(?!訂位)/.test(a.textContent||''))||phoneLinks[0];
      phoneLinks.forEach(a=>{if(a!==preferred)a.remove();});
    }

    // 2) 訂位：有線上訂位網址只留一個；沒有網址則完全不顯示「電話訂位」。
    let current=[...card.querySelectorAll('a')];
    const bookingLinks=current.filter(isBooking);
    if(r.bookingUrl){
      const preferred=bookingLinks.find(a=>a.href===r.bookingUrl) || bookingLinks.find(a=>/線上訂位|官方訂位/i.test(a.textContent||''));
      bookingLinks.forEach(a=>{if(a!==preferred)a.remove();});
      if(!preferred && r.__bookable){
        const host=card.querySelector('.actions')||card.querySelector('.locbar')||card;
        host.insertAdjacentHTML('beforeend',`<a href="${r.bookingUrl}" target="_blank" rel="noopener">🔴 線上訂位</a>`);
      }
    }else{
      bookingLinks.forEach(a=>a.remove());
    }

    // 3) 地圖：全卡片只保留一個 Google 地圖搜尋連結；優先保留「開啟地圖」。
    current=[...card.querySelectorAll('a')];
    const mapLinks=current.filter(isMap);
    if(mapLinks.length){
      const preferred=mapLinks.find(a=>/開啟地圖/i.test(a.textContent||''))
        || mapLinks.find(a=>a.classList.contains('locbtn'))
        || mapLinks[0];
      mapLinks.forEach(a=>{if(a!==preferred)a.remove();});
      preferred.textContent='🗺️ 開啟地圖';
    }else{
      const host=card.querySelector('.actions')||card.querySelector('.locbar')||card;
      host.insertAdjacentHTML('beforeend',`<a class="map-link" href="${mapUrl(r)}" target="_blank" rel="noopener">🗺️ 開啟地圖</a>`);
    }

    // 4) 電話：若資料有電話但畫面上完全沒有，補回唯一一個電話按鈕。
    current=[...card.querySelectorAll('a')];
    if(r.phone && !current.some(isTel)){
      const host=card.querySelector('.actions')||card.querySelector('.locbar')||card;
      host.insertAdjacentHTML('beforeend',`<a href="tel:${tel(r.phone)}">☎️ 電話</a>`);
    }

    // 5) 沒有 Google 評分才提供查詢入口。
    current=[...card.querySelectorAll('a')];
    if(!r.rating&&!current.some(a=>a.classList.contains('google-rating-link'))){
      const host=card.querySelector('.actions')||card;
      host.insertAdjacentHTML('beforeend',`<a class="google-rating-link" href="${googleSearchUrl(r)}" target="_blank" rel="noopener">⭐ 查看 Google 評分</a>`);
    }
  }

  function enhance(){
    document.querySelectorAll('.card').forEach(card=>{
      const h=card.querySelector('h3');
      if(!h)return;
      const r=data.find(x=>x.name===h.textContent.trim());
      if(!r)return;
      normalizeCard(card,r);
    });

    // 詳細資訊視窗的電話保持單一、可直接撥打。
    document.querySelectorAll('#modal .row').forEach(row=>{
      const key=row.querySelector('.k')?.textContent?.trim()||'';
      if(key!=='電話')return;
      const value=row.querySelector('.v');
      if(!value)return;
      const name=document.querySelector('#modal h2')?.textContent?.trim();
      const r=data.find(x=>x.name===name);
      if(!r?.phone)return;
      value.innerHTML=`<a href="tel:${tel(r.phone)}">☎️ ${r.phone}</a>`;
    });

    // 評分顯示統一為 Google。
    document.querySelectorAll('.rating').forEach(el=>{
      const card=el.closest('.card');
      const h=card?.querySelector('h3');
      const r=data.find(x=>x.name===h?.textContent?.trim());
      if(!r)return;
      if(r.rating)el.textContent=`⭐ ${Number(r.rating).toFixed(1)}（Google）`;
      else el.textContent='尚無 Google 評分';
    });
  }

  const oldRender=window.render;
  if(typeof oldRender==='function'){
    window.render=function(){
      const result=oldRender.apply(this,arguments);
      setTimeout(enhance,0);
      return result;
    };
  }

  enhance();
  setTimeout(enhance,300);
  setTimeout(enhance,800);
  setTimeout(enhance,1500);

  // 防止舊腳本在稍後插入重複按鈕。
  const cards=document.getElementById('cards');
  if(cards&&window.MutationObserver){
    let busy=false;
    const observer=new MutationObserver(()=>{
      if(busy)return;
      busy=true;
      observer.disconnect();
      try{enhance();}finally{
        observer.observe(cards,{childList:true,subtree:true});
        busy=false;
      }
    });
    observer.observe(cards,{childList:true,subtree:true});
  }
})();
