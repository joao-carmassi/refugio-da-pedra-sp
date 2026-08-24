'use client';

import { Star } from 'lucide-react';
import { MapMarker, MarkerContent, MarkerTooltip } from '@/components/ui/map';
import { CATEGORIAS, getDistancia, type Local } from '@/lib/mapa-turistico';
import { cn } from '@/lib/utils';

interface Props {
  local: Local;
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
function Pino({ local, selecionado, destacado, onSelect, onHover }: Props) {
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
      onClick={() => onSelect(local.id)}
      onMouseEnter={() => onHover(local.id)}
      onMouseLeave={() => onHover(null)}
    >
      <MarkerContent className='relative flex flex-col items-center'>
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

      {/* No toque não existe hover: o MapLibre só abre este popup no ponteiro,
          então o mobile nunca o vê — a informação chega pelo cartão inferior. */}
      <MarkerTooltip offset={diametro + 12} className='w-49'>
        <div
          style={{
            background: 'var(--map-surface)',
            borderColor: 'var(--map-line)',
            boxShadow: 'var(--map-shadow-panel)',
          }}
          className='rounded-xl border px-3 py-2.5'
        >
          <p
            style={{ color: 'var(--map-ink)' }}
            className='font-display text-sm leading-tight font-semibold'
          >
            {local.nome}
          </p>
          <p
            style={{ color: 'var(--map-meta)' }}
            className='mt-1 text-[11px] leading-tight'
          >
            {categoria.label}
          </p>
          <p
            style={{ color: 'var(--map-body)' }}
            className='text-[11px] leading-tight'
          >
            {getDistancia(local)}
          </p>
        </div>
      </MarkerTooltip>
    </MapMarker>
  );
}

export default Pino;
