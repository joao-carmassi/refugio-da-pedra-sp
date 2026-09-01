'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { Star } from 'lucide-react';
import {
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  useMap,
} from '@/components/ui/map';
import { CATEGORIAS, type Local } from '@/lib/mapa-turistico';
import { cn } from '@/lib/utils';
import { ZOOM_INICIAL, ZOOM_MAXIMO } from './base-cartografica';
import CartaoRapido from './cartao-rapido';

/**
 * Como o tamanho do pino responde ao zoom.
 *
 * `2 ** ((zoom - referencia) * forca)` é o crescimento do próprio mapa elevado
 * a uma fração. Com `forca: 1` o pino acompanharia o terreno metro a metro e
 * as pontas ficariam impraticáveis — invisível de longe, gigante de perto. A
 * fração encolhe o bastante para os pinos se desencostarem e ainda deixa o
 * desenho legível embaixo. `referencia` é o zoom em que a escala vale 1 e os
 * diâmetros do pino são o que se vê; `piso` e `teto` cortam as pontas.
 *
 * São duas curvas, escolhidas por `pointer: coarse` e não por largura de tela,
 * porque a pergunta que importa nas duas pontas é sobre o dedo.
 *
 * No ponteiro fino a referência é `ZOOM_INICIAL.desktop`, acima do zoom em que
 * o mapa abre — quem enquadra na abertura é `enquadrarTudo`, que encaixa o vale
 * na tela e para em ~11,9 num desktop largo. Pôr a referência na abertura foi a
 * primeira tentativa e não deu em nada: a escala abria em 0,99 e a tela cheia
 * de pinos, que é o caso do problema, continuava igual. Com ela acima, a vista
 * inicial já chega encolhida. O piso pode ser baixo porque o ponteiro é
 * preciso.
 *
 * No toque a curva inteira é outra, e desliza para o fim do zoom. Numa tela de
 * 390px quem decide se dois pinos se encavalam não é o zoom, é a largura: do
 * vale inteiro até o centro da cidade os pontos ficam a algumas dezenas de
 * pixels um do outro, e ali o pino precisa ficar no piso o tempo todo — 0,75,
 * que é o menor tamanho que ainda se acerta com o polegar. Só perto de
 * `ZOOM_MAXIMO`, quando o mapa já abriu a rua e sobra espaço entre os pontos,
 * é que ele cresce. Por isso a referência é `ZOOM_MAXIMO - 1` e a força é mais
 * suave: o piso segura até ~14,6 e o pino chega ao teto por volta de 16,7.
 */
const ESCALA = {
  ponteiroFino: {
    referencia: ZOOM_INICIAL.desktop,
    forca: 0.45,
    piso: 0.55,
    teto: 1.15,
  },
  ponteiroGrosso: {
    referencia: ZOOM_MAXIMO - 1,
    forca: 0.3,
    piso: 0.75,
    teto: 1.15,
  },
} as const;

/**
 * A lista de mídia é consultada a cada evento de zoom, então vive fora do
 * componente: criar uma nova por quadro é desperdício, e a mesma serve o mapa
 * inteiro. Fica nula no servidor, onde não há `window` — e a curva do ponteiro
 * fino é a certa até a primeira medição no cliente.
 */
const TOQUE =
  typeof window === 'undefined' ? null : window.matchMedia('(pointer: coarse)');

function assinarToque(aoMudar: () => void) {
  TOQUE?.addEventListener('change', aoMudar);

  return () => TOQUE?.removeEventListener('change', aoMudar);
}

/**
 * `true` quando o ponteiro é grosso — dedo, e não mouse.
 *
 * A mesma lista de mídia que decide a curva da escala, agora lida por quem
 * renderiza. `useSyncExternalStore` porque o valor vive fora do React e pode
 * mudar sozinho: quem encaixa o aparelho num teclado passa a ter mouse, e a
 * prévia de hover deixa de ser inalcançável no meio da sessão.
 */
function useToque() {
  return useSyncExternalStore(
    assinarToque,
    () => TOQUE?.matches ?? false,
    () => false,
  );
}

function escalaDoZoom(zoom: number) {
  // Relido a cada chamada, e não guardado: quem alterna mouse e toque no mesmo
  // aparelho troca de curva sem precisar recarregar o mapa.
  const curva = TOQUE?.matches ? ESCALA.ponteiroGrosso : ESCALA.ponteiroFino;
  const bruta = 2 ** ((zoom - curva.referencia) * curva.forca);

  return Math.min(curva.teto, Math.max(curva.piso, bruta));
}

/**
 * As camadas que o zoom escala, uma por pino, e a escala em vigor.
 *
 * A primeira versão publicava a escala como variável CSS no container do mapa
 * e deixava a herança entregá-la aos pinos. Custou caro: o `<Map>` guarda os
 * filhos no mesmo elemento que o MapLibre usa de container, então busca,
 * filtros, painéis e folha moram todos lá dentro — perto de 900 nós. Trocar
 * uma propriedade personalizada nesse elemento invalida o estilo herdado da
 * subárvore inteira, e o `zoom` dispara a cada quadro: medido em produção,
 * 0,43s de recálculo de estilo em 3,3s de zoom, 27% do tempo de tarefa.
 *
 * Escrever `scale` direto em cada camada troca uma invalidação de 900 nós por
 * 32 escritas dirigidas. O React continua sem ser acordado, que era o ponto da
 * variável.
 */
