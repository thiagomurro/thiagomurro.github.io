/* TOTAL FOCUS 100 — V40 | Alarmes essenciais + avisos discretos de trabalho.
   Sem servidor, sem acesso aos alarmes do iOS e sem publicar dados pessoais. */
(()=>{"use strict";
if(window.TF40_ALERTS)return;
const DK="totalfocus100.private.dataset.v1",SK="totalfocus100.v1",ROOT="#main";
const WEEK=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const escapeHTML=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const dateString=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
const dateFrom=s=>new Date(s+"T12:00:00");
const shift=(s,n)=>{const d=dateFrom(s);d.setDate(d.getDate()+n);return dateString(d)};
const minute=t=>Number((t||"00:00").slice(0,2))*60+Number((t||"00:00").slice(3,5));
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}};
const dayLabel=s=>{const d=dateFrom(s);return WEEK[d.getDay()]+" "+s.slice(8,10)+"/"+s.slice(5,7)};
let settings={days:12,...(read("totalfocus100.alerts.v40")||{})};
function classify(t){
 const name=String(t.title||"").toLowerCase(),h=minute(t.time),end=minute(t.end||t.time);
 const insideWork=h>=480&&h<1020;
 if(t.meta?.optional||t.meta?.noReminder||t.meta?.freeTime||/intervalo livre|mobilidade muito leve \(opcional\)/i.test(name))return null;
 if(insideWork&&(t.category==="Trabalho"||t.category==="PMERJ")){
  return {kind:"vibration",title:t.category==="PMERJ"?"PMERJ • estudar das 16h às 17h":t.title};
 }
 if(t.category==="Rotina"&&/acordar|preparação para a igreja|preparar para a igreja|se arrumar|banho e se arrumar/i.test(name))
  return {kind:"alarm",title:t.title};
 if(t.category==="Inglês"&&!insideWork)return {kind:"alarm",title:t.title};
 if(t.category==="PMERJ"&&!insideWork)return {kind:"alarm",title:t.title};
 if((t.category==="Treino"||t.category==="Cardio")&&!/caminhada educativa|caminhada com shiro/i.test(name))
  return {kind:"exercise",title:t.title};
 return null;
}
function events(){
 const data=read(DK),state=read(SK)||{};
 if(!Array.isArray(data?.tasks))return {alarms:[],vibrations:[],data:null};
 const start=dateString(new Date())>data.start?dateString(new Date()):data.start;
 const end=shift(start,settings.days-1),rows=[];
 for(const item of data.tasks){
  if(item.date<start||item.date>end||item.date>data.end)continue;
  if(["feito","cancelado"].includes(state.statuses?.[item.id]))continue;
  const t={...item,...(state.overrides?.[item.id]||{})};
  if(!/^\d\d:\d\d$/.test(t.time))continue;
  const c=classify(t);if(c)rows.push({date:t.date,time:t.time,id:t.id,category:t.category,...c});
 }
 rows.sort((a,b)=>(a.date+a.time+a.id).localeCompare(b.date+b.time+b.id));
 const exerciseDay=new Set(),alarms=[],vibrations=[];
 for(const e of rows){
  if(e.kind==="exercise"){if(exerciseDay.has(e.date))continue;exerciseDay.add(e.date);alarms.push({...e,kind:"alarm",title:"Começar treino • "+e.title});}
  else if(e.kind==="alarm")alarms.push(e);
  else vibrations.push(e);
 }
 alarms.sort((a,b)=>(a.date+a.time+a.id).localeCompare(b.date+b.time+b.id));
 return {alarms,vibrations,data};
}
function alarmText(rows){
 const head="TOTAL FOCUS 100 — ALARMES SONOROS PRIORITÁRIOS\n"+
 "Configure no app RELÓGIO do iPhone. Nenhum alarme é criado automaticamente.\n"+
 "Os dias e horários refletem o cronograma privado neste dispositivo.\n";
 return head+"\n"+rows.map(e=>dayLabel(e.date)+" | "+e.time+" | "+e.title).join("\n")+
 "\n\nConfigure como recorrentes somente horários realmente iguais. Para domingos e eventos variáveis, confira a data.\n";
}
function vibrationText(rows){
 const head="TOTAL FOCUS 100 — ALARMES VIBRATÓRIOS DO EXPEDIENTE\nNo app RELÓGIO escolha SOM: NENHUM e mantenha uma vibração/resposta tátil ativa.\nRepita de segunda a sexta os horários 08h, 08h30 e 16h.\n\n";
 return head+rows.map(e=>dayLabel(e.date)+" | "+e.time+" | "+e.title).join("\n")+"\n\nO app web não cria alarmes diretamente no Relógio.\n";
}
const icsText=v=>{
 const stamp=d=>new Date(d).toISOString().replace(/[-:]|\.\d{3}/g,"");
 const ts=(date,time)=>date.replace(/-/g,"")+"T"+time.replace(":","")+"00";
 const esc=s=>String(s).replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n");
 const lines=["BEGIN:VCALENDAR","VERSION:2.0","CALSCALE:GREGORIAN","METHOD:PUBLISH","PRODID:-//TOTAL FOCUS 100//V40 TRABALHO//PT-BR","X-WR-CALNAME:TOTAL FOCUS • TRABALHO","X-WR-TIMEZONE:America/Sao_Paulo","BEGIN:VTIMEZONE","TZID:America/Sao_Paulo","BEGIN:STANDARD","DTSTART:19700101T000000","TZOFFSETFROM:-0300","TZOFFSETTO:-0300","TZNAME:-03","END:STANDARD","END:VTIMEZONE"];
 const dt=stamp(new Date());
 for(const e of v){
   let ending=minute(e.time)+5;
   const end=String(Math.floor(ending/60)).padStart(2,"0")+":"+String(ending%60).padStart(2,"0");
   lines.push("BEGIN:VEVENT","UID:tf40-"+String(e.id).replace(/[^a-z0-9_-]/ig,"").slice(0,70)+"@totalfocus.local",
     "DTSTAMP:"+dt,"DTSTART;TZID=America/Sao_Paulo:"+ts(e.date,e.time),
     "DTEND;TZID=America/Sao_Paulo:"+ts(e.date,end),
     "SUMMARY:"+esc("TOTAL FOCUS • "+e.title),
     "DESCRIPTION:"+esc("AVISO DISCRETO: configure o Calendário do iPhone sem som, com resposta tátil em modo silencioso. O arquivo não força vibração nem controla o iOS."),
     "TRANSP:TRANSPARENT","BEGIN:VALARM","ACTION:DISPLAY","TRIGGER:PT0M","DESCRIPTION:"+esc(e.title),"END:VALARM","END:VEVENT");
 }
 return lines.concat(["END:VCALENDAR",""]).join("\r\n");
};
function download(data,name,mime){
 const blob=new Blob([data],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);
}
function box(){
 const root=document.querySelector(ROOT);if(!root)return;
 const config=!!root.querySelector('[data-tf18-screen="configMenu"] .tf18-listnav')||
  !!root.querySelector("h1")?.textContent?.includes("Ajustes e privacidade");
 if(!config)return;
 let panel=root.querySelector("#tf40-alerts");
 if(!panel){panel=document.createElement("section");panel.id="tf40-alerts";panel.className="card";panel.style.cssText="border:1px solid #35d6d3;border-radius:18px;margin:16px 0;padding:16px;background:#092b3b;color:#eaffff";const prior=root.querySelector("#tf14-reminders");if(prior)prior.insertAdjacentElement("afterend",panel);else root.append(panel);}
 const {alarms,vibrations,data}=events(),signature=[settings.days,alarms.map(e=>e.date+e.time+e.id),vibrations.map(e=>e.date+e.time+e.id)].join("|");
 if(panel.dataset.signature===signature)return;panel.dataset.signature=signature;
 const list=alarms.slice(0,18).map(e=>'<div style="padding:7px 0;border-bottom:1px solid #205466;display:flex;gap:9px"><b style="min-width:90px;color:#89fff1">'+escapeHTML(dayLabel(e.date))+' '+escapeHTML(e.time)+'</b><span>'+escapeHTML(e.title)+'</span></div>').join("");
 panel.innerHTML='<div style="font-size:11px;letter-spacing:1.2px;color:#72f2ec;font-weight:800">ALARME INTELIGENTE • IPHONE</div>'+
 '<h2 style="margin:7px 0 10px">Som fora do trabalho, discrição no expediente</h2>'+
 '<p style="font-size:13px;line-height:1.5">Alarmes importantes: Relógio do iPhone com som. No expediente, Relógio com Som = Nenhum e vibração ativa (08h, 08h30, 16h). Calendário como alternativa.</p>'+
 '<label style="display:block;font-size:13px">Período <select id="tf40-days" style="width:100%;margin:5px 0 12px"><option value="12" '+(settings.days===12?"selected":"")+'>Próximos 12 dias</option><option value="30" '+(settings.days===30?"selected":"")+'>Próximos 30 dias</option><option value="100" '+(settings.days===100?"selected":"")+'>Até o fim dos 100 dias</option></select></label>'+
 (data?'<p><b>'+alarms.length+'</b> horários de alarme sonoro · <b>'+vibrations.length+'</b> alarmes vibratórios no expediente</p>'+
 '<div style="display:flex;flex-wrap:wrap;gap:7px"><button type="button" id="tf40-copy">Copiar lista de alarmes</button><button type="button" id="tf40-text">Baixar alarmes com som (.txt)</button><button type="button" id="tf40-vibration">Baixar alarmes só vibração (.txt)</button><button type="button" id="tf40-ics">Calendário do trabalho (.ics) — opcional</button></div>'+
 '<details style="margin:10px 0"><summary style="cursor:pointer">Ver próximos horários de alarme sonoro</summary>'+list+'</details>'+
 '<details style="margin:10px 0"><summary style="cursor:pointer">Ver alarmes do expediente (som desligado + vibração)</summary>'+vibrations.slice(0,12).map(e=>'<div style="padding:7px 0;border-bottom:1px solid #205466"><b style="color:#89fff1">'+escapeHTML(dayLabel(e.date))+' '+escapeHTML(e.time)+'</b> · '+escapeHTML(e.title)+'</div>').join("")+'</details>'+
 '<p style="font-size:12px;line-height:1.5"><b>Passo 1:</b> crie os alarmes prioritários no Relógio com som audível. <b>Passo 2:</b> no Relógio, configure os 3 horários de trabalho: 08h, 08h30 e 16h, repetição de segunda a sexta, Som = Nenhum, vibração diferente de Nenhuma. Teste no iPhone. <b>Alternativa:</b> o arquivo .ics de trabalho pode ser importado no Calendário, com som desligado e resposta tátil ativada, mas não obriga o aparelho a vibrar. Não use os dois métodos no mesmo horário.</p>':
 '<p>Importe o cronograma privado V39 para gerar alarmes e avisos do trabalho.</p>')+
 '<p style="color:#b7d5df;font-size:11px">A lista é gerada localmente. O site não envia sua agenda a servidores nem ativa alarmes de forma remota.</p>';
}
document.addEventListener("change",e=>{
 if(e.target.id!=="tf40-days")return;
 settings.days=[12,30,100].includes(Number(e.target.value))?Number(e.target.value):12;
 localStorage.setItem("totalfocus100.alerts.v40",JSON.stringify(settings));const p=document.querySelector("#tf40-alerts");if(p)p.dataset.signature="";box();
});
document.addEventListener("click",async e=>{
 const id=e.target?.closest?.("button")?.id;if(!["tf40-copy","tf40-text","tf40-vibration","tf40-ics"].includes(id))return;
 const {alarms,vibrations}=events();
 if(id==="tf40-ics"){if(!vibrations.length)return alert("Nenhum aviso do expediente no período.");download(icsText(vibrations),"TOTAL_FOCUS_100_SOMENTE_TRABALHO_SEM_SOM.ics","text/calendar;charset=utf-8");return;}
 const text=alarmText(alarms);
 if(id==="tf40-text"){download(text,"TOTAL_FOCUS_100_ALARMES_IMPORTANTES.txt","text/plain;charset=utf-8");return;}
 if(id==="tf40-vibration"){download(vibrationText(vibrations),"TOTAL_FOCUS_100_ALARMES_SO_VIBRACAO.txt","text/plain;charset=utf-8");return;}
 try{await navigator.clipboard.writeText(text);alert("Lista copiada. Abra o Relógio e crie os alarmes prioritários.");}
 catch{download(text,"TOTAL_FOCUS_100_ALARMES_IMPORTANTES.txt","text/plain;charset=utf-8");}
});
let queued=false;const refresh=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;box()})};
const main=document.querySelector(ROOT);if(main)new MutationObserver(refresh).observe(main,{childList:true});
window.addEventListener("tf-remote-update",refresh);
window.TF40_ALERTS={version:"40.1",events,alarmText,vibrationText,icsText};
refresh();
})();