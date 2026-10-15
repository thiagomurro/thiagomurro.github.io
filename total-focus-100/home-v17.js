/* TOTAL FOCUS V17 — Painel do dia com metas reais */
(()=>{"use strict";
const D="totalfocus100.private.dataset.v1",S="totalfocus100.v1",get=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}};
const $=(q,r=document)=>r.querySelector(q),esc=x=>String(x??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const plus=(s,n)=>{const d=new Date(s+"T12:00:00");d.setDate(d.getDate()+n);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")};
function paint(){
 const m=$("#main"),hero=m?.querySelector(".card.hero"),date=m?.querySelector("#datepick")?.value;
 if(!m?.querySelector("h1")?.textContent?.startsWith("Meu dia")||!hero||!date||$("#tf17-todayplus",m))return;
 const d=get(D),s=get(S)||{};if(!d?.tasks)return;
 const all=d.tasks.map(t=>({...t,...(s.overrides?.[t.id]||{})})).filter(t=>t.priority==="flex"&&!t.meta?.optional);
 const selected=all.filter(t=>t.date===date),finished=selected.filter(t=>s.statuses?.[t.id]==="feito"),pct=selected.length?Math.round(100*finished.length/selected.length):0;
 const list=Array.from({length:7},(_,i)=>{const day=plus(date,-6+i),q=all.filter(t=>t.date===day),ok=q.filter(t=>s.statuses?.[t.id]==="feito").length;return {date:day,total:q.length,done:ok,pct:q.length?Math.round(100*ok/q.length):0}});
 const cats=[["Treino","Treinos","#35eab5"],["Shiro","Shiro","#ffd56d"],["PMERJ","Estudos","#b49aff"],["Empresa","Licitações","#57b4ef"]];
 const mini=cats.map(([name,label,color])=>{const rows=selected.filter(t=>t.category===name),ok=rows.filter(t=>s.statuses?.[t.id]==="feito").length;return '<div class="tf17-h-track"><span>'+label+'</span><div><i style="width:'+(rows.length?Math.round(ok/rows.length*100):0)+'%;background:'+color+'"></i></div><b>'+ok+'/'+rows.length+'</b></div>'}).join("");
 const rows=list.map(a=>'<div class="tf17-h-day" title="'+esc(a.date)+'"><small>'+a.date.slice(8)+'</small><div class="tf17-h-daybar"><i style="height:'+a.pct+'%"></i></div><small>'+a.done+'/'+a.total+'</small></div>').join("");
 const sec=document.createElement("section");sec.id="tf17-todayplus";sec.className="tf17-todayplus";
 sec.innerHTML='<div class="tf17-h-top"><div><div class="tf17-kicker">◈ JORNADA EM ANDAMENTO</div><h2>Seu placar de hoje</h2></div><strong>'+pct+'%</strong></div><div class="tf17-h-meter"><i style="width:'+pct+'%"></i></div><div class="tf17-h-sub">'+finished.length+' missões concluídas · '+Math.max(0,selected.length-finished.length)+' a realizar</div><div class="tf17-h-cols"><div><h3>Últimos 7 dias</h3><div class="tf17-h-chart">'+rows+'</div></div><div><h3>Áreas do dia</h3><div class="tf17-h-tracks">'+mini+'</div></div></div><button class="tf17-h-to-progress" data-h-go="progress">▤ Abrir dashboard completo <span>→</span></button>';
 const place=$("#tf-v11-panel",m)||hero;place.insertAdjacentElement("afterend",sec)
}
let pending=false;function next(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;paint()})}
const main=$("#main");if(main)new MutationObserver(next).observe(main,{childList:true});
document.addEventListener("click",e=>{if(e.target.closest('[data-h-go="progress"]'))document.querySelector('#nav button[data-page="progress"]')?.click()});
window.addEventListener("tf-remote-update",next);
next();
})();