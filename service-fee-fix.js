/* 2026-09-10: expose explicitly documented 10% service charges */
(function(){
  'use strict';
  const data=window.RESTAURANTS||[];
  const known={
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
    '十色鍋物':'10%',
    '肉多多火鍋 台南東寧店':'10%',
    '肉多多火鍋 台南怡平店':'10%',
    '肉多多火鍋 台南大遠百公園店':'10%',
    '肉多多火鍋 台南新仁店':'10%'
  };
  for(const r of data){
    const raw=[String(r.price||'')].concat(r.prices&&typeof r.prices==='object'?Object.values(r.prices):[]).join(' ');
    if(known[r.name]) r.service=known[r.name];
    else if(/(?:另加|另收|外加|加收|subject to)\s*[^%]{0,20}10\s*%|[+＋]\s*10\s*%/i.test(raw)) r.service='10%';
  }
})();
