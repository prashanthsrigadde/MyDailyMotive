const CACHE='my-daily-motive-v3-5';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./sw.js'];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.mode==='navigate'){
    event.respondWith(
      fetch(event.request,{cache:'no-store'})
        .then(response=>{
          const copy=response.clone();
          caches.open(CACHE).then(c=>c.put('./index.html',copy));
          return response;
        })
        .catch(()=>caches.match('./index.html'))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(cached=>cached||fetch(event.request))
    );
  }
});