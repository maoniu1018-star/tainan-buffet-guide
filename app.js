const $=s=>document.querySelector(s);const grid=$("#grid"),empty=$("#empty");
const data=[...new Map(RESTAURANTS.map(x=>[x.name,x])).values()];
const areas=[...new Set(data.map(x=>x.area).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'zh-Hant'));
const types=[...new Set(data.map(x=>x.type).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'zh-Hant'));
areas.forEach(x=>$("#area").insertAdjacentHTML('beforeend',`<option>${x}</option>`));
types.forEach(x=>$("#type").insertAdjacentHTML('beforeend',`<option>${x}</option>`));
function photoFor(x){
  const n=x.name;
  if(n.includes('肉次方')) return 'assets/bbq.svg';
  if(n.includes('涮乃葉')||n.includes('饗麻饗辣')||n.includes('億品鍋')||n.includes('武灰鍋')||n.includes('九鼎鍋')||n.includes('XM')||n.includes('尬麻')||n.includes('嗑肉石鍋')||n.includes('牧鍋')||n.includes('井賀')||n.includes('狂一鍋')||n.includes('肉多多')||n.includes('兩餐')) return 'assets/hotpot.svg';
  if(x.type.includes('Buffet')) return 'assets/bbuffet.svg';
  if(x.type.includes('牛排')) return 'assets/steak.svg';
  return x.type.includes('燒肉')||x.type.includes('韓式')||x.type.includes('日式')?'assets/bbq.svg':'assets/bbuffet.svg';
}
function render(){
 const q=$("#q").value.trim().toLowerCase(),a=$("#area").value,t=$("#type").value,tag=$("#tag").value,vo=$("#verifiedOnly").checked;
 const rows=data.filter(x=>(!q||JSON.stringify(x).toLowerCase().includes(q))&&(!a||x.area===a)&&(!t||x.type===t)&&(!tag||x.tags.includes(tag))&&(!vo||x.status.includes('🟢')));
 $("#count").textContent=`共 ${rows.length} 家`;
 grid.innerHTML='';empty.hidden=rows.length>0;
 rows.forEach(x=>{
  const tpl=$("#card").content.cloneNode(true),img=tpl.querySelector('.photo-img');
  tpl.querySelector('.chips').innerHTML=x.tags.map(v=>`<span class="chip">${v}</span>`).join('')+`<span class="status ${x.status.includes('🟢')?'ok':'warn'}">${x.status}</span>`;
  tpl.querySelector('h2').textContent=x.name;tpl.querySelector('.price').textContent='💰 '+x.price;tpl.querySelector('.addr').textContent='📍 '+x.address+'｜'+x.area;tpl.querySelector('.hours').textContent='🕐 '+x.hours;tpl.querySelector('.desc').textContent='✨ '+x.desc;
  img.src=x.photo||photoFor(x);img.alt=x.name+'代表圖片';
  tpl.querySelector('.source').textContent='來源：'+x.source;tpl.querySelector('.checked').textContent='最後核對：2026/09/10';
  let act=tpl.querySelector('.actions');
  if(x.phone&&/^06[-\s]?\d/.test(x.phone))act.insertAdjacentHTML('beforeend',`<a href="tel:${x.phone.replace(/[^0-9]/g,'')}">☎️ 電話</a>`);
  if(x.booking)act.insertAdjacentHTML('beforeend',`<a href="${x.booking}" target="_blank" rel="noopener noreferrer">🔴 官方訂位</a>`);
  if(x.official)act.insertAdjacentHTML('beforeend',`<a class="secondary" href="${x.official}" target="_blank" rel="noopener noreferrer">🌐 官方網站</a>`);
  grid.appendChild(tpl);
 });
}
['q','area','type','tag','verifiedOnly'].forEach(id=>$("#"+id).addEventListener(id==='q'?'input':'change',render));render();