const CAMADAS = new Set<HTMLElement>();

let escalaAtual = 1;

/**
 * Pino recém-montado entra já no tamanho certo.
 *
 * Sem isto, um pino que nasce com o mapa longe apareceria no tamanho nominal
 * até o zoom seguinte — e o filtro monta pinos a qualquer momento.
 */
function registrarCamada(el: HTMLElement) {
  CAMADAS.add(el);
  el.style.scale = String(escalaAtual);

  return () => {
    CAMADAS.delete(el);
  };
}

/**
 * Mantém a escala dos pinos em dia com o zoom.
 *
 * Poderia ser estado de React, mas o evento `zoom` dispara a cada quadro de
 * uma rolagem ou de um pinçar, e re-renderizar as quatro dezenas de pinos
 * nesse ritmo engasga.
 *
 * Sem transição, de propósito: o valor já chega quadro a quadro, e uma
 * transição por cima só atrasaria o pino em relação ao chão que ele marca.
 */
export function EscalaZoom() {
  const { map } = useMap();

  useEffect(() => {
    if (!map) return;

    const aplicar = () => {
      escalaAtual = escalaDoZoom(map.getZoom());

      const valor = String(escalaAtual);

      for (const camada of CAMADAS) camada.style.scale = valor;
    };

    aplicar();
    map.on('zoom', aplicar);

    return () => {
      map.off('zoom', aplicar);
    };
  }, [map]);

  return null;
}

