/* TOTAL FOCUS 100 V41 — atividade atual, pendencias e sono real */
(()=>{"use strict";
if(window.TF41_ROUTINE)return;
const DK="totalfocus100.private.dataset.v1",SK="totalfocus100.v1";
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}};
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const day=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")};
const minute=x=>/^\d\d:\d\d$/.test(String(x))?Number(x.slice(0,2))*60+Number(x.slice(3,5)):null;
const ends=t=>{const a=minute(t.time),b=minute(t.end);return a===null?null:b===null?a+15:b<=a?b+1440:b};
const final=new Set(["feito","nao_feito","cancelado","registrado"]);
const formal=new Set(["Treino","Cardio","Shiro","Empresa","PMERJ","Inglês"]);
const excluded=t=>t.meta?.optional===true||t.meta?.freeTime===true||t.meta?.kind==="free-time";
const stat=(s,t)=>s.statuses?.[t.id]||"pendente";
const style=document.createElement("style");style.id="tf41-styles";
style.textContent=".tf41-card{border:1px solid #35bdb7;border-radius:16px;background:linear-gradient(140deg,#133a50,#0d2639);padding:15px;margin:13px 0;color:#e7faff}.tf41-card h2{font-size:19px;margin:4px 0 10px}.tf41-card p{font-size:12px;color:#c3dbe8;line-height:1.5}.tf41-kicker{font-size:11px;font-weight:850;letter-spacing:1px;color:#74f9ee}.tf41-task{padding:10px 0;border-top:1px solid #326070;display:flex;flex-wrap:wrap;align-items:center;gap:7px}.tf41-task .tf41-info{flex:1;min-width:130px}.tf41-task strong{display:block;font-size:13px}.tf41-task small{font-size:11px;color:#bbd4df}.tf41-actions{display:flex;align-items:center;justify-content:end;flex-wrap:wrap;gap:5px;max-width:100%}.tf41-btn{font-size:12px;min-height:34px;padding:7px 9px;border-radius:9px;background:#21495a;border:1px solid #387b8d;color:#ebffff;font-weight:800}.tf41-yes{background:#146a5a;border-color:#37ac91}.tf41-no{background:#4d3144;border-color:#89586e}.tf41-status{font-weight:700;font-size:12px;color:#8de8dc}.tf41-status[data-status=nao_feito]{color:#ffc2b5}.tf18-event .tf41-actions{padding:5px;gap:4px}.tf18-event .tf41-btn{padding:6px;min-height:30px;font-size:11px}.task .tf41-actions{max-width:52%}.tf41-form label{display:block;color:#d7e9f2;font-size:13px;margin:12px 0}.tf41-form input{display:block;width:100%;font-size:16px;min-height:46px;color:#fff}.tf41-quiet{font-size:11px;color:#9db6bf}#tf41-sleepdlg{background:#102b3d;color:#efffff;border:1px solid #53ddce;border-radius:17px;width:min(94vw,480px);max-height:85vh;overflow:auto;padding:18px}#tf41-sleepdlg::backdrop{background:#0018}@media(max-width:420px){.tf18-event .tf41-actions{width:100%}.tf18-event{flex-wrap:wrap}}";
document.head.append(style);
function controls(t,s){
 const x=stat(s,t);
 if(excluded(t))return '<span class="tf41-quiet">Livre</span>';
 if(final.has(x))return '<span class="tf41-status" data-status="'+esc(x)+'">'+(x==="feito"?"✓ Feito":x==="nao_feito"?"× Não fiz":x==="registrado"?"Registrado":"Cancelado")+'</span><button type="button" class="tf41-btn" data-tf41="reopen" data-id="'+esc(t.id)+'" title="Reabrir">↶</button>';
 if(formal.has(t.category))return '<button type="button" class="tf41-btn" data-do="view" data-id="'+esc(t.id)+'">Registrar</button><button type="button" class="tf41-btn tf41-no" data-tf41="skip" data-id="'+esc(t.id)+'">Não fiz</button>';
 return '<button type="button" class="tf41-btn tf41-yes" data-tf41="done" data-id="'+esc(t.id)+'">✓ Fiz</button><button type="button" class="tf41-btn tf41-no" data-tf41="skip" data-id="'+esc(t.id)+'">Não fiz</button>';
}
function update(id,action){
 const d=read(DK),s=read(SK)||{},t=d?.tasks?.find(x=>x.id===id);
 if(!t||excluded(t))return;
 const before=stat(s,t);
 if(action==="done"&&formal.has(t.category))return alert("Esta tarefa exige registro detalhado. Use Registrar.");
 if(action==="skip"&&t.meta?.kind==="cotacao"&&s.quoteTimers?.[id]?.since)return alert("Pause o cronômetro da cotação antes de confirmar.");
 if(action==="skip"&&!confirm("Confirma que NÃO realizou a atividade?"))return;
 if(action==="reopen"&&!confirm("Reabrir a atividade para nova confirmação?"))return;
 s.statuses=s.statuses||{};s.history=s.history||[];
 if(action==="reopen")delete s.statuses[id];else s.statuses[id]=action==="done"?"feito":"nao_feito";
 s.history.unshift({type:"confirmacao-"+action,id,at:new Date().toISOString(),anterior:before});
 try{localStorage.setItem(SK,JSON.stringify(s))}catch{return alert("Falha ao salvar. Verifique espaço para dados.");}
 window.dispatchEvent(new Event("tf-remote-update"));
 if(document.querySelector('[data-tf18-screen="agenda"]'))window.TF18_APP?.refresh?.();
 schedule();
}
function rows(d,s,date){return d.tasks.map(t=>({...t,...(s.overrides?.[t.id]||{})})).filter(t=>t.date===date).sort((a,b)=>(a.time+" "+a.id).localeCompare(b.time+" "+b.id))}
function taskHTML(t,s){return '<div class="tf41-task"><div class="tf41-info"><strong>'+esc(t.title)+'</strong><small>'+esc(t.time)+'–'+esc(t.end||"")+' · '+esc(t.category)+'</small></div><div class="tf41-actions">'+controls(t,s)+'</div></div>';}
let prevSig="";
function home(){
 const m=document.querySelector("#main"),hero=m?.querySelector(".card.hero"),picker=m?.querySelector("#datepick");
 if(!hero||!picker||!m.querySelector("h1")?.textContent?.startsWith("Meu dia"))return;
 const d=read(DK),s=read(SK)||{};if(!d?.tasks)return;
 const selected=picker.value,today=day(),dateIsToday=selected===today,now=new Date(),currentMinute=now.getHours()*60+now.getMinutes(),items=rows(d,s,selected);
 const current=dateIsToday?items.filter(t=>{let st=minute(t.time),ed=ends(t);return st!==null&&ed!==null&&st<=currentMinute&&currentMinute<ed}):[];
 const late=items.filter(t=>{const ed=ends(t);return ed!==null&&((selected<today)||(dateIsToday&&ed<=currentMinute))&&!final.has(stat(s,t))&&!excluded(t)});
 const next=items.find(t=>minute(t.time)!==null&&(selected!==today||minute(t.time)>currentMinute)&&!final.has(stat(s,t))&&!excluded(t));
 const signature=[selected,currentMinute,items.map(t=>t.id+":"+stat(s,t)).join(",")].join("|");
 if(signature===prevSig&&m.querySelector("#tf41-now")&&m.querySelector("#tf41-late"))return;
 prevSig=signature;
 let nowBox=m.querySelector("#tf41-now"),lateBox=m.querySelector("#tf41-late");
 if(!nowBox){nowBox=document.createElement("section");nowBox.id="tf41-now";nowBox.className="tf41-card";hero.insertAdjacentElement("beforebegin",nowBox);}
 if(!lateBox){lateBox=document.createElement("section");lateBox.id="tf41-late";lateBox.className="tf41-card";nowBox.insertAdjacentElement("afterend",lateBox);}
 if(dateIsToday&&current.length){
  nowBox.innerHTML='<div class="tf41-kicker">AGORA · '+String(now.getHours()).padStart(2,"0")+":"+String(now.getMinutes()).padStart(2,"0")+'</div><h2>Atualmente: '+esc(current[0].title)+'</h2><p>'+esc(current[0].time)+'–'+esc(current[0].end||"")+'</p>'+current.map(t=>taskHTML(t,s)).join("")+(next?'<p>Depois: '+esc(next.time)+' — '+esc(next.title)+'</p>':"");
 }else if(dateIsToday){
  nowBox.innerHTML='<div class="tf41-kicker">AGORA</div><h2>Sem atividade prevista neste horário</h2><p>'+(next?"Próxima: "+esc(next.time)+" — "+esc(next.title):"Sem outras atividades previstas hoje.")+'</p>';
 }else nowBox.innerHTML='<div class="tf41-kicker">REVISÃO DO DIA</div><h2>'+esc(selected.split("-").reverse().join("/"))+'</h2><p>Confira o que foi feito ou não, sem alterar o horário programado.</p>';
 lateBox.innerHTML='<div class="tf41-kicker">ATIVIDADES ANTERIORES</div><h2>'+late.length+' pendência'+(late.length===1?"":"s")+' para confirmar</h2>'+
 (late.length?'<p>O horário passou, mas nenhuma atividade foi marcada automaticamente como não feita.</p>'+late.map(t=>taskHTML(t,s)).join(""):'<p>Tudo confirmado até este horário.</p>')+
 '<button class="tf41-btn" type="button" data-tf41="sleep-open" style="margin-top:12px">☾ Registrar horários de sono</button>';
 hero.style.display="none";
}
function latestSleep(s){
 const arr=Object.entries(s.checkins||{}).filter(([,v])=>v?.bedAt&&v?.wakeAt).sort((a,b)=>a[0].localeCompare(b[0]));
 const last=arr.at(-1);if(!last)return "Nenhum horário real registrado ainda.";
 return "Último registro: "+last[1].bedAt.replace("T"," às ")+" → "+last[1].wakeAt.replace("T"," às ")+" ("+last[1].sleep+"h).";
}
function sleepPanel(){
 const m=document.querySelector("#main"),page=m?.querySelector('[data-tf18-screen="sleep"]');if(!page||page.querySelector("#tf41-sleepentry"))return;
 const el=document.createElement("section");el.id="tf41-sleepentry";el.className="tf41-card";
 el.innerHTML='<div class="tf41-kicker">DIÁRIO DE SONO</div><h2>Que horas você dormiu e acordou?</h2><p>Registre os horários reais. O total de horas é calculado mesmo passando da meia-noite.</p><button type="button" class="primary" data-tf41="sleep-open">Registrar dormir e acordar</button><p>'+esc(latestSleep(read(SK)||{}))+'</p>';
 const top=page.querySelector(".tf18-pagehead");if(top)top.insertAdjacentElement("afterend",el);else page.prepend(el);
}
function sleepOpen(){
 let dialog=document.querySelector("#tf41-sleepdlg");if(!dialog){dialog=document.createElement("dialog");dialog.id="tf41-sleepdlg";document.body.append(dialog)}
 dialog.innerHTML='<form id="tf41-sleepform" class="tf41-form"><h2>Meu sono real</h2><p>Escolha a data e a hora que aconteceram, sem valores presumidos.</p><label>Quando fui dormir<input name="bed" type="datetime-local" required></label><label>Quando acordei<input name="wake" type="datetime-local" required></label><div class="buttons"><button type="submit" class="primary">Salvar sono</button><button type="button" data-tf41="sleep-close">Cancelar</button></div></form>';
 dialog.showModal();
}
function saveSleep(form){
 const bed=form.elements.bed?.value,wake=form.elements.wake?.value;
 if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(bed||"")||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(wake||""))return alert("Selecione data e hora nos dois campos.");
 const start=new Date(bed).getTime(),end=new Date(wake).getTime(),elapsed=(end-start)/60000;
 if(!Number.isFinite(elapsed)||elapsed<10||elapsed>960)return alert("Confira a ordem das datas e horários (máximo de 16 horas).");
 if(end>Date.now()+60000)return alert("O horário de acordar não pode estar no futuro.");
 const s=read(SK)||{},key=wake.slice(0,10);s.checkins=s.checkins||{};s.history=s.history||[];
 s.checkins[key]={...(s.checkins[key]||{}),bedAt:bed,wakeAt:wake,sleep:Math.round(elapsed/60*100)/100};
 s.history.unshift({type:"sono-registrado",date:key,at:new Date().toISOString()});
 try{localStorage.setItem(SK,JSON.stringify(s))}catch{return alert("Falha ao salvar o sono.")}
 document.querySelector("#tf41-sleepdlg")?.close();
 window.dispatchEvent(new Event("tf-remote-update"));
 if(document.querySelector('[data-tf18-screen="sleep"]'))window.TF18_APP?.refresh?.();
 schedule();
 alert("Sono salvo: "+(elapsed/60).toFixed(2).replace(".",",")+" horas.");
}
function paint(){if(document.querySelector("#shell")?.classList.contains("hidden"))return;home();sleepPanel()}
let waiting=false;function schedule(){if(waiting)return;waiting=true;requestAnimationFrame(()=>{waiting=false;paint()})}
document.addEventListener("click",e=>{const b=e.target.closest?.("[data-tf41]");if(!b)return;e.preventDefault();e.stopPropagation();const op=b.dataset.tf41;
 if(op==="sleep-open")sleepOpen();else if(op==="sleep-close")document.querySelector("#tf41-sleepdlg")?.close();else if(["done","skip","reopen"].includes(op))update(b.dataset.id,op);
},true);
document.addEventListener("submit",e=>{if(e.target.id==="tf41-sleepform"){e.preventDefault();saveSleep(e.target)}});
const root=document.querySelector("#main");if(root)new MutationObserver(schedule).observe(root,{childList:true});
window.addEventListener("tf-remote-update",()=>{prevSig="";schedule()});
window.addEventListener("pageshow",schedule);
document.addEventListener("visibilitychange",()=>{if(!document.hidden){prevSig="";schedule()}});
setInterval(()=>{if(!document.hidden){prevSig="";schedule()}},60000);
window.TF41_ROUTINE=Object.freeze({version:"41.0",controls,update,saveSleep,refresh:schedule});
schedule();
})();