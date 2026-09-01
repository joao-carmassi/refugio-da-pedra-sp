/**
 * Regras do convite para instalar o PWA do mapa.
 *
 * O navegador esconde a instalação num item de menu que quase ninguém procura
 * — no Chrome do Android, dentro dos três pontinhos; no iPhone, dentro do
 * botão de compartilhar. Quem chega ao mapa procurando onde ficam as
 * cachoeiras não vai atrás disso. Este módulo guarda o que decide quando a
 * página pode oferecer o atalho por conta própria, e o estado que impede a
 * oferta de virar insistência.
 *
 * Nada aqui toca em React: são as regras puras, para o hook
 * `useConviteInstalacao` ficar só com o ciclo de vida.
 *
 * Vale para o PWA do mapa, não para o da pousada — são dois apps distintos,
 * ver `pwa-mapa.ts`. A pousada segue sem convite: o site dela é de leitura, e
 * atalho na tela de início não muda como se lê uma página uma vez só.
 */

/**
 * O service worker mínimo que torna a rota instalável, e o escopo que ele
 * controla.
 *
 * O escopo é `/mapa` sem barra final de propósito, a mesma string do `scope`
 * de `public/mapa.webmanifest`: a comparação é de prefixo, então cobre
 * `/mapa/` e `/mapa-turistico/` de uma vez. Um escopo mais estreito que a
 * pasta do arquivo é sempre permitido, então o service worker pode morar na
 * raiz de `public/` sem precisar do cabeçalho `Service-Worker-Allowed`.
 */
export const SERVICE_WORKER = {
  url: '/mapa-sw.js',
  scope: '/mapa',
} as const;

/**
 * Onde o script de captura guarda o `beforeinstallprompt` interceptado.
 *
 * O evento é disparado uma única vez, no fim do carregamento, e some se
 * ninguém o segurar — inclusive se ele chegar antes de o React hidratar, o
 * que na tela do mapa é plausível: é a rota mais pesada do site. Por isso a
 * captura acontece fora do React, em `public/mapa-instalavel.js`, e o hook lê
 * daqui.
 *
 * Esta chave e o evento abaixo são o contrato com aquele arquivo: os nomes
 * estão escritos literalmente lá, e mudar um lado exige mudar o outro.
 */
export const CHAVE_EVENTO = '__conviteInstalarMapa';

/** Aviso de que a chave acima deixou de estar vazia. */
export const EVENTO_DISPONIVEL = 'mapa:instalavel';

/**
 * O script que faz a captura.
 *
 * Arquivo estático em `public/`, e não trecho inline no JSX: um `<script>`
 * inline renderizado por componente React nunca é executado quando a rota
 * chega por navegação client-side — o navegador ignora scripts inseridos
 * assim, e o React só avisa no console. Com `src` e `async` o React 19 trata a
 * tag como elemento içado: move para o `<head>`, executa e deduplica pelo
 * `src`, na primeira carga e na navegação interna.
 */
export const SCRIPT_CAPTURA_URL = '/mapa-instalavel.js';

/**
 * A partir de quantas visitas o convite pode aparecer.
 *
 * Duas: na primeira a pessoa ainda está descobrindo o que é a página, e
 * oferecer atalho para algo que ela não sabe se quer é o que faz banner de
 * instalação virar ruído. Voltar é o sinal de que o mapa serviu.
 */
export const VISITAS_ATE_CONVITE = 2;

/**
 * Quanto tempo depois de a rota abrir. O mapa demora a montar e a pessoa
 * chegou para usá-lo: aparecer junto com a tela seria interromper antes de
 * entregar.
 */
export const ATRASO_MS = 6000;

/** Silêncio depois de um "agora não". Um mês — a próxima viagem é outra. */
export const ESPERA_APOS_RECUSA_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Parâmetro que chama o convite na hora, sem esperar segunda visita e sem
 * respeitar silêncio: `/mapa/?instalar=1`.
 *
 * É o link para divulgar o app fora do site — na bio do Instagram, numa
 * mensagem, num QR code impresso. Quem clica já disse que quer instalar, então
 * as regras que existem para não incomodar quem não pediu não se aplicam.
 *
 * No iPhone o link sempre funciona, porque lá o convite é só instrução. No
 * Chrome ele depende do evento do navegador chegar: se o app já está
 * instalado, ou se a instalação foi recusada há pouco no diálogo nativo, o
 * Chrome não dispara mais e nada aparece — não há como a página forçar isso.
 */
export const PARAMETRO_FORCAR = 'instalar';

/**
 * Atraso quando o convite veio por link. Curto: quem clicou está esperando o
 * diálogo, não o mapa. Não é zero porque o evento do navegador chega no fim do
 * carregamento, e aparecer antes dele deixaria o botão sem ação.
 */
export const ATRASO_FORCADO_MS = 600;

/** `true` quando a URL traz o parâmetro acima. */
export function foiPedidoPorLink(): boolean {
  return new URLSearchParams(window.location.search).has(PARAMETRO_FORCAR);
}

