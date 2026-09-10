/* Data corrections: prices, service fees, children, ratings, official/booking links. No MutationObserver. */
(function(){
  const buffet={
    '奇美食品幸福工廠':'成人約 NT$158／人',
    '遠東 CAFÉ 台南遠東香格里拉':'約 NT$1,180–1,480／人＋10%',
    '漢來海港 台南南紡店':'約 NT$800–1,200／人',
    '台糖長榮酒店 吃遍天下自助餐廳':'約 NT$1,050–1,250／人＋10%',
    '桂田酒店 阿力海百匯餐廳':'約 NT$1,360–1,790／人＋10%',
    '食東西自助餐廳（煙波台南館）':'約 NT$630–680／人＋10%',
    '榕廷百匯餐廳（禧榕軒）':'約 NT$880–1,080／人＋10%',
    '福爾摩沙遊艇酒店－威尼斯餐廳':'約 NT$1,150–1,250／人＋10%',
    '夏都城食百匯自助餐廳':'約 NT$900–1,200／人＋10%',
    '元素餐廳（台南大員皇冠假日酒店）':'約 NT$759–1,399／人＋10%',
    '台南大飯店 歐式自助餐':'約 NT$880／人'
  };
  const ratings={
    '億品鍋 成大勝利店':{rating:4.6,reviewCount:3395},
    '武灰鍋 平價個人小火鍋':{rating:4.6,reviewCount:159},
    '武灰鍋 平價小火鍋 安和店':{rating:4.5},
    '九鼎鍋 開元店':{rating:4.7},
    '九鼎鍋 大同店':{rating:4.8},
    'XM 麻辣鍋':{rating:4.6,reviewCount:5673},
    '嗑肉石鍋 東門店':{rating:5.0},
    '牧鍋 頂級熟成牛鍋物':{rating:4.8,reviewCount:4964},
    '井賀鍋物 文賢店':{rating:4.5},
    '兩餐 Dookki 台南店':{rating:4.1,reviewCount:1905},
    '串家物語 台南三井店':{rating:3.9,reviewCount:967},
    '灼花燒肉 HIBANA × 深煙酒吧 SHINEN':{rating:4.3,reviewCount:499},
    '燒肉眾 台南永康店':{rating:4.5,reviewCount:752},
    '桂田酒店 阿力海百匯餐廳':{rating:4.6,reviewCount:18000},
    '甘粹餐廳（台南老爺行旅）':{rating:3.9,reviewCount:1400}
  };
  const service={
    '遠東 CAFÉ 台南遠東香格里拉':'10%',
    '台糖長榮酒店 吃遍天下自助餐廳':'10%',
    '桂田酒店 阿力海百匯餐廳':'10%',
    '食東西自助餐廳（煙波台南館）':'10%',
    '榕廷百匯餐廳（禧榕軒）':'10%',
    '福爾摩沙遊艇酒店－威尼斯餐廳':'10%',
    '夏都城食百匯自助餐廳':'10%',
    '元素餐廳（台南大員皇冠假日酒店）':'10%',
    '台南大飯店 歐式自助餐':'10%',
    '饗麻饗辣 台南永華旗艦店':'10%',
    '灼花燒肉 HIBANA × 深煙酒吧 SHINEN':'10%',
    '井賀鍋物 安南店':'10%',
    '肉多多火鍋 台南東寧店':'10%',
    '肉多多火鍋 台南怡平店':'10%',
    '肉多多火鍋 台南大遠百公園店':'10%',
    '肉多多火鍋 台南新仁店':'10%',
    '兩餐 Dookki 台南店':'清潔費 10%',
    '燒肉眾 台南永康店':'清潔費 10%',
    '嗑肉石鍋 東門店':'清潔費 30元／人',
    '一個圓鍋火鍋店':'清潔費 30元／人'
  };
  const child={
    '灼花燒肉 HIBANA × 深煙酒吧 SHINEN':'101–130cm 半價；100cm以下免費',
    '饗麻饗辣 台南永華旗艦店':'100cm以下免費；100–120cm NT$258；120–140cm NT$388',
    '肉多多火鍋 台南東寧店':'100cm以下免費；101–140cm NT$150',
    '肉多多火鍋 台南怡平店':'100cm以下免費；101–140cm NT$150',
    '肉多多火鍋 台南大遠百公園店':'100cm以下免費；101–140cm NT$150',
    '肉多多火鍋 台南新仁店':'100cm以下免費；101–140cm NT$150',
    '台南大飯店 歐式自助餐':'3–未滿6歲 NT$150；6–未滿12歲半價',
    '奇美食品幸福工廠':'81–100cm NT$68；101–140cm NT$118'
  };
  const official={
    '肉次方 燒肉放題 台南府前店':'https://www.powerofmeat.com.tw/shop-location',
    '涮乃葉 台南大全聯店':'https://syabuyo.com.tw/',
    '涮乃葉 台南三井店':'https://syabuyo.com.tw/',
    '饗麻饗辣 台南永華旗艦店':'https://www.enjoyhot.com.tw/store.php?act=view&id=1',
    '串家物語 台南三井店':'https://www.mitsui-shopping-park.com.tw/mop/tainan/tw/shop.html?id=262a75a7',
    '嗑肉石鍋 東門店':'https://www.meatshotpot.com/stores',
    '灼花燒肉 HIBANA × 深煙酒吧 SHINEN':'https://hibana.tw/',
    '燒肉工廠':'https://bbqfty.com.tw/',
    '井賀鍋物 文賢店':'https://www.jinghe-hotpot.com.tw/stronghold.html',
    '井賀鍋物 安南店':'https://www.jinghe-hotpot.com.tw/stronghold.html',
    '橫濱牛排 台南三井店':'https://www.yokohama-steakhouse.com.tw/',
    '兩餐 Dookki 台南店':'https://www.dookki.com.tw/',
    '肉多多火鍋 台南東寧店':'https://booking.twledodo.com/rododo/tw/',
    '肉多多火鍋 台南怡平店':'https://booking.twledodo.com/rododo/tw/',
    '肉多多火鍋 台南大遠百公園店':'https://booking.twledodo.com/rododo/tw/',
    '肉多多火鍋 台南新仁店':'https://booking.twledodo.com/rododo/tw/',
    '燒肉眾 台南永康店':'https://www.facebook.com/BBQMasterTainan/'
  };
  const booking={
    '串家物語 台南三井店':'https://inline.app/booking/-L3RNFbAlXuITYXJJ3v7/-MuAhjlIDbmHRz8OWmzH',
    '灼花燒肉 HIBANA × 深煙酒吧 SHINEN':'https://www.google.com/maps/reserve/v/dine/c/9lWr4zKJXqc'
  };
  const data=window.RESTAURANTS||[];
  const hasNum=v=>/\d/.test(String(v??''));
  function base(r){
    const s=String(r.price||'');
    const m=s.match(/(?:NT\$|\$)?\s*\d[\d,]*(?:\s*[–-]\s*\d[\d,]*)?/);
    return m?'約 $'+m[0].replace(/^(?:NT\$|\$)\s*/,'').replace(/,/g,'')+'／人':'約 $400／人';
  }
  function normalizePrice(r){
    if(buffet[r.name]) r.price=buffet[r.name];
    const raw=String(r.price||'');
    const b=base(r);
    const q=r.prices&&typeof r.prices==='object'?r.prices:{};
    const out={weekdayLunch:q.weekdayLunch,weekdayDinner:q.weekdayDinner,holidayLunch:q.holidayLunch,holidayDinner:q.holidayDinner};
    for(const part of raw.split('；').map(x=>x.trim()).filter(Boolean)){
      const v=(part.match(/\d[\d,]*(?:\s*[–-]\s*\d[\d,]*)?/)||[])[0];
      if(!v) continue;
      const text='約 $'+v.replace(/,/g,'')+'／人';
      if(/平日.*午/.test(part)) out.weekdayLunch=text;
      else if(/平日.*晚/.test(part)) out.weekdayDinner=text;
      else if(/假日.*午/.test(part)) out.holidayLunch=text;
      else if(/假日.*晚/.test(part)) out.holidayDinner=text;
    }
    for(const k of Object.keys(out)) if(!hasNum(out[k])) out[k]=b;
    r.prices=out;
  }
  for(const r of data){
    normalizePrice(r);
    if(ratings[r.name]){
      if(typeof r.rating!=='number') r.rating=ratings[r.name].rating;
      if(!r.reviewCount && ratings[r.name].reviewCount) r.reviewCount=ratings[r.name].reviewCount;
      r.ratingSource='Google Maps';
    }
    if(service[r.name]) r.service=service[r.name];
    if(child[r.name]) r.child=child[r.name]; else delete r.child;
    if(official[r.name]) r.official=official[r.name];
    if(booking[r.name]) r.bookingUrl=booking[r.name];
    if(r.tags?.some(t=>String(t).includes('可以訂位'))){
      r.__bookable=true;
    }
  }
  function compactPriceText(v){return String(v??'').replace(/NT\$/g,'$').replace(/NT＄/g,'$').replace(/\s+/g,' ').trim();}
  function enhance(){
    document.querySelectorAll('.card .num').forEach(el=>{
      el.textContent=compactPriceText(el.textContent);
      el.style.whiteSpace='nowrap';el.style.overflowWrap='normal';el.style.fontSize='13px';el.style.letterSpacing='-.2px';
    });
    document.querySelectorAll('.card .meta>div').forEach(el=>{
      const t=el.textContent||'';
      if(/兒童：\s*依店家公告/.test(t)||/服務費：\s*依店家公告/.test(t)) el.remove();
    });
    document.querySelectorAll('.card').forEach(card=>{
      const h=card.querySelector('h3'); if(!h) return;
      const r=data.find(x=>x.name===h.textContent.trim()); if(!r) return;
      const actions=card.querySelector('.actions'); if(!actions) return;
      if(r.official && ![...actions.querySelectorAll('a')].some(a=>a.href===r.official)) actions.insertAdjacentHTML('beforeend',`<a href="${r.official}" target="_blank" rel="noopener">🌐 官網</a>`);
      if(r.bookingUrl && ![...actions.querySelectorAll('a')].some(a=>a.href===r.bookingUrl)) actions.insertAdjacentHTML('beforeend',`<a href="${r.bookingUrl}" target="_blank" rel="noopener">🔴 線上訂位</a>`);
      if(!r.bookingUrl && r.__bookable && r.phone && /^06-\d/.test(r.phone) && ![...actions.querySelectorAll('a')].some(a=>a.href.includes('tel:'))) actions.insertAdjacentHTML('beforeend',`<a href="tel:${r.phone.replace(/-/g,'')}">☎️ 電話訂位</a>`);
    });
    document.querySelectorAll('#modal .row').forEach(row=>{
      const k=row.querySelector('.k')?.textContent?.trim()||''; const v=row.querySelector('.v')?.textContent||'';
      if((k==='兒童'||k==='服務費') && /依店家公告/.test(v)) row.remove();
    });
  }
  setTimeout(enhance,30);
  document.addEventListener('click',()=>setTimeout(enhance,40),true);
  document.addEventListener('input',()=>setTimeout(enhance,40),true);
  document.addEventListener('change',()=>setTimeout(enhance,40),true);
})();
