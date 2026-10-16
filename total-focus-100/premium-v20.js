/* TOTAL FOCUS GAME V20 — recursos gráficos verdadeiros, sem estado paralelo */
(()=>{"use strict";
const DK="totalfocus100.private.dataset.v1",SK="totalfocus100.v1",PHOTO="totalfocus100.v17.shiroPhoto";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}};
const day=()=>{let d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const photos={
 wall:"https://images.pexels.com/photos/5036902/pexels-photo-5036902.jpeg?auto=compress&cs=tinysrgb&w=900",
 dog:"https://images.pexels.com/photos/31566538/pexels-photo-31566538.jpeg?auto=compress&cs=tinysrgb&w=900",
 dog2:"https://images.pexels.com/photos/32350335/pexels-photo-32350335.jpeg?auto=compress&cs=tinysrgb&w=900",
 dog3:"https://images.pexels.com/photos/19052332/pexels-photo-19052332.jpeg?auto=compress&cs=tinysrgb&w=900",
 mountains:"https://images.pexels.com/photos/777211/pexels-photo-777211.jpeg?auto=compress&cs=tinysrgb&w=1100",
 pushup:"https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg?auto=compress&cs=tinysrgb&w=900",
 pushup2:"https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg?auto=compress&cs=tinysrgb&w=900",
 squat:"https://images.pexels.com/photos/4164456/pexels-photo-4164456.jpeg?auto=compress&cs=tinysrgb&w=900",
 plank:"https://images.pexels.com/photos/7592358/pexels-photo-7592358.jpeg?auto=compress&cs=tinysrgb&w=900",
 running:"https://images.pexels.com/photos/32996801/pexels-photo-32996801.jpeg?auto=compress&cs=tinysrgb&w=900",
 bicycle:"https://images.pexels.com/photos/4162580/pexels-photo-4162580.jpeg?auto=compress&cs=tinysrgb&w=900"
};
const icon={
 house:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 10h18"/>',
 fitness:'<path d="m6 5-2 2 13 13 2-2M4 9 2 11m4-8L4 5m15 10-2 2m5-8-2 2M10 14l4-4"/>',
 dog:'<circle cx="12" cy="16" r="4"/><ellipse cx="5" cy="7" rx="2" ry="3"/><ellipse cx="10" cy="4.5" rx="2" ry="2.5"/><ellipse cx="15" cy="4.5" rx="2" ry="2.5"/><ellipse cx="20" cy="7" rx="2" ry="3"/>',
 briefcase:'<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M3 14h18M10 13h4v3h-4z"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M3 21a9 9 0 0 1 18 0"/>',
 cloud:'<path d="M6 18a4 4 0 0 1-.5-8 7 7 0 0 1 13-1 4.5 4.5 0 0 1-1 9z"/>',
 bell:'<path d="M6 9a6 6 0 0 1 12 0v5l2 3H4l2-3zM10 21h4"/>',
 volume:'<path d="M4 9h4l5-4v14l-5-4H4zM17 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>',
 shield:'<path d="m12 2 8 4v5c0 5-3 8-8 11-5-3-8-6-8-11V6z"/>',
 settings:'<circle cx="12" cy="12" r="3"/><path d="M10 2h4l1 3 3 1 3-1 2 4-2 2v3l2 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 2-2v-3L1 9l2-4 3 1 3-1z"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 plane:'<path d="m2 13 8 2 3 7 3-1-1-7 6-5c2-3-1-5-4-3L11 12 4 8 2 9 7 15z"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M22 12h-2M4 12H2M19 5l-2 2M7 17l-2 2M5 5l2 2M17 17l2 2"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
 heart:'<path d="M20 6a5 5 0 0 0-8 0 5 5 0 0 0-8 0c-2 3-1 5 1 7l7 7 7-7c3-3 3-5 1-7z"/>',
 moon:'<path d="M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10z"/>',
 chart:'<path d="M3 21h18M5 17v-5M10 17V8M15 17V4M20 17v-8"/>',
 crown:'<path d="M2 8 7 12l5-8 5 8 5-4-2 12H4z"/>',
 book:'<path d="M12 6c-3-2-6-2-9-2v15c3 0 6 0 9 2 3-2 6-2 9-2V4c-3 0-6 0-9 2zM12 6v15"/>'
};
const svg=(k)=>'<svg aria-hidden="true" viewBox="0 0 24 24">'+(icon[k]||icon.target)+'</svg>';
function trustedImg(src,alt,cls){const el=document.createElement("img");el.src=src;el.alt=alt;el.loading="lazy";el.decoding="async";if(cls)el.className=cls;return el}
function nav(){
 const types=["house","calendar","fitness","dog","briefcase","menu"];
 $$("#nav .tf18-nav").forEach((b,i)=>{const spot=b.querySelector(".tf18-nav-icon");if(!spot)return;if(spot.dataset.tf20)return;spot.dataset.tf20="1";spot.innerHTML=svg(types[i]||"menu")});
}
function home(){
 const m=$("#main");if(!m||!m.querySelector("h1")?.textContent?.startsWith("Meu dia"))return;
 m.classList.add("tf20-home");
 const hero=m.querySelector(".card.hero");if(!hero)return;
 if(!$("#tf20-cover",m)){
  const box=document.createElement("section");box.id="tf20-cover";box.className="tf20-cover";
  box.innerHTML='<img class="tf20-mountain" src="'+photos.mountains+'" alt="Paisagem de montanha ao pôr do sol"><img class="tf20-wolf" src="'+photos.dog+'" alt="Fotografia ilustrativa da raça pastor-branco-suíço"><div class="tf20-brand"><img src="./icon.svg" alt="Brasão dourado TF"><strong>TOTAL FOCUS 100</strong><small>DISCIPLINA HOJE · RESULTADOS SEMPRE</small></div><p class="tf20-motto">“Foco transforma planos em resultados.”</p><small class="tf20-credit">Fotos ilustrativas: Pexels</small>';
  hero.insertAdjacentElement("beforebegin",box)
 }
 const v=read(SK)||{},d=read(DK);if(!d)return;
 const picked=m.querySelector("#datepick")?.value||day(),tasks=d.tasks.map(x=>({...x,...(v.overrides?.[x.id]||{})})).filter(x=>x.date===picked&&x.priority==="flex"&&!x.meta?.optional),finished=tasks.filter(x=>v.statuses?.[x.id]==="feito").length;
 const pct=tasks.length?Math.round(finished/tasks.length*100):0,checks=Object.entries(v.checkins||{}).sort((a,b)=>a[0].localeCompare(b[0])),check=checks.at(-1)?.[1]||{},sleep=Number(check.sleep||0),energy=Number(check.energy||0);
 if(!$("#tf20-dash",m)){
  const block=document.createElement("section");block.id="tf20-dash";block.className="tf20-dashboard";
  block.innerHTML='<div class="tf20-circular" id="tf20-ring"><div><strong id="tf20-percent">0%</strong><small id="tf20-count">0/0 missões</small></div></div><div class="tf20-vitals"><div><span>☾ Sono</span><b id="tf20-sleep">—</b></div><div><span>⚡ Energia</span><b id="tf20-energy">—</b></div><div><span>◎ Foco do dia</span><b id="tf20-focus">—</b></div></div>';
  hero.insertAdjacentElement("afterend",block);
 }
 const ring=$("#tf20-ring",m);if(ring)ring.style.setProperty("--pct",pct+"%");
 const set=(id,val)=>{const el=$(id,m);if(el&&el.textContent!==val)el.textContent=val};
 set("#tf20-percent",pct+"%");set("#tf20-count",finished+"/"+tasks.length+" missões");
 set("#tf20-sleep",sleep?sleep.toFixed(1).replace(".",",")+"h":"não registrado");
 set("#tf20-energy",energy?energy+"/5":"não registrada");
 set("#tf20-focus",pct===100?"Completo":finished?"Em progresso":"A iniciar");
 const cta=hero.querySelector("button.primary");if(cta)cta.classList.add("tf20-yellow");
 if(!$("#tf20-cta",m)){
  const button=document.createElement("button");button.id="tf20-cta";button.className="tf20-yellow";button.type="button";button.textContent="▥ Dashboard do Dia";button.style.cssText="display:block;margin:8px 0;width:100%;padding:12px;border-radius:12px;font-size:12px";
  button.addEventListener("click",()=>$("#tf20-dash",m)?.scrollIntoView({behavior:"smooth",block:"center"}));
  hero.insertAdjacentElement("afterend",button);
 }
}
function agenda(){
 const m=$("#main [data-tf18-screen='agenda']");if(!m)return;
 $$(".tf18-event",m).forEach(x=>{
  const body=x.querySelector(".event-body");if(!body)return;
  const key=(body.querySelector("small")?.textContent||"").split("·")[0].trim(),c={Treino:"#41ed94",Cardio:"#16f7e9",Empresa:"#ffc338",Igreja:"#ff7498",Família:"#e48dfe",PMERJ:"#9ba0ff","Inglês":"#5ae0e1",Shiro:"#ffe46b",Lazer:"#acd1ff"}[key]||"#53dbf0";
  x.style.setProperty("--tcolor",c);
  const name=body.querySelector("strong")?.textContent||"";
  if(key==="Empresa"||/shiro licitações|cotação/i.test(name))x.style.setProperty("--tcolor","#ffca37")
 });
}
function photoFor(text){
 const title=String(text||"").toLowerCase();
 // Apenas imagens que correspondem ao exercício; em outros casos, mantém o guia técnico.
 if(/flexão na parede|flexao na parede/.test(title))return photos.wall;
 if(/flexão|flexao|supino|tríceps|triceps/.test(title))return photos.pushup;
 if(/agachamento|agacha|afundo/.test(title))return photos.squat;
 if(/prancha|plank/.test(title)&&!/lateral|inclinada/.test(title))return photos.plank;
 if(/corrida|correr|trotes|trote/.test(title))return photos.running;
 if(/bicicleta|bike|pedal/.test(title))return photos.bicycle;
 if(/caminhada|passeio com shiro|passeio do shiro/.test(title))return photos.dog3;
 return "";
}
function commandPhoto(name){
 const x=String(name||"").trim().toLowerCase();
 if(x==="senta"||x==="f ica"||x==="fica")return photos.dog2;
 if(x==="deita")return "https://images.pexels.com/photos/14372462/pexels-photo-14372462.jpeg?auto=compress&cs=tinysrgb&w=900";
 if(x==="vem"||x==="pega"||x==="traz")return "https://images.pexels.com/photos/46523/pexels-photo-46523.jpeg?auto=compress&cs=tinysrgb&w=900";
 return photos.dog3;
}
function imageFallback(img,alternative){
 if(!img)return;
 img.addEventListener("error",()=>{
  if(img.dataset.photoFailed)return;
  img.dataset.photoFailed="1";
  img.removeAttribute("src");
  img.setAttribute("alt",alternative||"Imagem ilustrativa indisponível; utilize o guia escrito");
  img.style.display="none";
  const root=img.parentElement;
  if(root&&!root.querySelector(".tf21-photo-fallback")){
    const box=document.createElement("div");box.className="tf21-photo-fallback";
    box.innerHTML='<span>◈</span><small>Imagem indisponível</small>';
    root.insertBefore(box,img)
  }
 },{once:true});
}

function training(){
 const root=$("#main [data-tf18-screen='training']");if(!root)return;
 $$(".tf18-gallery-card",root).forEach(card=>{
  const h=card.querySelector("strong"),art=card.querySelector(".tf18-art");if(!h||!art||art.dataset.tf20)return;art.dataset.tf20="yes";
  const src=photoFor(h.textContent);art.textContent="";
  if(src){const image=trustedImg(src,"Foto ilustrativa da atividade: "+h.textContent);imageFallback(image,"Fotografia de "+h.textContent+" não disponível");art.append(image)}else{art.innerHTML='<div class="tf21-neutral-guide" aria-label="Consultar guia técnico deste movimento">◈<small>Guia técnico</small></div>'}
  let play=card.lastElementChild;if(play){play.className="tf20-play";play.textContent="▶"}
 });
 if(!$("#tf20-trainingcredit",root)){
  const last=root.querySelector(".tf18-card:last-child");if(last){const note=document.createElement("p");note.id="tf20-trainingcredit";note.className="tf20-legend";note.textContent="Fotografias ilustrativas Pexels (uso gratuito). Confira as instruções técnicas de cada movimento antes da execução.";last.append(note)}
 }
}
function shiro(){
 const m=$("#main .tf17-school");if(!m)return;
 const myPhoto=!!localStorage.getItem(PHOTO);
 const hero=m.querySelector(".tf17-doghero img");if(hero&&!hero.dataset.tf20){hero.dataset.tf20="1";if(!myPhoto)hero.src=photos.dog;imageFallback(hero,"Foto do pastor-branco-suíço indisponível")}
 $(".tf17-dogtile img",m).forEach(el=>{if(el.dataset.tf20)return;el.dataset.tf20="1";const title=el.closest(".tf17-dogtile")?.querySelector("strong")?.textContent||"";el.src=commandPhoto(title);el.alt="Pastor-branco-suíço: fotografia ilustrativa para "+title;imageFallback(el,"Foto do comando "+title+" indisponível")});
 const caption=m.querySelector(".tf17-photo-license");if(caption&&!caption.dataset.tf20){caption.dataset.tf20="1";caption.innerHTML='Fotos de exemplo da raça, não são o Shiro. Fotos: <a href="https://www.pexels.com/photo/white-swiss-shepherd-dog-in-a-sunny-park-31566538/" rel="noopener noreferrer" target="_blank">Pexels / Nadin Romanova</a> e fotógrafos creditados. Você pode substituir pela foto real do Shiro.'}
}
function dogDialog(){
 const m=$("#tf17-detail");if(!m?.open)return;
 const image=m.querySelector(".pic");if(image&&!image.dataset.tf20){image.dataset.tf20="1";image.src=commandPhoto(m.querySelector(".copy h2")?.textContent);imageFallback(image,"Fotografia de adestramento indisponível")}
 const c=m.querySelector(".tf17-photo-license");if(c&&!c.dataset.tf20){c.dataset.tf20="1";c.textContent="Foto da raça, ilustrativa; a execução correta é descrita nos passos acima."}
}
function trainer(){
 const dlg=$("#tf12-dialog");if(!dlg?.open)return;
 const view=$("#tf12-view",dlg);if(!view)return;
 const title=$(".tf12-movename",view)?.textContent?.trim()||"";
 if(!title)return;
 if(view.dataset.tf20Title!==title){view.dataset.tf20Title=title;
  $$(".tf20-hero-exercise",view).forEach(x=>x.remove());
  if(!view.querySelector(".tf12-dog-cards")){
   const src=photoFor(title);if(src){
    const figure=document.createElement("div");figure.className="tf20-hero-exercise";
    const img=trustedImg(src,"Imagem ilustrativa de "+title);imageFallback(img,"Foto do exercício indisponível");figure.append(img);
    const legend=document.createElement("span");legend.textContent="Fotografia ilustrativa — verifique posição, amplitude e execução no guia.";figure.append(legend);
    const heading=$(".tf12-movename",view);heading?.insertAdjacentElement("afterend",figure);
    const stale=$(".tf15-photo",view);if(stale)stale.style.display="none";
   }
  }
 }
 if(view.querySelector(".tf12-dog-cards")){
  const photo=$(".tf17-coach-photo img",view)||$(".tf15-photo img",view);if(photo&&!photo.dataset.tf20){photo.dataset.tf20="1";photo.src=localStorage.getItem(PHOTO)||commandPhoto($(".tf12-movename",view)?.textContent.replace(/^♧\s*/,""));imageFallback(photo,"Imagem do Shiro indisponível")}
  const old=$(".tf15-photo",view);if(old)old.style.display="none";
  let box=$(".tf20-doglarge",view);
  if(!box){box=document.createElement("div");box.className="tf20-doglarge";box.innerHTML='<img alt="Foto ilustrativa de pastor-branco-suíço" src="'+(localStorage.getItem(PHOTO)||commandPhoto($(".tf12-movename",view)?.textContent?.replace(/^♧\s*/,"")))+'"><small>Imagem ilustrativa. Siga as instruções textuais de cada comando.</small>';imageFallback(box.querySelector("img"),"Fotografia do comando indisponível");$(".tf12-movename",view)?.insertAdjacentElement("afterend",box)}
  const count=Number($(".tf12-dog-target strong",view)?.textContent?.match(/^\d+/)?.[0]||0),target=Number($(".tf12-dog-target strong",view)?.textContent?.match(/\/\s*(\d+)/)?.[1]||5);
  if(!$("#tf20-attempts",view)){const attempts=document.createElement("div");attempts.id="tf20-attempts";attempts.className="tf20-attempts";$(".tf12-dog-target",view)?.after(attempts)}
  const slot=$("#tf20-attempts",view);if(slot)slot.innerHTML=Array.from({length:Math.min(12,target)},(_,i)=>'<i class="'+(i<count?"hit":"")+'">'+(i<count?"✓":"♧")+"</i>").join("");
 }
}
function quotes(){
 const root=$("#main [data-tf18-screen='quotes']");if(!root)return;
 const ring=$(".tf18-quote-ring",root);if(!ring)return;
 const d=read(DK),s=read(SK)||{},today=day();if(!d?.tasks)return;
 const tasks=d.tasks.map(t=>({...t,...(s.overrides?.[t.id]||{})})).filter(t=>t.category==="Empresa"&&t.meta?.kind==="cotacao").sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
 const now=new Date(),closest=tasks.find(t=>new Date(t.date+"T"+t.end+":00")>now)||tasks.at(-1);if(!closest)return;
 const q=s.quoteTimers?.[closest.id]||{},windowMs=Math.max(1,new Date(closest.date+"T"+closest.end+":00")-new Date(closest.date+"T"+closest.time+":00"));
 const effective=(Number(q.ms)||0)+(q.since?Math.max(0,Math.min(Date.now(),new Date(closest.date+"T"+closest.end+":00"))-q.since):0);
 ring.style.setProperty("--pct",Math.min(100,Math.round(100*effective/windowMs))+"%");
 const clk=$("strong",ring);if(clk){const time=Math.max(0,Math.floor(effective/1000));const value=[Math.floor(time/3600),Math.floor(time/60)%60,time%60].map(x=>String(x).padStart(2,"0")).join(":");if(clk.textContent!==value)clk.textContent=value}
}
function award(){const m=$("#main [data-tf18-screen=awards]");if(!m)return;
 $$(".tf18-award .symbol",m).forEach(el=>{
  if(el.dataset.tf20)return;el.dataset.tf20="1";
  const words=el.parentElement?.querySelector("strong")?.textContent||"";
  el.innerHTML=svg(/Corrida/i.test(words)?"fitness":/Shiro/i.test(words)?"dog":/Estudante/i.test(words)?"book":/Licitações/i.test(words)?"briefcase":/7 dias/i.test(words)?"sun":"target")
 });
}
function modes(){const m=$("#main [data-tf18-screen='modes']");if(!m)return;
 const styles=["travel","rest","goal","focus","family"],types=["plane","sun","target","lock","heart"];
 $$(".tf18-listnav button",m).forEach((b,i)=>{const g=$(".glyph",b);if(!g||g.dataset.tf20)return;g.dataset.tf20="1";b.classList.add("tf20-mode-"+styles[i]);g.innerHTML=svg(types[i]||"target")})
}
function settings(){const m=$("#main [data-tf18-screen=configMenu]");if(!m)return;
 const types=["user","cloud","bell","volume","shield","settings","target"];
 $$(".tf18-listnav button",m).forEach((b,i)=>{const g=$(".glyph",b);if(g&&!g.dataset.tf20){g.dataset.tf20="1";g.innerHTML=svg(types[i]||"settings")}})
}
function sleepGraphic(){
 const root=$("#main [data-tf18-screen='sleep']");if(!root)return;
 const inner=root.querySelector(".tf18-card"),tabs=root.querySelector(".tf18-segments");
 if(!inner||!tabs||!tabs.querySelector('[aria-pressed="true"]')?.textContent?.includes("Sono"))return;
 if(root.querySelector(".tf20-sleep-summary"))return;
 const check=Object.entries(read(SK)?.checkins||{}).filter(([,v])=>Number(v.sleep)>0).sort((a,b)=>a[0].localeCompare(b[0])).at(-1);
 const hours=Number(check?.[1]?.sleep||0),quality=hours?Math.min(100,Math.round(hours/8*100)):0;
 const box=document.createElement("div");box.className="tf20-sleep-summary";
 box.innerHTML='<div class="tf20-sleep-ring" style="--pct:'+quality+'%"><div class="values"><strong>'+ (hours?hours.toFixed(1).replace(".",",")+"h":"—") +'</strong><small>último registro</small></div></div><div class="tf20-sleep-stats"><div><span>Meta de referência</span><b>8 horas</b></div><div><span>Energia percebida</span><b>'+(Number(check?.[1]?.energy)||"—")+'/5</b></div><div><span>Registro</span><b>'+(check?check[0].split("-").reverse().join("/"):"Pendente")+'</b></div></div>';
 inner.querySelector("h2")?.insertAdjacentElement("afterend",box);
}
function quoteModal(){const m=$("#modalcontent");if(!m?.querySelector("#qtime"))return;
 const timer=$("#qtime",m);if(timer&&!timer.dataset.tf20){timer.dataset.tf20="1";timer.style.border="11px solid #20e7ec";timer.style.borderRadius="50%";timer.style.boxShadow="0 0 25px #10f9f65c";timer.style.background="radial-gradient(#0c354e,#051322)";timer.style.width="min(72vw,250px)";timer.style.height="min(72vw,250px)";timer.style.margin="15px auto";timer.style.display="grid";timer.style.placeItems="center";timer.style.fontSize="clamp(23px,6vw,34px)"}
}
let busy=false;function paint(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;try{nav();home();agenda();training();shiro();dogDialog();trainer();award();modes();settings();sleepGraphic();quoteModal()}catch(e){console.warn("TOTAL FOCUS V20 visual:",e.message)}})}
const main=$("#main"),content=$("#modalcontent"),modal=$("#tf12-dialog"),body=document.body;
if(main)new MutationObserver(paint).observe(main,{subtree:true,childList:true});
if(content)new MutationObserver(paint).observe(content,{childList:true,subtree:true});
new MutationObserver(paint).observe(body,{childList:true,subtree:false});
document.addEventListener("click",()=>{setTimeout(paint,80)},{passive:true});
window.addEventListener("pageshow",paint);window.addEventListener("tf-remote-update",paint);
setInterval(()=>{if($("#main [data-tf18-screen='quotes']"))quotes()},1100);
paint();
})();
