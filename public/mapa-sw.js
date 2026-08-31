/*
 * Service worker do PWA do mapa.
 *
 * Ele nasceu sem cachear nada, e o comentário de então explicava por quê: "o
 * mapa desenha a partir de tiles vindos da rede: sem conexão ele não
 * funcionaria de qualquer forma". Isso deixou de ser verdade. A base
 * cartográfica agora é servida daqui (`public/mapa-base/<snapshot>/`, gerada
 * por `scripts/gerar-base-offline.mjs`), os dados dos lugares e as rotas já
 * viajavam dentro do bundle, e o que faltava para a rota inteira funcionar sem
 * sinal era exatamente este arquivo.
 *
 * A objeção antiga continua de pé e é respondida, não ignorada: "service worker
 * que cacheia passa a servir versão velha do site depois de cada deploy". Duas
 * escolhas fazem com que isso não aconteça aqui.
 *
 *   1. O documento é rede primeiro. Deploy novo aparece na primeira carga
 *      online, não na segunda; o cache dele só entra em cena quando a rede
 *      falha, que é o caso para o qual ele existe.
 *   2. Tudo que é cache primeiro tem endereço imutável. Os chunks do Next levam
 *      hash de conteúdo no nome, e o pacote da base leva o snapshot no caminho —
 *      em nenhum dos dois a mesma URL pode significar duas coisas diferentes.
 *      Não há versão velha para servir por engano.
 *
 * Escopo `/mapa`, sem barra final, como antes. Não é limitação: escopo decide
 * quais *documentos* este arquivo controla, não quais URLs ele pode interceptar
 * — com `/mapa/` sob controle, todo subrecurso que a página pedir passa por
 * aqui, `/_next/static/` inclusive. A única coisa que precisa morar sob o
 * prefixo é o worker do MapLibre, porque script de worker casa pela própria
 * URL; foi por isso que ele se mudou para `/mapa-worker/`.
 *
 * E é por isso que as rotas da pousada seguem intocadas: elas não estão no
 * escopo, este arquivo nunca é consultado nelas, e o `fetch` abaixo ainda
 * recusa por conta própria tudo que não reconhece.
 */

/*
 * Os dois caches, e o contrato de nome com `src/lib/mapa-offline.ts` — o
 * download roda na janela e escreve nestes mesmos caches, então os nomes estão
 * escritos literalmente nos dois arquivos e mudar um lado exige mudar o outro.
 *
 * Separados porque têm ciclos de vida diferentes: a casca envelhece a cada
 * deploy e é remontada sozinha, o pacote da base foi baixado de propósito pelo
 * hóspede e não pode sumir num `activate` de rotina.
 */
const CACHE_CASCA = 'mapa-casca-v1';
const CACHE_BASE = 'mapa-base-v1';
const NOSSOS = [CACHE_CASCA, CACHE_BASE];

/** O documento da rota, e a chave sob a qual ele é guardado. */
const DOCUMENTO = '/mapa/';

/**
 * Arquivos do app que não moram em `/_next/static/` e não têm hash no nome.
 *
 * Todos já carregam o prefixo `mapa-` por convenção do projeto, o que os deixa
 * dentro do escopo sem esforço. O worker é o item que não pode faltar: sem ele
 * o MapLibre não decodifica tile nenhum, e o mapa abre em branco com o cache
 * cheio — a falha mais difícil de diagnosticar deste arquivo inteiro.
 */
const ARQUIVOS_DO_APP = new Set([
  '/mapa-worker/maplibre-gl-worker.mjs',
  '/mapa-worker/maplibre-gl-shared.mjs',
  '/mapa-instalavel.js',
  '/mapa.webmanifest',
  '/mapa-icon-96x96.png',
  '/mapa-apple-icon.png',
  '/mapa-web-app-manifest-192x192.png',
  '/mapa-web-app-manifest-512x512.png',
]);

