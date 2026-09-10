/* Google/public rating completion: fill entries that previously had no rating. */
(function(){
  const R={
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
  for(const r of (window.RESTAURANTS||[])){
    if(R[r.name]){
      if(typeof r.rating!=='number') r.rating=R[r.name].rating;
      if(!r.reviewCount && R[r.name].reviewCount) r.reviewCount=R[r.name].reviewCount;
      r.ratingSource='Google / public indexed listing';
    }
  }
  const k=(window.RESTAURANTS||[]).find(r=>r.name==='串家物語 台南三井店');
  if(k) k.bookingUrl='https://inline.app/booking/-L3RNFbAlXuITYXJJ3v7/-MuAhjlIDbmHRz8OWmzH';
})();
