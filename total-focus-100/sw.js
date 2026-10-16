/* TOTAL FOCUS offline cache premium V17 */
const VERSION="totalfocus100-responsive-v22-20261016";
const ASSETS=["./","./index.html","./manifest.webmanifest","./icon.svg","./game-v10.css","./game-v10.js","./game-v11.css","./game-v11.js","./coach-v12.css","./coach-v12.js","./install-v13.css","./install-v13.js","./reminders-v14.css","./reminders-v14.js","./cloud-v16.css","./cloud-v16.js","./experience-v17.css","./metrics-v17.js","./shiro-v17.js","./trainer-photo-v17.js","./home-v17.js","./screens-v18.css","./screens-v18.js","./qa-v19.css","./qa-v19.js","./premium-v20.css","./premium-v20.js","./desktop-v22.css","./desktop-v22.js","./scenery-v22.svg"];
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
