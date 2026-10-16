/* TOTAL FOCUS Cloud V16 - Google Drive appDataFolder | sem senha no codigo */
(()=>{"use strict";
const DATA="totalfocus100.private.dataset.v1",STATE="totalfocus100.v1",CFG="totalfocus100.cloud.v16",BASE="totalfocus100.cloud.baseline",BACK="totalfocus100.cloud.encrypted-safety";
const FILENAME="total-focus-100-private-v1.json",SCOPE="https://www.googleapis.com/auth/drive.appdata";
const $=(s,r=document)=>r.querySelector(s),read=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}};
const txt=s=>String(s||"").replace(/[&<>"]/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[x]));
let clientId=(read(CFG)||{}).clientId||"",token="",expiresAt=0,key=null,remote=null,busy=false,stopped=false,panel=null,lastSync=0,lastErr="",connectedOnce=false;
const EXTRA=["totalfocus100.sleep.v9","totalfocus100.v12.voice","totalfocus100.calendar.v14","totalfocus100.v17.shiroPhoto","totalfocus100.v18.modes","totalfocus100.study.v24"];
function logs(s){const msg=$("#tfcloud-status");if(msg)msg.textContent=s;lastErr=s}
function getExtra(){const extra={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(EXTRA.includes(k)||k.startsWith("totalfocus100.v12.dog-attempts."))extra[k]=localStorage.getItem(k)}return extra}
function localData(){return {schema:1,cronograma:read(DATA),registros:read(STATE)||{},extras:getExtra()}}
function meaningful(x){return !!x?.cronograma?.tasks?.length||!!Object.keys(x?.registros?.statuses||{}).length}
async function digest(x){const a=new TextEncoder().encode(JSON.stringify(x));const h=new Uint8Array(await crypto.subtle.digest("SHA-256",a));return Array.from(h,b=>b.toString(16).padStart(2,"0")).join("")}
function toB64(a){return btoa(String.fromCharCode(...new Uint8Array(a)))}
function fromB64(t){return Uint8Array.from(atob(t),s=>s.charCodeAt(0))}
async function derive(pass,salt){const x=await crypto.subtle.importKey("raw",new TextEncoder().encode(pass),"PBKDF2",false,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt,iterations:240000,hash:"SHA-256"},x,{name:"AES-GCM",length:256},false,["encrypt","decrypt"])}
async function seal(obj){const nonce=crypto.getRandomValues(new Uint8Array(12)),plain=new TextEncoder().encode(JSON.stringify(obj)),cipher=await crypto.subtle.encrypt({name:"AES-GCM",iv:nonce},key,plain);return {format:"TF_CLOUD_AESGCM_V1",nonce:toB64(nonce),cipher:toB64(cipher)}}
async function unseal(blob){if(blob?.format!=="TF_CLOUD_AESGCM_V1"||!blob.nonce||!blob.cipher)throw Error("Arquivo de nuvem incompatível");const value=await crypto.subtle.decrypt({name:"AES-GCM",iv:fromB64(blob.nonce)},key,fromB64(blob.cipher));const data=JSON.parse(new TextDecoder().decode(value));if(data.schema!==1||typeof data!=="object"||!data.registros||!data.extras)throw Error("Dados recuperados inválidos");return data}
function freshToken(){if(!token||Date.now()>expiresAt-60000){token="";throw Error("Sessão do Google expirada. Toque em Conectar novamente.")}}
async function api(url,options={}){freshToken();const x=await fetch(url,{...options,headers:{"Authorization":"Bearer "+token,...options.headers}});if(!x.ok){const t=(await x.text()).slice(0,300);if(x.status===401){token="";throw Error("Google pediu uma nova autorização.")}throw Error("Google Drive "+x.status+": "+t)}const raw=await x.text();try{return JSON.parse(raw)}catch{return raw}}
async function list(){const q=new URLSearchParams({spaces:"appDataFolder",fields:"nextPageToken,files(id,name,version,modifiedTime)",pageSize:"100"});const result=await api("https://www.googleapis.com/drive/v3/files?"+q);return (result.files||[]).filter(x=>x.name===FILENAME).sort((a,b)=>String(b.modifiedTime||"").localeCompare(String(a.modifiedTime||"")))[0]||null}
async function metadata(id){return api("https://www.googleapis.com/drive/v3/files/"+encodeURIComponent(id)+"?fields=id,name,version,modifiedTime")}
async function get(id){return api("https://www.googleapis.com/drive/v3/files/"+encodeURIComponent(id)+"?alt=media")}
async function create(body){const boundary="tf"+crypto.getRandomValues(new Uint32Array(2)).join("");
 const metadata={name:FILENAME,parents:["appDataFolder"],mimeType:"application/json"};
 const content="--"+boundary+"\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n"+JSON.stringify(metadata)+"\r\n--"+boundary+"\r\nContent-Type: application/json\r\n\r\n"+JSON.stringify(body)+"\r\n--"+boundary+"--\r\n";
 return api("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,version,modifiedTime",{method:"POST",headers:{"Content-Type":"multipart/related; boundary="+boundary},body:content})}
async function update(id,body){return api("https://www.googleapis.com/upload/drive/v3/files/"+encodeURIComponent(id)+"?uploadType=media&fields=id,name,version,modifiedTime",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})}
function storeBaseline(hash){localStorage.setItem(BASE,JSON.stringify({hash,at:new Date().toISOString()}));lastSync=Date.now();uiStatus("Sincronizado",true)}
function uiStatus(s,ok=false){logs(s);const badge=$("#tfcloud-badge");if(badge){badge.textContent=s;badge.dataset.ok=ok?"true":"false"}}
async function preserveLocal(){const cur=localData();if(!meaningful(cur))return;const b=await seal(cur);localStorage.setItem(BACK,JSON.stringify({created:new Date().toISOString(),body:b}))}
function apply(inc){if(inc.cronograma?.tasks?.length)localStorage.setItem(DATA,JSON.stringify(inc.cronograma));if(inc.registros)localStorage.setItem(STATE,JSON.stringify(inc.registros));if(inc.extras&&typeof inc.extras==="object"){for(const [name,value] of Object.entries(inc.extras)){if((EXTRA.includes(name)||name.startsWith("totalfocus100.v12.dog-attempts."))&&typeof value==="string")localStorage.setItem(name,value)}}window.dispatchEvent(new Event("tf-remote-update"))}
async function installRemote(inc,hash){await preserveLocal();apply(inc);storeBaseline(hash);uiStatus("Atualizado pela nuvem ✓",true)}
async function upload(snapshot,remoteVersion){const hash=await digest(snapshot),wrapped=await seal(snapshot);
 const bundle={...wrapped,salt:cloudSalt,hash,version:1,updatedAt:new Date().toISOString()};
 if(!remote){remote=await create(bundle)}else{const current=await metadata(remote.id);if(String(current.version)!==String(remoteVersion))throw Error("A nuvem mudou enquanto sincronizávamos. Reabra a sincronização; nenhum dado foi sobrescrito.");remote=await update(remote.id,bundle)}storeBaseline(hash);uiStatus("Alterações enviadas ao Drive ✓",true)}
