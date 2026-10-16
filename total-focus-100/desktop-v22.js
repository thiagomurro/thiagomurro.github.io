/* TOTAL FOCUS V22 — nova capa única e layout real para PC */
(()=>{"use strict";
const $=(s,r=document)=>r.querySelector(s);
const sceneries=[
 "https://images.pexels.com/photos/7458667/pexels-photo-7458667.jpeg?auto=compress&cs=tinysrgb&w=1200",
 "https://images.pexels.com/photos/9581795/pexels-photo-9581795.jpeg?auto=compress&cs=tinysrgb&w=1200"
];
let repainting=false;
function cover(root){
 const cover=$("#tf20-cover",root);
 if(!cover||cover.dataset.tf22)return false;
 cover.dataset.tf22="1";
 cover.setAttribute("aria-label","Abertura TOTAL FOCUS com pessoa e cachorro nas montanhas");
 cover.innerHTML='<div class="tf22-landscape" aria-hidden="true"><img class="tf22-photo" src="'+sceneries[0]+'" alt="" loading="eager" fetchpriority="high" decoding="async"><div class="tf22-landscape-shade"></div></div>'+
 '<div class="tf22-cover-top"><div class="tf22-stars">★ ★ ★</div><img src="./icon.svg" alt="Brasão TF dourado" class="tf22-emblem"><div class="tf22-wordmark">TOTAL FOCUS <span>100</span></div><div class="tf22-slogan">DISCIPLINA HOJE · RESULTADOS SEMPRE</div></div>'+
 '<div class="tf22-cover-bottom"><span class="tf22-quote">“Foco transforma planos em resultados.”</span><small>JORNADA DE 100 DIAS · OUT 2026 — JAN 2027</small></div>';
 const image=$(".tf22-photo",cover);
 let fallback=0;
 image.addEventListener("error",()=>{
  fallback++;
  if(fallback<sceneries.length)image.src=sceneries[fallback];
  else{image.removeAttribute("src");image.style.display="none";cover.classList.add("tf22-photo-offline")}
 });
 return true
}
function structure(main){
 if(!main?.classList.contains("tf20-home"))return;
 let art=$("#tf20-cover",main);
 if(!art)return;
 const mainhead=main.querySelector(":scope > .flex");
 if(!mainhead)return;
 // Rebuild only layout wrappers. The source of truth stays in existing app.
 let workspace=$("#tf22-workspace",main);
 if(!workspace){
  workspace=document.createElement("section");
  workspace.id="tf22-workspace";
  workspace.className="tf22-workspace";
  art.insertAdjacentElement("afterend",workspace);
 }
 const headIndex=Array.from(main.children).indexOf(mainhead);
 Array.from(main.children).forEach((node,index)=>{
  if(node===workspace||node===art||index<=headIndex)return;
  workspace.append(node)
 });
}
function dayGreeting(main){
 if(!main?.classList.contains("tf20-home"))return;
 const area=$("#tf22-workspace",main);
 if(!area||$("#tf22-intro",area))return;
 const e=document.createElement("section");e.id="tf22-intro";e.className="tf22-intro";
 const current=new Date(),h=current.getHours(),g=h<12?"Bom dia!":h<18?"Boa tarde!":"Boa noite!";
 e.innerHTML='<div class="tf22-kicker"><span>◈ PAINEL DO DIA</span><span class="tf22-pulse">● ATIVO</span></div><h2>'+g+' <em>Vamos com tudo hoje.</em></h2><p>Veja sua próxima missão, acompanhe a evolução e avance um passo de cada vez.</p>';
 area.prepend(e)
}
function mission(main){
 const hero=$("#tf22-workspace .card.hero",main);
 if(!hero)return;
 hero.classList.add("tf22-mission");
 const kicker=$(".kicker",hero);
 if(kicker&&kicker.textContent!=="⏱  PRÓXIMA ATIVIDADE")kicker.textContent="⏱  PRÓXIMA ATIVIDADE";
 const dateLine=$("p.muted",hero);
 if(dateLine){dateLine.classList.add("tf22-mission-meta")}
 const action=$("button.primary",hero);
 if(action){if(action.textContent!=="▶  INICIAR AGORA")action.textContent="▶  INICIAR AGORA";action.classList.add("tf20-yellow")}
}
function cleanup(main){
 const promo=$("#tf20-cta",main);
 if(promo){if(promo.textContent!=="▥  Ver meu dashboard do dia")promo.textContent="▥  Ver meu dashboard do dia";promo.classList.add("tf22-dashboard-button")}
 const base=$("#tf20-dash",main);
 if(base)base.classList.add("tf22-dashboard");
 const mini=$("#tf17-todayplus",main);
 if(mini)mini.classList.add("tf22-daily-stats");
}
function paint(){
 if(repainting)return;
 repainting=true;
 try{
 const main=$("#main");if(!main)return;
 const isHome=!!main.querySelector('h1')?.textContent?.startsWith("Meu dia");
 if(!isHome){main.classList.remove("tf22-home");return}
 main.classList.add("tf22-home");
 cover(main);structure(main);dayGreeting(main);mission(main);cleanup(main);
 }finally{repainting=false}
}
let pending=false;
function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;paint()})}
const main=$("#main");
if(main)new MutationObserver(schedule).observe(main,{childList:true});
document.addEventListener("change",e=>{if(e.target.id==="datepick")schedule()});
window.addEventListener("pageshow",schedule);
window.addEventListener("tf-remote-update",schedule);
schedule();
})();