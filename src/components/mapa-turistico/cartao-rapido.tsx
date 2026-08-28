'use client';

import { Route, X } from 'lucide-react';
import { type Local } from '@/lib/mapa-turistico';
import { cn } from '@/lib/utils';
import BotaoMapa from './botao-mapa';
import FotoLocal from './foto-local';
import { EtiquetaCategoria, Horario, Nota, SeloDestaque } from './etiquetas';

interface Props {
  local: Local;
  variante: 'desktop' | 'mobile';
  /**
   * Fechar, "Ver detalhes" e "Como chegar". Desligado quando o cartão é a
   * prévia de hover do desktop: o balão do MapLibre some assim que o ponteiro
   * deixa o pino, então botão nenhum ali chega a ser clicável.
   */
  acoes?: boolean;
  onDetalhes?: () => void;
  onRota?: () => void;
  onFechar?: () => void;
}

/**
 * Prévia de um lugar — a primeira resposta do mapa, antes da ficha completa.
 *
 * No desktop é vertical, com a foto no topo, e aparece ao passar o ponteiro
 * sobre o pino; no mobile, onde hover não existe, ele é horizontal e mais
 * baixo, porque ali divide a tela com o próprio mapa e não pode cobrir o pino
 * que acabou de ser tocado.
 */
function CartaoRapido({
  local,
  variante,
  acoes = true,
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
            {local.nota && (
              <p className='mt-1 flex items-center gap-2 text-xs'>
                <Nota local={local} />
              </p>
            )}
            {/* O resumo é a razão de o hóspede tocar em "Detalhes" — sem ele o
                cartão do celular só repete o nome que já está no pino. Três
                linhas: a coluna aqui é estreita, e em duas quase todo resumo
                do cadastro morria no meio da frase. Ainda cabe sem que a
                prévia cubra o pino que acabou de ser tocado. */}
            <p
              style={{ color: 'var(--map-body)' }}
              className='mt-1.5 line-clamp-3 text-xs leading-normal text-pretty'
            >
              {local.resumo}
            </p>
          </div>

          {acoes && (
            <button
              type='button'
              onClick={onFechar}
              aria-label='Fechar'
              style={{ color: 'var(--map-meta)' }}
              className='-mt-1 -mr-1 grid size-8 shrink-0 place-items-center self-start rounded-full transition-colors hover:bg-black/5'
            >
              <X className='size-4.5' />
            </button>
          )}
        </div>
      ) : (
        <>
          <div className='relative h-33 w-full overflow-hidden'>
            <FotoLocal local={local} sizes='352px' />

            {acoes && (
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
            )}

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
            {(local.nota || local.horario) && (
              <p className='mt-1.5 flex flex-wrap items-center gap-2 text-xs'>
                <Nota local={local} />
                <Horario local={local} />
              </p>
            )}
            <p
              style={{ color: 'var(--map-body)' }}
              className='mt-2 text-xs leading-normal text-pretty'
            >
              {local.resumo}
            </p>
          </div>
        </>
      )}

      {acoes && (
        <div className={cn('flex gap-2.5 px-3.5 pb-4', !mobile && 'px-4')}>
          <BotaoMapa onClick={onDetalhes} className='flex-1'>
            {mobile ? 'Detalhes' : 'Ver detalhes'}
          </BotaoMapa>
          <BotaoMapa tom='contorno' onClick={onRota} className='flex-1'>
            <Route aria-hidden='true' />
            Como chegar
          </BotaoMapa>
        </div>
      )}
    </div>
  );
}

export default CartaoRapido;