let cloudSalt=null;
async function synchronize(interactive=false){if(stopped||busy||!key||!token||Date.now()>expiresAt-60000)return;
 busy=true;
 try{
   const mine=localData(),mineHash=await digest(mine),previous=read(BASE)?.hash||null;
   remote=await list();
   if(!remote){if(!meaningful(mine)){uiStatus("Importe primeiro o cronograma neste aparelho.");return}await upload(mine,null);return}
   const version=remote.version,record=await get(remote.id);
   if(!record?.salt)throw Error("Arquivo de nuvem sem salt criptográfico.");
   const salt=fromB64(record.salt);
   if(!cloudSalt){uiStatus("Informe a senha de criptografia desta nuvem para continuar.");return}
   if(toB64(salt)!==toB64(cloudSalt))throw Error("Este arquivo usa outra senha/conta ou inicialização de nuvem.");
   const theirs=await unseal(record),remoteHash=await digest(theirs);
   if(remoteHash===mineHash){storeBaseline(mineHash);return}
   if(!meaningful(mine)){await installRemote(theirs,remoteHash);return}
   if(previous===mineHash){await installRemote(theirs,remoteHash);return}
   if(previous===remoteHash){await upload(mine,version);return}
   stopped=true;uiStatus("Conflito entre PC e iPhone. Precisa escolher a versão.");
   const choice=confirm("As duas versões têm dados diferentes.\nOK: baixar os dados do Google Drive neste aparelho.\nCancelar: manter os dados locais, sem sobrescrever nada.\n\nPara enviar a versão local, use o botão 'Enviar esta versão' depois de conferir o histórico.");
   if(choice){await installRemote(theirs,remoteHash);stopped=false}
 }catch(e){uiStatus("Sincronização: "+e.message)}
 finally{busy=false}}
