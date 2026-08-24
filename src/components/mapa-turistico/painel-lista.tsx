'use client';

import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Local } from '@/lib/mapa-turistico';
import { cn } from '@/lib/utils';
import CartaoLista from './cartao-lista';

interface Props {
  titulo: string;
  locais: Local[];
  selecionado: string | null;
  onSelect: (id: string) => void;
  onHover?: (id: string | null) => void;
  onFechar?: () => void;
  compacto?: boolean;
  className?: string;
}

/**
 * Lista de resultados.
 *
 * Serve o painel lateral do desktop e o conteúdo da folha do mobile — o que
 * muda entre os dois é só a moldura, então a moldura fica de fora.
 */
function PainelLista({
  titulo,
  locais,
  selecionado,
  onSelect,
  onHover,
  onFechar,
  compacto,
  className,
}: Props) {
  return (
    <div className={cn('flex min-h-0 flex-col', className)}>
      <div
        style={{ borderColor: 'var(--map-line)' }}
        className='flex shrink-0 items-start gap-2.5 border-b px-4.5 pt-4 pb-3'
      >
        <div className='min-w-0 flex-1'>
          <h2
            style={{ color: 'var(--map-ink)' }}
            className='font-display text-xl leading-tight font-semibold'
          >
            {titulo}
          </h2>
          <p
            style={{ color: 'var(--map-meta)' }}
            className='mt-0.5 text-xs'
          >
            {locais.length}{' '}
            {locais.length === 1 ? 'lugar encontrado' : 'lugares encontrados'} ·
            parceiros primeiro
          </p>
        </div>

        {onFechar && (
          <button
            type='button'
            onClick={onFechar}
            aria-label='Fechar lista'
            style={{
              color: 'var(--map-meta)',
              borderColor: 'var(--map-line)',
            }}
            className='grid size-7.5 shrink-0 place-items-center rounded-full border transition-colors hover:bg-black/5'
          >
            <X className='size-4.5' />
          </button>
        )}
      </div>

      <ScrollArea className='min-h-0 flex-1'>
        <ul className='flex flex-col gap-2.5 p-3'>
          {locais.map((local) => (
            <li key={local.id}>
              <CartaoLista
                local={local}
                ativo={selecionado === local.id}
                onSelect={onSelect}
                onHover={onHover}
                compacto={compacto}
              />
            </li>
          ))}

          {locais.length === 0 && (
            <li
              style={{ color: 'var(--map-meta)' }}
              className='px-2 py-8 text-center text-sm'
            >
              Nenhum lugar encontrado com esse filtro.
            </li>
          )}
        </ul>
      </ScrollArea>
    </div>
  );
}

export default PainelLista;
