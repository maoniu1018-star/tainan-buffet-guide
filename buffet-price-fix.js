/* Data-only correction: no DOM access */
(function(){
  const map={'奇美食品幸福工廠':'成人約 NT$158／人','遠東 CAFÉ 台南遠東香格里拉':'約 NT$1,180–1,480／人＋10%','漢來海港 台南南紡店':'約 NT$800–1,200／人','台糖長榮酒店 吃遍天下自助餐廳':'約 NT$1,050–1,250／人＋10%','桂田酒店 阿力海百匯餐廳':'約 NT$1,360–1,790／人＋10%','食東西自助餐廳（煙波台南館）':'約 NT$630–680／人＋10%','榕廷百匯餐廳（禧榕軒）':'約 NT$880–1,080／人＋10%','福爾摩沙遊艇酒店－威尼斯餐廳':'約 NT$1,150–1,250／人＋10%','夏都城食百匯自助餐廳':'約 NT$900–1,200／人＋10%','元素餐廳（台南大員皇冠假日酒店）':'約 NT$759–1,399／人＋10%','台南大飯店 歐式自助餐':'約 NT$880／人'};
  for(const r of (window.RESTAURANTS||[])) if(map[r.name]) r.price=map[r.name];
  const x=(window.RESTAURANTS||[]).find(r=>r.name==='串家物語 台南三井店');
  if(x) x.bookingUrl='https://inline.app/booking/-L3RNFbAlXuITYXJJ3v7/-MuAhjlIDbmHRz8OWmzH';
})();
