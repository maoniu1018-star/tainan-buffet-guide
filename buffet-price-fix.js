/* 只補正 Buffet 的成人價格顯示；其他網站內容不動 */
(function(){
  const P={
    '奇美食品幸福工廠':{weekdayLunch:'約 NT$158／人',weekdayDinner:'約 NT$158／人',holidayLunch:'約 NT$158／人',holidayDinner:'約 NT$158／人'},
    '遠東 CAFÉ 台南遠東香格里拉':{weekdayLunch:'NT$1,180＋10%',weekdayDinner:'NT$1,280＋10%',holidayLunch:'NT$1,480＋10%',holidayDinner:'NT$1,480＋10%'},
    '漢來海港 台南南紡店':{weekdayLunch:'約 NT$800–1,000／人',weekdayDinner:'約 NT$1,000–1,200／人',holidayLunch:'約 NT$1,000–1,200／人',holidayDinner:'約 NT$1,000–1,200／人'},
    '台糖長榮酒店 吃遍天下自助餐廳':{weekdayLunch:'約 NT$1,050／人＋10%',weekdayDinner:'約 NT$1,050／人＋10%',holidayLunch:'NT$1,250＋10%',holidayDinner:'NT$1,250＋10%'},
    '桂田酒店 阿力海百匯餐廳':{weekdayLunch:'NT$1,360＋10%',weekdayDinner:'NT$1,590＋10%',holidayLunch:'NT$1,790＋10%',holidayDinner:'NT$1,790＋10%'},
    '食東西自助餐廳（煙波台南館）':{weekdayLunch:'約 NT$750–850／人＋10%',weekdayDinner:'NT$950＋10%',holidayLunch:'約 NT$850–950／人＋10%',holidayDinner:'約 NT$1,050／人＋10%'},
    '榕廷百匯餐廳（禧榕軒）':{weekdayLunch:'NT$880＋10%',weekdayDinner:'—（無晚餐）',holidayLunch:'NT$1,080＋10%',holidayDinner:'—（無晚餐）'},
    '福爾摩沙遊艇酒店－威尼斯餐廳':{weekdayLunch:'NT$1,150＋10%',weekdayDinner:'NT$1,150＋10%',holidayLunch:'NT$1,250＋10%',holidayDinner:'NT$1,250＋10%'},
    '夏都城食百匯自助餐廳':{weekdayLunch:'約 NT$900／人＋10%',weekdayDinner:'約 NT$1,100／人＋10%',holidayLunch:'約 NT$1,000／人＋10%',holidayDinner:'約 NT$1,200／人＋10%'},
    '元素餐廳（台南大員皇冠假日酒店）':{weekdayLunch:'NT$759＋10%',weekdayDinner:'NT$1,099＋10%',holidayLunch:'NT$1,399＋10%',holidayDinner:'NT$1,399＋10%'}
  };
  const A=window.RESTAURANTS||[];
  A.forEach(r=>{if(P[r.name]){r.prices=P[r.name];r.price=r.prices.weekdayLunch;}});
  const串=A.find(r=>r.name==='串家物語 台南三井店');
  if(串) 串.bookingUrl='https://inline.app/booking/-L3RNFbAlXuITYXJJ3v7/-MuAhjlIDbmHRz8OWmzH';
})();
