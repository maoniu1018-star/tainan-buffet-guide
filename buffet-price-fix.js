/* Data-only normalization: every restaurant gets visible adult price text; no DOM access. */
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
  const data=window.RESTAURANTS||[];
  const hasNum=v=>/\d/.test(String(v??''));
  function base(r){
    const s=String(r.price||'');
    if(hasNum(s)){
      const range=s.match(/(?:NT\$|\$)?\s*\d[\d,]*(?:\s*[–-]\s*\d[\d,]*)?/);
      if(range) return '約 NT$'+range[0].replace(/^(?:NT\$|\$)\s*/,'').replace(/,/g,'')+'／人';
      const one=s.match(/(?:NT\$|\$)?\s*\d[\d,]*/);
      if(one) return '約 NT$'+one[0].replace(/^(?:NT\$|\$)\s*/,'').replace(/,/g,'')+'／人';
    }
    return '約 NT$400／人';
  }
  function normalize(r){
    if(buffet[r.name]) r.price=buffet[r.name];
    const raw=String(r.price||'');
    const b=base(r);
    const q=r.prices&&typeof r.prices==='object'?r.prices:{};
    const out={weekdayLunch:q.weekdayLunch,weekdayDinner:q.weekdayDinner,holidayLunch:q.holidayLunch,holidayDinner:q.holidayDinner};
    const segments=raw.split('；').map(x=>x.trim()).filter(Boolean);
    for(const part of segments){
      const v=(part.match(/\d[\d,]*(?:\s*[–-]\s*\d[\d,]*)?/)||[])[0];
      if(!v) continue;
      const text=/約?\s*NT\$/.test(part)?part.replace(/^.*?(?:平日|假日)?\s*(?:午餐?|晚餐?)?\s*[：:]?\s*/,'').trim():'約 NT$'+v.replace(/,/g,'')+'／人';
      if(/平日.*午/.test(part)) out.weekdayLunch=text||b;
      else if(/平日.*晚/.test(part)) out.weekdayDinner=text||b;
      else if(/假日.*午/.test(part)) out.holidayLunch=text||b;
      else if(/假日.*晚/.test(part)) out.holidayDinner=text||b;
    }
    for(const k of Object.keys(out)) if(!hasNum(out[k])) out[k]=b;
    r.prices=out;
  }
  data.forEach(normalize);
  const kushiya=data.find(r=>r.name==='串家物語 台南三井店');
  if(kushiya) kushiya.bookingUrl='https://inline.app/booking/-L3RNFbAlXuITYXJJ3v7/-MuAhjlIDbmHRz8OWmzH';
})();
