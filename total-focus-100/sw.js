/* TOTAL FOCUS offline cache premium V17 */
const VERSION="totalfocus100-v28.1-20261016";
const ASSETS=["./","./index.html","./manifest.webmanifest","./icon.svg","./game-v10.css","./game-v10.js","./game-v11.css","./game-v11.js","./coach-v12.css","./coach-v12.js","./install-v13.css","./install-v13.js","./reminders-v14.css","./reminders-v14.js","./cloud-v16.css","./cloud-v16.js","./experience-v17.css","./metrics-v17.js","./shiro-v17.js","./trainer-photo-v17.js","./home-v17.js","./screens-v18.css","./screens-v18.js","./qa-v19.css","./qa-v19.js","./premium-v20.css","./premium-v20.js","./desktop-v22.css","./desktop-v22.js","./plan-import-v23.js","./study-progress-v24.css","./study-progress-v24.js","./scenery-v22.svg","./tf25-ui.js","./tf25-ui.css","./tf28-status.js","./tf25-assets/shiro_cartao_deita.webp","./tf25-assets/warmup_polichinelo.webp","./tf25-assets/flexao_etapa_3.webp","./tf25-assets/card_treino_d.webp","./tf25-assets/flexao_etapa_2.webp","./tf25-assets/shiro_cartao_fica.webp","./tf25-assets/card_treino_b.webp","./tf25-assets/flexao_etapa_1.webp","./tf25-assets/flexao_etapa_4.webp","./tf25-assets/shiro_senta_etapa_3.webp","./tf25-assets/shiro_senta_etapa_1.webp","./tf25-assets/shiro_cartao_senta.webp","./tf25-assets/card_treino_c.webp","./tf25-assets/shiro_senta_etapa_4.webp","./tf25-assets/shiro_senta_etapa_2.webp","./tf25-assets/shiro_cartao_traz.webp","./tf25-assets/warmup_mobilidade.webp","./tf25-assets/card_treino_a.webp","./tf25-assets/shiro_cartao_deixa.webp","./tf25-assets/shiro_cartao_junto.webp","./tf25-assets/musculos_traseiro.webp","./tf25-assets/musculos_frontal.webp","./tf25-assets/shiro_cartao_vem.webp"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(VERSION).then(cache=>Promise.all(ASSETS.map(asset=>cache.add(asset)))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("totalfocus100-")&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 event.respondWith(fetch(event.request).then(response=>{
  if(response.ok){const copy=response.clone();event.waitUntil(caches.open(VERSION).then(cache=>cache.put(event.request,copy)).catch(()=>{}))}
  return response
 }).catch(async()=>{const cache=await caches.open(VERSION);return (await cache.match(event.request,{ignoreSearch:true}))||Response.error()}))
});
