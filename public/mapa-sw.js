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
 * O item 2 é verdade no build de produção e mentira no `next dev`, que serve
 * `/_next/static/chunks/app/mapa/page.js` e `css/app/layout.css` com o mesmo
 * endereço a cada edição. Sob este worker, a primeira visita de desenvolvimento
 * congelaria o bundle e o CSS, e nenhuma alteração apareceria mais na tela —
 * com a aparência de código que não salvou, não de cache. Por isso este arquivo
 * só é registrado em produção, e em desenvolvimento é ativamente removido junto
 * com os caches `mapa-`: ver `src/hooks/use-convite-instalacao.ts`.
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
/*
 * O número no nome da casca é a válvula de escape deste arquivo.
 *
 * Quando uma casca guardada estraga — foi o que aconteceu com a `v1`, que
 * chegou a guardar bundle de desenvolvimento —, não há como pedir ao navegador
 * de outra pessoa que esvazie o cache: o código que faria isso mora justamente
 * no bundle que o cache velho está servindo. O que quebra o impasse é que o
 * *script do worker* nunca vem do cache dele mesmo: o navegador refaz o
 * download de `mapa-sw.js` a cada navegação dentro do escopo e compara byte a
 * byte. Então basta este arquivo mudar — e trocar o número é a menor mudança
 * possível — para a versão nova instalar, o `activate` abaixo apagar toda
 * casca que não seja a atual e a próxima carga vir limpa.
 *
 * O pacote da base não leva número junto: ele foi baixado de propósito pelo
 * hóspede, pesa megabytes e tem endereço com snapshot no caminho. Apagá-lo
 * porque a casca estragou seria cobrar do hóspede um erro que não é dele.
 */
const CACHE_CASCA = 'mapa-casca-v2';
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
 * Guardado agora, atualizado por baixo para a próxima vez.
 *
 * É o que os arquivos sem hash no nome precisam. `/mapa-worker/`,
 * `/mapa-instalavel.js`, o manifesto e os ícones mantêm o mesmo endereço para
 * sempre: com cache primeiro, a versão baixada na primeira visita seria servida
 * até o fim dos tempos, e um deploy que corrigisse o worker do MapLibre nunca
 * chegaria a quem já tivesse o antigo — o pior caso é o mapa abrir em branco
 * com o cache cheio, que é a falha mais difícil de diagnosticar aqui.
 *
 * A resposta sai do cache no mesmo instante, então a promessa de funcionar sem
 * sinal continua de pé; a ida à rede acontece em paralelo e só troca o que está
 * guardado. Quem paga o atraso de uma versão é a visita atual, nunca a
 * seguinte. Se a rede falhar, o `catch` deixa o guardado como estava — offline
 * isto se comporta exatamente como cache primeiro.
 *
 * A ida à rede é criada fora, pelo `fetch` listener, porque quem a segura viva
 * é o `waitUntil` do evento: sem isso o navegador pode desligar o worker no
 * instante em que a resposta guardada sai, e a atualização morre pela metade —
 * de novo servindo a versão velha na visita seguinte.
 *
 * Ela chega aqui podendo rejeitar, de propósito. Havendo cópia guardada, a
 * rejeição é irrelevante e some no `waitUntil`. Não havendo, a rede é a única
 * fonte, e o erro dela precisa chegar ao navegador como erro — engoli-lo aqui
 * devolveria `undefined` ao `respondWith`, que é uma falha bem menos legível do
 * que a que o navegador daria sozinho.
 */
async function doRevalidando(cache, requisicao, rede) {
  const guardado = await caches.match(requisicao, { cacheName: cache });

  return guardado ?? rede;
}

/** A metade em segundo plano do `doRevalidando`: busca e guarda. */
function atualizarEmSegundoPlano(cache, requisicao) {
  return fetch(requisicao).then((resposta) =>
    guardar(cache, requisicao, resposta),
  );
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

  /*
   * Cache primeiro só aqui, e só porque o endereço é imutável: o nome do chunk
   * carrega o hash do conteúdo. Vale no build de produção — e este worker é
   * registrado apenas lá, justamente porque no `next dev` a mesma URL muda de
   * conteúdo a cada edição. Ver `src/hooks/use-convite-instalacao.ts`.
   */
  if (url.pathname.startsWith('/_next/static/')) {
    evento.respondWith(doCache(CACHE_CASCA, request));
    return;
  }

  /*
   * Estes não têm hash — o endereço é o mesmo para sempre —, então cache
   * primeiro os congelaria na primeira visita e um deploy nunca os alcançaria.
   * A resposta continua saindo do cache na hora; o que muda é que a cópia
   * guardada é trocada por baixo para a visita seguinte.
   */
  if (ARQUIVOS_DO_APP.has(url.pathname)) {
    const rede = atualizarEmSegundoPlano(CACHE_CASCA, request);

    // O `catch` é do `waitUntil`, não da resposta: aqui a rejeição só encerra
    // a atualização em silêncio. Quem decide o que fazer com ela quando não há
    // cópia guardada é o `doRevalidando`.
    evento.waitUntil(rede.catch(() => undefined));
    evento.respondWith(doRevalidando(CACHE_CASCA, request, rede));
  }
});
