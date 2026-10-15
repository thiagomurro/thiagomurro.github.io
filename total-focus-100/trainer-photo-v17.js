/* TOTAL FOCUS V17: reforco fotografico da cartela do Shiro */
(()=>{"use strict";
const root=document.getElementById("tf12-dialog");if(!root)return;
const PHOTO="totalfocus100.v17.shiroPhoto";
const files=["White Swiss Shepherd 1.jpg","White Swiss Shepherd 2.jpg","White Swiss Shepherd 3.jpg","White Swiss Shepherd 4.jpg"];
let pending=false;
function enhance(){
 if(!root.open)return;
 const page=root.querySelector("#tf12-view");if(!page||page.querySelector(".tf17-coach-photo")||!page.querySelector(".tf12-dog-cards"))return;
 const title=page.querySelector(".tf12-movename");if(!title)return;
 const cmd=title.textContent.trim().replace(/^♧\s*/,"");
 const data=(()=>{try{return JSON.parse(localStorage.getItem("totalfocus100.private.dataset.v1"))}catch{return null}})();
 const keys=Object.keys(data?.commands||{}),i=Math.max(0,keys.indexOf(cmd))%4;
 const url=localStorage.getItem(PHOTO)||"https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(files[i])+"?width=800";
 const fig=document.createElement("figure");fig.className="tf17-coach-photo";
 const img=document.createElement("img");img.src=url;img.alt="Foto de pastor-branco-suíço ilustrativa do adestramento";img.loading="lazy";img.onerror=()=>{fig.style.display="none"};
 const caption=document.createElement("figcaption");caption.textContent=localStorage.getItem(PHOTO)?"Foto do Shiro": "Pastor-branco-suíço — fotografia ilustrativa da raça, não um guia visual da posição";
 fig.append(img,caption);title.after(fig);
 const old=page.querySelector(".tf15-photo");if(old)old.style.display="none";
}
function queue(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;enhance()})}
new MutationObserver(queue).observe(root,{childList:true,subtree:true});
queue();
})();