/* TOTAL FOCUS GAME V18 — navegação com telas reais e sem dados de demonstração */
(()=>{"use strict";
const DK="totalfocus100.private.dataset.v1",SK="totalfocus100.v1",MK="totalfocus100.v18.modes";
const $=(q,r=document)=>r.querySelector(q);
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}};
const write=(k,x)=>{try{localStorage.setItem(k,JSON.stringify(x));return true}catch{alert("Sem espaço no armazenamento. Faça backup antes de continuar.");return false}};
const date=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")};
const plus=(s,n)=>{const d=new Date(s+"T12:00:00");d.setDate(d.getDate()+n);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")};
const fmt=s=>s?s.split("-").reverse().join("/"):"—",week=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const millis=s=>new Date(s+"T12:00:00").getTime();
const colors={Treino:"#45f2a5",Cardio:"#3ee7ea",Shiro:"#ffd568",Empresa:"#e1bc49",PMERJ:"#ad8eff","Inglês":"#7dabff",Igreja:"#f7b065",Família:"#e695cd",Sono:"#957bfa",Lazer:"#85b6f3"};
const cats=["Treino","Cardio","Shiro","Empresa","PMERJ","Inglês","Família","Lazer"],icon={Treino:"⚡",Cardio:"◉",Shiro:"♧",Empresa:"▣",PMERJ:"▤","Inglês":"♢",Família:"♡",Lazer:"☀",Igreja:"✦"};
let active="today",agendaMode="week",selected="",sleepTab="sono",metricsTab="resumo",quoteFilter="hoje",trainingFilter="todos",focus={started:0,elapsed:0,run:false},focusTick=null;
function base(){const d=read(DK),s=read(SK)||{};if(!d?.tasks?.length)return null;let tasks=d.tasks.map(t=>({...t,...(s.overrides?.[t.id]||{})}));return {d,s,tasks}}
function valid(t){return t.priority==="flex"&&!t.meta?.optional}
function done(s,t){return s.statuses?.[t.id]==="feito"}
function updateLocal(s){if(!write(SK,s))return;window.dispatchEvent(new Event("tf-remote-update"))}
function taskRow(t,s){const isDone=done(s,t),status=s.statuses?.[t.id]||"pendente",color=colors[t.category]||"#71d2e4",button=t.priority==="flex";
 return '<div class="tf18-event" data-done="'+isDone+'"><div class="time">'+esc(t.time)+'</div><div class="event-body" style="--tcolor:'+color+'"><strong>'+esc(t.title)+'</strong><small>'+esc(t.category)+' · '+(isDone?"✓ Concluído":esc(status))+'</small></div>'+(button?'<button class="event-action" data-do="view" data-id="'+esc(t.id)+'">Abrir ›</button>':'<span class="event-action">●</span>')+'</div>'}
function top(title,caption,extra=""){return '<div class="tf18-pagehead"><div><small>◈ TOTAL FOCUS 100</small><h1>'+title+'</h1></div>'+extra+'</div>'}
function tabs(key,items,value){return '<div class="tf18-segments">'+items.map(([k,name])=>'<button type="button" data-tf18-'+key+'="'+k+'" aria-pressed="'+(k===value)+'">'+name+'</button>').join("")+'</div>'}
function eventsFor(tasks,dt){return tasks.filter(t=>t.date===dt).sort((a,b)=>String(a.time).localeCompare(String(b.time)))}
function minTime(t){return Number(t.slice(0,2))*60+Number(t.slice(3,5))}
function dateToday(d){const t=date();return t<d.start?d.start:t>d.end?d.end:t}
function calendar(){
 const m=$("#main"),u=base();if(!u||!m)return;
 const {d,s,tasks}=u;if(!selected||selected<d.start||selected>d.end)selected=dateToday(d);
 let html='<section data-tf18-screen="agenda" class="tf18-screen">'+top("Minha Agenda","",'<button data-tf18="add" class="tf18-iconbtn" aria-label="Adicionar atividade">＋</button>')+
 tabs("agenda",[["week","Semana"],["month","Mês"],["cycle","Ciclo"]],agendaMode);
 const selectedDate=new Date(selected+"T12:00:00"),weekday=selectedDate.getDay();
 if(agendaMode==="week"){
  const monday=plus(selected,weekday===0?-6:1-weekday);
  html+='<div class="tf18-card"><div class="tf18-weekhead"><button class="tf18-iconbtn" data-tf18="shiftweek" data-n="-7">‹</button><strong>'+fmt(monday)+' — '+fmt(plus(monday,6))+'</strong><button class="tf18-iconbtn" data-tf18="shiftweek" data-n="7">›</button></div><div class="tf18-weekstrip">';
  for(let i=0;i<7;i++){const dt=plus(monday,i),count=eventsFor(tasks,dt).length;
   html+='<button aria-pressed="'+(selected===dt)+'" data-tf18-date="'+dt+'" '+(dt<d.start||dt>d.end?'disabled':'')+'><span>'+week[(i+1)%7]+'</span><b>'+dt.slice(8)+'</b><span>'+count+' itens</span></button>'}
  html+='</div></div>';
 }else if(agendaMode==="month"){
  const year=selectedDate.getFullYear(),month=selectedDate.getMonth(),first=new Date(year,month,1),total=new Date(year,month+1,0).getDate();
  const startOffset=first.getDay(),monthTitle=first.toLocaleDateString("pt-BR",{month:"long",year:"numeric"});
  html+='<div class="tf18-card"><div class="tf18-weekhead"><button class="tf18-iconbtn" data-tf18="shiftmonth" data-n="-1">‹</button><strong>'+esc(monthTitle)+'</strong><button class="tf18-iconbtn" data-tf18="shiftmonth" data-n="1">›</button></div><div class="tf18-gridcalendar">';
  for(let j=0;j<startOffset;j++)html+='<span></span>';
  for(let j=1;j<=total;j++){const dt=[year,String(month+1).padStart(2,"0"),String(j).padStart(2,"0")].join("-"),t=eventsFor(tasks,dt),sig=t.slice(0,3).map(x=>'<i style="--color:'+(colors[x.category]||"#53d7e3")+'"></i>').join("");
   html+='<button class="tf18-cal-day" aria-selected="'+(selected===dt)+'" data-tf18-date="'+dt+'" '+(dt<d.start||dt>d.end?'disabled':'')+'><b>'+j+'</b><span class="tf18-signal">'+sig+'</span><small>'+t.length+'</small></button>'}
  html+='</div></div>';
 }else{
  const cycle=Math.min(9,Math.ceil((millis(selected)-millis(d.start)+86400000)/86400000/12)),from=plus(d.start,(cycle-1)*12),to=plus(d.start,Math.min(99,cycle*12-1)),arr=tasks.filter(t=>t.date>=from&&t.date<=to&&valid(t)),ok=arr.filter(t=>done(s,t)).length,pct=arr.length?Math.round(100*ok/arr.length):0;
  html+='<div class="tf18-card"><div class="tf18-weekhead"><button class="tf18-iconbtn" data-tf18="cycle" data-n="-1">‹</button><strong>Ciclo '+cycle+' / 9 · '+fmt(from)+' — '+fmt(to)+'</strong><button class="tf18-iconbtn" data-tf18="cycle" data-n="1">›</button></div><div class="tf18-counters"><div class="tf18-counter"><b>'+ok+'</b><span>Feitas</span></div><div class="tf18-counter"><b>'+Math.max(0,arr.length-ok)+'</b><span>Pendentes</span></div><div class="tf18-counter"><b>'+pct+'%</b><span>Progresso</span></div></div><div class="tf18-cycle-track" style="margin-top:13px"><i style="width:'+pct+'%"></i></div><div class="tf18-weekstrip" style="grid-template-columns:repeat(6,1fr)">';
  for(let i=0;i<=Math.round((millis(to)-millis(from))/86400000);i++){const dt=plus(from,i);html+='<button aria-pressed="'+(selected===dt)+'" data-tf18-date="'+dt+'"><span>'+week[new Date(dt+"T12:00:00").getDay()]+'</span><b>'+dt.slice(8)+'</b></button>'}
  html+='</div></div>';
 }
 const events=eventsFor(tasks,selected);
 html+='<div class="tf18-card"><h2>▦ '+fmt(selected)+' <span style="float:right;color:#6cf1dd;font-size:11px">'+events.length+' eventos</span></h2><div class="tf18-events">'+(events.length?events.map(t=>taskRow(t,s)).join(""):'<p class="tf18-state">Nenhum compromisso programado.</p>')+'</div></div><div class="tf18-card"><div class="tf18-actions"><button data-tf18="add" class="gold">＋ Nova atividade</button><button data-tf18-mode="travel">✈ Modo viagem</button></div></div></section>';
 m.innerHTML=html;
}
function training(){
 const m=$("#main"),u=base();if(!u||!m)return;const {d,s,tasks}=u,today=dateToday(d),training=tasks.filter(t=>t.category==="Treino"||t.category==="Cardio"),filtered=training.filter(t=>trainingFilter==="todos"||(trainingFilter==="casa"&&t.category==="Treino")||(trainingFilter==="corrida"&&t.category==="Cardio"&&t.meta?.kind==="run")||(trainingFilter==="bike"&&t.category==="Cardio"&&/bike|bicic/i.test(t.title+" "+JSON.stringify(t.meta||{})))),incoming=filtered.filter(t=>t.date>=today&&!done(s,t)).slice(0,12),finished=training.filter(t=>done(s,t)),push=training.filter(t=>t.category==="Treino"&&done(s,t)).length;
 const catsMove={Treino:"⚡",Cardio:"◉"};
 const blocks=incoming.map(t=>'<button class="tf18-gallery-card" data-do="view" data-id="'+esc(t.id)+'" style="display:flex;gap:10px;width:100%;margin:8px 0;background:#0e2c43;border:1px solid #2d748d;padding:9px;border-radius:13px;text-align:left;align-items:center"><span class="tf18-art" style="width:70px;height:70px;flex-shrink:0;display:grid;place-items:center;border-radius:9px;background:#135466;font-size:35px">'+(catsMove[t.category]||"✦")+'</span><span style="flex:1;min-width:0"><strong style="font-size:13px;color:#f5ffff;display:block">'+esc(t.title)+'</strong><small style="display:block;color:#ade1e5;font-size:11px;margin:6px 0">'+fmt(t.date)+' · '+esc(t.time)+'</small><small style="color:#ffda89;font-size:11px">'+(t.category==="Treino"?"10 minutos guiados":esc(t.description||"Cardio progressivo").slice(0,58))+'</small></span><span style="color:#3beadd;font-size:20px">▶</span></button>').join("");
 m.innerHTML='<section data-tf18-screen="training" class="tf18-screen">'+top("Meu Treino","",'<span style="color:#ffde86;font-weight:900">⚡</span>')+tabs("training",[["todos","Todos"],["casa","Em casa"],["corrida","Corrida"],["bike","Bicicleta"]],trainingFilter)+'<div class="tf18-card" style="border-color:#43e8d6"><div class="tf18-kicker" style="color:#8bfcf0;font-size:11px">MISSÃO FÍSICA</div><h2 style="font-size:22px;margin:9px 0">Força, resistência e recuperação</h2><p class="tf18-state">Sessões de 10 minutos em casa, corridas e bicicleta conforme seu cronograma. Evite treinar com dor incomum.</p><div class="tf18-counters"><div class="tf18-counter"><b>'+push+'</b><span>Treinos físicos</span></div><div class="tf18-counter"><b>'+finished.length+'</b><span>Sessões feitas</span></div><div class="tf18-counter"><b>'+training.length+'</b><span>Programadas</span></div></div></div><div class="tf18-card"><h2>Próximas sessões</h2>'+(blocks||'<p class="tf18-state">Sem novas sessões programadas.</p>')+'</div><div class="tf18-card"><h2>Guias de execução</h2><p class="tf18-state">Abra uma sessão para consultar repetições, músculos trabalhados, técnica e iniciar o treinador narrado.</p><button data-tf18-page="metrics" class="primary" style="width:100%">Ver minha evolução</button></div></section>'
}
function quotations(){
 const m=$("#main"),u=base();if(!u||!m)return;
 const {d,s,tasks}=u,now=new Date(),today=date(),arr=tasks.filter(t=>t.category==="Empresa"&&t.meta?.kind==="cotacao").sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)),closest=arr.find(t=>{const end=new Date(t.date+"T"+t.end+":00");return end>now})||arr.at(-1);
 const activeNow=closest&&now>=new Date(closest.date+"T"+closest.time+":00")&&now<new Date(closest.date+"T"+closest.end+":00"),q=closest?s.quoteTimers?.[closest.id]||{}:{},ms=(Number(q.ms)||0)+(q.since&&activeNow?Math.max(0,now-q.since):0),seconds=Math.floor(ms/1000);
 const hrs=String(Math.floor(seconds/3600)).padStart(2,"0"),minutes=String(Math.floor((seconds%3600)/60)).padStart(2,"0"),secs=String(seconds%60).padStart(2,"0");
 const validQuote=arr.filter(t=>s.quotes?.[t.id]||s.quoteTimers?.[t.id]),effective=arr.reduce((sum,t)=>sum+(Number(s.quoteTimers?.[t.id]?.ms)||0),0)/3600000;
 const list=arr.filter(t=>quoteFilter==="hoje"?t.date===today:quoteFilter==="proximas"?t.date>=today:!!s.quotes?.[t.id]||!!s.quoteTimers?.[t.id]).slice(0,25).map(t=>taskRow(t,s)).join("");
 m.innerHTML='<section data-tf18-screen="quotes" class="tf18-screen">'+top("Cotações — SHIRO","",'<span style="font-size:20px">▣</span>')+tabs("quotes",[["hoje","Hoje"],["proximas","Próximas"],["historico","Histórico"]],quoteFilter)+'<div class="tf18-card" style="border-color:#33cedb"><div style="text-align:center;color:#77f1e6;font-size:12px;font-weight:850">'+(activeNow?"EM JANELA DE TRABALHO":"PRÓXIMA JANELA DE COTAÇÃO")+'</div><div class="tf18-quote-ring"><div><span>'+ (closest?fmt(closest.date)+" "+closest.time+"–"+closest.end:"Sem janela") +'</span><strong>'+hrs+':'+minutes+':'+secs+'</strong><span>tempo efetivo registrado</span></div></div><h2 style="text-align:center">'+(closest?esc(closest.title):"Sem cotação agendada")+'</h2><div class="tf18-actions">'+(closest?'<button class="start" data-do="view" data-id="'+esc(closest.id)+'">▶ Abrir cronômetro</button><button class="stop" data-tf18="quote-details" data-id="'+esc(closest.id)+'">▤ Detalhes</button>':'')+'</div><p class="tf18-note" style="font-size:11px;color:#b2cbd6;margin-top:13px;text-align:center">O temporizador funciona somente na janela planejada e desconta pausas. Conclusão depende de confirmação.</p></div><div class="tf18-counters"><div class="tf18-counter"><b>'+effective.toFixed(1).replace(".",",")+'h</b><span>Tempo efetivo salvo</span></div><div class="tf18-counter"><b>'+validQuote.length+'</b><span>Janelas registradas</span></div><div class="tf18-counter"><b>'+arr.filter(t=>s.statuses?.[t.id]==="feito").length+'</b><span>Concluídas</span></div></div><div class="tf18-card"><h2>Janelas de trabalho</h2><div class="tf18-events">'+(list||'<p class="tf18-state">Nenhuma janela neste filtro.</p>')+'</div></div><div class="tf18-notice">A conclusão de uma cotação não é determinada apenas pelo tempo trabalhado. Não registre trabalho privado durante o expediente público.</div></section>';
}
function more(){
 const m=$("#main");if(!m)return;
 const choices=[["metrics","▥","Desempenho e Evolução","Gráficos, indicadores, hábitos e planilhas"],["awards","✦","Conquistas e Níveis","XP, medalhas e desafios"],["sleep","☾","Sono e Recuperação","Sono, energia e descanso"],["modes","◈","Modos Especiais","Viagem, família, foco e dia livre"],["config","⚙","Configurações e Backup","Google Drive, segurança, avisos e ajustes"],["focus","✧","FOCUS AI","Comandos locais e ditado por voz"]];
 m.innerHTML='<section data-tf18-screen="more" class="tf18-screen">'+top("Mais","",'<span style="font-size:22px;color:#ffd56f">✦</span>')+'<div class="tf18-card"><div class="tf18-listnav">'+choices.map(([id,g,label,desc])=>'<button data-tf18-page="'+id+'"><span class="glyph">'+g+'</span><span class="label"><strong>'+label+'</strong><small>'+desc+'</small></span><span class="arrow">›</span></button>').join("")+'</div></div><p class="tf18-state">Os dados são mantidos no seu aparelho enquanto a sincronização Google não estiver ativada.</p></section>'
}
function awards(){
 const m=$("#main"),u=base();if(!m||!u)return;
 const {d,s,tasks}=u,flex=tasks.filter(valid),completed=flex.filter(t=>done(s,t)),award={Treino:22,Cardio:35,Shiro:28,PMERJ:25,"Inglês":17,Empresa:15},xp=completed.reduce((z,t)=>z+(award[t.category]||10),0),level=1+Math.floor(Math.sqrt(xp/220)),threshold=n=>Math.ceil(220*n*n),currentLevelXp=threshold(level-1),nextLevelXp=threshold(level),percent=Math.min(100,Math.max(0,Math.round(100*(xp-currentLevelXp)/(nextLevelXp-currentLevelXp||1))));
 const walkDates=[];for(let dt=d.start;dt<=d.end&&dt<=date();dt=plus(dt,1)){const arr=flex.filter(t=>t.date===dt);if(arr.length)walkDates.push({dt,ok:arr.every(t=>done(s,t))})}
 let best=0,run=0;for(const x of walkDates){run=x.ok?run+1:0;best=Math.max(best,run)}
 const runs=completed.filter(t=>t.category==="Cardio"&&t.meta?.kind==="run").length,dogs=completed.filter(t=>t.category==="Shiro").length,physical=completed.filter(t=>t.category==="Treino").length,studies=completed.filter(t=>t.category==="PMERJ").length,quotes=completed.filter(t=>t.category==="Empresa").length;
 const badges=[["✦","7 dias seguidos",best>=7,best+"/7 dias"],["↗","Mestre da Corrida",runs>=10,runs+"/10 corridas"],["⚡","Disciplina no Treino",physical>=30,physical+"/30 treinos"],["♧","Parceiro do Shiro",dogs>=20,dogs+"/20 sessões"],["▤","Estudante dedicado",studies>=30,studies+"/30 estudos"],["▣","Foco nas Licitações",quotes>=20,quotes+"/20 cotações"]];
 const cards=badges.map(([symbol,title,yes,p])=>'<div class="tf18-award '+(yes?"":"locked")+'"><span class="symbol">'+symbol+'</span><strong>'+title+'</strong><small>'+(yes?"Conquistada ✓":p)+'</small></div>').join("");
 const planned=flex.filter(t=>t.date>=d.start&&t.date<=plus(d.start,11)),ok=planned.filter(t=>done(s,t)).length;
 m.innerHTML='<section data-tf18-screen="awards" class="tf18-screen">'+top("Conquistas e Níveis","",'<button class="tf18-iconbtn" data-tf18-page="more">‹</button>')+'<div class="tf18-card" style="text-align:center"><img src="./icon.svg" width="106" height="106" alt="Brasão TF dourado" style="margin:0 auto 12px;filter:drop-shadow(0 0 15px #ffcb5466)"><h2 style="font-size:27px;margin:0">Nível '+level+'</h2><p style="color:#ffe1a0;font-size:12px">Guerreiro do Foco</p><div class="tf18-cycle-track"><i style="width:'+percent+'%"></i></div><p style="font-size:12px;color:#b8dbe1">'+xp+' XP totais · próximo nível em '+Math.max(0,nextLevelXp-xp)+' XP</p></div><div class="tf18-card"><h2>Medalhas e conquistas</h2><div class="tf18-award-grid">'+cards+'</div></div><div class="tf18-card"><h2>Objetivos em andamento</h2><div class="tf18-counters"><div class="tf18-counter"><b>'+physical+'/30</b><span>Treinos físicos</span></div><div class="tf18-counter"><b>'+studies+'/30</b><span>Estudos PMERJ</span></div><div class="tf18-counter"><b>'+dogs+'/20</b><span>Treinos Shiro</span></div></div></div><p class="tf18-state">Medalhas são obtidas somente por atividades realmente concluídas. Descanso e família não devem gerar punições.</p></section>';
}
function sleep(){
 const m=$("#main"),u=base();if(!m||!u)return;
 const {d,s}=u,last=Object.entries(s.checkins||{}).sort((a,b)=>a[0].localeCompare(b[0])).at(-1),n=last?Number(last[1].sleep)||0:0,energy=last?Number(last[1].energy)||0:0,pain=last?.[1].pain||"—",recorded=Object.entries(s.checkins||{}).filter(([,x])=>Number(x.sleep)>0).sort((a,b)=>a[0].localeCompare(b[0])).slice(-7),avg=recorded.length?(recorded.reduce((a,[,x])=>a+Number(x.sleep),0)/recorded.length):0;
 const today=date(),start=plus(today,-6),days=Array.from({length:7},(_,i)=>{let dt=plus(start,i),x=s.checkins?.[dt];return {dt,sleep:Number(x?.sleep)||0,energy:Number(x?.energy)||0}});
 let special="";
 if(sleepTab==="sono"){special='<div class="tf18-card"><h2>Último sono registrado</h2><div class="tf18-counters"><div class="tf18-counter"><b>'+(n?n.toFixed(1).replace(".",",")+"h":"—")+'</b><span>Horas dormidas</span></div><div class="tf18-counter"><b>'+(avg?avg.toFixed(1).replace(".",",")+"h":"—")+'</b><span>Média dos registros</span></div><div class="tf18-counter"><b>7–9h</b><span>Faixa geral adulta</span></div></div><div class="tf18-sleep-bar">'+days.map(x=>'<div><i style="height:'+Math.round(Math.min(100,x.sleep/10*100))+'%"></i><small>'+x.dt.slice(8)+'</small></div>').join("")+'</div><p class="tf18-state">Sono profundo e sono leve não são medidos pelo aplicativo. Nenhum valor será inventado.</p></div>'}
 else if(sleepTab==="energia"){special='<div class="tf18-card"><h2>Energia registrada</h2><div class="tf18-counters"><div class="tf18-counter"><b>'+(energy||"—")+'/5</b><span>Último check-in</span></div><div class="tf18-counter"><b>'+recorded.length+'</b><span>Registros de sono</span></div><div class="tf18-counter"><b>'+((n&&n<6)?"Baixa":"—")+'</b><span>Atenção ao sono</span></div></div><p class="tf18-state">Energia e horas de sono são autorrelatos, não medições por sensor.</p></div>'}
 else{special='<div class="tf18-card"><h2>Recuperação e segurança</h2><div class="tf18-notice">'+(pain==="sim"?"Foi registrada dor incomum. Evite progressão de esforço e avalie atendimento profissional.":n&&n<6?"Seu último registro indica pouco sono. Considere reduzir o esforço físico e antecipar a preparação para dormir.":"Respeite intervalos de recuperação, alimentação e períodos familiares protegidos.")+'</div></div>'}
 m.innerHTML='<section data-tf18-screen="sleep" class="tf18-screen">'+top("Sono e Recuperação","",'<button data-tf18-page="more" class="tf18-iconbtn">‹</button>')+tabs("sleep",[["sono","Sono"],["energia","Energia"],["recuperacao","Recuperação"]],sleepTab)+special+'<div class="tf18-card"><h2>Rotina de descanso</h2><div class="tf18-event" style="margin:8px 0"><div class="time">23:00</div><div class="event-body" style="--tcolor:#ac87ef"><strong>Começar a se preparar para dormir</strong><small>Adiantado quando a agenda exigir acordar cedo</small></div></div><div class="tf18-event" style="margin:8px 0"><div class="time">00:00</div><div class="event-body" style="--tcolor:#af88ff"><strong>Horário habitual de dormir</strong><small>Não substitui um despertador nativo</small></div></div><button data-tf18="sleepdialog" class="primary" style="width:100%;margin:9px 0">☾ Configurar lembretes do sono</button><button data-tf18="checkin" style="width:100%">Registrar meu sono e energia</button></div></section>';
}
function modes(){
 const m=$("#main");if(!m)return;
 const data=read(MK)||{mode:"normal",at:null};
 const options=[["travel","✈","Modo Viagem","Suspenda atividades flexíveis explicitamente, preservando compromissos fixos."],["rest","☂","Dia Livre","Visualização de descanso. Não cancela tarefas automaticamente."],["goal","◎","Meta do Ciclo","Consulte o progresso do atual ciclo de 12 dias."],["focus","◉","Modo Foco","Cronômetro concentrado de 25 minutos, com pausa."],["family","♡","Modo Família","Priorize o tempo familiar e evite distrações no aplicativo."]];
 m.innerHTML='<section data-tf18-screen="modes" class="tf18-screen">'+top("Modos Especiais","",'<button data-tf18-page="more" class="tf18-iconbtn">‹</button>')+'<p class="tf18-state">Selecione o modo que melhor combina com seu dia.</p><div class="tf18-listnav">'+options.map(([k,g,n,desc])=>'<button data-tf18-mode="'+k+'"><span class="glyph">'+g+'</span><span class="label"><strong>'+n+'</strong><small>'+desc+'</small></span><span class="arrow">'+(data.mode===k?"✓":"›")+'</span></button>').join("")+'</div><div class="tf18-card"><strong>Modo ativo: '+esc(data.mode==="normal"?"Rotina normal":options.find(x=>x[0]===data.mode)?.[2]||"Normal")+'</strong><p class="tf18-state">A ativação de um modo não altera os compromissos protegidos. Só o Modo Viagem, com sua confirmação, altera atividades flexíveis.</p><button data-tf18="clearmode">Retornar à rotina normal</button></div></section>';
}
function configMenu(){
 const m=$("#main");if(!m)return;
 m.innerHTML='<section data-tf18-screen="configMenu" class="tf18-screen">'+top("Configurações","",'<button data-tf18-page="more" class="tf18-iconbtn">‹</button>')+'<div class="tf18-listnav">'+[
 ["native-config","☁","Minha conta e sincronização","Google Drive, autorização e conflitos"],
 ["native-config","▤","Dados e backup","Exportar e restaurar cópia criptografada"],
 ["native-config","♧","Lembretes e despertadores","Alertas do Calendário e horários de acordar"],
 ["native-config","◉","Som e vibração","Efeitos sonoros e controles do iPhone"],
 ["native-config","◆","Privacidade","Dados pessoais no aparelho"],
 ["native-config","◎","Sobre o aplicativo","TOTAL FOCUS 100 — Jornada"]
 ].map(([k,g,n,t])=>'<button data-tf18-page="'+k+'"><span class="glyph">'+g+'</span><span class="label"><strong>'+n+'</strong><small>'+t+'</small></span><span class="arrow">›</span></button>').join("")+'</div></section>';
}
function openModal(inner){let dlg=$("#tf18-modal");if(!dlg){dlg=document.createElement("dialog");dlg.className="tf18-modal";dlg.id="tf18-modal";document.body.append(dlg)}
 dlg.innerHTML=inner;dlg.showModal()}
