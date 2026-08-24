'use client';

import { Star } from 'lucide-react';
import { MapMarker, MarkerContent, MarkerTooltip } from '@/components/ui/map';
import { CATEGORIAS, type Local } from '@/lib/mapa-turistico';
import { cn } from '@/lib/utils';
import CartaoRapido from './cartao-rapido';

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
    ? 46
    : selecionado
      ? 44
      : local.destaque
        ? 38
        : 32;

  const zIndex = local.refugio
    ? 520
    : selecionado
      ? 510
      : local.destaque
        ? 470
        : 440;

  // Preenchido só quando o pino "acende": fora disso o ícone fica na cor da
  // categoria sobre o cartão branco, que é o que mantém a base legível.
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
          'transition-[opacity,transform] duration-300 ease-out',
          visivel
            ? 'scale-100 opacity-100'
            : 'pointer-events-none scale-50 opacity-0',
        )}
      >
        <div
          style={{
            zIndex,
            width: diametro,
            height: diametro,
            background: aceso
              ? local.refugio
                ? 'var(--map-green-deep)'
                : categoria.cor
              : 'var(--map-surface)',
            color: aceso ? 'var(--map-sand)' : categoria.cor,
            borderColor: local.refugio
              ? 'var(--map-stone)'
              : selecionado
                ? 'var(--map-surface)'
                : local.destaque
                  ? 'var(--map-stone)'
                  : categoria.cor,
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
          {local.refugio && (
            <span
              data-map-pulse
              aria-hidden='true'
              className='absolute -inset-1.5 rounded-full border-2'
              style={{
                borderColor: 'var(--map-stone)',
                animation: 'map-pin-pulse 2.4s ease-out infinite',
              }}
            />
          )}

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
            background: local.refugio
              ? 'var(--map-green-deep)'
              : selecionado
                ? categoria.cor
                : 'rgb(27 36 32 / 0.35)',
          }}
          className='h-[9px] w-0.5'
        />

        {(local.refugio || selecionado) && (
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
