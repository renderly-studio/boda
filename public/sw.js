/* Om gens casem · service worker
   La primera visita ho desa tot; després la web carrega a l'instant
   i funciona fins i tot sense cobertura (útil a la finca!). */
const CACHE = 'omgenscasem-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/'])));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(claus => Promise.all(claus.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // Maps, FormSubmit, fonts: xarxa normal
  e.respondWith(
    caches.match(e.request).then(hit =>
      hit || fetch(e.request).then(resposta => {
        const copia = resposta.clone();
        caches.open(CACHE).then(c => c.put(e.request, copia));
        return resposta;
      }).catch(() => caches.match('/'))
    )
  );
});
