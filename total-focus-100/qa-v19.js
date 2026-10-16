/* TOTAL FOCUS 100 — Autoauditoria segura para iPhone/PC V19 */
(()=>{"use strict";
const DK="totalfocus100.private.dataset.v1",SK="totalfocus100.v1";
const $=(q,r=document)=>r.querySelector(q);
const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pages=[["today","Início","#main h1"],["agenda","Agenda",'#main [data-tf18-screen="agenda"]'],["training","Treinos",'#main [data-tf18-screen="training"]'],["shiro","Shiro","#main .tf17-school"],["quotes","Cotações",'#main [data-tf18-screen="quotes"]'],["more","Mais",'#main [data-tf18-screen="more"]'],["awards","Conquistas",'#main [data-tf18-screen="awards"]'],["sleep","Sono",'#main [data-tf18-screen="sleep"]'],["modes","Modos",'#main [data-tf18-screen="modes"]'],["config","Configurações",'#main [data-tf18-screen="configMenu"]']];
let dialog=null,working=false,results=null,errors=[];
window.addEventListener("error",e=>{const entry=String(e.message||"").slice(0,130);if(entry&&!errors.includes(entry))errors.push(entry)});
window.addEventListener("unhandledrejection",e=>{const entry=String(e.reason?.message||"falha assíncrona").slice(0,130);if(!errors.includes(entry))errors.push(entry)});
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const limit=()=>window.innerWidth||document.documentElement.clientWidth;
function testData(){
 let d=null,s=null,problems=[],count=0;
 try{d=JSON.parse(localStorage.getItem(DK));s=JSON.parse(localStorage.getItem(SK)||"{}")}catch{problems.push("JSON local inválido");return {loaded:false,count:0,problems}}
 if(!d?.tasks?.length)return {loaded:false,count:0,problems:["Cronograma ainda não importado"]};
 count=d.tasks.length;
 if(d.start!=="2026-10-19"||d.end!=="2027-01-26")problems.push("Datas de início/fim inesperadas");
 const ids=new Set();
 for(const t of d.tasks){if(!t.id||ids.has(t.id))problems.push("ID ausente ou repetido");ids.add(t.id);if(!t.date||t.date<d.start||t.date>d.end)problems.push("Atividade fora dos 100 dias");if(!/^\d\d:\d\d$/.test(t.time||""))problems.push("Horário inválido");}
 if(s&&!s.statuses)problems.push("Estado sem mapa de conclusões");
 return {loaded:true,count,problems:[...new Set(problems)]}
}
function storageTest(){
 const k="totalfocus100.qa.v19.probe";
 try{const previous=localStorage.getItem(k),value="probe-"+Date.now();localStorage.setItem(k,value);const ok=localStorage.getItem(k)===value;
 if(previous===null)localStorage.removeItem(k);else localStorage.setItem(k,previous);return ok}catch{return false}
}
function present(){
 if(!dialog){dialog=document.createElement("dialog");dialog.id="tf19-qa-dialog";dialog.className="tf19-qa-dialog";document.body.append(dialog)}
 dialog.innerHTML='<div class="tf19-qa-head"><strong>◈ DIAGNÓSTICO TOTAL FOCUS</strong><button data-tf19-close type="button">✕</button></div><p class="tf19-sub">Teste local sem enviar agenda, nomes, CPF ou senha.</p><div id="tf19-output">Pronto para começar.</div><div class="tf19-actions"><button class="primary" type="button" data-tf19-run>▶ Executar verificação</button><button data-tf19-copy type="button">Copiar relatório</button></div><p class="tf19-caveat">Este teste verifica as telas e o armazenamento nesta sessão. Não substitui o teste de avisos na tela bloqueada, recuperação de backup ou uso prolongado no Safari.</p>';
 dialog.showModal()
}
function label(kind){return kind==="pass"?"✓":kind==="warn"?"!":"×"}
function setOutput(items,extra){
 const el=$("#tf19-output");if(!el)return;
 el.innerHTML=items.map(o=>'<div class="tf19-test" data-result="'+o.kind+'"><strong>'+label(o.kind)+' '+safe(o.name)+'</strong><small>'+safe(o.detail||"")+'</small></div>').join("")+(extra?'<p class="tf19-sub">'+safe(extra)+'</p>':"")
}
async function run(){
 if(working)return;
 working=true;
 const button=dialog?.querySelector("[data-tf19-run]");if(button)button.disabled=true;
 let items=[],previous=window.TF18_APP?.current?.()||"today",stateBefore=localStorage.getItem(SK),dataBefore=localStorage.getItem(DK),test=testData();
 const mark=(kind,name,detail)=>{items.push({kind,name,detail});setOutput(items,"Testando. Não feche esta janela.")};
 try{
  mark(storageTest()?"pass":"fail","Armazenamento local",storageTest()?"Leitura e escrita de teste disponíveis.":"Não foi possível salvar dados nesta sessão.");
  mark(test.loaded?(test.problems.length?"warn":"pass"):"warn","Cronograma privado",test.loaded?test.count+" atividades • "+(test.problems.length?test.problems.slice(0,3).join(", "):"estrutura básica válida"):"Ainda não foi importado.");
  mark(location.protocol==="https:"?"pass":"warn","Conexão HTTPS",location.protocol==="https:"?"Conexão segura.":"Abra pelo endereço HTTPS publicado.");
  mark(window.matchMedia?.("(display-mode: standalone)")?.matches||navigator.standalone===true?"pass":"warn","Aplicativo instalado","Abrir pela Tela de Início permite verificar o modo PWA.");
  if(!window.TF18_APP?.activate){mark("fail","Módulo de telas","Navegador ainda não carregou a atualização V18.");return}
  if(test.loaded){
   for(const [page,name,selector] of pages){
    window.TF18_APP.activate(page);
    await wait(125);
    const content=!!$(selector),horizontal=document.documentElement.scrollWidth>limit()+3;
    mark(content&&!horizontal?"pass":content?"warn":"fail",name,content?(horizontal?"Conteúdo existe, mas há rolagem horizontal.":"Tela carregada sem rolagem horizontal da página."):"Tela não encontrada após abrir.");
   }
  }else mark("warn","Teste das 10 telas","Importe o cronograma antes do teste de navegação.");
  mark("pass","Dados privados","O diagnóstico não exportou nem enviou seus registros.");
  const sw="serviceWorker"in navigator && !!navigator.serviceWorker.controller;
  mark(sw?"pass":"warn","Cache offline",sw?"Service worker controla a página.":"Instale e reabra; disponibilidade offline ainda precisa ser confirmada.");
  if(errors.length)mark("warn","Erros de JavaScript",errors.length+" erro(s) observado(s). Não incluir informações privadas no relatório.");
  else mark("pass","Erros de JavaScript","Nenhum erro capturado durante a verificação.");
 }catch(e){mark("fail","Falha na verificação",e.message)}
 finally{
  try{window.TF18_APP?.activate(previous)}catch{}
  await wait(100);
  if(localStorage.getItem(SK)!==stateBefore||localStorage.getItem(DK)!==dataBefore)mark("warn","Integridade de registros","O estado mudou durante o teste. Confira antes de continuar.");
  else mark("pass","Integridade de registros","Dados principais permaneceram iguais.");
  results=items;
  setOutput(items,"Verificação encerrada. Faça uma captura desta tela se houver avisos ou falhas.");
  if(button)button.disabled=false;working=false
 }
}
function report(){
 if(!results)return "TOTAL FOCUS QA V19: ainda não executado.";
 const summary=results.map(x=>label(x.kind)+" "+x.name+": "+x.detail).join("\n");
 return "TOTAL FOCUS 100 — Diagnóstico V19\n"+"Data: "+new Date().toLocaleDateString("pt-BR")+"\nNavegador: "+(navigator.userAgent.includes("iPhone")?"iPhone":navigator.userAgent.includes("Android")?"Android":"PC/outro")+"\n"+summary+"\nSem informações pessoais da agenda.";
}
function addButton(){
 const box=document.querySelector('#main [data-tf18-screen="configMenu"] .tf18-listnav');
 if(box&&!box.querySelector("[data-tf19-open]")){
  const b=document.createElement("button");b.type="button";b.dataset.tf19Open="1";b.innerHTML='<span class="glyph">◉</span><span class="label"><strong>Diagnóstico do aplicativo</strong><small>Testar 10 telas, dados locais e funcionamento PWA</small></span><span class="arrow">›</span>';box.append(b)
 }
 const more=document.querySelector('#main [data-tf18-screen="more"] .tf18-listnav');
 if(more&&!more.querySelector("[data-tf19-open]")){
  const b=document.createElement("button");b.type="button";b.dataset.tf19Open="1";b.innerHTML='<span class="glyph">◉</span><span class="label"><strong>Verificar funcionamento</strong><small>Diagnóstico gratuito da V18</small></span><span class="arrow">›</span>';more.append(b)
 }
}
document.addEventListener("click",async e=>{
 if(e.target.closest("[data-tf19-open]"))present();
 else if(e.target.closest("[data-tf19-close]"))dialog?.close();
 else if(e.target.closest("[data-tf19-run]"))await run();
 else if(e.target.closest("[data-tf19-copy]")){
  const text=report();
  try{await navigator.clipboard.writeText(text);alert("Relatório copiado.")}catch{const area=document.createElement("textarea");area.value=text;area.style.cssText="width:100%;height:150px";$("#tf19-output")?.append(area);area.select();alert("Selecione e copie o texto exibido.")}
 }
});
let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;addButton()})};
const main=$("#main");if(main)new MutationObserver(schedule).observe(main,{childList:true});
window.addEventListener("pageshow",schedule);
schedule();
})();
