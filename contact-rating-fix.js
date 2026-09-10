/* 2026-09-10: Google rating + contact + booking UI corrections */
(function(){
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
    if(x){r.rating=x.rating;r.reviewCount=x.reviewCount;r.ratingSource='Google Maps';}
    if(phones[r.name])r.phone=phones[r.name];
    if(booking[r.name])r.bookingUrl=booking[r.name];
    if(/可以訂位|訂位/.test((r.tags||[]).join(' ')))r.__bookable=true;
  }
  function tel(v){return String(v||'').replace(/[^0-9+]/g,'');}
  function mapUrl(r){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent((r.name||'')+' '+(r.address||'台南'));}
  function googleSearchUrl(r){return 'https://www.google.com/search?q='+encodeURIComponent((r.name||'')+' 台南 Google 評分');}
  function hasMap(actions){return [...actions.querySelectorAll('a')].some(a=>/google\.com\/maps/i.test(a.href));}
  function isBookingLink(a){return /訂位|booking|reserve/i.test((a.textContent||'')+' '+a.href);}
  function cleanupActions(actions,r){
    const links=[...actions.querySelectorAll('a')];
    const seenHref=new Set();
    for(const a of links){
      const href=a.href||'';
      if(seenHref.has(href)){a.remove();continue;}
      seenHref.add(href);
    }
    const current=[...actions.querySelectorAll('a')];
    const telLinks=current.filter(a=>/^tel:/i.test(a.getAttribute('href')||''));
    telLinks.slice(1).forEach(a=>a.remove());
    // 電話訂位與「電話」功能相同：沒有線上訂位時只留一個電話按鈕，不再重複顯示電話訂位。
    if(!r.bookingUrl){
      [...actions.querySelectorAll('a')].filter(isBookingLink).forEach(a=>{
        if(/電話訂位/i.test(a.textContent||''))a.remove();
      });
    }else{
      // 有線上訂位時只保留一個線上訂位按鈕。
      const bookingLinks=[...actions.querySelectorAll('a')].filter(a=>a.href===r.bookingUrl || /線上訂位|官方訂位/i.test(a.textContent||''));
      bookingLinks.slice(1).forEach(a=>a.remove());
    }
    const maps=[...actions.querySelectorAll('a')].filter(a=>/google\.com\/maps/i.test(a.href));
    maps.slice(1).forEach(a=>a.remove());
  }
  function enhance(){
    document.querySelectorAll('.card').forEach(card=>{
      const h=card.querySelector('h3');if(!h)return;
      const r=data.find(x=>x.name===h.textContent.trim());if(!r)return;
      const actions=card.querySelector('.actions');if(!actions)return;
      cleanupActions(actions,r);
      const hasTel=!!actions.querySelector('a[href^="tel:"]');
      if(r.phone&&!hasTel)actions.insertAdjacentHTML('beforeend',`<a href="tel:${tel(r.phone)}">☎️ 電話</a>`);
      const hasBooking=[...actions.querySelectorAll('a')].some(a=>a.href===r.bookingUrl && r.bookingUrl);
      if(r.__bookable&&r.bookingUrl&&!hasBooking)actions.insertAdjacentHTML('beforeend',`<a href="${r.bookingUrl}" target="_blank" rel="noopener">🔴 線上訂位</a>`);
      if(!hasMap(actions))actions.insertAdjacentHTML('beforeend',`<a class="map-link" href="${mapUrl(r)}" target="_blank" rel="noopener">🗺️ 開啟地圖</a>`);
      const hasGoogleRatingLink=actions.querySelector('.google-rating-link');
      if(!r.rating&&!hasGoogleRatingLink)actions.insertAdjacentHTML('beforeend',`<a class="google-rating-link" href="${googleSearchUrl(r)}" target="_blank" rel="noopener">⭐ 查看 Google 評分</a>`);
      cleanupActions(actions,r);
    });
    document.querySelectorAll('#modal .row').forEach(row=>{
      const key=row.querySelector('.k')?.textContent?.trim()||'';
      if(key!=='電話')return;
      const value=row.querySelector('.v');if(!value)return;
      const name=document.querySelector('#modal h2')?.textContent?.trim();
      const r=data.find(x=>x.name===name);if(!r||!r.phone)return;
      value.innerHTML=`<a href="tel:${tel(r.phone)}">☎️ ${r.phone}</a>`;
    });
    document.querySelectorAll('.rating').forEach(el=>{
      const card=el.closest('.card');const h=card?.querySelector('h3');const r=data.find(x=>x.name===h?.textContent?.trim());
      if(!r)return;
      if(r.rating)el.textContent=`⭐ ${Number(r.rating).toFixed(1)}（Google）`;
      else el.textContent='尚無 Google 評分';
    });
  }
  const oldRender=window.render;
  if(typeof oldRender==='function')window.render=function(){const x=oldRender.apply(this,arguments);setTimeout(enhance,0);return x;};
  enhance();
  setTimeout(enhance,500);
  setTimeout(enhance,1500);
})();
