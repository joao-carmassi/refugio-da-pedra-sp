import base from '@/data/base-offline.json';

/**
 * Regras do pacote offline do mapa.
 *
 * O `public/mapa-sw.js` só *lê* dos caches. Quem escreve é esta página: o
 * `CacheStorage` é da origem, não do service worker, e `caches.open()` existe na
 * janela igual. Baixar daqui dá progresso de verdade item a item, cancelamento e
 * retomada — coisas que um `postMessage` para o service worker teria de
 * reinventar, com o estado dividido entre dois lados que não se enxergam.
 *
 * Nada aqui toca em React: são as regras puras, para o hook `useMapaOffline`
 * ficar só com o ciclo de vida. Mesma divisão de `pwa-instalacao.ts`.
 */

/**
 * Os nomes dos caches. Contrato literal com `public/mapa-sw.js`: as mesmas duas
 * strings estão escritas lá, e mudar um lado exige mudar o outro.
 */
const CACHE_CASCA = 'mapa-casca-v1';
const CACHE_BASE = 'mapa-base-v1';

/** Quanto o navegador precisa ter livre para o download caber com folga. */
const ESPACO_MINIMO = 12 * 1024 * 1024;

/** Requisições em voo. O suficiente para não deixar a barra parada. */
const SIMULTANEAS = 6;

export const PACOTE = {
  snapshot: base.snapshot,
  bytes: base.bytes,
} as const;

export type EstadoOffline =
  | 'indisponivel'
  | 'ausente'
  | 'parcial'
  | 'pronto'
  | 'desatualizado';

export interface Situacao {
  estado: EstadoOffline;
  /** Fração do pacote já guardada, de 0 a 1. */
  fracao: number;
}

/** `4,6 MB`. */
export function formatarBytes(bytes: number): string {
  return `${(bytes / 1048576).toFixed(1).replace('.', ',')} MB`;
}

/** O navegador tem o que este módulo precisa? Safari antigo e http:// não têm. */
export function temSuporte(): boolean {
  return (
    typeof window !== 'undefined' &&
    'caches' in window &&
    'serviceWorker' in navigator
  );
}

const raiz = `/mapa-base/${base.snapshot}`;

/**
 * Toda URL do pacote da base.
 *
 * Expandida das faixas em vez de lida de uma lista escrita: as faixas cabem em
 * duzentos bytes no bundle, e setecentos caminhos literais custariam quinze mil
 * para dizer a mesma coisa pior — a geometria some no meio da lista.
 */
export function urlsDaBase(): string[] {
  // O estilo não entra: ele viaja dentro do bundle (`src/data/base-estilo.json`),
  // que a casca já guarda. Aqui é só o que mora em `public/`.
  const urls: string[] = [];
  // Anotado porque a lista costuma sair vazia do gerador, e um `[]` no JSON o
  // TypeScript lê como `never[]`.
  const ausentes = new Set<string>(base.ausentes);

  for (const [z, faixa] of Object.entries(base.faixas)) {
    for (let x = faixa.x0; x <= faixa.x1; x++) {
      for (let y = faixa.y0; y <= faixa.y1; y++) {
        if (!ausentes.has(`${z}/${x}/${y}`)) {
          urls.push(`${raiz}/tiles/${z}/${x}/${y}.pbf`);
        }
      }
    }
  }

  for (const stack of base.glifos) {
    for (const faixa of base.faixasGlifo) {
      urls.push(`${raiz}/glifos/${encodeURIComponent(stack)}/${faixa}.pbf`);
    }
  }

  // Os quatro: o MapLibre escolhe entre 1x e 2x pelo `devicePixelRatio`, e o
  // hóspede pode abrir o mapa guardado noutra tela.
  for (const nome of ['ofm.json', 'ofm.png', 'ofm@2x.json', 'ofm@2x.png']) {
    urls.push(`${raiz}/sprite/${nome}`);
  }

  return urls;
}

/**
 * Em que pé está o pacote, conferido no próprio cache.
 *
 * A verdade mora no cache e não no `localStorage`: o navegador pode despejar o
 * armazenamento sem avisar — no iPhone, onde `persist()` não é concedido, isso é
 * rotina —, e um registro dizendo "baixado" sobre um cache vazio manda o hóspede
 * para a serra confiando num mapa que não está lá.
 *
 * O snapshot no caminho é o que separa "incompleto" de "velho": as URLs pedidas
 * já trazem a leva de dados corrente, então zero presentes num cache que não
 * está vazio quer dizer que o site gerou base nova depois do download.
 *
 * A fração vem junto porque `parcial` sozinho não diz nada ao botão: navegar
 * pelo mapa já deixa algumas dezenas de tiles guardados sem ninguém pedir, e
 * oferecer "continuar" a quem nunca começou seria falar de um download que não
 * houve.
 */
