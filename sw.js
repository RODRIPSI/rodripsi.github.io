/* Bloco Mágico: guarda os próprios arquivos para funcionar sem internet.
   Não mexe em nada do Consultório (rodripsi.github.io/consultorio/): nem nos arquivos, nem nas cópias guardadas dele. */
const CACHE="bloco-magico-v17";
const ASSETS=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];
const ehDoConsultorio=u=>u.origin===location.origin&&u.pathname.startsWith("/consultorio");
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS.map(a=>new Request(a,{cache:"reload"})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("bloco-magico")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
 if(ehDoConsultorio(u))return;
 const shell=u.origin===location.origin,lib=/cdn\.jsdelivr\.net|fonts\.(googleapis|gstatic)\.com/.test(u.host);
 if(!shell&&!lib)return;
 e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res})
  .catch(()=>caches.open(CACHE).then(c=>c.match(r).then(m=>m||(shell?c.match("./index.html"):Response.error())))))});
