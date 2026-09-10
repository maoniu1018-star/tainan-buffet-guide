/* 2026-09-10: final data quality normalization
   - Fill known missing Google ratings without replacing existing ratings.
   - Fill verified phone aliases only when current phone is missing/placeholder.
   - Remove any legacy "查看 Google 評分" links.
   - Keep data conservative: never invent a rating or phone.
*/
(function(){
  'use strict';
  const data=window.RESTAURANTS||[];

  const ratings={
    '億品鍋 成大勝利店':4.6,
    '武灰鍋 平價個人小火鍋':5.0,
    '武灰鍋平價個人小火鍋':5.0,
    '武灰鍋 平價小火鍋 安和店':4.5,
    '九鼎鍋 開元店':4.7,
    '九鼎鍋 大同店':4.8,
    'XM 麻辣鍋':4.3,
    '嗑肉石鍋 東門店':5.0,
    '牧鍋 頂級熟成牛鍋物':4.5,
    '井賀鍋物 文賢店':4.5,
    '兩餐 Dookki 台南店':4.1,
    '串家物語 台南三井店':3.9,
    '灼花燒肉 HIBANA × 深煙酒吧 SHINEN':4.3,
    '燒肉眾 台南永康店':4.5,
    '魔力牛牛排館 安南安中店':4.2,
    '遠東 CAFÉ 台南遠東香格里拉':4.3,
    '遠東 Café 台南遠東香格里拉':4.3,
    '桂田酒店 阿力海百匯餐廳':4.6,
    '甘粹餐廳（台南老爺行旅）':3.9,
    '饗翻天臭臭鍋 新營店':4.8,
    '饗翻天臭臭鍋〖新營店〗':4.8,
    '饗翻天臭臭鍋 南區中華南店':4.5,
    '饗翻天臭臭鍋〖南區中華南店〗':4.5,
    '一個圓鍋火鍋店':4.8,
    '井賀鍋物 安南店':4.5
  };

  const phones={
    '武灰鍋 平價小火鍋 安和店':'06-251-8997',
    '九鼎鍋 大同店':'06-215-5676',
    '嗑肉石鍋 東門店':'06-602-0358',
    '麻佬二 台南店':'0968-114-508',
    '遠東 CAFÉ 台南遠東香格里拉':'06-702-8856',
    '遠東 Café 台南遠東香格里拉':'06-702-8856',
    '台南大飯店 歐式自助餐':'06-224-9886',
    '元素餐廳（台南大員皇冠假日酒店）':'06-512-1807',
    '夏都城食百匯自助餐廳':'06-292-0656',
    '小時厚牛排 台南永康店':'06-302-1239',
    '小時厚牛排-台南永康店':'06-302-1239'
  };

  function placeholder(v){
    return !v || /依(官方|商家|最新|店家)/i.test(String(v));
  }

  for(const r of data){
    const name=String(r.name||'').trim();
    if(typeof r.rating!=='number' && typeof ratings[name]==='number'){
      r.rating=ratings[name];
      r.ratingSource='Google Maps';
    }
    if(placeholder(r.phone) && phones[name]) r.phone=phones[name];
    if(typeof r.rating==='number' && !r.ratingSource) r.ratingSource='Google Maps';
  }

  function cleanRatingLinks(){
    document.querySelectorAll('a.google-rating-link').forEach(a=>a.remove());
    document.querySelectorAll('a').forEach(a=>{
      if(/查看\s*Google\s*評分/i.test((a.textContent||'').trim())) a.remove();
    });
  }
  cleanRatingLinks();
  if(window.MutationObserver){
    const root=document.getElementById('cards');
    if(root){
      let busy=false;
      const obs=new MutationObserver(()=>{
        if(busy)return;
        busy=true;
        cleanRatingLinks();
        busy=false;
      });
      obs.observe(root,{childList:true,subtree:true});
    }
  }
})();
