(function(){
  function norm(v){return String(v||'').replace(/\$/g,'NT$').replace(/\s+/g,' ').trim()||'依店家公告'}
  function fourPrices(r){
    var s=norm(r.price), out={weekdayLunch:'依店家公告',weekdayDinner:'依店家公告',holidayLunch:'依店家公告',holidayDinner:'依店家公告'};
    if(r.prices&&typeof r.prices==='object'){
      out.weekdayLunch=norm(r.prices.weekdayLunch||r.prices.weekday||r.prices.lunch);
      out.weekdayDinner=norm(r.prices.weekdayDinner||r.prices.dinner);
      out.holidayLunch=norm(r.prices.holidayLunch||r.prices.holiday||r.prices.weekend);
      out.holidayDinner=norm(r.prices.holidayDinner||r.prices.holidayDinner||r.prices.holiday||r.prices.weekend);
      return out;
    }
    var parts=s.split(/[；;]/).map(function(x){return x.trim()}).filter(Boolean);
    function find(re){return parts.find(function(x){return re.test(x)})}
    out.weekdayLunch=find(/平日.*午|平日午|週一.*午|週一至週五.*午/i)||find(/午餐/i)||null;
    out.weekdayDinner=find(/平日.*晚|平日晚|週一.*晚|週一至週五.*晚/i)||find(/晚餐/i)||null;
    out.holidayLunch=find(/假日.*午|例假.*午|假日午|週末.*午/i)||null;
    out.holidayDinner=find(/假日.*晚|例假.*晚|假日晚|週末.*晚/i)||null;
    var range=parts.length===1?s:parts.slice(0,2).join('；');
    if(!out.weekdayLunch && s!=='依店家公告') out.weekdayLunch=s;
    if(!out.weekdayDinner && /起|區間|\-|–|~|～/.test(s)) out.weekdayDinner=s;
    if(!out.holidayLunch && /假日|例假|週末/.test(s)) out.holidayLunch=s;
    if(!out.holidayDinner && /假日|例假|週末/.test(s)) out.holidayDinner=s;
    return out;
  }
  window.tainanFourPrices=fourPrices;
  function renderFourPrices(r){
    var p=fourPrices(r);
    return '<div class="prices four-prices">'
      +[['平日午餐',p.weekdayLunch],['平日晚餐',p.weekdayDinner],['假日午餐',p.holidayLunch],['假日晚餐',p.holidayDinner]].map(function(x){return '<div class="pricebox"><div class="lab">'+x[0]+'</div><div class="num">'+window.__escPrice(x[1])+'</div></div>'}).join('')
      +'</div>';
  }
  window.renderFourPrices=renderFourPrices;
  window.__escPrice=function(v){return String(v??'依店家公告').replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]})};
  function apply(){
    if(!window.RESTAURANTS)return;
    document.querySelectorAll('.card').forEach(function(card){
      var title=card.querySelector('h3'); if(!title)return;
      var r=window.RESTAURANTS.find(function(x){return x.name===title.textContent}); if(!r)return;
      var old=card.querySelector('.prices'); if(old) old.outerHTML=renderFourPrices(r);
    });
  }
  window.applyFourPriceLayout=apply;
  setTimeout(apply,0);
  setTimeout(apply,50);
  setTimeout(apply,150);
})();
