/* TOTAL FOCUS V11 — painel de progresso real, sem APIs pagas */
(()=>{'use strict';
const DK='totalfocus100.private.dataset.v1',SK='totalfocus100.v1';
const $=(s,r=document)=>r.querySelector(s);
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch{return null}};
const dateNum=(s,start)=>Math.round((new Date(s+'T12:00:00')-new Date(start+'T12:00:00'))/86400000)+1;
let pending=false;
function render(){
 const main=$('#main'),d=read(DK),s=read(SK)||{};
 if(!main||!d||!Array.isArray(d.tasks))return;
 const hero=$('.card.hero',main);if(!hero)return;
 const pick=$('#datepick',main),day=pick?.value||d.start;
 const todayNumber=Math.max(1,Math.min(100,dateNum(day,d.start)));
 const cycle=Math.ceil(todayNumber/12),begin=(cycle-1)*12+1,end=Math.min(100,begin+11);
 const list=d.tasks.map(t=>({...t,...(s.overrides?.[t.id]||{})})).filter(t=>t.priority==='flex'&&!t.meta?.optional);
 const inDay=list.filter(t=>t.date===day),inCycle=list.filter(t=>{const num=dateNum(t.date,d.start);return num>=begin&&num<=end});
 const done=t=>s.statuses?.[t.id]==='feito';
 const doneDay=inDay.filter(done).length,doneCycle=inCycle.filter(done).length;
 const pct=inCycle.length?Math.round(doneCycle/inCycle.length*100):0;
 let panel=$('#tf-v11-panel',main);if(!panel){panel=document.createElement('section');panel.id='tf-v11-panel';panel.className='tf-v11-panel';hero.insertAdjacentElement('afterend',panel)}
 const html='<div class="tf-v11-head"><span>◈ CICLO '+cycle+' / 9</span><b>'+pct+'% concluído</b></div><div class="tf-v11-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'"><span style="width:'+pct+'%"></span></div><div class="tf-v11-stats"><div><b>'+doneDay+'/'+inDay.length+'</b><small>Missões do dia</small></div><div><b>'+doneCycle+'/'+inCycle.length+'</b><small>Missões do ciclo</small></div><div><b>'+todayNumber+'/100</b><small>Dia da jornada</small></div></div><div class="tf-v11-actions"><button data-v11page="agenda">▦ Agenda</button><button data-v11page="shiro">♧ Shiro</button><button data-v11page="progress">▤ Rendimento</button></div>';
 if(panel.innerHTML!==html)panel.innerHTML=html;
}
const queue=()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;render()})};
const main=$('#main');if(main)new MutationObserver(queue).observe(main,{childList:true});
document.addEventListener('click',e=>{const a=e.target.closest('[data-v11page]');if(a)document.querySelector('#nav button[data-page="'+a.dataset.v11page+'"]')?.click()});
document.addEventListener('change',e=>{if(e.target.id==='datepick')queue()});
window.addEventListener('storage',queue);window.addEventListener('pageshow',queue);queue();
})();