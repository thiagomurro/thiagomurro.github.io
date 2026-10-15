/* TOTAL FOCUS V13 — Instalação iPhone e diagnóstico local, zero serviços pagos */
(()=>{"use strict";
const $=(q,r=document)=>r.querySelector(q);
const standalone=()=>window.matchMedia?.("(display-mode: standalone)")?.matches||navigator.standalone===true;
const storage=()=>{try{const key="tf13.storage.test",value="ok";localStorage.setItem(key,value);const ok=localStorage.getItem(key)===value;localStorage.removeItem(key);return ok}catch{return false}};
function check() {
 let result=$(".tf13-check","#setup" in window?document:document);
 const setup=$("#setup .card");
 if(setup&&!$("#tf13-setup",setup)){
   const section=document.createElement("section");section.id="tf13-setup";section.className="tf13-setup";
   section.innerHTML='<div class="tf13-head"><span>◈ CONFIGURAÇÃO DO IPHONE</span><span id="tf13-mode"></span></div><ol><li>Abra este endereço no <strong>Safari</strong> do iPhone.</li><li>Use <strong>Compartilhar → Adicionar à Tela de Início</strong>.</li><li>Abra o ícone <strong>TOTAL FOCUS</strong> instalado.</li><li>Importe o arquivo <strong>MEU_CRONOGRAMA_TOTAL_FOCUS_NAO_PUBLICAR.json</strong> no formulário acima.</li></ol><div id="tf13-storage"></div><p>Não desinstale o aplicativo sem exportar um backup criptografado de seus registros.</p>';
   setup.append(section)
 }
 const st=standalone(),s=storage();
 if($("#tf13-mode"))$("#tf13-mode").textContent=st?"✓ MODO APP":"ABERTO NO NAVEGADOR";
 if($("#tf13-storage"))$("#tf13-storage").textContent=s?"✓ Este navegador consegue salvar registros neste momento.":"⚠ O armazenamento local está bloqueado ou indisponível.";
 const main=$("#main"),cfg=main?.querySelector("h1")?.textContent?.includes("Ajustes e privacidade");
 if(cfg&&!$("#tf13-health")){
    const panel=document.createElement("section");panel.id="tf13-health";panel.className="card tf13-health";
    panel.innerHTML='<h2>Diagnóstico do aplicativo</h2><div class="tf13-rows"><div><span>Modo de instalação</span><strong id="tf13-app-status"></strong></div><div><span>Armazenamento local</span><strong id="tf13-store-status"></strong></div><div><span>Backup do histórico</span><strong>Manual e criptografado</strong></div></div><p>Faça backup regularmente, especialmente antes de atualizar o aplicativo ou trocar de telefone. O modo instalado não garante recuperação se os dados do Safari forem apagados.</p><div class="buttons"><button type="button" id="tf13-backup" class="primary">Fazer backup agora</button><button type="button" id="tf13-export">Exportar cronograma</button></div>';
    main.append(panel)
 }
 if($("#tf13-app-status"))$("#tf13-app-status").textContent=st?"✓ Instalado como app":"Abra pela Tela de Início";
 if($("#tf13-store-status"))$("#tf13-store-status").textContent=s?"✓ Escrita permitida":"⚠ Indisponível";
}
document.addEventListener("click",e=>{
 if(e.target.closest("#tf13-backup")){const btn=$('[data-do="backup"]');if(btn)btn.click()}
 if(e.target.closest("#tf13-export")){const btn=$('[data-do="exportAgenda"]');if(btn)btn.click()}
});
let scheduled=false;const tick=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;check()})};
const main=$("#main");if(main)new MutationObserver(tick).observe(main,{childList:true});
tick();
})();