/**
 * Tira o parâmetro da URL depois que a pessoa decidiu.
 *
 * Sem isso, recarregar a página — ou voltar a ela pelo histórico — traria o
 * convite de novo, porque a URL continuaria pedindo. E como o link costuma
 * chegar por fora do site, ele tende a ser justamente o endereço que fica
 * salvo na aba.
 *
 * `replaceState`, e não o router do Next: não há nada para renderizar de
 * novo, e trocar a entrada atual do histórico em vez de empilhar uma nova é o
 * que faz o botão "voltar" continuar levando de onde a pessoa veio. O
 * `history.state` é repassado porque é onde o App Router guarda o estado de
 * navegação dele.
 */
export function limparParametroDoLink(): void {
  const url = new URL(window.location.href);
  if (!url.searchParams.has(PARAMETRO_FORCAR)) return;

  url.searchParams.delete(PARAMETRO_FORCAR);
  window.history.replaceState(
    window.history.state,
    '',
    `${url.pathname}${url.search}${url.hash}`,
  );
}

const CHAVE_VISITAS = 'mapa:visitas';
const CHAVE_SILENCIO = 'mapa:convite-silenciado-ate';
const CHAVE_INSTALADO = 'mapa:convite-instalado';
const CHAVE_SESSAO = 'mapa:visita-contada';

/**
 * `beforeinstallprompt`, que não existe no `lib.dom` porque nunca saiu de
 * proposta — é do Chromium, e o Safari nunca implementou.
 */
export interface EventoInstalacao extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

/**
 * Acesso ao armazenamento que devolve `null` quando ele não está disponível —
 * navegação anônima e navegadores com cookies bloqueados podem lançar já na
 * primeira gravação.
 *
 * Sem armazenamento não há como contar visitas nem lembrar de uma recusa, e o
 * convite passaria a reaparecer a cada carregamento. Quem lê `null` aqui
 * desiste de convidar: melhor não oferecer nada do que insistir.
 */
function armazem(qual: 'local' | 'sessao'): Storage | null {
  try {
    const alvo = qual === 'local' ? window.localStorage : window.sessionStorage;
    const teste = '__teste';
    alvo.setItem(teste, '1');
    alvo.removeItem(teste);
    return alvo;
  } catch {
    return null;
  }
}

function gravar(alvo: Storage, chave: string, valor: string): void {
  try {
    alvo.setItem(chave, valor);
  } catch {
    // Cota estourada ou gravação bloqueada: o convite simplesmente não avança.
  }
}

/**
 * Conta esta visita e devolve o total, ou `null` se não há onde contar.
 *
 * Uma por sessão, e não por carregamento: recarregar a página, voltar do
 * detalhe de um lugar ou navegar entre `/mapa-turistico/` e `/mapa/` é a
 * mesma visita. O marcador de sessão é o que separa as duas coisas.
 */
export function contarVisita(): number | null {
  const local = armazem('local');
  const sessao = armazem('sessao');
  if (!local || !sessao) return null;

  const total = Number(local.getItem(CHAVE_VISITAS)) || 0;
  if (sessao.getItem(CHAVE_SESSAO)) return total;

  gravar(sessao, CHAVE_SESSAO, '1');
  gravar(local, CHAVE_VISITAS, String(total + 1));
  return total + 1;
}

/** `true` enquanto durar o silêncio pedido por uma recusa ou por uma instalação. */
export function estaSilenciado(): boolean {
  const local = armazem('local');
  if (!local) return true;
  if (local.getItem(CHAVE_INSTALADO)) return true;

  const ate = Number(local.getItem(CHAVE_SILENCIO)) || 0;
  return Date.now() < ate;
}

export function silenciar(ms: number = ESPERA_APOS_RECUSA_MS): void {
  const local = armazem('local');
  if (local) gravar(local, CHAVE_SILENCIO, String(Date.now() + ms));
}

/**
 * Marca o app como instalado.
 *
 * Guardado à parte do silêncio porque não expira: o `display-mode` só denuncia
 * a instalação quando a pessoa abre pelo atalho, e quem instalou e continuou
 * navegando na aba do navegador seguiria recebendo o convite sem esta marca.
 */
export function marcarInstalado(): void {
  const local = armazem('local');
  if (local) gravar(local, CHAVE_INSTALADO, '1');
}

/** `true` quando a página está rodando como app, e não como aba do navegador. */
export function abertoComoApp(): boolean {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean })
    .standalone;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    iosStandalone === true
  );
}

/**
 * `true` no iOS e no iPadOS.
 *
 * O Safari nunca implementou `beforeinstallprompt`, e no iOS todo navegador é
 * WebKit por baixo — nenhum deles dá à página um botão que instale. Lá o
 * convite só pode ensinar o caminho, e por isso precisa se reconhecer.
 *
 * O iPad se declara "Macintosh" desde o iPadOS 13; `maxTouchPoints` é o que o
 * separa de um Mac de verdade, que não tem tela sensível ao toque.
 */
export function ehIOS(): boolean {
  const agente = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(agente)) return true;

  return /Macintosh/.test(agente) && navigator.maxTouchPoints > 1;
}

/** O evento que o script inline segurou, se ele chegou a acontecer. */
export function eventoCapturado(): EventoInstalacao | null {
  const janela = window as unknown as Record<string, unknown>;
  return (janela[CHAVE_EVENTO] as EventoInstalacao | null) ?? null;
}

/** O evento vale uma chamada só: depois de usado, some do buffer. */
export function descartarEventoCapturado(): void {
  const janela = window as unknown as Record<string, unknown>;
  janela[CHAVE_EVENTO] = null;
}
