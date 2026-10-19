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
/* Ícones vetoriais locais e específicos, sem imagens externas. */
const icons={
 briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a20 20 0 0 0 18 0M12 11v3"/>',
 dumbbell:'<path d="M6.5 6.5 17.5 17.5M4 4 2 6l4 4 4-4-4-4-2 2m16 16 2-2-4-4-4 4 4 4 2-2"/>',
 activity:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',
 bike:'<circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="m15 7-3.5 10.5h-6L9 10h6l3.5 7.5M13 7h4M9 10 7 7H4"/>',
 paw:'<circle cx="6" cy="8" r="1"/><circle cx="10" cy="5.5" r="1"/><circle cx="15" cy="5.5" r="1"/><circle cx="19" cy="8" r="1"/><path d="M7 17c0-3 3.2-5.5 5-5.5s5 2.5 5 5.5c0 2.2-1.8 3.2-3.5 2.1a3 3 0 0 0-3 0C8.8 20.2 7 19.2 7 17Z"/>',
 book:'<path d="M12 7C9 5 6 5 3 6v14c3-1 6-1 9 1 3-2 6-2 9-1V6c-3-1-6-1-9 1ZM12 7v14"/>',
 languages:'<path d="M3 5h12M9 3v2m2 0c-.5 5-3 8-7 10M5 9c1.8 3 4 5 7 6M13 21l5-12 5 12M15 17h6"/>',
 church:'<path d="M12 2v5m-3-2h6M5 10 12 6l7 4v12H5V10Zm0 4H3v8h18v-8h-2M10 22v-6a2 2 0 0 1 4 0v6"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 shower:'<path d="M4 20V8a5 5 0 0 1 10 0M12 8h5a3 3 0 0 1 3 3H9a3 3 0 0 1 3-3Zm0 6v1m4-1v1m4-1v1m-8 3v1m4-1v1m4-1v1"/>',
 coffee:'<path d="M4 8h14v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Zm14 1h2a2 2 0 0 1 0 4h-2M8 3v2m4-2v2m4-2v2"/>',
 moon:'<path d="M20.8 14a9 9 0 0 1-10.8-10.8A9 9 0 1 0 20.8 14Z"/>',
 heart:'<path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.5 8.8-8.5a5.5 5.5 0 0 0 0-7.8Z"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/>',
 car:'<path d="m5 17-1 3m15-3 1 3M4 14l2-7h12l2 7v5H4v-5Zm0 0h16M7 16h2m6 0h2"/>',
 building:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 21v-5h6v5M8 7h1m6 0h1M8 11h1m6 0h1"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'
};
function symbol(t){
 const title=String(t?.title||"").toLocaleLowerCase("pt-BR"),cat=t?.category||"";
 let key="target";
 if(/banho|chuveiro|higiene/.test(title))key="shower";
 else if(/acordar|despertar/.test(title))key="sun";
 else if(/dormir|sono|descanso/.test(title))key="moon";
 else if(/bike|bicicleta|pedal/.test(title))key="bike";
 else if(/corrida|correr|trote|caminhada|cardio/.test(title)||cat==="Cardio")key="activity";
 else if(/igreja|culto|consagração|ensaio/.test(title)||cat==="Igreja")key="church";
 else if(/café|almoc|refeição|comer/.test(title))key="coffee";
 else if(/deslocamento|sair para|trajeto|retorno para casa/.test(title)||cat==="Deslocamento")key="car";
 else if(cat==="Trabalho")key="briefcase";
 else if(cat==="Treino")key="dumbbell";
 else if(cat==="Shiro")key="paw";
 else if(cat==="PMERJ")key="book";
 else if(cat==="Inglês")key="languages";
 else if(cat==="Família")key="heart";
 else if(cat==="Empresa")key="building";
 else if(cat==="Rotina")key="clock";
 else if(cat==="Descanso")key="moon";
 else if(cat==="Lazer")key="sun";
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">'+icons[key]+'</svg>';
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
 '<div class="tf42-symbol" aria-hidden="true">'+symbol(task)+'</div>'+
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
window.TF42_LIVE=Object.freeze({version:"43.0",selection,action,markup,symbol,refresh});
refresh();
})();