function modalAdd(){
 const u=base();if(!u)return;openModal('<h2>＋ Adicionar atividade</h2><p class="tf18-state">A atividade entra no seu cronograma privado. Conflitos com compromissos existentes serão avisados.</p><label>Nome<input id="tf18-title" maxlength="90" placeholder="Ex.: Revisar questões"></label><label>Categoria<select id="tf18-category">'+cats.map(c=>'<option value="'+esc(c)+'">'+esc(c)+'</option>').join("")+'</select></label><label>Data<input type="date" id="tf18-date" min="'+u.d.start+'" max="'+u.d.end+'" value="'+selected+'"></label><div class="tf18-actions"><label>Início<input type="time" id="tf18-start" value="18:00"></label><label>Duração (min)<input type="number" id="tf18-duration" min="5" max="240" value="30"></label></div><div class="buttons"><button class="primary" data-tf18="save-activity">Adicionar</button><button data-tf18="closemodal">Cancelar</button></div>');
}
function saveActivity(){
 const u=base();if(!u)return;const title=$("#tf18-title")?.value.trim(),category=$("#tf18-category")?.value,dt=$("#tf18-date")?.value,start=$("#tf18-start")?.value,duration=Number($("#tf18-duration")?.value);
 if(!title||title.length>90||!cats.includes(category)||dt<u.d.start||dt>u.d.end||!/^\d\d:\d\d$/.test(start)||!Number.isFinite(duration)||duration<5||duration>240){alert("Preencha nome, data, horário e duração válida.");return}
 const total=minTime(start)+duration;if(total>=1440){alert("A atividade não pode ultrapassar a meia-noite.");return}
 const end=String(Math.floor(total/60)).padStart(2,"0")+":"+String(total%60).padStart(2,"0");
 const conflicts=eventsFor(u.tasks,dt).filter(t=>total>minTime(t.time)&&minTime(start)<minTime(t.end||t.time));
 if(conflicts.length&&!confirm("Há conflito com "+conflicts.slice(0,3).map(t=>t.title).join(", ")+". Adicionar mesmo assim?"))return;
 u.d.tasks.push({id:"user-"+Date.now()+"-"+Math.floor(Math.random()*9999),title,description:"Atividade adicionada pelo usuário.",category,date:dt,time:start,end,priority:"flex",meta:{userCreated:true}});
 if(!write(DK,u.d))return;$("#tf18-modal")?.close();window.dispatchEvent(new Event("tf-remote-update"));selected=dt;calendar()
}
function recordCheckin(){
 const u=base();if(!u)return;const x=u.s.checkins?.[date()]||{};
 openModal('<h2>☾ Check-in diário</h2><label>Horas de sono<input id="tf18-checksleep" type="number" min="0" max="15" step="0.5" value="'+esc(x.sleep||"7")+'"></label><label>Energia (1–5)<input id="tf18-checkenergy" type="number" min="1" max="5" value="'+esc(x.energy||3)+'"></label><label>Dor incomum?<select id="tf18-checkpain"><option value="nao">Não</option><option value="sim" '+(x.pain==="sim"?"selected":"")+'>Sim</option></select></label><div class="buttons"><button class="primary" data-tf18="savecheck">Salvar</button><button data-tf18="closemodal">Cancelar</button></div>');
}
function saveCheck(){
 const u=base();if(!u)return;const sleep=Number($("#tf18-checksleep")?.value),energy=Number($("#tf18-checkenergy")?.value),pain=$("#tf18-checkpain")?.value;
 if(!Number.isFinite(sleep)||sleep<0||sleep>15||!Number.isInteger(energy)||energy<1||energy>5){alert("Informe horas de sono e energia válidas.");return}
 u.s.checkins=u.s.checkins||{};u.s.checkins[date()]={sleep,energy,pain};updateLocal(u.s);$("#tf18-modal")?.close();if(active==="sleep")sleepView()
}
function sleepView(){sleep()}
function applyMode(k){
 if(k==="goal"){activate("awards");return}
 if(k==="focus"){focusMenu();return}
 if(k==="travel"){
  const u=base();if(!u)return;const start=prompt("Início da viagem (AAAA-MM-DD):",date());if(!start)return;const end=prompt("Fim da viagem (AAAA-MM-DD):",start);if(!end||start>end||start<u.d.start||end>u.d.end){alert("Período inválido.");return}
  const items=u.tasks.filter(t=>valid(t)&&t.date>=start&&t.date<=end&&!["feito","cancelado"].includes(u.s.statuses?.[t.id]));
  if(!confirm("Cancelar "+items.length+" missões flexíveis entre "+fmt(start)+" e "+fmt(end)+"? Compromissos fixos serão preservados. Faça backup antes."))return;
  u.s.undo=JSON.stringify({statuses:{...u.s.statuses},overrides:{...u.s.overrides}});u.s.statuses=u.s.statuses||{};for(const t of items)u.s.statuses[t.id]="cancelado";updateLocal(u.s);
 }
 let previousSound=null;if(k==="family"){const u=base();if(u){u.s.settings=u.s.settings||{};previousSound=u.s.settings.sound!==false;u.s.settings.sound=false;updateLocal(u.s)}}
 write(MK,{mode:k,at:new Date().toISOString(),previousSound});modes();
}
function focusMenu(){
 const u=base();if(!u)return;active="focusTimer";paint();
}
function focusView(){
 const m=$("#main");if(!m)return;
 m.innerHTML='<section data-tf18-screen="focusTimer" class="tf18-screen">'+top("Modo Foco","",'<button data-tf18-page="modes" class="tf18-iconbtn">‹</button>')+'<div class="tf18-card" style="text-align:center"><div class="tf18-quote-ring"><div><span>CONTAGEM REGRESSIVA</span><strong id="tf18-focusclock">25:00</strong><span>sessão pessoal</span></div></div><div class="tf18-actions"><button data-tf18="focusplay" class="start">▶ Iniciar / Pausar</button><button data-tf18="focusreset" class="stop">■ Reiniciar</button></div><p class="tf18-state">Este cronômetro não marca missões como concluídas nem funciona como despertador com a tela bloqueada.</p></div></section>';
 showClock()
}
function showClock(){
 const el=$("#tf18-focusclock");if(!el)return;const now=focus.elapsed+(focus.run?Date.now()-focus.started:0),remain=Math.max(0,1500000-now);if(remain===0){focus.run=false;focus.elapsed=1500000}
 el.textContent=String(Math.floor(remain/60000)).padStart(2,"0")+":"+String(Math.ceil(remain%60000/1000)).padStart(2,"0")
}
function activate(page){
 active=page;
 if(!read(DK)){return}
 if(["today","shiro","metrics","focus","native-config"].includes(page)){
  const native=page==="metrics"?"progress":page==="native-config"?"config":page;
  const b=$("#tf18-proxy [data-page='"+native+"']");if(b)b.click();
  if(page==="metrics"){requestAnimationFrame(enhanceMetrics)}
 }else{const b=$("#tf18-proxy [data-page='today']");if(b)b.click();paint()}
 navActive()
}
function navActive(){
 document.querySelectorAll(".tf18-nav").forEach(b=>b.classList.toggle("current",b.dataset.tf18Page===active||active==="metrics"&&b.dataset.tf18Page==="more"||["awards","sleep","modes","config","native-config","focus","focusTimer"].includes(active)&&b.dataset.tf18Page==="more"))
}
function paint(){
 const m=$("#main");if(!m||!read(DK))return;
 if(active==="agenda"&&!m.querySelector('[data-tf18-screen="agenda"]'))calendar();
 if(active==="training"&&!m.querySelector('[data-tf18-screen="training"]'))training();
 if(active==="quotes"&&!m.querySelector('[data-tf18-screen="quotes"]'))quotations();
 if(active==="more"&&!m.querySelector('[data-tf18-screen="more"]'))more();
 if(active==="awards"&&!m.querySelector('[data-tf18-screen="awards"]'))awards();
 if(active==="sleep"&&!m.querySelector('[data-tf18-screen="sleep"]'))sleepView();
 if(active==="modes"&&!m.querySelector('[data-tf18-screen="modes"]'))modes();
 if(active==="config"&&!m.querySelector('[data-tf18-screen="configMenu"]'))configMenu();
 if(active==="focusTimer"&&!m.querySelector('[data-tf18-screen="focusTimer"]'))focusView();
 if(active==="metrics")enhanceMetrics();
 navActive()
}
function enhanceMetrics(){
 const m=$("#main"),dashboard=m?.querySelector(".tf17-dash");if(!dashboard)return;
 if(!m.querySelector(".tf18-metric-tabs")){
 const bar=document.createElement("section");bar.className="tf18-metric-tabs";bar.innerHTML=tabs("mtab",[["resumo","Resumo"],["habitos","Hábitos"],["saude","Saúde"],["estudos","Estudos"],["trabalho","Trabalho"]],metricsTab);
 dashboard.prepend(bar)}
 dashboard.querySelectorAll("[data-tf18-mtab]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.tf18Mtab===metricsTab)));
 const blocks=[...dashboard.querySelectorAll(".tf17-card")];blocks.forEach(x=>x.style.display=metricsTab==="resumo"?"":"none");
 let extra=$("#tf18-metric-extra");
 if(!extra){extra=document.createElement("section");extra.id="tf18-metric-extra";dashboard.insertBefore(extra,blocks[0]||null)}
 if(metricsTab==="resumo"){extra.innerHTML="";return}
 const u=base();if(!u)return;
 const complete=t=>done(u.s,t),items=u.tasks.filter(valid),count=(filter)=>{let a=items.filter(filter);return [a.filter(complete).length,a.length]};
 const note='<p class="tf18-state">Indicadores calculados com seus registros, sem dados fictícios.</p>';
 if(metricsTab==="habitos"){
  const d=u.d,days=Array.from({length:12},(_,i)=>plus(date()>d.end?d.end:date()<d.start?plus(d.start,11):date(),i-11)),bars=days.map(dt=>{let arr=eventsFor(items,dt),ok=arr.filter(complete).length,p=arr.length?Math.round(100*ok/arr.length):0;return '<div><small>'+dt.slice(8)+'</small><div class="tf18-habit-spot" style="background:'+(p===100?"#40e6bb":p>0?"#1f8097":"#15314a")+';border-radius:7px;height:38px;display:grid;place-items:center;color:#fff">'+p+'%</div></div>'}).join("");
  extra.innerHTML='<div class="tf18-metric-info"><h2>Constância nos últimos 12 dias</h2><div style="display:grid;grid-template-columns:repeat(6,1fr);gap:7px">'+bars+'</div>'+note+'</div>'
 }else if(metricsTab==="saude"){
  const weights=u.s.weights||[],check=Object.entries(u.s.checkins||{}).sort((a,b)=>a[0].localeCompare(b[0])).slice(-7),last=weights.at(-1);
  extra.innerHTML='<div class="tf18-metric-info"><h2>Saúde e recuperação</h2><div class="tf18-counters"><div class="tf18-counter"><b>'+esc(last?.kg||u.d.weightKg||"—")+'</b><span>Peso registrado (kg)</span></div><div class="tf18-counter"><b>'+check.length+'</b><span>Check-ins recentes</span></div><div class="tf18-counter"><b>'+count(t=>t.category==="Cardio")[0]+'</b><span>Cardios feitos</span></div></div><p class="tf18-state">Fases de sono e frequência cardíaca não são medidas.</p><button data-tf18-page="sleep" class="primary">Abrir Sono e Recuperação</button></div>'
 }else if(metricsTab==="estudos"){
  const pm=count(t=>t.category==="PMERJ"),eng=count(t=>t.category==="Inglês");
  extra.innerHTML='<div class="tf18-metric-info"><h2>Estudos e preparação</h2><div class="tf18-counters"><div class="tf18-counter"><b>'+pm[0]+'/'+pm[1]+'</b><span>PMERJ</span></div><div class="tf18-counter"><b>'+eng[0]+'/'+eng[1]+'</b><span>Inglês</span></div><div class="tf18-counter"><b>'+(pm[0]+eng[0])+'</b><span>Sessões realizadas</span></div></div><p class="tf18-state">Sessões concluídas não equivalem a desempenho nas questões. Registre acertos e erros em suas revisões.</p></div>'
 }else{
  const quote=count(t=>t.category==="Empresa"),time=items.reduce((n,t)=>n+(t.category==="Empresa"?Number(u.s.quoteTimers?.[t.id]?.ms||0):0),0)/3600000;
  extra.innerHTML='<div class="tf18-metric-info"><h2>Licitações e produtividade</h2><div class="tf18-counters"><div class="tf18-counter"><b>'+quote[0]+'/'+quote[1]+'</b><span>Blocos concluídos</span></div><div class="tf18-counter"><b>'+time.toFixed(1).replace(".",",")+'h</b><span>Tempo trabalhado</span></div><div class="tf18-counter"><b>'+quote[1]+'</b><span>Janelas programadas</span></div></div><button data-tf18-page="quotes" class="primary" style="margin-top:11px;width:100%">Abrir cronômetro SHIRO</button></div>'
 }
}
const navMarkup=[
 ["today","⌂","Início"],["agenda","▦","Agenda"],["training","⚡","Treinos"],["shiro","♧","Shiro"],["quotes","▣","Cotações"],["more","☷","Mais"]
];
function setupNav(){
 const nav=$("#nav");if(!nav||nav.querySelector(".tf18-nav"))return;
 const proxy=document.createElement("div");proxy.id="tf18-proxy";proxy.style.display="none";for(const p of ["today","agenda","shiro","progress","focus","config"]){const b=document.createElement("button");b.dataset.page=p;proxy.append(b)}
 nav.innerHTML=navMarkup.map(([id,g,name])=>'<button class="tf18-nav '+(id==="today"?"current":"")+'" data-tf18-page="'+id+'" aria-label="'+name+'"><span class="tf18-nav-icon">'+g+'</span><span>'+name+'</span></button>').join("");
 nav.append(proxy);
}
document.addEventListener("click",e=>{
 const b=e.target.closest("[data-tf18-page],[data-tf18],[data-tf18-agenda],[data-tf18-sleep],[data-tf18-quotes],[data-tf18-mtab],[data-tf18-date],[data-tf18-mode]");
 if(!b)return;
 if(b.dataset.tf18Page){activate(b.dataset.tf18Page);return}
 if(b.dataset.tf18Agenda){agendaMode=b.dataset.tf18Agenda;calendar();return}
 if(b.dataset.tf18Training){trainingFilter=b.dataset.tf18Training;training();return}
 if(b.dataset.tf18Sleep){sleepTab=b.dataset.tf18Sleep;sleepView();return}
 if(b.dataset.tf18Quotes){quoteFilter=b.dataset.tf18Quotes;quotations();return}
 if(b.dataset.tf18Mtab){metricsTab=b.dataset.tf18Mtab;enhanceMetrics();return}
 if(b.dataset.tf18Date){selected=b.dataset.tf18Date;calendar();return}
 if(b.dataset.tf18Mode){applyMode(b.dataset.tf18Mode);return}
 const op=b.dataset.tf18;
 if(op==="add")modalAdd();
 if(op==="save-activity")saveActivity();
 if(op==="closemodal")$("#tf18-modal")?.close();
 if(op==="shiftweek"){const u=base();const d=plus(selected,Number(b.dataset.n));if(u){selected=d<u.d.start?u.d.start:d>u.d.end?u.d.end:d}calendar()}
 if(op==="shiftmonth"){const dt=new Date(selected+"T12:00:00");dt.setMonth(dt.getMonth()+Number(b.dataset.n));const u=base();let d=plus([dt.getFullYear(),String(dt.getMonth()+1).padStart(2,"0"),"01"].join("-"),0);selected=d<u.d.start?u.d.start:d>u.d.end?u.d.end:d;calendar()}
 if(op==="cycle"){const u=base();if(!u)return;const cycle=Math.min(9,Math.max(1,Math.ceil((millis(selected)-millis(u.d.start)+86400000)/86400000/12)+Number(b.dataset.n)));selected=plus(u.d.start,(cycle-1)*12);calendar()}
 if(op==="quote-details"){const id=b.dataset.id;const btn=document.createElement("button");btn.dataset.do="view";btn.dataset.id=id;document.body.append(btn);btn.click();btn.remove()}
 if(op==="sleepdialog"){const btn=$("#sleep-open");if(btn)btn.click();else alert("Módulo de sono ainda não está disponível.")}
 if(op==="checkin")recordCheckin();
 if(op==="savecheck")saveCheck();
 if(op==="clearmode"){const md=read(MK)||{};if(md.mode==="family"&&typeof md.previousSound==="boolean"){const u=base();if(u){u.s.settings=u.s.settings||{};u.s.settings.sound=md.previousSound;updateLocal(u.s)}}write(MK,{mode:"normal",at:new Date().toISOString()});modes()}
 if(op==="focusplay"){if(focus.run){focus.elapsed+=Date.now()-focus.started;focus.run=false}else if(focus.elapsed<1500000){focus.run=true;focus.started=Date.now()}showClock()}
 if(op==="focusreset"){focus={started:0,elapsed:0,run:false};showClock()}
});
document.addEventListener("visibilitychange",()=>{if(document.hidden&&focus.run){focus.elapsed+=Date.now()-focus.started;focus.run=false}});
let busy=false;const main=$("#main");
function cyclePaint(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;if($("#shell")?.classList.contains("hidden"))return;setupNav();paint()})}
if(main)new MutationObserver(cyclePaint).observe(main,{childList:true});
window.addEventListener("pageshow",cyclePaint);
window.addEventListener("tf-remote-update",cyclePaint);
focusTick=setInterval(()=>{if(active==="focusTimer"&&focus.run)showClock()},500);
setupNav();cyclePaint();
})();