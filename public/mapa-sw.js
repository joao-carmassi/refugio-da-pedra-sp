/*
 * Service worker do PWA do mapa.
 *
 * Existe por um motivo só: o Chrome (Android e desktop) não dispara
 * `beforeinstallprompt` — o evento que dá à página um botão de instalar
 * próprio, em vez de esconder a ação no menu do navegador — enquanto não
 * houver um service worker com handler de `fetch` no escopo da `start_url`.
 * Sem ele o convite de instalação não teria o que fazer no clique.
 *
 * Por isso ele não guarda nada em cache. Service worker que cacheia passa a
 * servir versão velha do site depois de cada deploy, e evitar isso exige
 * versionar o cache e invalidá-lo na ativação — complexidade que só se paga
 * quando existe promessa de funcionar offline. Houve uma tentativa dessa
 * promessa, e ela saiu: em desenvolvimento o `next dev` serve
 * `/_next/static/` com o mesmo endereço a cada edição, e a primeira visita
 * congelava o bundle e o CSS daquele minuto — com a cara de código que não
 * salvou, não de cache. O mapa segue desenhando a partir da base local em
 * `public/mapa-base/`, que é servida pela rede como qualquer outro arquivo.
 *
 * O handler de `fetch` é vazio de propósito. Sem `respondWith` o navegador
 * segue para a rede exatamente como seguiria sem service worker nenhum —
 * nenhuma resposta passa a depender deste arquivo. Se algum dia o critério de
 * instalabilidade exigir mais que a existência do handler, o próximo passo é
 * uma página de fallback offline, não cache do site inteiro.
 *
 * Escopo `/mapa` (declarado no register, sem barra final): a mesma string do
 * `scope` em `public/mapa.webmanifest`, pelo mesmo motivo — a comparação é de
 * prefixo, então ela cobre `/mapa/` e `/mapa-turistico/`, e não vaza para as
 * rotas da pousada, que são o outro PWA.
 */

self.addEventListener('install', () => {
  /*
   * Sem esperar as abas antigas fecharem. Na primeira visita o service worker
   * precisa estar ativo e no controle antes de o navegador avaliar a
   * instalabilidade; ficar em `waiting` adiaria o convite por uma visita
   * inteira. É seguro aqui justamente porque ele não serve conteúdo: não há
   * versão nova e velha para conflitar.
   */
  self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    (async () => {
      /*
       * A saída de quem ficou preso na versão que cacheava.
       *
       * Um navegador que visitou o mapa enquanto o cache existia tem no disco
       * a casca (`mapa-casca-*`) e o pacote da base (`mapa-base-*`), e o
       * código que os apagaria mora justamente no bundle que a casca está
       * servindo. O que quebra o impasse é que o *script do worker* nunca vem
       * do cache dele mesmo: o navegador o rebaixa a cada navegação dentro do
       * escopo e compara byte a byte. Este arquivo mudou, então esta versão
       * instala, e o `activate` esvazia tudo que era do mapa antes de assumir.
       *
       * Sem isso, remover o cache do código não removeria o cache do disco:
       * o `fetch` daqui deixaria de responder, mas as entradas continuariam
       * ocupando megabytes na máquina do hóspede para sempre.
       */
      const nomes = await caches.keys();

      await Promise.all(
        nomes
          .filter((nome) => nome.startsWith('mapa-'))
          .map((nome) => caches.delete(nome)),
      );

      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', () => {});