self.addEventListener('install', () => {
  /*
   * Sem esperar as abas antigas fecharem. Continua seguro pelo mesmo motivo do
   * item 2 lá em cima: não existe par de versões disputando uma URL só. Uma aba
   * da versão anterior nunca recebe um chunk da nova, porque o nome do chunk
   * mudou junto com o conteúdo.
   */
  self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    (async () => {
      const nomes = await caches.keys();

      await Promise.all(
        nomes
          .filter((nome) => nome.startsWith('mapa-') && !NOSSOS.includes(nome))
          .map((nome) => caches.delete(nome)),
      );

      await self.clients.claim();
    })(),
  );
});

/** Guarda a resposta e devolve a original — `Response` só se lê uma vez. */
async function guardar(cache, requisicao, resposta) {
  if (resposta.ok) {
    await caches.open(cache).then((c) => c.put(requisicao, resposta.clone()));
  }

  return resposta;
}

/**
 * Cache primeiro, e grava o que passar.
 *
 * A gravação na ausência é o que torna a casca automática: depois de uma visita
 * online, o mapa inteiro menos os tiles já está guardado, sem ninguém ter
 * apertado botão nenhum. O botão de baixar fica sendo só sobre o pacote da base.
 */
async function doCache(cache, requisicao) {
  const guardado = await caches.match(requisicao, { cacheName: cache });

  if (guardado) return guardado;

  return guardar(cache, requisicao, await fetch(requisicao));
}

/**
 * Rede primeiro para o documento da tela do mapa, cache como ela falhar.
 *
 * A chave é sempre `/mapa/`, montada à mão em vez de vir da requisição. Sem
 * servidor não há o 308 que normaliza `/mapa` para `/mapa/`, e os parâmetros
 * (`?refugio=1`, `?lugar=…`, `?instalar=1`) são lidos no cliente sobre a mesma
 * página estática — guardar uma entrada por combinação encheria o cache de
 * cópias do mesmo arquivo, e ainda deixaria de fora a combinação que o hóspede
 * usasse justamente quando ficasse sem sinal.
 */
async function doDocumento(requisicao) {
  try {
    return guardar(CACHE_CASCA, DOCUMENTO, await fetch(requisicao));
  } catch {
    const guardado = await caches.match(DOCUMENTO, { cacheName: CACHE_CASCA });

    if (guardado) return guardado;

    return new Response(
      'O mapa ainda não foi guardado para uso sem internet.',
      { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    );
  }
}

self.addEventListener('fetch', (evento) => {
  const { request } = evento;
  const url = new URL(request.url);

  /*
   * Sem `respondWith`, o navegador segue para a rede exatamente como seguiria
   * sem service worker nenhum. É a saída para tudo que este arquivo não tem
   * motivo para tocar, e ela vem primeiro de propósito: o padrão é não
   * interferir.
   */
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Prefetch do roteador do Next pede a carga RSC, não HTML. Devolver o
  // documento guardado aqui entregaria uma página inteira ao parser de flight,
  // que engasgaria. Offline o prefetch simplesmente falha, e o Next cai numa
  // navegação de verdade — que o ramo do documento atende.
  if (request.headers.has('RSC') || url.searchParams.has('_rsc')) return;

  // As fotos ficam de fora por decisão: o pacote offline é sobre o mapa, não
  // sobre a galeria. Sem interceptar, a falha é imediata e `foto-local.tsx`
  // mostra a hachura no lugar, em vez de uma imagem quebrada.
  if (url.pathname.startsWith('/_next/image')) return;

  /*
   * Só a tela do mapa. O escopo `/mapa` é prefixo e alcança `/mapa-turistico/`
   * também, mas a promessa de funcionar offline é de uma rota só: servir o
   * documento guardado para qualquer navegação que falhasse entregaria o app do
   * mapa no endereço da página de conteúdo — que é pior do que o erro honesto do
   * navegador, porque a barra de endereços diria uma coisa e a tela, outra.
   */
  if (request.mode === 'navigate') {
    if (url.pathname.replace(/\/?$/, '/') === DOCUMENTO) {
      evento.respondWith(doDocumento(request));
    }

    return;
  }

  if (url.pathname.startsWith('/mapa-base/')) {
    evento.respondWith(doCache(CACHE_BASE, request));
    return;
  }

  if (
    url.pathname.startsWith('/_next/static/') ||
    ARQUIVOS_DO_APP.has(url.pathname)
  ) {
    evento.respondWith(doCache(CACHE_CASCA, request));
  }
});