export async function estado(): Promise<Situacao> {
  if (!temSuporte()) return { estado: 'indisponivel', fracao: 0 };

  const cache = await caches.open(CACHE_BASE);
  const guardadas = new Set(
    (await cache.keys()).map((req) => new URL(req.url).pathname),
  );

  if (!guardadas.size) return { estado: 'ausente', fracao: 0 };

  const querido = urlsDaBase();
  const presentes = querido.filter((url) => guardadas.has(url)).length;
  const fracao = presentes / querido.length;

  if (presentes === querido.length) return { estado: 'pronto', fracao: 1 };

  return { estado: presentes === 0 ? 'desatualizado' : 'parcial', fracao };
}

/**
 * As URLs da casca do app, tiradas do DOM que está na tela.
 *
 * Os chunks do Next levam hash no nome e mudam a cada build, então uma lista
 * escrita à mão envelheceria no primeiro deploy. A página renderizada, essa
 * sabe exatamente quais são os seus — e sabe hoje, não na hora da build.
 *
 * Na prática isto é rede de segurança: o `fetch` do service worker já guarda
 * `/_next/static/` conforme passa, então depois de uma visita online a casca
 * está inteira sem ninguém pedir. Serve para o caso de o hóspede apertar o botão
 * antes de o service worker ter assumido o controle, o que acontece na primeira
 * visita de todas.
 */
export function urlsDaCasca(): string[] {
  const urls = new Set<string>(['/mapa/']);

  const mesmaOrigem = (valor: string | null) => {
    if (!valor) return;

    const url = new URL(valor, location.origin);

    if (url.origin === location.origin) urls.add(url.pathname + url.search);
  };

  for (const script of document.querySelectorAll('script[src]')) {
    mesmaOrigem(script.getAttribute('src'));
  }

  for (const elo of document.querySelectorAll('link[href]')) {
    const rel = elo.getAttribute('rel') ?? '';

    // `stylesheet` e `preload` (as fontes do next/font entram por aqui). O
    // `icon` e o `manifest` já estão na lista fixa do service worker.
    if (rel.includes('stylesheet') || rel.includes('preload')) {
      mesmaOrigem(elo.getAttribute('href'));
    }
  }

  for (const entrada of performance.getEntriesByType('resource')) {
    if (entrada.name.includes('/_next/static/')) mesmaOrigem(entrada.name);
  }

  return [...urls];
}

/** O navegador tem espaço? Devolve `null` quando não dá para saber. */
export async function espacoSuficiente(): Promise<boolean | null> {
  if (!navigator.storage?.estimate) return null;

  const { quota, usage } = await navigator.storage.estimate();

  if (quota === undefined || usage === undefined) return null;

  return quota - usage > ESPACO_MINIMO;
}

interface Progresso {
  feitos: number;
  total: number;
}

/**
 * Baixa o pacote, item a item.
 *
 * Item a item, e não `cache.addAll`: o `addAll` não conta nada enquanto corre e
 * é tudo-ou-nada, então um único arquivo fora do ar descartaria os outros
 * setecentos que já tinham chegado.
 *
 * A conferência antes de cada item deixa a retomada de graça. Fechar a aba na
 * metade custa o item corrente, não o download — e é o que faz o botão poder
 * dizer "continuar" em vez de "começar de novo" para quem já tinha tentado.
 */
export async function baixar(
  aoAndar: (progresso: Progresso) => void,
  sinal?: AbortSignal,
): Promise<void> {
  await navigator.storage?.persist?.().catch(() => false);

  const casca = await caches.open(CACHE_CASCA);
  const cache = await caches.open(CACHE_BASE);

  const tarefas: Array<[Cache, string]> = [
    ...urlsDaCasca().map((url) => [casca, url] as [Cache, string]),
    ...urlsDaBase().map((url) => [cache, url] as [Cache, string]),
  ];

  const total = tarefas.length;
  let feitos = 0;

  async function operario() {
    for (let tarefa = tarefas.shift(); tarefa; tarefa = tarefas.shift()) {
      const [onde, url] = tarefa;

      if (sinal?.aborted) throw new DOMException('Cancelado', 'AbortError');

      if (!(await onde.match(url))) {
        const resposta = await fetch(url, { signal: sinal });

        if (resposta.ok) await onde.put(url, resposta);
      }

      aoAndar({ feitos: ++feitos, total });
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(SIMULTANEAS, total) }, operario),
  );
}

/** Devolve o espaço. Quem baixou por engano num plano de dados tem como voltar. */
export async function remover(): Promise<void> {
  await caches.delete(CACHE_BASE);
}