interface Props {
  local: Local;
  /**
   * `false` mantém o pino montado, porém fora de cena. Quem chama não desmonta
   * os pinos que saem do filtro — é o que permite a eles animarem a saída.
   */
  visivel: boolean;
  selecionado: boolean;
  destacado: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

/**
 * Um pino do mapa.
 *
 * Quatro variantes, do menor para o maior: comum, parceiro em Destaque,
 * selecionado e o Refúgio. O tamanho é o que ordena a leitura — quem olha o
 * mapa de longe vê primeiro o Refúgio, depois os parceiros, depois o resto.
 * O `z-index` segue a mesma ordem para que o pino maior nunca fique atrás de
 * um menor.
 *
 * Esses diâmetros valem no zoom de referência (ver `ESCALA`), que é mais perto
 * do que o mapa abre: `EscalaZoom` encolhe todos juntos conforme o mapa se
 * afasta, e a vista inicial já chega menor do que os números daqui.
 *
 * O Refúgio se distingue por tamanho, cor e borda, e só. Sem pulso e sem nome
 * fixo embaixo: o rótulo permanente disputava espaço com os pinos vizinhos, e
 * a animação infinita puxava o olho para o único ponto do mapa que ninguém
 * precisa procurar — o rótulo agora é do selecionado, como em qualquer outro
 * pino.
 *
 * A cauda de 2×8px abaixo do círculo é o que faz o pino "apontar": o
 * `anchor='bottom'` do MapLibre ancora a base do elemento na coordenada, então
 * é a ponta da cauda que cai sobre o lugar, não o centro do círculo.
 */
function Pino({
  local,
  visivel,
  selecionado,
  destacado,
  onSelect,
  onHover,
}: Props) {
  // Só o registro; quem escreve a escala a partir daqui é `EscalaZoom`.
  const camada = useCallback(
    (el: HTMLDivElement | null) => (el ? registrarCamada(el) : undefined),
    [],
  );

  const toque = useToque();
  const categoria = CATEGORIAS[local.cat];
  const Icone = local.refugio ? CATEGORIAS.hospedagem.icone : categoria.icone;

  const diametro = local.refugio
    ? 39
    : selecionado
      ? 37
      : local.destaque
        ? 32
        : 27;

  const zIndex = local.refugio
    ? 520
    : selecionado
      ? 510
      : local.destaque
        ? 470
        : 440;

  // Aceso agora quer dizer só "com a sombra forte": todo pino é preenchido, e
  // o preenchimento deixou de servir de sinal de estado.
  const aceso = selecionado || Boolean(local.refugio);

  return (
    <MapMarker
      longitude={local.lng}
      latitude={local.lat}
      anchor='bottom'
      // Os guardas são o que torna o pino fora de cena inerte de verdade: o
      // MapLibre escuta no elemento que ele mesmo cria, acima do conteúdo, e
      // `pointer-events-none` no conteúdo não o alcança.
      onClick={() => visivel && onSelect(local.id)}
      onMouseEnter={() => visivel && onHover(local.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Entra e sai crescendo a partir da ponta da cauda, que é o ponto que
          de fato marca o lugar. */}
      <MarkerContent
        className={cn(
          'relative flex origin-bottom flex-col items-center',
          // `scale`, e não `transform`: no Tailwind v4 o `scale-50` abaixo
          // escreve na propriedade `scale`, que é própria. Com `transform` na
          // lista o pino só desbotava, e o crescer prometido no comentário
          // acima acontecia de uma vez, no primeiro quadro.
          'transition-[opacity,scale] duration-300 ease-out',
          visivel
            ? 'scale-100 opacity-100'
            : 'pointer-events-none scale-50 opacity-0',
        )}
      >
        {/* A camada que o zoom mexe. Fica separada da de cima porque as duas
            escalam: a de fora anima a entrada e a saída do pino, esta segue o
            afastamento do mapa, e no Tailwind v4 as duas escreveriam na mesma
            propriedade `scale` se estivessem no mesmo elemento.

            `origin-bottom` de novo: encolher a partir da ponta da cauda
            mantém o pino sobre a coordenada e mantém a etiqueta abaixo dele,
            que é irmã desta camada justamente para não encolher junto — texto
            de 11px a 72% não se lê. */}
        <div
          ref={camada}
          className='flex origin-bottom flex-col items-center'
        >
          <div
            style={{
              zIndex,
              width: diametro,
              height: diametro,
              // Disco na cor da categoria com o desenho claro por cima: sobre
              // um mapa de papel, cheio de textura, a mancha de cor é o que se
              // acha de longe — o contorno fino sobre branco se perdia no fundo.
              // A borda clara não é enfeite: é ela que descola o disco do que
              // estiver embaixo quando os dois têm cor forte.
              background: local.refugio
                ? 'var(--map-green-deep)'
                : categoria.cor,
              color: 'var(--map-sand)',
              borderColor:
                local.refugio || local.destaque
                  ? 'var(--map-stone)'
                  : 'var(--map-surface)',
              borderWidth: local.refugio || selecionado ? 3 : local.destaque ? 2.5 : 2,
              boxShadow: aceso
                ? 'var(--map-shadow-pin-active)'
                : 'var(--map-shadow-pin)',
            }}
            className={cn(
              'relative grid cursor-pointer place-items-center rounded-full border-solid',
              'transition-transform duration-200 ease-out',
              destacado && !selecionado && 'scale-115',
            )}
          >
            <Icone
              aria-hidden='true'
              strokeWidth={2.25}
              style={{ width: diametro * 0.52, height: diametro * 0.52 }}
            />

            {local.destaque && (
              <span
                aria-hidden='true'
                className='absolute -top-1 -right-1.5 grid size-[15px] place-items-center rounded-full border-2'
                style={{
                  background: 'var(--map-stone)',
                  borderColor: 'var(--map-surface)',
                  color: 'var(--map-surface)',
                }}
              >
                <Star className='size-2.5' fill='currentColor' />
              </span>
            )}
          </div>

          <span
            aria-hidden='true'
            style={{
              zIndex,
              // A cauda acompanha o disco: com o disco preenchido, deixá-la
              // cinza fazia o pino parecer duas peças soltas.
              background: local.refugio
                ? 'var(--map-green-deep)'
                : categoria.cor,
            }}
            className='h-2 w-0.5'
          />
        </div>

        {selecionado && (
          <span
            style={{
              zIndex,
              background: 'var(--map-surface)',
              borderColor: 'var(--map-line)',
              color: 'var(--map-ink)',
              boxShadow: 'var(--map-shadow-pin)',
            }}
            className='absolute top-full left-1/2 mt-0.5 -translate-x-1/2 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap'
          >
            {local.nome}
          </span>
        )}
      </MarkerContent>

      {/* A prévia do lugar é este balão, e só ele: o clique no pino vai direto
          para a ficha completa. No toque não existe hover — o MapLibre só abre
          o popup no ponteiro —, então o mobile nunca o vê e recebe a mesma
          prévia pelo cartão inferior.

          Por isso o `!toque`: até aqui o cartão era montado assim mesmo, no
          contêiner solto do balão, e ficava lá sem chance de aparecer. Medido
          num celular emulado, os trinta e dois custavam cerca de 990 nós fora
          do documento e a maior parte de dez mil ouvintes de evento. Quem não
          tem ponteiro não precisa deles montados; quem encaixar um teclado
          passa a ter, porque `useToque` acompanha a mudança.

          Sem ações aqui: o balão fecha assim que o ponteiro sai do pino, então
          um botão dentro dele não teria como ser alcançado.

          Ele só existe enquanto o pino está em cena — o balão instala o próprio
          ouvinte no marcador, fora do alcance do conteúdo, e sem isso o mapa
          abriria a prévia de um pino que ficou transparente.

          O balão do `ui/map` vem com moldura escura de tooltip curto; o cartão
          traz o próprio fundo e a própria sombra, então ela é zerada aqui. */}
      {visivel && !toque && (
        <MarkerTooltip
          offset={diametro + 12}
          className='w-88 bg-transparent p-0 text-[color:var(--map-ink)] shadow-none'
        >
          <CartaoRapido local={local} variante='desktop' acoes={false} />
        </MarkerTooltip>
      )}
    </MapMarker>
  );
}

export default Pino;
