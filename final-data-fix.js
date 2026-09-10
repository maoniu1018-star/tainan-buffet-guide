/* 2026-09-10: final data quality normalization
   - Fill known missing Google ratings without replacing existing ratings.
   - Fill verified phone aliases and correct known stale/incorrect phone entries.
   - Remove any legacy "查看 Google 評分" links.
   - Keep data conservative: never invent a rating or phone.
   - Move the price reminder into the hero area with compact styling.
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
    '井賀鍋物 安南店':4.5,
    '麻佬二 台南店':4.6,
    '麻佬二 手作麻辣':4.6
  };

  const reviewCounts={
    '麻佬二 台南店':1190,
    '麻佬二 手作麻辣':1190
  };

  const phones={
    '武灰鍋 平價小火鍋 安和店':'06-251-8997',
    '武灰鍋平價個人小火鍋':'06-358-3988',
    '武灰鍋 平價個人小火鍋':'06-358-3988',
    '九鼎鍋 大同店':'06-215-5676',
    '嗑肉石鍋 東門店':'06-602-0358',
    '麻佬二 台南店':'0968-114-508',
    '麻佬二 手作麻辣':'0968-114-508',
    '億品鍋 台南安南店':'06-247-7700',
    '遠東 CAFÉ 台南遠東香格里拉':'06-702-8856',
    '遠東 Café 台南遠東香格里拉':'06-702-8856',
    '燒肉工廠':'06-276-1288',
    '好好吃肉韓式烤肉吃到飽 台南店':'06-223-6995',
    '台南大飯店 歐式自助餐':'06-224-9886',
    '元素餐廳（台南大員皇冠假日酒店）':'06-512-1807',
    '夏都城食百匯自助餐廳':'06-292-0656',
    '小時厚牛排 台南永康店':'06-302-1239',
    '小時厚牛排-台南永康店':'06-302-1239',
    '漢來海港 台南南紡店':'06-236-9288'
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
    if(reviewCounts[name] && !Number.isFinite(Number(r.reviewCount))) r.reviewCount=reviewCounts[name];
    if(phones[name] && (placeholder(r.phone) || (name==='漢來海港 台南南紡店' && /0[67]-?412-?8068/i.test(String(r.phone))))){
      r.phone=phones[name];
    }
    if(typeof r.rating==='number' && !r.ratingSource) r.ratingSource='Google Maps';
  }

  function cleanRatingLinks(){
    document.querySelectorAll('a.google-rating-link').forEach(a=>a.remove());
    document.querySelectorAll('a').forEach(a=>{
      if(/查看\s*Google\s*評分/i.test((a.textContent||'').trim())) a.remove();
    });
  }

  function cleanCreatorDuplicate(){
    document.querySelectorAll('.stats .pill').forEach(pill=>{
      if(/Chung\s*NING|製作者/i.test((pill.textContent||'').trim())) pill.remove();
    });
  }

  function movePriceNoticeToTop(){
    const notices=Array.from(document.querySelectorAll('.notice'));
    if(!notices.length) return false;
    const notice=notices[0];
    for(const extra of notices.slice(1)) extra.remove();
    const hero=document.querySelector('.hero');
    const wrap=hero && hero.querySelector('.wrap');
    const stats=wrap && wrap.querySelector('.stats');
    const controls=document.querySelector('.controls');
    if(hero && wrap){
      if(stats) stats.insertAdjacentElement('afterend',notice);
      else wrap.appendChild(notice);
      notice.classList.add('top-price-notice');
      notice.id='notice';
      notice.dataset.movedTop='1';
      return true;
    }
    if(controls && controls.parentNode){
      controls.parentNode.insertBefore(notice,controls);
      notice.classList.add('top-price-notice');
      notice.id='notice';
      notice.dataset.movedTop='1';
      return true;
    }
    return false;
  }

  function applyNoticeLayout(){
    if(document.getElementById('notice-layout-fix')) return;
    const style=document.createElement('style');
    style.id='notice-layout-fix';
    style.textContent=`
      .hero .top-price-notice{box-sizing:border-box;width:min(820px,100%);margin:18px auto 0;padding:11px 18px;border:1px solid rgba(239,142,174,.28);border-radius:14px;background:rgba(255,255,255,.72);font-size:13px;line-height:1.55;color:#6b4f5b;text-align:center;box-shadow:0 4px 14px rgba(190,120,150,.06);}
      .hero .top-price-notice b{color:#7a4f61;font-weight:700;}
      @media(max-width:760px){.hero .top-price-notice{width:100%;margin-top:14px;padding:9px 12px;font-size:12px;border-radius:11px;}}
    `;
    document.head.appendChild(style);
  }

  function cleanup(){
    cleanRatingLinks();
    cleanCreatorDuplicate();
    applyNoticeLayout();
    movePriceNoticeToTop();
  }

  cleanup();
  document.addEventListener('DOMContentLoaded',cleanup,{once:true});
  [0,100,500,1000].forEach(ms=>setTimeout(cleanup,ms));

  if(window.MutationObserver && document.body){
    let busy=false;
    const obs=new MutationObserver(()=>{
      if(busy) return;
      busy=true;
      requestAnimationFrame(()=>{
        cleanup();
        busy=false;
      });
    });
    obs.observe(document.body,{childList:true,subtree:true});
  }
})();
