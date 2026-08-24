'use client';

import { Crosshair, Minus, Plus, TentTree } from 'lucide-react';
import { useMap } from '@/components/ui/map';
import { REFUGIO } from '@/lib/mapa-turistico';
import { cn } from '@/lib/utils';
import { ZOOM_FOCO, enquadrarTudo } from './base-cartografica';

interface Props {
  variante: 'desktop' | 'mobile';
  className?: string;
}

/**
 * Controles do mapa.
 *
 * Não usa o `MapControls` do mapcn: o desenho pede o botão "Refúgio" — que
 * não é zoom nem bússola — na mesma pilha dos demais, e pede a pilha na
 * paleta do mapa. O comportamento continua vindo da instância do MapLibre via
 * `useMap()`.
 */
function Controles({ variante, className }: Props) {
  const { map } = useMap();
  const mobile = variante === 'mobile';

  function irParaRefugio() {
    map?.flyTo({
      center: [REFUGIO.lng, REFUGIO.lat],
      zoom: ZOOM_FOCO,
      duration: 800,
      essential: true,
    });
  }

  function reenquadrar() {
    if (!map) return;
    enquadrarTudo(map, mobile, 800);
  }

  const botaoPilha =
    'grid place-items-center transition-colors hover:bg-black/5';

  return (
    <div
      className={cn(
        'pointer-events-auto flex flex-col items-end gap-2.5',
        className,
      )}
    >
      <button
        type='button'
        onClick={irParaRefugio}
        aria-label={`Centralizar no ${REFUGIO.nome}`}
        style={{
          background: 'var(--map-green)',
          color: '#fff',
          boxShadow: 'var(--map-shadow-control)',
        }}
        className={cn(
          'flex items-center gap-2 text-[13px] font-bold transition-[filter] hover:brightness-90',
          mobile
            ? 'size-11 justify-center rounded-2xl'
            : 'h-10.5 rounded-xl px-3.5',
        )}
      >
        <TentTree aria-hidden='true' className='size-5' />
        {!mobile && 'Refúgio'}
      </button>

      {/* A pilha inteira é de desktop. No celular sobrava um botão só nela,
          e uma caixa com um único item ao lado do botão do Refúgio lê como
          peça esquecida — o zoom ali se faz com os dedos. */}
      {!mobile && (
        <div
          style={{
            background: 'var(--map-surface)',
            borderColor: 'var(--map-line)',
            boxShadow: 'var(--map-shadow-control)',
          }}
          className='flex flex-col overflow-hidden rounded-xl border'
        >
          <button
            type='button'
            onClick={() => map?.zoomIn()}
            aria-label='Aproximar'
            style={{ color: 'var(--map-ink)' }}
            className={cn(botaoPilha, 'size-10.5')}
          >
            <Plus className='size-5' />
          </button>
          <span
            aria-hidden='true'
            style={{ background: 'var(--map-line)' }}
            className='h-px'
          />
          <button
            type='button'
            onClick={() => map?.zoomOut()}
            aria-label='Afastar'
            style={{ color: 'var(--map-ink)' }}
            className={cn(botaoPilha, 'size-10.5')}
          >
            <Minus className='size-5' />
          </button>
          <span
            aria-hidden='true'
            style={{ background: 'var(--map-line)' }}
            className='h-px'
          />
          <button
            type='button'
            onClick={reenquadrar}
            aria-label='Ver todos os pontos'
            style={{ color: 'var(--map-ink)' }}
            className={cn(botaoPilha, 'size-10.5')}
          >
            <Crosshair className='size-5' />
          </button>
        </div>
      )}
    </div>
  );
}

export default Controles;
