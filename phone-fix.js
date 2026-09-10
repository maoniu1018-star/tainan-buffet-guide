/* Verified restaurant phone numbers — 2026/09/10 */
(function(){
  const phones={
    '饗麻饗辣 台南永華旗艦店':'06-299-7676',
    '兩餐 Dookki 台南店':'06-222-0689',
    '逐鹿炭火燒肉 台南店':'06-222-3322',
    '灼花燒肉 HIBANA':'06-221-8859',
    'Oh! Yaki 精緻燒肉吃到飽 台南店':'06-220-9819',
    '一底夯燒肉專賣 東平店':'06-208-6367',
    '田季發爺燒肉 台南中華店':'06-267-3070',
    '本格和牛燒肉放題 台南西門店':'06-252-2333',
    '好好吃肉韓式烤肉吃到飽 台南民族店':'06-223-6995',
    '吃道飽火烤兩吃':'06-303-5559',
    '燒肉眾 台南永康店':'06-207-3522',
    '肉多多火鍋 台南東寧店':'06-200-5818',
    '肉多多火鍋 台南怡平店':'06-295-8999',
    '肉多多火鍋 台南新仁店':'06-268-0059',
    '狂一鍋 台南仁德店':'06-279-7321',
    '井賀鍋物 文賢店':'06-358-0888',
    '井賀鍋物 安南店':'06-356-3888',
    '牧鍋 頂級熟成牛鍋物':'06-237-0222',
    'XM 麻辣鍋':'06-302-5299',
    '武灰鍋 平價個人小火鍋':'06-358-3988',
    '九鼎鍋 開元店':'06-200-5529',
    '億品鍋 台南健康店':'06-214-5963',
    '億品鍋 台南仁德店':'06-279-5381',
    '億品鍋 台南佳里店':'06-723-6111',
    '億品鍋 台南永康店':'06-231-9700',
    '億品鍋 惠南旗艦店':'06-263-3175',
    '億品鍋 台南麻豆店':'06-571-3805',
    '一個圓鍋火鍋店':'06-251-2129',
    '敝姓鍋 台南海安店':'06-251-1283',
    '初巴適麻辣鍋 台南1號店':'06-208-6565',
    '鬥牛士石燒牛排 台南Focus店':'06-220-7366',
    '小時厚牛排 台南東區店':'06-267-9366',
    '小時厚牛排 台南健康店':'06-263-0303',
    '達樂斯美式牛排 東門店':'06-267-5388',
    '達樂斯美式牛排 永康店':'06-253-9775',
    '牛B牛排':'06-299-2829',
    '魔力牛牛排館 安平文平店':'06-295-0113',
    '魔力牛牛排館 安南安中店':'06-247-9616',
    '牛室炙燒牛排 BEEFHOUSE 台南海安店':'06-251-0630',
    '公牛隊牛排館':'06-202-9709',
    '一二三木頭人炙燒牛排':'06-357-1515',
    '奇美食品幸福工廠':'06-269-8588',
    '遠東 Café 台南遠東香格里拉':'06-702-8856',
    '食東西自助餐廳（煙波台南館）':'06-214-1200',
    '榕廷百匯餐廳（禧榕軒）':'06-223-7988',
    '福爾摩沙遊艇酒店－威尼斯餐廳':'06-391-2188',
    '旭集（台南西門店）':'06-303-1303',
    '饗食天堂台南西門店':'06-214-1688',
    '朵頤牛排 台南小北門店':'06-251-9985',
    '夏都城食百匯自助餐廳':'06-292-0656',
    '元素餐廳（台南大員皇冠假日酒店）':'06-391-1899',
    '活佛素食餐廳':'06-260-0568',
    '滿粵閣港點中華料理':'06-243-0246',
    '上蠔烤蚵吃到飽':'0911-368-682',
    '安平碳烤 烤蚵吃到飽':'06-223-9740',
    '温家堡燒肉吃到飽':'06-203-2888',
    '饗翻天臭臭鍋 新營店':'06-656-1116',
    '饗翻天臭臭鍋 永康鹽行店':'06-253-0815',
    '饗翻天臭臭鍋 南區中華南店':'06-262-4462',
    '饗翻天臭臭鍋 永康南台店':'06-243-4045',
    '十色鍋物':'06-289-0636',
    '温玥坊鍋物':'06-203-6608',
    '蕾鼎鍋物':'06-297-8585',
    '橫濱牛排 台南三井店':'06-303-2563',
    '台糖長榮酒店 吃遍天下自助餐廳':'06-337-3865',
    '甘粹餐廳（台南老爺行旅）':'06-238-3868'
  };
  (window.RESTAURANTS||[]).forEach(r=>{if(phones[r.name])r.phone=phones[r.name];});
})();

/* Final notice placement guard: keep the price reminder directly below the hero,
   with compact styling and #notice anchor support. Runs after other fixer scripts. */
(function(){
  'use strict';
  function placeNotice(){
    const notice=document.querySelector('.notice');
    const hero=document.querySelector('.hero');
    if(!notice || !hero || !hero.parentNode) return;
    notice.id='notice';
    notice.classList.add('top-price-notice');
    if(hero.nextElementSibling!==notice){
      hero.parentNode.insertBefore(notice,hero.nextSibling);
    }
    if(!document.getElementById('price-notice-final-style')){
      const style=document.createElement('style');
      style.id='price-notice-final-style';
      style.textContent=`
        .top-price-notice{box-sizing:border-box;width:min(1120px,calc(100% - 32px));margin:16px auto 12px;padding:11px 16px;border:1px solid rgba(239,142,174,.28);border-radius:14px;background:#fff7fa;color:#6b4f5b;font-size:13px;line-height:1.55;box-shadow:0 2px 10px rgba(128,76,96,.05);}
        .top-price-notice b{color:#7a4f61;font-weight:700;}
        .top-price-notice{scroll-margin-top:16px;}
        @media(max-width:760px){.top-price-notice{width:calc(100% - 24px);margin:12px auto 10px;padding:9px 12px;font-size:12px;border-radius:11px;}}
      `;
      document.head.appendChild(style);
    }
  }
  window.addEventListener('load',()=>setTimeout(placeNotice,1800));
  setTimeout(placeNotice,1800);
})();
