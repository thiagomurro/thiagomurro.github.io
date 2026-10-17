/* TOTAL FOCUS 100 V31: biblioteca visual interativa para exercicios do cronograma privado. */
(()=>{"use strict";
if(window.TF31_EXERCISES)return;
const DK="totalfocus100.private.dataset.v1",base="./tf25-assets/treinos/";
const photo={
"Agachamento livre":"agachamento_livre",
"Abdominal supra curto":"abdominal_supra",
"Prancha de antebraços":"v31/prancha_antebracos",
"Bird-dog":"v31/bird_dog",
"Ponte de glúteos":"v31/ponte_gluteos",
"Afundo reverso com apoio":"avanco"
};
const hints={
"Agachamento livre":["Fique em pé com os pés afastados.","Leve o quadril para trás, mantendo os calcanhares no chão.","Flexione os joelhos dentro da amplitude confortável.","Retorne devagar, sem travar os joelhos."],
"Abdominal supra curto":["Deite de costas e dobre os joelhos.","Apoie os pés e mantenha o pescoço neutro.","Expire e eleve somente os ombros.","Retorne com controle, sem puxar a cabeça."],
"Prancha de antebraços":["Apoie antebraços e cotovelos sob os ombros.","Estenda as pernas e alinhe o tronco.","Mantenha abdômen contraído e respire.","Apoie os joelhos para finalizar."],
"Bird-dog":["Comece em quatro apoios: mãos sob ombros, joelhos sob quadris.","Estenda braço direito e perna esquerda.","Mantenha o quadril estável, sem arquear as costas.","Retorne e repita do lado oposto."],
"Ponte de glúteos":["Deite de costas e dobre os joelhos.","Contraia abdômen e glúteos.","Eleve o quadril até alinhar ombros e joelhos.","Desça lentamente sem arquear a lombar."],
"Afundo reverso com apoio":["Fique em pé, perto de uma parede firme.","Dê um passo curto para trás.","Flexione os joelhos em amplitude confortável.","Volte controladamente e alterne as pernas."]
};
const css=document.createElement("style");css.textContent=".tf31-trigger{border:1px solid #1ce4df!important;color:#a5fffa!important;background:#0b3341!important;padding:10px 14px!important;border-radius:12px;cursor:pointer}.tf31-dialog{width:min(94vw,780px);max-height:88dvh;overflow:auto;background:#061e2c;color:#f3feff;border:1px solid #36d6d8;border-radius:18px;padding:18px}.tf31-dialog::backdrop{background:#000c}.tf31-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.tf31-step{margin:0;padding:10px;border:1px solid #20516a;border-radius:12px;background:#0c2c3b}.tf31-step img{width:100%;aspect-ratio:1.65;object-fit:cover;border-radius:8px}.tf31-step p{font-size:13px;line-height:1.5;margin:6px 0}.tf31-top{display:flex;justify-content:space-between;gap:10px;align-items:center}.tf31-top h2{margin:4px 0 12px;font-size:21px}.tf31-summary{padding:12px;border-radius:10px;background:#123847;line-height:1.65;margin:12px 0}.tf31-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.tf31-list button{background:#12384a;color:#e6ffff;border:1px solid #23667b;border-radius:9px;padding:12px;text-align:left}.tf31-note{font-size:12px;color:#b5d4df;line-height:1.5}";
document.head.append(css);
const modal=document.createElement("dialog");modal.id="tf31-modal";modal.className="tf31-dialog";document.body.append(modal);
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function dataset(){try{return JSON.parse(localStorage.getItem(DK)||"null")||{};}catch(e){return {};}}
function open(name){const specs=dataset().exerciseSpecs||{},v=specs[name];if(!v)return;const prefix=photo[name],steps=hints[name];
 const imgs=prefix&&steps?'<div class="tf31-grid">'+steps.map((txt,i)=>'<figure class="tf31-step"><img loading="lazy" src="'+base+esc(prefix)+'/etapa_0'+(i+1)+'.webp" alt="'+esc(name+" etapa "+(i+1))+'" onerror="this.hidden=true"><p><b>Etapa '+(i+1)+':</b> '+esc(txt)+'</p></figure>').join("")+"</div>":'<div class="tf31-summary"><b>1. Preparação</b> · '+esc(v.start||"Posicione-se com segurança.")+'<hr style="border-color:#225164"><b>2. Execução</b> · '+esc(v.move||"Faça devagar.")+'<hr style="border-color:#225164"><b>3. Técnica</b> · '+esc(v.mistake||"Evite dor e compensações.")+'</div><p class="tf31-note">A sequência fotográfica específica deste exercício está em preparação. Não foi usada uma foto de outro movimento.</p>';
 modal.innerHTML='<div class="tf31-top"><h2>'+esc(name)+'</h2><button class="tf31-trigger" data-tf31-close>Fechar ✕</button></div>'+imgs+'<div class="tf31-summary"><b>Execução programada:</b> '+esc(v.reps||"Siga sua agenda")+'<p><b>Músculos:</b> '+esc((v.muscles||[]).join(", "))+'</p><p><b>Atenção:</b> '+esc(v.mistake||"Pare se sentir dor.")+'</p></div><p class="tf31-note">Fotografias ilustrativas geradas por IA; a descrição do exercício no seu cronograma prevalece. As séries e o cronômetro são os da sessão real.</p><button class="tf31-trigger" data-tf31-library>‹ Todos os exercícios</button>';modal.showModal();
}
function library(){const specs=dataset().exerciseSpecs||{};const names=Object.keys(specs);modal.innerHTML='<div class="tf31-top"><h2>Biblioteca · '+names.length+' exercícios em casa</h2><button data-tf31-close class="tf31-trigger">Fechar ✕</button></div><p class="tf31-note">Selecione um movimento da cartela de calistenia V30. As atividades concluídas não serão alteradas.</p><div class="tf31-list">'+names.map(n=>'<button data-tf31-name="'+esc(n)+'">'+esc(n)+(photo[n]?' · Fotos':' · Técnica')+'</button>').join("")+'</div>';if(!modal.open)modal.showModal();}
document.addEventListener("click",e=>{const a=e.target.closest("[data-tf31-name],[data-tf31-library],[data-tf31-close]");if(!a)return;if(a.hasAttribute("data-tf31-close"))modal.close();else if(a.hasAttribute("data-tf31-library"))library();else open(a.getAttribute("data-tf31-name"));});
function attach(){const trainer=document.querySelector("#tf12-dialog"),root=document.querySelector('[data-tf25-root="treino"]');
 if(root&&!root.querySelector(".tf31-trigger")){const b=document.createElement("button");b.className="tf31-trigger";b.textContent="◉ Exercícios ilustrados (V31)";b.onclick=library;(root.querySelector(".tf25-top")||root).append(b);}
 if(trainer?.open){const view=trainer.querySelector("#tf12-view");if(view&&!trainer.querySelector('[data-tf31-library]')){const b=document.createElement("button");b.type="button";b.className="tf31-trigger";b.dataset.tf31Library="";b.textContent="Ver fotos e técnicas dos exercícios";b.style.margin="10px";view.before(b);}}
}
const target=document.querySelector("#main");if(target){let pending=false;new MutationObserver(()=>{if(!pending){pending=true;requestAnimationFrame(()=>{pending=false;attach();});}}).observe(target,{childList:true,subtree:true});}
document.addEventListener("click",e=>{if(e.target.closest("[data-tf31-library]")){e.preventDefault();library();}});
setInterval(attach,1500);attach();
window.TF31_EXERCISES={open,library,photoNames:Object.keys(photo)};
})();