async function forceUpload(){if(!token||!key){uiStatus("Conecte sua conta antes.");return}if(!confirm("Enviar esta versão local para o Drive? Confira antes se o outro aparelho não tem alterações mais recentes."))return;
 busy=true;try{remote=await list();let prev=remote?.version||null;if(remote){const now=await get(remote.id);if(now.salt!==toB64(cloudSalt))throw Error("Dados remotos protegidos por outra senha.");const theirs=await unseal(now);await preserveLocal();const local=localData();if(await digest(theirs)!==read(BASE)?.hash&&!confirm("A nuvem contém alterações não incorporadas neste aparelho. Mesmo assim substituí-la?"))return}
 await upload(localData(),prev);stopped=false}catch(e){uiStatus("Envio: "+e.message)}finally{busy=false}}
async function loadGIS(){if(window.google?.accounts?.oauth2)return;await new Promise((resolve,reject)=>{const s=document.createElement("script");s.src="https://accounts.google.com/gsi/client";s.async=true;s.onload=resolve;s.onerror=()=>reject(Error("Não foi possível carregar o login Google."));document.head.append(s)})}
async function connect(){if(!crypto.subtle){uiStatus("Criptografia HTTPS indisponível.");return}
 const input=$("#tfcloud-client");clientId=(input?.value||"").trim();if(!/^[A-Za-z0-9-]+\.apps\.googleusercontent\.com$/.test(clientId)){uiStatus("Informe um ID OAuth de aplicativo Web válido.");return}
 localStorage.setItem(CFG,JSON.stringify({clientId}));let pass=$("#tfcloud-pass")?.value||"";if(pass.length<12){uiStatus("Crie ou informe sua senha de criptografia com pelo menos 12 caracteres.");return}
 let salt=localStorage.getItem("totalfocus100.cloud.salt");cloudSalt=salt?fromB64(salt):crypto.getRandomValues(new Uint8Array(16));key=await derive(pass,cloudSalt);$("#tfcloud-pass").value=""; 
 try{if(!window.google?.accounts?.oauth2){loadGIS().then(()=>uiStatus("Autorização pronta. Toque novamente em Entrar com Google.")).catch(e=>uiStatus(e.message));return}const oauth=google.accounts.oauth2.initTokenClient({client_id:clientId,scope:SCOPE,callback:async result=>{if(result.error){uiStatus("Autorização Google: "+result.error);return}token=result.access_token;expiresAt=Date.now()+(Number(result.expires_in)||3600)*1000;connectedOnce=true;uiStatus("Google conectado. Conferindo nuvem...");
    try{const existing=await list();if(existing){const b=await get(existing.id);if(!b?.salt)throw Error("Dados remotos incompatíveis.");if(!salt){cloudSalt=fromB64(b.salt);key=await derive(pass,cloudSalt)}else if(toB64(cloudSalt)!==b.salt){cloudSalt=fromB64(b.salt);key=await derive(pass,cloudSalt)}const confirmHash=await unseal(b);if(!confirmHash?.schema)throw Error("Senha inválida")}localStorage.setItem("totalfocus100.cloud.salt",toB64(cloudSalt));await synchronize(true)}catch(e){uiStatus("Conexão: "+(e.name==="OperationError"?"Senha de criptografia incorreta.":e.message))}
  }});
  oauth.requestAccessToken({prompt:"consent"});
 }catch(e){uiStatus("Login: "+e.message)}}
