const $=s=>document.querySelector(s);const grid=$('#grid');
const data=[...new Map(RESTAURANTS.map(x=>[x.name,x])).values()];
const areas=[...new Set(data.map(x=>x.area).filter(Boolean))].sort();
const types=[...new Set(data.map(x=>x.type).filter(Boolean))].sort();
areas.forEach(x=>$('#area').insertAdjacentHTML('beforeend',`<option>${x}</option>`));
types.forEach(x=>$('#type').insertAdjacentHTML('beforeend',`<option>${x}</option>`));
function render(){
 const q=$('#q').value.trim().toLowerCase(),a=$('#area').value,t=$('#type').value,tag=$('#tag').value;
 const rows=data.filter(x=>(!q||JSON.stringify(x).toLowerCase().includes(q))&&(!a||x.area===a)&&(!t||x.type===t)&&(!tag||x.tags.includes(tag)));
 $('#count').textContent=`共 ${rows.length} 家`;
 grid.innerHTML='';
 rows.forEach(x=>{
  const tpl=$('#card').content.cloneNode(true);
  tpl.querySelector('.chips').innerHTML=x.tags.map(v=>`<span class="chip">${v}</span>`).join('')+`<span class="status ${x.status.includes('🟢')?'ok':'warn'}">${x.status}</span>`;
  tpl.querySelector('h2').textContent=x.name;
  tpl.querySelector('.price').textContent='💰 '+x.price;
  tpl.querySelector('.addr').textContent='📍 '+x.address+'｜'+x.area;
  tpl.querySelector('.hours').textContent='🕐 '+x.hours;
  tpl.querySelector('.desc').textContent='✨ '+x.desc;
  tpl.querySelector('.source').textContent='來源：'+x.source;
  tpl.querySelector('.checked').textContent='最後核對：2026/09/10';
  let act=tpl.querySelector('.actions');
  if(x.phone&&/^06-\d/.test(x.phone))act.insertAdjacentHTML('beforeend',`<a href="tel:${x.phone.replace(/-/g,'')}">☎️ 電話</a>`);
  if(x.booking)act.insertAdjacentHTML('beforeend',`<a href="${x.booking}" target="_blank" rel="noopener">🔴 官方訂位</a>`);
  if(x.official)act.insertAdjacentHTML('beforeend',`<a class="secondary" href="${x.official}" target="_blank" rel="noopener">🌐 官方網站</a>`);
  grid.appendChild(tpl)
 });
}
['q','area','type','tag'].forEach(id=>$('#'+id).addEventListener('input',render));render();
