/* TOTAL FOCUS V14: lembretes locais para Calendario. Sem backend ou API paga. */
(()=>{"use strict";
const DK="totalfocus100.private.dataset.v1",SK="totalfocus100.v1",PK="totalfocus100.calendar.v14";
const cats=["Treino","Cardio","Shiro","Empresa","PMERJ","Inglês","Igreja","Família","Lazer","Trabalho","Rotina","Deslocamento"];
const def={cats:cats.slice(0,7),lead:10,days:12,discreet:true};
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}};
let cfg={...def,...(read(PK)||{})};
const $=(s,r=document)=>r.querySelector(s);
const date=()=>{const d=new Date;return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")};
const plus=(s,n)=>{const d=new Date(s+"T12:00:00");d.setDate(d.getDate()+n);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")};
const stamp=(s,t)=>s.replace(/-/g,"")+"T"+t.replace(":","")+"00";
const escapeICS=s=>String(s||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n");
const escapeHTML=s=>String(s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function events(){
 const d=read(DK),s=read(SK)||{};if(!Array.isArray(d?.tasks))return [];
 const start=date()>d.start?date():d.start,limit=cfg.days===100?d.end:plus(start,11),out=[];
 for(const item of d.tasks){
  const x={...item,...(s.overrides?.[item.id]||{})};
  if(x.date<start||x.date>limit||x.date>d.end)continue;
  if(!cfg.cats.includes(x.category)||["feito","cancelado"].includes(s.statuses?.[item.id])||x.meta?.noReminder===true||x.meta?.freeTime===true)continue;
  if(!/^\d{2}:\d{2}$/.test(x.time))continue;
  out.push({id:"tf-"+String(item.id).replace(/[^a-z0-9_-]/gi,"").slice(0,80)+"@totalfocus.local",date:x.date,time:x.time,category:x.category,title:cfg.discreet?"TOTAL FOCUS — "+x.category:"TOTAL FOCUS — "+x.title});
 }
 return out.sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
}
function buildICS(){
 const list=events(),dt=new Date().toISOString().replace(/[-:]|\.\d{3}/g,""),lines=["BEGIN:VCALENDAR","VERSION:2.0","CALSCALE:GREGORIAN","PRODID:-//TOTAL FOCUS//AGENDA PESSOAL//PT-BR","X-WR-TIMEZONE:America/Sao_Paulo","BEGIN:VTIMEZONE","TZID:America/Sao_Paulo","BEGIN:STANDARD","DTSTART:19700101T000000","TZOFFSETFROM:-0300","TZOFFSETTO:-0300","TZNAME:-03","END:STANDARD","END:VTIMEZONE"];
 for(const e of list){
   const d=new Date(e.date+"T"+e.time+":00");d.setMinutes(d.getMinutes()+5);
   const finish=[d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
   const ft=String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0");
   lines.push("BEGIN:VEVENT","UID:"+e.id,"DTSTAMP:"+dt,"DTSTART;TZID=America/Sao_Paulo:"+stamp(e.date,e.time),"DTEND;TZID=America/Sao_Paulo:"+stamp(finish,ft),"SUMMARY:"+escapeICS(e.title),"DESCRIPTION:"+escapeICS("Aviso TOTAL FOCUS. Se a agenda mudar, gere e importe novamente."),"BEGIN:VALARM","ACTION:DISPLAY","TRIGGER:-PT"+cfg.lead+"M","DESCRIPTION:"+escapeICS(e.title),"END:VALARM","END:VEVENT");
 }
 lines.push("END:VCALENDAR");return {text:lines.join("\r\n")+"\r\n",count:list.length,first:list[0]};
}
function download(){
 const f=buildICS();if(!f.count){alert("Nenhuma atividade no período selecionado.");return}
 const b=new Blob([f.text],{type:"text/calendar;charset=utf-8"}),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download="TOTAL_FOCUS_100_LEMBRETES.ics";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),30000);
 alert("Gerados "+f.count+" eventos. Para avisos na tela bloqueada, importe o arquivo no Calendário e permita suas notificações. Não substitui o despertador nativo. Se remanejar tarefas, atualize o calendário evitando duplicações.");
}
function paint(){
 const main=$("#main");if(!main)return;const hero=main.querySelector(".card.hero");if(hero&&!main.querySelector("#tf14-open")){const b=document.createElement("button");b.id="tf14-open";b.className="tf14-quick";b.textContent="◷ Atualizar avisos";b.type="button";hero.insertAdjacentElement("afterend",b)}if(!main.querySelector("h1")?.textContent?.includes("Ajustes e privacidade"))return;
 let area=$("#tf14-reminders");if(!area){area=document.createElement("section");area.id="tf14-reminders";area.className="card tf14-reminders";main.append(area)}const signature=JSON.stringify({cfg,events:events().map(x=>x.id+"_"+x.date+x.time)});if(area.dataset.signature===signature)return;area.dataset.signature=signature;
 let h='<div class="kicker">ALERTAS · SEM CUSTO</div><h2>Lembretes para tela bloqueada</h2><p><b>No iPhone:</b> gere o arquivo .ics e importe os eventos no Calendário. Para importar, abra o anexo .ics pelo app Mail, escolha um calendário privado e ative os alertas do Calendário em Ajustes → Notificações.</p><p>Para receber avisos de chegada ao trabalho, café/preparação e início do expediente, marque também <b>Trabalho</b> e <b>Deslocamento</b>. <b>Rotina</b> inclui outros avisos, como acordar. Selecionar essas categorias pode gerar muitos lembretes; prefira 12 dias inicialmente.</p><p><b>Limite:</b> não são notificações push próprias do TOTAL FOCUS com app fechado. Para acordar, use o Relógio do iPhone. Seu arquivo permanece privado e não é publicado no GitHub.</p><div class="tf14-cats">';
 for(const c of cats)h+='<label><input type="checkbox" data-tf14-cat="'+escapeHTML(c)+'" '+(cfg.cats.includes(c)?"checked":"")+'> '+escapeHTML(c)+'</label>';
 h+='</div><div class="tf14-selects"><label>Antecedência<select id="tf14-lead"><option>5</option><option>10</option><option>15</option><option>20</option></select></label><label>Período<select id="tf14-days"><option value="12">Próximos 12 dias</option><option value="100">Até o final do desafio</option></select></label></div><label class="tf14-inline"><input id="tf14-discreet" type="checkbox" '+(cfg.discreet?"checked":"")+'> Ocultar detalhes nos títulos</label><p id="tf14-count"></p><button class="primary tf14-download" id="tf14-download">◷ Baixar lembretes (.ics)</button><p class="tf14-note">IMPORTANTE: um .ics contém uma cópia estática do planejamento; ao remanejar uma tarefa, o alerta antigo não muda. Antes de reimportar, exclua os eventos anteriores do calendário escolhido para evitar duplicações. O Calendário pode emitir sons e avisos na tela bloqueada, dependendo do Foco e das configurações do iPhone. Para importar o .ics, o app Mail é um caminho suportado; não equivale a um alarme nativo do Relógio.</p>';
 area.innerHTML=h;$("#tf14-lead").value=cfg.lead;$("#tf14-days").value=cfg.days;const ev=events(),last=ev[0];$("#tf14-count").textContent="Eventos selecionados: "+ev.length+(last?". Primeiro: "+last.date+" às "+last.time+".":"");
}
function change(e){
 if(e.target.hasAttribute("data-tf14-cat")){const c=e.target.getAttribute("data-tf14-cat");cfg.cats=e.target.checked?[...new Set([...cfg.cats,c])]:cfg.cats.filter(x=>x!==c)}
 else if(e.target.id==="tf14-lead")cfg.lead=Math.max(5,Math.min(20,Number(e.target.value)||10));
 else if(e.target.id==="tf14-days")cfg.days=Number(e.target.value)===100?100:12;
 else if(e.target.id==="tf14-discreet")cfg.discreet=e.target.checked;
 else return;
 localStorage.setItem(PK,JSON.stringify(cfg));paint();
}
document.addEventListener("change",change);document.addEventListener("click",e=>{if(e.target.closest("#tf14-download"))download();if(e.target.closest("#tf14-open")){const nav=document.querySelector('#nav button[data-page="config"]');if(nav)nav.click();requestAnimationFrame(()=>document.querySelector("#tf14-reminders")?.scrollIntoView({behavior:"smooth",block:"start"}))}});
let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;paint()})};
const main=$("#main");if(main)new MutationObserver(schedule).observe(main,{childList:true});schedule();
})();
