/* Guarda os arquivos do app no aparelho para abrir sem internet.
   Só guarda os arquivos do próprio app; nunca os seus dados.
   Ao publicar uma nova versão, mude o número abaixo. */
const VERSAO = 'financeiro-v2';
const ARQUIVOS = ['./', './index.html', './manifest.webmanifest', './icone-192.png', './icone-512.png', './icone-maskable-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('financeiro-') && k !== VERSAO).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  const chave = url.origin + url.pathname;
  e.respondWith(fetch(url.href, { cache: 'no-cache' })
    .then(r => { if (r.ok && r.type === 'basic') { const copia = r.clone(); caches.open(VERSAO).then(c => c.put(chave, copia)).catch(() => {}); } return r; })
    .catch(() => caches.open(VERSAO).then(c => c.match(chave, { ignoreSearch: true })).then(r => r || Response.error())));
});
