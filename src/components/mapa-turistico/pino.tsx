'use client';

import { useEffect } from 'react';
import { Star } from 'lucide-react';
import {
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  useMap,
} from '@/components/ui/map';
import { CATEGORIAS, type Local } from '@/lib/mapa-turistico';
import { cn } from '@/lib/utils';
import { ZOOM_INICIAL } from './base-cartografica';
import CartaoRapido from './cartao-rapido';

/**
 * Como o tamanho do pino responde ao zoom.
 *
 * `2 ** ((zoom - referencia) * forca)` é o crescimento do próprio mapa elevado
 * a uma fração. Com `forca: 1` o pino acompanharia o terreno metro a metro e
 * as pontas ficariam impraticáveis — invisível de longe, gigante de perto.
 * `0.45` encolhe o bastante para os pinos se desencostarem e ainda deixa o
 * desenho legível na ponta de baixo.
 *
 * A referência é `ZOOM_INICIAL.desktop`, e esse é o ponto: o mapa não abre
 * nele. Quem enquadra na abertura é `enquadrarTudo`, que encaixa o vale na
 * tela e para em ~11,9 num desktop largo e no zoom mínimo num celular. Pôr a
 * referência na abertura foi a primeira tentativa e não deu em nada — a
 * escala abria em 0,99, e a tela cheia de pinos, que é o caso do problema,
 * continuava igual. Com a referência acima da abertura, a vista inicial já
 * chega encolhida e o tamanho nominal fica reservado a quem aproximou.
 *
 * Os pisos são por dedo, não por largura de tela: num mouse o pino pode ficar
 * pequeno à vontade, porque o ponteiro é preciso; num toque ele não pode
 * descer abaixo do que se acerta com o polegar. `pointer: coarse` responde
 * exatamente essa pergunta.
 */
const ESCALA = {
  referencia: ZOOM_INICIAL.desktop,
  forca: 0.45,
  maxima: 1.15,
  piso: { ponteiroFino: 0.55, ponteiroGrosso: 0.75 },
} as const;

/**
 * A lista de mídia é consultada a cada evento de zoom, então vive fora do
 * componente: criar uma nova por quadro é desperdício, e a mesma serve o mapa
 * inteiro. Fica nula no servidor, onde não há `window` — e o piso do ponteiro
 * fino é o certo até a primeira medição no cliente.
 */
const TOQUE =
  typeof window === 'undefined' ? null : window.matchMedia('(pointer: coarse)');

function escalaDoZoom(zoom: number) {
  const bruta = 2 ** ((zoom - ESCALA.referencia) * ESCALA.forca);
  // Relido a cada chamada, e não guardado: quem alterna mouse e toque no mesmo
  // aparelho muda de piso sem precisar recarregar o mapa.
  const piso = TOQUE?.matches
    ? ESCALA.piso.ponteiroGrosso
    : ESCALA.piso.ponteiroFino;

  return Math.min(ESCALA.maxima, Math.max(piso, bruta));
}

/**
 * Publica a escala dos pinos como variável CSS no container do mapa.
 *
 * Poderia ser estado de React, mas o evento `zoom` dispara a cada quadro de
 * uma rolagem ou de um pinçar, e re-renderizar as quatro dezenas de pinos
 * nesse ritmo engasga. Escrevendo direto na variável, quem recalcula é o
 * navegador e o React não é acordado nenhuma vez.
 *
 * A variável mora no container porque todo marcador do MapLibre é descendente
 * dele — a herança do CSS entrega o valor a todos de uma vez.
 *
 * Sem transição, de propósito: o valor já chega quadro a quadro, e uma
 * transição por cima só atrasaria o pino em relação ao chão que ele marca.
 */
export function EscalaZoom() {
  const { map } = useMap();

  useEffect(() => {
    if (!map) return;

    const container = map.getContainer();
    const aplicar = () =>
      container.style.setProperty(
        '--pino-escala',
        String(escalaDoZoom(map.getZoom())),
      );

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
 * do que o mapa abre: `--pino-escala` encolhe todos juntos conforme o mapa se
 * afasta, e a vista inicial já chega menor do que os números daqui.
 *
 * O Refúgio se distingue por tamanho, cor e borda, e só. Sem pulso e sem nome
 * fixo embaixo: o rótulo permanente disputava espaço com os pinos vizinhos, e
 * a animação infinita puxava o olho para o único ponto do mapa que ninguém
 * precisa procurar — o rótulo agora é do selecionado, como em qualquer outro
 * pino.
 *
 * A cauda de 2×9px abaixo do círculo é o que faz o pino "apontar": o
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
  const categoria = CATEGORIAS[local.cat];
  const Icone = local.refugio ? CATEGORIAS.hospedagem.icone : categoria.icone;

  const diametro = local.refugio
    ? 43
    : selecionado
      ? 41
      : local.destaque
        ? 35
        : 30;

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
          className='flex origin-bottom flex-col items-center'
          style={{ scale: 'var(--pino-escala, 1)' }}
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
                className='absolute -top-1 -right-1.5 grid size-[17px] place-items-center rounded-full border-2'
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
            className='h-[9px] w-0.5'
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

          Sem ações aqui: o balão fecha assim que o ponteiro sai do pino, então
          um botão dentro dele não teria como ser alcançado.

          Ele só existe enquanto o pino está em cena — o balão instala o próprio
          ouvinte no marcador, fora do alcance do conteúdo, e sem isso o mapa
          abriria a prévia de um pino que ficou transparente.

          O balão do `ui/map` vem com moldura escura de tooltip curto; o cartão
          traz o próprio fundo e a própria sombra, então ela é zerada aqui. */}
      {visivel && (
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
