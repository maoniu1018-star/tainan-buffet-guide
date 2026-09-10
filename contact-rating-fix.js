/* 2026-09-10: ratings + contact + booking UI corrections */
(function(){
  const ratings={
    '億品鍋 成大勝利店':{rating:4.6,reviewCount:3395},
    '武灰鍋 平價個人小火鍋':{rating:5.0,reviewCount:3},
    '武灰鍋平價個人小火鍋':{rating:5.0,reviewCount:3},
    '九鼎鍋 開元店':{rating:4.7},
    '九鼎鍋 大同店':{rating:4.8},
    'XM 麻辣鍋':{rating:4.6,reviewCount:5673},
    '嗑肉石鍋 東門店':{rating:5.0},
    '牧鍋 頂級熟成牛鍋物':{rating:4.5,reviewCount:1731},
    '井賀鍋物 文賢店':{rating:4.5},
    '兩餐 Dookki 台南店':{rating:4.1,reviewCount:1905},
    '串家物語 台南三井店':{rating:3.9,reviewCount:967},
    '灼花燒肉 HIBANA × 深煙酒吧 SHINEN':{rating:4.3,reviewCount:499},
    '燒肉眾 台南永康店':{rating:4.5,reviewCount:752},
    '桂田酒店 阿力海百匯餐廳':{rating:4.6,reviewCount:16970},
    '甘粹餐廳（台南老爺行旅）':{rating:3.9,reviewCount:1400},
    '魔力牛牛排館 安南安中店':{rating:4.7}
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
    const x=ratings[r.name];
    if(x){r.rating=x.rating;if(x.reviewCount)r.reviewCount=x.reviewCount;r.ratingSource='Google Maps';}
    if(phones[r.name])r.phone=phones[r.name];
    if(booking[r.name])r.bookingUrl=booking[r.name];
    if(/可以訂位|訂位/.test((r.tags||[]).join(' ')))r.__bookable=true;
  }
  function tel(v){return String(v||'').replace(/[^0-9+]/g,'');}
  function mapUrl(r){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent((r.name||'')+' '+(r.address||'台南'));}
  function enhance(){
    document.querySelectorAll('.card').forEach(card=>{
      const h=card.querySelector('h3');if(!h)return;
      const r=data.find(x=>x.name===h.textContent.trim());if(!r)return;
      const actions=card.querySelector('.actions');if(!actions)return;
      if(r.phone && !actions.querySelector('a[href^="tel:"]'))actions.insertAdjacentHTML('beforeend',`<a href="tel:${tel(r.phone)}">☎️ 電話</a>`);
      if(r.__bookable && r.bookingUrl && ![...actions.querySelectorAll('a')].some(a=>a.href===r.bookingUrl))actions.insertAdjacentHTML('beforeend',`<a href="${r.bookingUrl}" target="_blank" rel="noopener">🔴 線上訂位</a>`);
      if(r.__bookable && !r.bookingUrl && r.phone && !actions.querySelector('.phone-booking'))actions.insertAdjacentHTML('beforeend',`<a class="phone-booking" href="tel:${tel(r.phone)}">📞 電話訂位</a>`);
      if(!actions.querySelector('.map-link'))actions.insertAdjacentHTML('beforeend',`<a class="map-link" href="${mapUrl(r)}" target="_blank" rel="noopener">📍 Google地圖</a>`);
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
      if(/未提供|尚無|—|NaN/.test(el.textContent||'')){
        const card=el.closest('.card');const h=card?.querySelector('h3');const r=data.find(x=>x.name===h?.textContent?.trim());
        if(r?.rating)el.textContent=`⭐ ${r.rating.toFixed(1)}（Google）`;
      }
    });
  }
  const oldRender=window.render;
  if(typeof oldRender==='function')window.render=function(){const x=oldRender.apply(this,arguments);setTimeout(enhance,0);return x;};
  enhance();
  setTimeout(enhance,500);
  setTimeout(enhance,1500);
})();
