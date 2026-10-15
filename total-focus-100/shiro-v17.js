/* TOTAL FOCUS V17 - Escola fotográfica de Shiro */
(()=>{"use strict";
const DK="totalfocus100.private.dataset.v1",SK="totalfocus100.v1",PHOTO="totalfocus100.v17.shiroPhoto",ATT="totalfocus100.v12.dog-attempts.";
const $=(q,r=document)=>r.querySelector(q),read=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}};
const esc=x=>String(x??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const files=[
 ["White Swiss Shepherd portrait.jpg","Joselodos, CC0"],
 ["White Swiss Shepherd Dog.jpg","Avietar, CC0"],
 ["White Swiss Shepherd 1.jpg","Canarian, CC BY-SA 4.0"],
 ["White Swiss Shepherd 2.jpg","Canarian, CC BY-SA 4.0"],
 ["White Swiss Shepherd 3.jpg","Canarian, CC BY-SA 4.0"],
 ["White Swiss Shepherd 4.jpg","Canarian, CC BY-SA 4.0"]
];
const pic=i=>"https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(files[i%files.length][0])+"?width=800";
const credits=i=>"https://commons.wikimedia.org/wiki/File:"+encodeURIComponent(files[i%files.length][0].replace(/ /g,"_"));
const basic=["Senta","Deita","Fica","Vem","Junto","Olha","Espera","Patinha"];
let filter="basicos",modal=null,loading=false;
function get(){const d=read(DK),s=read(SK)||{};if(!d?.tasks?.length)return null;const tasks=d.tasks.map(t=>({...t,...(s.overrides?.[t.id]||{})})).filter(t=>t.category==="Shiro");return {d,s,tasks}}
function report(u,cmd){let attempts=0,hit=0;for(const t of u.tasks){const a=read(ATT+t.id)||{},b=u.s.dogs?.[t.id]?.counts||{};const good=Number(b[cmd]||0),tries=Number(a[cmd]||0);attempts+=Math.max(good,tries);hit+=good}return {attempts,hit,pct:attempts?Math.round(100*hit/attempts):0}}
function next(u,cmd){const links=t=>u.d.dogSessions?.[t.meta?.session]?.routine?.some(c=>c[0]===cmd);
 return u.tasks.find(t=>links(t)&&!["feito","cancelado"].includes(u.s.statuses?.[t.id]))||u.tasks.find(links)}
function openSession(id){if(!id)return;if(modal?.open)modal.close();const a=document.createElement("button");a.dataset.do="view";a.dataset.id=id;document.body.append(a);a.click();a.remove()}
function dogPage(){
 const u=get(),m=$("#main");if(!u||!m)return;const cmds=Object.keys(u.d.commands||{});
 const current=cmds.length?cmds:["Senta","Deita","Fica","Vem","Junto","Olha","Espera","Patinha","Deixa","Solta","Pega","Traz"];
 const chosen=current.filter(c=>filter==="todos"||filter==="basicos"&&basic.includes(c)||filter==="avancados"&&!basic.includes(c));
 const completed=u.tasks.filter(t=>u.s.statuses?.[t.id]==="feito"),today=new Date().toISOString().slice(0,10),soon=u.tasks.find(t=>t.date>=today&&!["feito","cancelado"].includes(u.s.statuses?.[t.id]))||u.tasks.find(t=>!["feito","cancelado"].includes(u.s.statuses?.[t.id]));
 const attempts=u.tasks.reduce((sum,t)=>sum+Object.values(read(ATT+t.id)||{}).reduce((a,b)=>a+Number(b||0),0),0);
 const cards=chosen.map(cmd=>{const v=report(u,cmd),i=(Math.max(0,current.indexOf(cmd))%4)+2;return '<button class="tf17-dogtile" data-dogcommand="'+esc(cmd)+'"><img src="'+pic(i)+'" loading="lazy" alt="Fotografia ilustrativa de pastor branco suíço" onerror="this.style.display=\'none\'"><div class="tf17-dogtile-body"><strong>'+esc(cmd)+'</strong><small>'+v.attempts+' tentativas · '+v.hit+' acertos</small><div class="tf17-pct"><span style="width:'+v.pct+'%"></span></div></div></button>'}).join("");
 const image=localStorage.getItem(PHOTO)||pic(0);
 m.innerHTML='<section class="tf17-school"><div class="tf17-doghero"><img src="'+image+'" alt="Foto do Shiro ou fotografia ilustrativa de pastor branco suíço" onerror="this.src=\''+pic(1)+'\'"><div class="tf17-dogtitle"><div class="tf17-kicker">♧ ESCOLA DO SHIRO</div><h1>Meu parceiro de jornada</h1><p>Obediência positiva, comandos passo a passo e acompanhamento das sessões.</p></div></div><div class="tf17-photo-row"><button id="tf17-photo-add">📷 Adicionar foto real do Shiro</button><button id="tf17-photo-default">Imagem padrão</button></div><input type="file" id="tf17-photo-file" class="tf17-photo-input" accept="image/jpeg,image/png,image/webp"><p class="tf17-photo-license">Imagem padrão: fotografia ilustrativa da raça, não é o Shiro. <a target="_blank" rel="noopener noreferrer" href="'+credits(0)+'">Joselodos, CC0 / Wikimedia Commons</a>. Sua foto pessoal não é publicada no site.</p><div class="tf17-dog-medals"><div><strong>'+completed.length+'/'+u.tasks.length+'</strong><small>Sessões concluídas</small></div><div><strong>'+attempts+'</strong><small>Tentativas marcadas</small></div><div><strong>'+current.length+'</strong><small>Comandos cadastrados</small></div></div>'+(soon?'<div class="tf17-next-train"><div><strong>PRÓXIMA SESSÃO</strong><small>'+esc(soon.date.split("-").reverse().join("/"))+' · '+esc(soon.time)+' · '+esc(soon.title)+'</small></div><button data-do="view" data-id="'+esc(soon.id)+'">▶ Treinar</button></div>':"")+'<div class="tf17-card"><h2>Guia de comandos <span>Toque para abrir</span></h2><div class="tf17-dog-switch">'+[["basicos","Básicos"],["avancados","Intermediários"],["todos","Todos"]].map(c=>'<button data-dogfilter="'+c[0]+'" aria-pressed="'+(filter===c[0])+'">'+c[1]+'</button>').join("")+'</div><div class="tf17-doggrid">'+cards+'</div><p class="tf17-note">As fotos mostram a raça e são ilustrativas. Para aprender a posição de cada comando, abra a ficha e siga as instruções. O progresso vem das tentativas registradas.</p></div><div class="tf17-card"><h2>Treinos programados <span>Agenda privada</span></h2>'+u.tasks.filter(t=>t.date>=today).slice(0,8).map(t=>'<div class="task"><div class="data"><strong>'+esc(t.date.split("-").reverse().join("/"))+' · '+esc(t.title)+'</strong><small>'+esc(t.time)+' · '+esc(u.s.statuses?.[t.id]||"pendente")+'</small></div><button data-do="view" data-id="'+esc(t.id)+'">Abrir</button></div>').join("")+'</div></section>';
}
function detail(cmd){
 const u=get();if(!u)return;
 const info=u.d.commands?.[cmd]||{},v=report(u,cmd),task=next(u,cmd),list=Object.keys(u.d.commands||{}),i=(Math.max(0,list.indexOf(cmd))%4)+2;
 if(!modal){modal=document.createElement("dialog");modal.className="tf17-modal";modal.id="tf17-detail";document.body.append(modal)}
 const instructions=Array.isArray(info.steps)&&info.steps.length?info.steps:["Escolha um lugar calmo e prepare petiscos.","Apresente o comando uma vez e aguarde.","Marque com ISSO! o acerto e recompense; use OKAY para liberar quando apropriado."];
 modal.innerHTML='<img class="pic" src="'+pic(i)+'" alt="Foto ilustrativa de pastor branco suíço" onerror="this.style.display=\'none\'"><div class="copy"><div class="tf17-kicker">ESCOLA DO SHIRO · COMANDO</div><h2>'+esc(cmd)+'</h2><p class="tf17-muted">'+esc(info.why||"Treino de obediência com reforço positivo.")+'</p><ol>'+instructions.map(s=>'<li>'+esc(s)+'</li>').join("")+'</ol><div class="tf17-dog-medals"><div><strong>'+v.attempts+'</strong><small>Tentativas</small></div><div><strong>'+v.hit+'</strong><small>Acertos</small></div><div><strong>'+v.pct+'%</strong><small>Taxa registrada</small></div></div><p class="tf17-photo-license">Foto ilustrativa da raça, não é demonstração da posição do comando. Fonte: <a target="_blank" rel="noopener noreferrer" href="'+credits(i)+'">'+files[i][1]+'</a>.</p><div class="actions">'+(task?'<button class="primary" data-dogstart="'+esc(task.id)+'">▶ Abrir sessão</button>':"")+'<button data-dogclose="yes">Fechar</button></div></div>';
 modal.showModal()
}
async function upload(file){
 if(!file||!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size>10000000){alert("Selecione imagem JPG, PNG ou WebP de até 10 MB.");return}
 let url;try{
 url=URL.createObjectURL(file);
 const image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=url});
 const ratio=Math.min(1,850/image.width,950/image.height),canvas=document.createElement("canvas");
 canvas.width=Math.max(1,Math.round(image.width*ratio));canvas.height=Math.max(1,Math.round(image.height*ratio));canvas.getContext("2d").drawImage(image,0,0,canvas.width,canvas.height);
 let encoded=canvas.toDataURL("image/jpeg",.75);if(encoded.length>420000)encoded=canvas.toDataURL("image/jpeg",.48);
 if(encoded.length>600000)throw Error("Imagem grande demais para armazenamento local.");
 localStorage.setItem(PHOTO,encoded);dogPage()
 }catch(e){alert("Não foi possível carregar a foto: "+e.message)}
 finally{if(url)URL.revokeObjectURL(url)}
}
let pending=false,main=$("#main");function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;const h=main?.querySelector("h1");if(h?.textContent.trim()==="Escola do Shiro"&&!main.querySelector(".tf17-school"))dogPage()})}
if(main)new MutationObserver(schedule).observe(main,{childList:true});
document.addEventListener("click",e=>{const b=e.target.closest("[data-dogcommand],[data-dogfilter],[data-dogclose],[data-dogstart],#tf17-photo-add,#tf17-photo-default");if(!b)return;
 if(b.dataset.dogcommand)detail(b.dataset.dogcommand);
 else if(b.dataset.dogfilter){filter=b.dataset.dogfilter;dogPage()}
 else if(b.dataset.dogclose)modal?.close();
 else if(b.dataset.dogstart)openSession(b.dataset.dogstart);
 else if(b.id==="tf17-photo-add")$("#tf17-photo-file")?.click();
 else if(b.id==="tf17-photo-default"){if(confirm("Retornar à fotografia de exemplo?")){localStorage.removeItem(PHOTO);dogPage()}}
});
document.addEventListener("change",e=>{if(e.target.id==="tf17-photo-file")upload(e.target.files?.[0])});
window.addEventListener("tf-remote-update",schedule);window.addEventListener("pageshow",schedule);
schedule();
})();
