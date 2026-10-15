/* TOTAL FOCUS V17 - Rendimento com dados reais */
(()=>{"use strict";
const DATA="totalfocus100.private.dataset.v1",STATE="totalfocus100.v1";
const names={Treino:"Treinos",Cardio:"Cardio",Shiro:"Shiro",PMERJ:"PMERJ",Inglês:"Inglês",Empresa:"Licitações"};
const palette={Treino:"#34e5a0",Cardio:"#18d9e3",Shiro:"#ffca5d",PMERJ:"#ae84fa",Inglês:"#f285bd",Empresa:"#59a9ff"};
const cats=Object.keys(names),$=(q,r=document)=>r.querySelector(q);
const esc=x=>String(x??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}};
const day=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")};
const plus=(s,n)=>{let d=new Date(s+"T12:00:00");d.setDate(d.getDate()+n);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")};
const ok=(s,t)=>s.statuses?.[t.id]==="feito";
let windowDays=12,selection=0;
function getStats(){
const d=read(DATA),s=read(STATE)||{};if(!d?.tasks)return null;
const end=windowDays===100?d.end:day()<d.start?plus(d.start,windowDays-1):day()>d.end?d.end:day(),start=windowDays===100?d.start:plus(end,1-windowDays)<d.start?d.start:plus(end,1-windowDays);
const all=d.tasks.map(t=>({...t,...(s.overrides?.[t.id]||{})})).filter(t=>t.priority==="flex"&&!t.meta?.optional);
const list=all.filter(t=>t.date>=start&&t.date<=end);
const complete=list.filter(t=>ok(s,t));
const groups=cats.map(cat=>{const tasks=list.filter(t=>t.category===cat);const done=tasks.filter(t=>ok(s,t)).length;return {cat,planned:tasks.length,done,pct:tasks.length?Math.round(100*done/tasks.length):0}});
const segments=windowDays<=12?windowDays:10,step=windowDays===30?3:windowDays===100?10:1,blocks=[];
for(let i=0;i<segments;i++){const a=plus(start,i*step),b=plus(a,step-1),items=list.filter(t=>t.date>=a&&t.date<=b),done=items.filter(t=>ok(s,t)).length;blocks.push({from:a,to:b,label:windowDays<=12?a.slice(8):String(i+1),total:items.length,done})}
let quoteMinutes=0;for(const t of all.filter(t=>t.category==="Empresa"&&t.date>=start&&t.date<=end)){const q=s.quoteTimers?.[t.id];if(q)quoteMinutes+=(Number(q.ms)||0)/60000+(q.since?Math.max(0,Date.now()-q.since)/60000:0)}
let xp=0;const award={Treino:22,Cardio:35,Shiro:28,PMERJ:25,"Inglês":17,Empresa:15};
for(const t of all)if(ok(s,t))xp+=award[t.category]||10;
return {d,s,list,complete,groups,blocks,start,end,pct:list.length?Math.round(100*complete.length/list.length):0,quoteMinutes,xp}
}
function ring(percent){const c=2*Math.PI*45;return '<div class="tf17-ring"><svg viewBox="0 0 110 110" aria-label="'+percent+' por cento" role="img"><circle cx="55" cy="55" r="45" fill="none" stroke="#17415a" stroke-width="11"/><circle cx="55" cy="55" r="45" fill="none" stroke="#32e5d7" stroke-width="11" stroke-dasharray="'+c.toFixed(2)+'" stroke-dashoffset="'+((1-percent/100)*c).toFixed(2)+'" stroke-linecap="round"/></svg><div class="center"><strong>'+percent+'%</strong><small>concluídas</small></div></div>'}
function tile(name,value,desc){return '<div class="tf17-stat"><small>'+name+'</small><strong>'+value+'</strong><em>'+desc+'</em></div>'}
function draw(){
 const m=$("#main"),x=getStats();if(!m||!x)return;
 const count=x.complete.length,planned=x.list.length,blocks=x.blocks,maximum=Math.max(1,...blocks.map(y=>y.total));
 const choices=[7,12,30,100].map(n=>'<button type="button" data-metric-range="'+n+'" aria-pressed="'+(n===windowDays)+'">'+(n===100?"100 dias":n+" dias")+'</button>').join("");
 const bars=blocks.map((y,i)=>'<button data-metric-block="'+i+'" aria-selected="'+(i===selection)+'"><span class="pillar"><i style="height:'+Math.round(100*y.done/maximum)+'%"></i></span><small>'+y.label+'</small></button>').join("");
 const category=x.groups.map(y=>'<div><div class="tf17-area-head"><span>'+esc(names[y.cat])+'</span><b>'+y.done+'/'+y.planned+' · '+y.pct+'%</b></div><div class="tf17-area-track"><div style="background:'+palette[y.cat]+';width:'+y.pct+'%"></div></div></div>').join("");
 const rows=x.groups.map(y=>'<tr><td>'+esc(names[y.cat])+'</td><td>'+y.planned+'</td><td>'+y.done+'</td><td>'+Math.max(0,y.planned-y.done)+'</td><td>'+y.pct+'%</td></tr>').join("");
 const idx=Math.min(selection,blocks.length-1),sel=blocks[idx],capt=sel?sel.from+" a "+sel.to+": "+sel.done+" concluídas de "+sel.total+" previstas.":"Sem atividades.";
 const sleeps=Object.values(x.s.checkins||{}).slice(-7).map(c=>Number(c.sleep)).filter(n=>n>0),avg=sleeps.length?(sleeps.reduce((a,b)=>a+b,0)/sleeps.length).toFixed(1).replace(".",","):"—";
 m.innerHTML='<section class="tf17-dash"><div class="tf17-hero"><div class="tf17-kicker">◈ CENTRAL DE COMANDO</div><h1 class="tf17-title">Meu desempenho</h1><p class="tf17-muted">Painel interativo ligado aos registros reais do TOTAL FOCUS.</p><div class="tf17-switch">'+choices+'</div></div><div class="tf17-kpi">'+tile("Missões realizadas",count+"/"+planned,"no período")+tile("Aproveitamento",x.pct+"%","realizadas / previstas")+tile("Cotações",(x.quoteMinutes/60).toFixed(1).replace(".",",")+"h","tempo registrado")+tile("Experiência",x.xp,"XP acumulado")+'</div><div class="tf17-card"><h2>Visão geral <span>'+x.start+" — "+x.end+'</span></h2><div class="tf17-ringbar">'+ring(x.pct)+'<div class="tf17-lines"><div><strong>'+count+' realizadas</strong><span>✓</span><small>Missões confirmadas</small></div><div><strong>'+Math.max(0,planned-count)+' restantes</strong><span>◷</span><small>Inclui atividades futuras</small></div><div><strong>'+avg+'h de sono</strong><span>☾</span><small>Média dos check-ins</small></div></div></div></div><div class="tf17-card"><h2>Evolução da jornada <span>Selecione um dia</span></h2><p class="tf17-note">Cada coluna mostra as missões concluídas no respectivo dia ou intervalo.</p><div class="tf17-trendgrid" style="grid-template-columns:repeat('+blocks.length+',minmax(0,1fr))">'+bars+'</div><p id="tf17-selected" class="tf17-note">'+esc(capt)+'</p></div><div class="tf17-card"><h2>Desempenho por área <span>Dados reais</span></h2><div class="tf17-areas">'+category+'</div></div><div class="tf17-card"><h2>Planilha de resultados <button class="tf17-export" id="tf17-export">↓ CSV</button></h2><div class="tf17-table-scroll"><table class="tf17-table"><thead><tr><th>Área</th><th>Previstas</th><th>Feitas</th><th>Pendentes</th><th>%</th></tr></thead><tbody>'+rows+'</tbody></table></div></div><p class="tf17-note">A meta é acompanhar tendências reais. Nada de gráficos com resultados inventados.</p></section>';
}
function exportCSV(){
 const x=getStats();if(!x)return;const lines=["Data,Categoria,Tarefa,Status,Início,Fim"],quote=s=>'"'+String(s??"").replace(/"/g,'""')+'"';for(const t of x.list)lines.push([t.date,t.category,t.title,x.s.statuses?.[t.id]||"pendente",t.time,t.end||""].map(quote).join(","));
 const blob=new Blob(["\ufeff"+lines.join("\r\n")],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="TOTAL_FOCUS_"+windowDays+"_dias.csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),25000)
}
let busy=false;const main=$("#main");function schedule(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;const h=main?.querySelector("h1");if(h?.textContent.trim()==="Meu rendimento"&&!main.querySelector(".tf17-dash"))draw()})}
if(main)new MutationObserver(schedule).observe(main,{childList:true});
document.addEventListener("click",e=>{const btn=e.target.closest("[data-metric-range],[data-metric-block],#tf17-export");if(!btn)return;
 if(btn.dataset.metricRange){windowDays=Number(btn.dataset.metricRange);selection=0;draw()}
 else if(btn.dataset.metricBlock!==undefined){selection=Number(btn.dataset.metricBlock);const b=getStats().blocks[selection];const cap=$("#tf17-selected");if(cap)cap.textContent=b.from+" a "+b.to+": "+b.done+" concluídas de "+b.total+" previstas.";document.querySelectorAll("[data-metric-block]").forEach(el=>el.setAttribute("aria-selected",el===btn?"true":"false"))}
 else if(btn.id==="tf17-export")exportCSV()
});
window.addEventListener("tf-remote-update",schedule);window.addEventListener("pageshow",schedule);
schedule();
})();