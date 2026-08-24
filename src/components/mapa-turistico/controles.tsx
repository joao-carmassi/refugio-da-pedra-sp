'use client';

import {
  Crosshair,
  LoaderCircle,
  LocateFixed,
  Minus,
  Plus,
  TentTree,
} from 'lucide-react';
import { useMap } from '@/components/ui/map';
import { REFUGIO } from '@/lib/mapa-turistico';
import { cn } from '@/lib/utils';
import { ZOOM_FOCO, ZOOM_INICIAL } from './base-cartografica';

interface Props {
  variante: 'desktop' | 'mobile';
  /**
   * Pedir a localização mora fora daqui: a resposta do navegador vira
   * marcador no mapa e recado na tela, e nenhuma das duas coisas é assunto de
   * uma pilha de botões. O que sobra para os botões é chamar e mostrar espera.
   */
  localizando: boolean;
  onLocalizar: () => void;
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
function Controles({ variante, localizando, onLocalizar, className }: Props) {
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
    map?.flyTo({
      center: [REFUGIO.lng, REFUGIO.lat],
      zoom: mobile ? ZOOM_INICIAL.mobile : ZOOM_INICIAL.desktop,
      duration: 800,
      essential: true,
    });
  }

  const botaoPilha =
    'grid place-items-center transition-colors hover:bg-black/5 disabled:opacity-50';

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

      <div
        style={{
          background: 'var(--map-surface)',
          borderColor: 'var(--map-line)',
          boxShadow: 'var(--map-shadow-control)',
        }}
        className={cn(
          'flex flex-col overflow-hidden border',
          mobile ? 'rounded-2xl' : 'rounded-xl',
        )}
      >
        <button
          type='button'
          onClick={onLocalizar}
          disabled={localizando}
          aria-label='Usar minha localização'
          aria-busy={localizando}
          style={{ color: 'var(--map-ink)' }}
          className={cn(botaoPilha, mobile ? 'size-11' : 'size-10.5')}
        >
          {/* A espera pode passar de dez segundos sem GPS. Sem o giro, o
              botão apagado é indistinguível de botão que não fez nada. */}
          {localizando ? (
            <LoaderCircle aria-hidden='true' className='size-5 animate-spin' />
          ) : (
            <LocateFixed aria-hidden='true' className='size-5' />
          )}
        </button>

        {!mobile && (
          <>
            <span
              aria-hidden='true'
              style={{ background: 'var(--map-line)' }}
              className='h-px'
            />
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
              aria-label='Reenquadrar o mapa'
              style={{ color: 'var(--map-ink)' }}
              className={cn(botaoPilha, 'size-10.5')}
            >
              <Crosshair className='size-5' />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Controles;
