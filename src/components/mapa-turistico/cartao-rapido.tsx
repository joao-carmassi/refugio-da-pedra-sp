'use client';

import { Route, X } from 'lucide-react';
import { getDistancia, type Local } from '@/lib/mapa-turistico';
import { cn } from '@/lib/utils';
import BotaoMapa from './botao-mapa';
import FotoLocal from './foto-local';
import { EtiquetaCategoria, Horario, Nota, SeloDestaque } from './etiquetas';

interface Props {
  local: Local;
  variante: 'desktop' | 'mobile';
  onDetalhes: () => void;
  onRota: () => void;
  onFechar: () => void;
}

/**
 * Cartão que aparece quando um pino é clicado — a primeira resposta do mapa,
 * antes do painel completo.
 *
 * No desktop é vertical, com a foto no topo; no mobile é horizontal e mais
 * baixo, porque ali ele divide a tela com o próprio mapa e não pode cobrir o
 * pino que acabou de ser tocado.
 */
function CartaoRapido({
  local,
  variante,
  onDetalhes,
  onRota,
  onFechar,
}: Props) {
  const mobile = variante === 'mobile';

  return (
    <div
      role='region'
      aria-label={local.nome}
      style={{
        background: 'var(--map-surface)',
        borderColor: local.destaque
          ? 'var(--map-featured-bd)'
          : 'var(--map-line)',
        boxShadow: 'var(--map-shadow-panel)',
      }}
      className={cn(
        'overflow-hidden border',
        mobile ? 'rounded-3xl' : 'w-88 rounded-2xl',
      )}
    >
      {mobile ? (
        <div className='flex gap-3 p-3.5'>
          <div className='relative size-20 shrink-0 overflow-hidden rounded-xl'>
            <FotoLocal local={local} sizes='80px' />
          </div>

          <div className='min-w-0 flex-1'>
            <div className='flex items-center gap-2'>
              <EtiquetaCategoria local={local} />
              {local.destaque && <SeloDestaque />}
            </div>
            <p
              style={{ color: 'var(--map-ink)' }}
              className='font-display mt-1 text-lg leading-tight font-semibold'
            >
              {local.nome}
            </p>
            <p className='mt-1 flex items-center gap-2 text-xs'>
              <Nota local={local} />
              <span style={{ color: 'var(--map-meta)' }}>{getDistancia(local)}</span>
            </p>
          </div>

          <button
            type='button'
            onClick={onFechar}
            aria-label='Fechar'
            style={{ color: 'var(--map-meta)' }}
            className='-mt-1 -mr-1 grid size-8 shrink-0 place-items-center self-start rounded-full transition-colors hover:bg-black/5'
          >
            <X className='size-4.5' />
          </button>
        </div>
      ) : (
        <>
          <div className='relative h-33 w-full overflow-hidden'>
            <FotoLocal local={local} sizes='352px' />

            <button
              type='button'
              onClick={onFechar}
              aria-label='Fechar'
              style={{
                background: 'var(--map-surface)',
                color: 'var(--map-ink)',
                boxShadow: 'var(--map-shadow-control)',
              }}
              className='absolute top-3 right-3 grid size-7.5 place-items-center rounded-full'
            >
              <X className='size-4.5' />
            </button>

            {local.destaque && (
              <SeloDestaque className='absolute top-3 left-3 bg-[color:var(--map-surface)]!' />
            )}
          </div>

          <div className='px-4 pt-3.5 pb-4'>
            <EtiquetaCategoria local={local} />
            <p
              style={{ color: 'var(--map-ink)' }}
              className='font-display mt-1 text-xl leading-tight font-semibold'
            >
              {local.nome}
            </p>
            <p className='mt-1.5 flex flex-wrap items-center gap-2 text-xs'>
              <Nota local={local} />
              <span style={{ color: 'var(--map-meta)' }}>{getDistancia(local)}</span>
              <Horario local={local} />
            </p>
            <p
              style={{ color: 'var(--map-body)' }}
              className='mt-2 text-xs leading-normal text-pretty'
            >
              {local.resumo}
            </p>
          </div>
        </>
      )}

      <div className={cn('flex gap-2.5 px-3.5 pb-4', !mobile && 'px-4')}>
        <BotaoMapa onClick={onDetalhes} className='flex-1'>
          {mobile ? 'Detalhes' : 'Ver detalhes'}
        </BotaoMapa>
        <BotaoMapa tom='contorno' onClick={onRota} className='flex-1'>
          <Route aria-hidden='true' />
          Como chegar
        </BotaoMapa>
      </div>
    </div>
  );
}

export default CartaoRapido;
