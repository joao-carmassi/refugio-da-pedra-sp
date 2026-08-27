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
 * quando existe promessa de funcionar offline. O mapa desenha a partir de
 * tiles vindos da rede: sem conexão ele não funcionaria de qualquer forma.
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
  evento.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {});
