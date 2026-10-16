/* TOTAL FOCUS 100 — Progressão independente PMERJ/Inglês V24
   Não altera cotações, expediente, sono nem histórico concluído.
   A meta é medida por sessões registradas como 'feito', confirmadas pelo usuário. */
(()=>{"use strict";
const DK="totalfocus100.private.dataset.v1",SK="totalfocus100.v1",PK="totalfocus100.study.v24",DAY=86400000;
const $=(q,r=document)=>r.querySelector(q),J=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}};
const dstr=x=>[x.getFullYear(),String(x.getMonth()+1).padStart(2,"0"),String(x.getDate()).padStart(2,"0")].join("-");
const today=()=>dstr(new Date()),dt=s=>new Date(s+"T12:00:00"),shift=(s,n)=>{const v=dt(s);v.setDate(v.getDate()+n);return dstr(v)};
const minute=s=>Number(s.slice(0,2))*60+Number(s.slice(3,5));
const hm=n=>String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0");
const clean=s=>String(s??"").replace(/[&<>"]/g,k=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[k]));
const modkey=t=>t?.category==="PMERJ"?"pmerj":t?.category==="Inglês"?"english":null;
const wd=s=>dt(s).getDay();
const initial={pmerj:30,english:15},goal={pmerj:60,english:30};
const pmSlot={1:["21:45","22:15"],2:["18:05","18:35"],3:["22:10","22:40"],4:["21:55","22:25"],5:["19:10","19:40"]};
let guard=false,working=false,dlg=null,lastEvaluation="";
function state(){return {pmerj:null,english:null,pending:[],...(J(PK)||{})}}
function eligible(task,type){return type==="pmerj"?task.category==="PMERJ"&&task.meta?.studyTrack!=="pmerj-extra"&&task.meta?.kind!=="study-extension":task.category==="Inglês"&&task.meta?.studyTrack!=="english-extra"&&task.meta?.kind!=="study-extension"}
function info(type,data,app,day=today()){
 const end=shift(day,-1),begin=shift(end,-29),eligibleTasks=data.tasks.filter(t=>t.date>=begin&&t.date<=end&&eligible(t,type));
 const n=eligibleTasks.length,all=eligibleTasks.filter(t=>{
  if(app.statuses?.[t.id]!=="feito")return false;
  const extras=data.tasks.filter(e=>e.meta?.parentStudyId===t.id&&e.date===t.date);
  return extras.every(e=>app.statuses?.[e.id]==="feito");
 }).length;
 return {type,n,all,pct:n?Math.round(100*all/n):0,exact:n?all/n:0,begin,end,remaining:Math.max(0,Math.ceil(n*.8)-all)};
}
function full30(day,start){return day>=shift(start,30)}
function overlaps(d,app,date,start,end,skipId){
 const a=minute(start),b=minute(end);
 return d.tasks.some(t=>{
  if(t.id===skipId||t.date!==date)return false;
  const o=app.overrides?.[t.id]||{},x={...t,...o};
  if(app.statuses?.[t.id]==="cancelado")return false;
  return a<minute(x.end||x.time)&&b>minute(x.time);
 });
}
function available(d,app,day,slot,skipId){
 return slot&&minute(slot[0])<minute(slot[1])&&!overlaps(d,app,day,slot[0],slot[1],skipId)
}
function extraTask(parent,start,end,type){
 const minutes=minute(end)-minute(start);
 return {id:"tf24-"+type+"-extra-"+parent.date,date:parent.date,time:start,end,
 category:parent.category,priority:"flex",
 title:type==="pmerj"?"PMERJ • Complemento de estudo (30 min)":"Inglês • Complemento de conversação (15 min)",
 description:type==="pmerj"?"Complemento após o expediente; junto com os 30 minutos do almoço, totaliza 60 minutos diários.":"Complemento de 15 minutos para atingir 30 minutos no dia, sem deslocar família e igreja.",
 meta:{kind:"study-extension",studyTrack:type+"-extra",durationMin:minutes,parentStudyId:parent.id,conditional80:true}};
}
function alternatives(d,app,day,minutes,dflt){
 if(available(d,app,day,dflt))return dflt;
 for(const start of [18*60,18*60+10,18*60+20,19*60,19*60+10,19*60+40,20*60,20*60+10,20*60+30,21*60,21*60+10,21*60+45,22*60,22*60+10,22*60+25]){
  const candidate=[hm(start),hm(start+minutes)];
  if(start+minutes<=23*60&&available(d,app,day,candidate))return candidate
 }
 return null;
}
function applyPromotion(type,d,app,when,plan){
 const future=d.tasks.filter(t=>t.date>=when&&eligible(t,type)),problems=[];
 for(const t of future){
  if(type==="pmerj"){
   const pref=pmSlot[wd(t.date)];
   const slot=alternatives(d,app,t.date,30,pref);
   if(!slot){problems.push(t.date);continue}
   const ext=extraTask(t,slot[0],slot[1],type);if(!d.tasks.some(x=>x.id===ext.id))d.tasks.push(ext);
  }else{
   // Semana de quarta: 15 min antes da igreja + 15 min depois, sem usar a janela familiar.
   const wedSplit=t.time==="18:00";
   if(wedSplit){
    const slot=alternatives(d,app,t.date,15,["22:45","23:00"]);
    if(!slot){problems.push(t.date);continue}
    const ext=extraTask(t,slot[0],slot[1],type);if(!d.tasks.some(x=>x.id===ext.id))d.tasks.push(ext);
   }else{
    const newEnd=hm(minute(t.end)+15);
    const check=available(d,app,t.date,[t.time,newEnd],t.id);
    if(!check){problems.push(t.date);continue}
    t.end=newEnd;t.meta={...(t.meta||{}),durationMin:30,promotedFrom:15,promotedOn:when};
    t.description="30 minutos de inglês em casa após atingir 80% da meta de 30 dias. Priorize escuta e conversação.";
   }
  }
 }
 plan[type]={on:when,threshold:.8,basisDays:30,unavailable:problems};
 d.tasks.sort((a,b)=>(a.date+" "+a.time+" "+a.id).localeCompare(b.date+" "+b.time+" "+b.id));
 return problems
}
function evaluate(){
 if(working)return;
 const data=J(DK),app=J(SK)||{},plan=state();
 if(!Array.isArray(data?.tasks)||!data.studyProgression||!full30(today(),data.start))return;
 const day=today(),key=day+"-"+Object.keys(app.statuses||{}).length+"-"+(plan.pmerj?.on||"")+"-"+(plan.english?.on||"");
 if(lastEvaluation===key)return;
 lastEvaluation=key;working=true;
 try{
  let changed=false,warnings=[];
  for(const type of ["pmerj","english"]){
   if(plan[type]?.on)continue;
   const result=info(type,data,app,day);
   const minimum=type==="pmerj"?14:24;
   if(result.n>=minimum&&result.exact>=.8){
    warnings.push(...applyPromotion(type,data,app,day,plan).map(s=>type+" "+s));
    changed=true
   }
  }
  if(changed){
   plan.pending=[...new Set([...(plan.pending||[]),...warnings])];
   // Write schedule and promotion state in the same event tick; status data remains intact.
   localStorage.setItem(DK,JSON.stringify(data));
   localStorage.setItem(PK,JSON.stringify(plan));
   window.dispatchEvent(new Event("tf-remote-update"));
  }
 }catch(e){plan.lastError=String(e?.message||e).slice(0,200);localStorage.setItem(PK,JSON.stringify(plan))}
 finally{working=false}
}
function row(type,d,s,plan){
 const z=info(type,d,s),upgrade=!!plan[type]?.on,ready=full30(today(),d.start);
 const label=type==="pmerj"?"PMERJ":"Inglês",unit=upgrade?goal[type]:initial[type],availableDays=z.n?z.n+" sessões": "Sem sessões encerradas";
 const pct=upgrade?"100":z.pct.toString();
 return '<div class="tf24-track"><div class="tf24-head"><strong>'+label+'</strong><span class="tf24-badge" data-promoted="'+upgrade+'">'+(upgrade?"EVOLUÇÃO ATIVADA":"META · 80%")+'</span></div>'+
 '<div class="tf24-numbers"><b>'+z.all+'/'+z.n+'</b><span>'+z.pct+'% de adesão</span><strong>'+unit+' min</strong></div>'+
 '<div class="tf24-progress"><i style="width:'+pct+'%"></i></div><small>'+availableDays+' nos últimos 30 dias completos · '+z.remaining+' conclusão(ões) para 80%.</small>'+
 '<p class="tf24-extra">'+(upgrade?"Aumentou para "+goal[type]+" minutos em "+z.begin+" ou depois. A conquista é permanente até o fim do desafio.":ready?"Avaliação diária automática; marque as sessões realmente estudadas como concluídas.":"Primeira avaliação em "+shift(d.start,30)+".")+'</p></div>'
}
function renderBox(){
 const d=J(DK),s=J(SK)||{};if(!d?.studyProgression)return "";
 const p=state(),ready=full30(today(),d.start);
 return '<section class="tf24-panel" id="tf24-panel"><div class="tf24-eyebrow">⚡ MOTOR DE EVOLUÇÃO · 30 DIAS</div><h2>Estudos e novas metas</h2><p>Suba de nível com pelo menos 80% das sessões concluídas nos últimos 30 dias. PMERJ e inglês progridem separadamente.</p>'+row("pmerj",d,s,p)+row("english",d,s,p)+
 '<p class="tf24-foot">PMERJ: 30 min no almoço; após a promoção, mais 30 min fora do expediente. Inglês: 15 min diários (inclusive sábado e domingo); após a promoção, 30 min. Quarta-feira pode ser dividida em 2 blocos de 15 min.</p>'+
 (p.pending?.length?'<p class="tf24-warning">Conflitos em '+p.pending.length+' data(s). Consulte o cronograma antes de contar a ampliação.</p>':"")+
 '<div class="tf24-row"><button id="tf24-refresh" type="button">↻ Conferir evolução</button><button id="tf24-open-today" type="button">▤ Estudos de hoje</button></div></section>';
}
function paint(){
 const m=$("#main"),d=J(DK);
 if(!m||!d?.studyProgression)return;
 const destination=m.querySelector('[data-tf18-screen="more"] .tf18-listnav')||m.querySelector('[data-tf18-screen="configMenu"] .tf18-listnav');
 const isProgress=!!m.querySelector(".tf17-dash");
 if(!destination&&!isProgress)return;
 let el=$("#tf24-panel",m);
 if(!el){el=document.createElement("section");if(destination)destination.after(el);else m.querySelector(".tf17-dash")?.prepend(el)}
 const html=renderBox();if(el.outerHTML!==html)el.outerHTML=html;
}
function openToday(){
 const d=J(DK),s=J(SK)||{},now=today();if(!d)return;
 const tasks=d.tasks.filter(t=>t.date===now&&(t.category==="PMERJ"||t.category==="Inglês"));
 if(!tasks.length){alert("Sem estudos programados para hoje.");return}
 if(!dlg){dlg=document.createElement("dialog");dlg.id="tf24-dialog";dlg.className="tf24-dialog";document.body.append(dlg)}
 dlg.innerHTML='<h2>Estudos de hoje</h2><p>Escolha uma sessão. Marque como concluída apenas após realizar o tempo previsto.</p>'+
 tasks.map(t=>'<div class="tf24-study-item"><div><b>'+clean(t.title)+'</b><small>'+t.time+'–'+t.end+' · '+(t.meta?.durationMin||minute(t.end)-minute(t.time))+' min · '+(s.statuses?.[t.id]==="feito"?"✓ Feito":"Pendente")+'</small></div><button data-tf24-done="'+clean(t.id)+'" '+(s.statuses?.[t.id]==="feito"?"disabled":"")+'>Concluir</button></div>').join("")+
 '<button data-tf24-close="1">Fechar</button>';
 dlg.showModal();
}
document.addEventListener("click",e=>{
 if(e.target.closest("#tf24-refresh")){lastEvaluation="";evaluate();paint()}
 if(e.target.closest("#tf24-open-today"))openToday();
 if(e.target.closest("[data-tf24-close]"))dlg?.close();
 const b=e.target.closest("[data-tf24-done]");
 if(b){
  const id=b.dataset.tf24Done,d=J(DK),s=J(SK)||{},t=d?.tasks?.find(v=>v.id===id);if(!t)return;
  const minutes=t.meta?.durationMin||minute(t.end)-minute(t.time);
  if(!confirm("Você realmente estudou "+minutes+" minutos de "+t.category+"? A conclusão será considerada na meta de 80%."))return;
  s.statuses=s.statuses||{};s.statuses[id]="feito";s.history=s.history||[];s.history.push({at:new Date().toISOString(),kind:"study",id,minutes});
  localStorage.setItem(SK,JSON.stringify(s));window.dispatchEvent(new Event("tf-remote-update"));dlg?.close();lastEvaluation="";evaluate();
 }
});
let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;evaluate();paint()})};
const main=$("#main");if(main)new MutationObserver(schedule).observe(main,{childList:true});
window.addEventListener("pageshow",schedule);window.addEventListener("tf-remote-update",schedule);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)schedule()});
window.TF_STUDY_V24=Object.freeze({info,full30,eligible,version:"24"});
schedule();
})();