/* Data-only corrections: visible adult pricing + Google/public ratings + Kushiya booking. No DOM access. */
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
    '武灰鍋 平價小火鍋 安和店':{rating:4.5,reviewCount:12},
    '九鼎鍋 開元店':{rating:4.7,reviewCount:9},
    '九鼎鍋 大同店':{rating:4.8,reviewCount:5},
    'XM 麻辣鍋':{rating:4.6,reviewCount:5673},
    '嗑肉石鍋 東門店':{rating:5.0,reviewCount:4},
    '牧鍋 頂級熟成牛鍋物':{rating:4.8,reviewCount:4964},
    '井賀鍋物 文賢店':{rating:4.5,reviewCount:2},
    '兩餐 Dookki 台南店':{rating:4.1,reviewCount:1905},
    '串家物語 台南三井店':{rating:3.8,reviewCount:746},
    '灼花燒肉 HIBANA × 深煙酒吧 SHINEN':{rating:4.3,reviewCount:499},
    '燒肉眾 台南永康店':{rating:4.5},
    '桂田酒店 阿力海百匯餐廳':{rating:4.6,reviewCount:18000},
    '甘粹餐廳（台南老爺行旅）':{rating:3.9,reviewCount:1278}
  };
  const data=window.RESTAURANTS||[];
  const hasNum=v=>/\d/.test(String(v??''));
  function base(r){
    const s=String(r.price||'');
    const range=s.match(/(?:NT\$|\$)?\s*\d[\d,]*(?:\s*[–-]\s*\d[\d,]*)?/);
    if(range) return '約 NT$'+range[0].replace(/^(?:NT\$|\$)\s*/,'').replace(/,/g,'')+'／人';
    const one=s.match(/(?:NT\$|\$)?\s*\d[\d,]*/);
    if(one) return '約 NT$'+one[0].replace(/^(?:NT\$|\$)\s*/,'').replace(/,/g,'')+'／人';
    return '約 NT$400／人';
  }
  function normalizePrice(r){
    if(buffet[r.name]) r.price=buffet[r.name];
    const raw=String(r.price||'');
    const b=base(r);
    const q=r.prices&&typeof r.prices==='object'?r.prices:{};
    const out={weekdayLunch:q.weekdayLunch,weekdayDinner:q.weekdayDinner,holidayLunch:q.holidayLunch,holidayDinner:q.holidayDinner};
    const segments=raw.split('；').map(x=>x.trim()).filter(Boolean);
    for(const part of segments){
      const v=(part.match(/\d[\d,]*(?:\s*[–-]\s*\d[\d,]*)?/)||[])[0];
      if(!v) continue;
      const text='約 NT$'+v.replace(/,/g,'')+'／人';
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
      r.ratingSource='Google / public indexed listing';
    }
  }
  const k=data.find(r=>r.name==='串家物語 台南三井店');
  if(k){
    k.bookingUrl='https://inline.app/booking/-L3RNFbAlXuITYXJJ3v7/-MuAhjlIDbmHRz8OWmzH';
    k.tags=Array.from(new Set([...(k.tags||[]),'🔴 可以訂位']));
  }
})();
