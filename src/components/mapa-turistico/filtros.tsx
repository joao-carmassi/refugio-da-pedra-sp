'use client';

import { FILTROS, type FiltroId } from '@/lib/mapa-turistico';
import { cn } from '@/lib/utils';

interface Props {
  ativo: FiltroId;
  onChange: (filtro: FiltroId) => void;
  className?: string;
}

/**
 * Fila de categorias.
 *
 * No mobile a fila rola na horizontal sem barra visível (`no-scrollbar`, que
 * já existe no projeto) — cabe mais categoria na tela do que largura, e
 * quebrar em duas linhas comeria o mapa.
 */
function Filtros({ ativo, onChange, className }: Props) {
  return (
    <div
      role='group'
      aria-label='Filtrar por categoria'
      className={cn(
        'no-scrollbar flex gap-2 overflow-x-auto pb-1',
        className,
      )}
    >
      {FILTROS.map(({ id, label, icone: Icone }) => {
        const on = ativo === id;

        return (
          <button
            key={id}
            type='button'
            aria-pressed={on}
            onClick={() => onChange(id)}
            style={{
              background: on ? 'var(--map-green-deep)' : 'var(--map-surface)',
              color: on ? 'var(--map-sand)' : 'var(--map-ink)',
              borderColor: on ? 'var(--map-green-deep)' : 'var(--map-line)',
              boxShadow: '0 3px 12px rgb(27 36 32 / 0.12)',
            }}
            className='flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium whitespace-nowrap transition-colors'
          >
            <Icone aria-hidden='true' className='size-4' />
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default Filtros;
