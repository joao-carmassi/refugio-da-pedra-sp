/*
 * Service worker de desligamento do antigo PWA do mapa.
 *
 * O mapa turístico morou neste domínio e registrava um service worker neste
 * endereço, com escopo `/mapa`. Ele saiu daqui e hoje tem site próprio, mas
 * quem instalou o app ou visitou o mapa continua com o worker antigo no
 * navegador — e com os caches `mapa-casca-*` e `mapa-base-*` que a versão mais
 * velha deixou no disco.
 *
 * O navegador rebaixa este arquivo a cada navegação dentro do escopo e compara
 * byte a byte. Como o conteúdo mudou, esta versão instala, apaga os caches,
 * cancela o próprio registro e recarrega as abas abertas, que voltam a vir
 * direto da rede, sem worker nenhum.
 *
 * Pode ser apagado depois de alguns meses, quando não houver mais visitas
 * chegando com o worker antigo registrado.
 */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    (async () => {
      const nomes = await caches.keys();

      await Promise.all(nomes.map((nome) => caches.delete(nome)));

      await self.registration.unregister();

      const abas = await self.clients.matchAll({ type: 'window' });

      await Promise.all(
        abas.map((aba) => aba.navigate(aba.url).catch(() => undefined)),
      );
    })(),
  );
});
