/* TOTAL FOCUS 100 · V42 — Painel ao vivo no lugar da capa estática
   Dados sempre do cronograma privado local, sem chamadas externas. */
(()=>{"use strict";
if(window.TF42_LIVE)return;
const DK="totalfocus100.private.dataset.v1",SK="totalfocus100.v1";
const $=(s,r=document)=>r.querySelector(s);
const safe=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}};
const iso=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
const hm=n=>String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0");
const min=s=>/^\d\d:\d\d$/.test(String(s))?Number(s.slice(0,2))*60+Number(s.slice(3,5)):null;
const end=t=>{const a=min(t.time),b=min(t.end);if(a===null)return null;return b===null?a+15:b<=a?b+1440:b};
const terminal=new Set(["feito","nao_feito","cancelado","registrado"]);
function status(s,t){return s.statuses?.[t.id]||"pendente"}
function blocked(t){return t.meta?.optional===true||t.meta?.freeTime===true||t.meta?.kind==="free-time"}
function score(t){return (["Treino","Cardio"].includes(t.category)?8:0)+(t.category==="Shiro"?4:0)+(t.category==="PMERJ"?3:0)+(t.category==="Trabalho"?1:0)}
function listFor(d,s,selected){return d.tasks.map(t=>({...t,...(s.overrides?.[t.id]||{})})).filter(t=>t.date===selected).sort((a,b)=>{const av=min(a.time)??0,bv=min(b.time)??0;return av-bv||a.id.localeCompare(b.id)})}
function selection(d,s,selected,nowDate=new Date()){
 const today=iso(nowDate),clock=nowDate.getHours()*60+nowDate.getMinutes();
 const tasks=listFor(d,s,selected),todaySelected=selected===today;
 const active=todaySelected?tasks.filter(t=>{let a=min(t.time),b=end(t);return a!==null&&b!==null&&a<=clock&&clock<b})
 .sort((a,b)=>(min(b.time)-min(a.time))||score(b)-score(a)): [ ];
 const upcoming=tasks.find(t=>min(t.time)!==null&&(selected!==today||min(t.time)>clock)&&!terminal.has(status(s,t))&&!blocked(t));
 const awaiting=tasks.filter(t=>!blocked(t)&&!terminal.has(status(s,t))&&end(t)!==null&&
 (selected<today||(todaySelected&&end(t)<=clock))).length;
 const chosen=active[0]||upcoming||null;
 const later=chosen?tasks.find(t=>min(t.time)!==null&&min(t.time)>(chosen===active[0]?clock:min(chosen.time))&&!terminal.has(status(s,t))&&!blocked(t)):null;
 const mode=selected<today?"review":active.length?"now":chosen?"next":"rest";
 return {selected,today,todaySelected,clock,tasks,chosen,later,awaiting,active,mode};
}
function action(task,s,mode){
 if(!task)return "";
 const state=status(s,task),id=safe(task.id);
 if(blocked(task))return '<span class="tf42-rest-note">Este período é livre, sem registro obrigatório.</span>';
 if(state==="feito")return '<span class="tf42-done"><span aria-hidden="true">✓</span> Atividade concluída</span>';
 if(state==="nao_feito")return '<span class="tf42-skipped">Registrada como não realizada</span>';
 if(state==="cancelado"||state==="registrado")return '<span class="tf42-rest-note">'+safe(state==="cancelado"?"Cancelada":"Registrada")+'</span>';
 if(task.category==="Treino"&&Array.isArray(task.meta?.moves)&&task.meta.moves.length)
  return '<button type="button" class="tf42-primary" data-tf12-open="work" data-id="'+id+'">▶ Abrir treinador guiado</button>';
 if(task.category==="Shiro"&&task.meta?.session!==undefined)
  return '<button type="button" class="tf42-primary" data-tf12-open="dog" data-id="'+id+'">♧ Iniciar treino do Shiro</button>';
 if(task.category==="Cardio")
  return '<button type="button" class="tf42-primary" data-do="view" data-id="'+id+'">▶ Abrir corrida / pedalada</button>';
 if(["PMERJ","Inglês","Empresa","Shiro","Treino"].includes(task.category))
  return '<button type="button" class="tf42-primary" data-do="view" data-id="'+id+'">▶ Abrir atividade</button>';
 return '<div class="tf42-actions"><button type="button" class="tf42-primary" data-tf41="done" data-id="'+id+'">✓ Fiz esta atividade</button>'+
 '<button type="button" class="tf42-secondary" data-tf41="skip" data-id="'+id+'">Não fiz</button></div>';
}
function markup(v,s){
 const task=v.chosen,n=v.clock;
 const progress=task&&v.mode==="now"&&min(task.time)!==null?Math.max(0,Math.min(100,Math.round((n-min(task.time))/(end(task)-min(task.time))*100))):0;
 const remaining=task&&v.mode==="now"?Math.max(0,end(task)-n):null;
 let label=v.mode==="now"?"AGORA • EM ANDAMENTO":v.mode==="next"?(v.todaySelected?"PRÓXIMA ATIVIDADE":"AGENDA PROGRAMADA"):v.mode==="review"?"REVISÃO DO DIA":"TEMPO DISPONÍVEL";
 const cardTitle=task?task.title:v.mode==="review"?"Consulte as atividades realizadas":"Sem atividade programada";
 const beginEnd=task?safe(task.time+"–"+(task.end||hm(end(task)%1440))):"";
 const dateLabel=v.selected.split("-").reverse().join("/");
 const currentTime=v.todaySelected?hm(n):dateLabel;
 const category=task?safe(task.category):"TOTAL FOCUS";
 return '<div class="tf42-live-wrap" role="region" aria-label="Painel da atividade atual">'+
 '<div class="tf42-top"><div class="tf42-brand"><img src="./icon.svg" alt="" width="30" height="30"><span>TOTAL FOCUS <strong>100</strong></span></div><span class="tf42-live-tag"><i></i>'+safe(v.todaySelected?"DIA "+dateLabel:dateLabel)+'</span></div>'+
 '<div class="tf42-eyebrow">'+safe(label)+' <span>'+safe(currentTime)+'</span></div>'+
 '<div class="tf42-symbol" aria-hidden="true">'+(task?.category==="Treino"?"↗":task?.category==="Cardio"?"◎":task?.category==="Shiro"?"♧":task?.category==="PMERJ"?"▤":task?.category==="Trabalho"?"▣":"◈")+'</div>'+
 '<div class="tf42-body"><span class="tf42-type">'+category+'</span><h2>'+safe(cardTitle)+'</h2>'+
 (task?'<p class="tf42-hours"><span aria-hidden="true">◷</span> '+beginEnd+(remaining!==null?" · Restam aproximadamente "+remaining+" min":"")+'</p>':
 '<p class="tf42-hours">Use este intervalo para suas atividades pessoais.</p>')+
 (task&&v.mode==="now"?'<div class="tf42-track" role="progressbar" aria-label="Progresso do horário da atividade" aria-valuenow="'+progress+'" aria-valuemin="0" aria-valuemax="100"><i style="width:'+progress+'%"></i></div>':"")+
 (task?'<div class="tf42-go">'+action(task,s,v.mode)+'</div>':"")+
 (v.later?'<div class="tf42-after"><small>A SEGUIR</small><strong>'+safe(v.later.time)+' — '+safe(v.later.title)+'</strong></div>':"")+
 '</div><div class="tf42-bottom"><span>Jornada de 100 dias</span>'+
 (v.awaiting?'<button type="button" data-tf42="pending"><strong>'+v.awaiting+'</strong> pendência'+(v.awaiting===1?"":"s")+' para confirmar ↓</button>':'<span>Rotina sincronizada com a agenda</span>')+
 '</div></div>';
}
let previous="",busy=false;
function paint(){
 const main=$("#main");if(!main||!main.querySelector("h1")?.textContent?.startsWith("Meu dia"))return;
 const cover=$("#tf20-cover",main),picker=$("#datepick",main);if(!cover||!picker)return;
 const d=read(DK),s=read(SK)||{};if(!Array.isArray(d?.tasks))return;
 const selected=picker.value||iso(new Date()),v=selection(d,s,selected);
 const k=JSON.stringify([selected,v.clock,v.mode,v.chosen?.id||"",v.later?.id||"",v.awaiting, v.tasks.map(t=>t.id+":"+status(s,t))]);
 if(previous===k&&cover.dataset.tf42==="1")return;
 previous=k;
 cover.dataset.tf22="1";cover.dataset.tf42="1";cover.classList.add("tf42-cover");
 cover.removeAttribute("aria-label");cover.setAttribute("aria-label","Atividade da rotina atual, com controles interativos");
 cover.innerHTML=markup(v,s);
 main.classList.add("tf42-home");
}
function refresh(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;paint()})}
document.addEventListener("click",e=>{
 const b=e.target.closest?.("[data-tf42]");if(!b)return;
 if(b.dataset.tf42==="pending")$("#tf41-late")?.scrollIntoView({behavior:"smooth",block:"start"});
});
const main=$("#main");if(main)new MutationObserver(refresh).observe(main,{childList:true,subtree:false});
document.addEventListener("change",e=>{if(e.target.id==="datepick"){previous="";refresh()}});
window.addEventListener("tf-remote-update",()=>{previous="";refresh()});
window.addEventListener("pageshow",()=>{previous="";refresh()});
document.addEventListener("visibilitychange",()=>{if(!document.hidden){previous="";refresh()}});
setInterval(()=>{if(!document.hidden){previous="";refresh()}},30000);
window.TF42_LIVE=Object.freeze({version:"42.0",selection,action,markup,refresh});
refresh();
})();