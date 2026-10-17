/* TOTAL FOCUS V23: aplicação privada da agenda corrigida, preservando conquistas */
(()=>{"use strict";
const DK="totalfocus100.private.dataset.v1",SK="totalfocus100.v1",PREV="totalfocus100.plan.previous.v23",q=x=>document.querySelector(x);
const authorized={0:["13:30","15:30"],1:["19:00","21:00"],4:["20:10","21:10"]};
function inspect(d){
if(!d||d.start!=="2026-10-19"||d.end!=="2027-01-26"||!Array.isArray(d.tasks))throw Error("O arquivo não é um cronograma TOTAL FOCUS válido.");
const days=new Set(),learn=new Set(),quotes={0:0,1:0,4:0},ids=new Set();
for(const t of d.tasks){
if(!t.id||ids.has(t.id))throw Error("Atividade repetida ou sem identificador");ids.add(t.id);
if(t.category==="Empresa"){const wd=new Date(t.date+"T12:00:00").getDay(),a=authorized[wd];if(!a||t.time!==a[0]||t.end!==a[1])throw Error("Foi encontrada cotação fora de domingo, segunda ou quinta.");quotes[wd]++}
if(t.category==="Trabalho"&&/Prefeitura/.test(t.title)&&[1,2,3,4,5].includes(new Date(t.date+"T12:00:00").getDay()))days.add(t.date);
if(t.category==="PMERJ"&&t.time==="15:30"&&t.end==="16:00")learn.add(t.date);
}
for(const wd of days)if(!learn.has(wd))throw Error("Falta o estudo PMERJ em "+wd);
if(!d.studyProgression||d.studyProgression.evaluationDays!==30)throw Error("Selecione o cronograma V24 com progressão de 80%.");
const english=d.tasks.filter(t=>t.category==="Inglês"),englishDays=new Set(english.map(t=>t.date));
if(english.length!==100||englishDays.size!==100)throw Error("O plano deve ter 100 sessões de inglês, incluindo os fins de semana.");
if(english.some(t=>Math.floor((Number(t.end.slice(0,2))*60+Number(t.end.slice(3,5)))-(Number(t.time.slice(0,2))*60+Number(t.time.slice(3,5))))!==15))throw Error("O tempo inicial de inglês deve ser 15 minutos.");
if(!quotes[0]||!quotes[1]||!quotes[4])throw Error("Faltam blocos confirmados de cotação.");
return {days:days.size,quotes:quotes[0]+quotes[1]+quotes[4]}
}
const input=document.createElement("input");input.type="file";input.accept=".json,application/json";input.hidden=true;input.id="tf23-update-input";document.body.append(input);
let queued=false;
function display(){
const main=q("#main");if(!main)return;const menu=main.querySelector('[data-tf18-screen="configMenu"] .tf18-listnav'),native=main.querySelector("h1")?.textContent?.includes("Ajustes e privacidade");
if(!menu&&!native||main.querySelector("#tf23-update"))return;
const b=document.createElement("button");b.id="tf23-update";b.type="button";b.className="tf23-update";b.style.cssText="width:100%;padding:15px;text-align:left;border:1px solid #36dbd5;border-radius:12px;background:#0d3549;color:#affdf1;font-weight:850;margin:12px 0";b.textContent="▦ Atualizar cronograma privado (V24 / V30)";
(menu||main).append(b);b.addEventListener("click",()=>input.click())
}
input.addEventListener("change",async()=>{const file=input.files?.[0];input.value="";if(!file)return;if(file.size>6000000)return alert("Arquivo muito grande");
try{
const d=JSON.parse(await file.text()),r=inspect(d),promoted=JSON.parse(localStorage.getItem("totalfocus100.study.v24")||"{}"),done=Object.values(JSON.parse(localStorage.getItem(SK)||"{}").statuses||{}).filter(x=>x==="feito").length;
if(promoted.pmerj?.on||promoted.english?.on)throw Error("A progressão de estudo já foi desbloqueada neste dispositivo. Não reimporte a versão inicial e não apague os complementos. Faça backup primeiro.");
const upgradeV30=Array.isArray(d.trainingRoadmapV30)&&d.trainingRoadmapV30.length===14;
if(!confirm("Aplicar novo plano "+(upgradeV30?"V30 — corrida e calistenia":"V24")+"?\nPMERJ: "+r.days+" dias de expediente, 15h30–16h.\nCotações: "+r.quotes+" blocos só domingo, segunda e quinta.\nInglês: 15 min nos 100 dias (inclui fins de semana), dobrando após a meta.\n"+(upgradeV30?"Cardio: terça, quinta e domingo, com caminhadas à parte.\nForça: calistenia sem pesos segunda, quarta e sexta.\nIgreja quarta: 19h–21h20.\n":"")+done+" registros de atividades concluídas serão mantidos no histórico, embora exercícios substituídos possam ter outros IDs.\n\nNenhum dado será enviado ao GitHub."))return;
const old=localStorage.getItem(DK);if(old)localStorage.setItem(PREV,old);localStorage.setItem(DK,JSON.stringify(d));window.dispatchEvent(new Event("tf-remote-update"));alert("Cronograma privado atualizado. Confira a agenda e faça backup para preservar seu histórico.");
}catch(e){alert("Importação não realizada: "+e.message)}});
const main=q("#main");if(main)new MutationObserver(()=>{if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;display()})}}).observe(main,{childList:true});display();
})();