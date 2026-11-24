// 常にネットワーク優先。古い保存データは起動のたびに全削除して、画面が更新されないのを防ぐ。
self.addEventListener("install", function(){ self.skipWaiting(); });
self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){ return Promise.all(keys.map(function(k){ return caches.delete(k); })); })
      .then(function(){ return self.clients.claim(); })
  );
});
self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;
  var url = new URL(req.url);
  if(url.origin !== location.origin) return;           // 地図タイルなど外部はそのまま
  e.respondWith(fetch(req, {cache: "no-store"}).catch(function(){ return caches.match(req); }));
});