async function first(){if(token){await synchronize(true);return}await connect()}
function paint(){
 const main=$("#main"),setup=$("#setup"),setupCard=$("#setup .card"),inSetup=!!setupCard&&!setup.classList.contains("hidden"),inSettings=!!main?.querySelector("h1")?.textContent?.includes("Ajustes e privacidade");if(!inSetup&&!inSettings)return;
 let sec=$("#tfcloud-settings");if(sec){const target=inSettings?main:setupCard;if(!target.contains(sec))target.append(sec);return}
 sec=document.createElement("section");sec.id="tfcloud-settings";sec.className="card tfcloud-card";
 sec.innerHTML='<div class="kicker">TOTAL FOCUS CLOUD · BETA</div><h2>Sincronização PC + iPhone</h2><p>Utilize a mesma conta Google e senha de criptografia nos dois aparelhos. Os registros ficam na pasta oculta do aplicativo no Google Drive.</p><label>ID OAuth Google (tipo aplicativo Web)<input id="tfcloud-client" type="text" spellcheck="false" autocomplete="off" placeholder="...apps.googleusercontent.com"></label><label>Senha de criptografia privada (não use uma senha compartilhada em chat)<input id="tfcloud-pass" type="password" autocomplete="new-password" placeholder="Mínimo de 12 caracteres"></label><div class="tfcloud-controls"><button id="tfcloud-connect" class="primary">Entrar com Google e sincronizar</button><button id="tfcloud-now">Sincronizar agora</button><button id="tfcloud-upload" class="warn">Enviar esta versão</button></div><div class="tfcloud-badge" id="tfcloud-badge">Não conectado</div><p class="tfcloud-msg" id="tfcloud-status">A conexão só será ativada após configurar um cliente OAuth 2.0 no Google Cloud e autorizar este site.</p><p class="tfcloud-note"><strong>Proteção de conflitos:</strong> se PC e celular forem alterados antes da sincronização, o aplicativo perguntará qual cópia manter. Ele não apaga a outra cópia silenciosamente. O backup criptografado manual continua recomendado.</p><p class="tfcloud-note">Configuração inicial: acesse <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">Google Cloud — Credenciais</a>, habilite a Google Drive API e crie um Cliente OAuth de Aplicativo Web com a origem https://thiagomurro.github.io. No consentimento, inclua sua conta como usuário de teste quando necessário.</p><p class="tfcloud-note">O login do Google não usa CPF nem senha fixa no código. A autorização pode expirar e exigir um novo toque em Entrar com Google. Sincronização periódica apenas com o app aberto e autorizado.</p>';
 (inSettings?main:setupCard).append(sec);$("#tfcloud-client").value=clientId;loadGIS().catch(()=>{});
}
document.addEventListener("click",e=>{if(e.target.closest("#tfcloud-connect"))connect();if(e.target.closest("#tfcloud-now"))first();if(e.target.closest("#tfcloud-upload"))forceUpload()});
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&token&&Date.now()-lastSync>30000)synchronize()});
setInterval(()=>{if(!document.hidden&&token&&Date.now()-lastSync>30000)synchronize()},45000);
let pending=false;const run=()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;paint()})};const main=$("#main");if(main)new MutationObserver(run).observe(main,{childList:true});run();
})();
