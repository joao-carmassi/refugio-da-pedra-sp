'use client';

import { type Local } from '@/lib/mapa-turistico';
import { cn } from '@/lib/utils';
import FotoLocal from './foto-local';
import {
  EtiquetaCategoria,
  Horario,
  Nota,
  SeloDestaque,
} from './etiquetas';

interface Props {
  local: Local;
  ativo: boolean;
  onSelect: (id: string) => void;
  onHover?: (id: string | null) => void;
  /**
   * No mobile o cartão troca o horário pelo resumo: quem folheia a folha ainda
   * está escolhendo o lugar, não conferindo se abre agora — o horário continua
   * na ficha. E o clamp é mais curto (2 linhas em vez de 3) para a folha caber
   * na altura de repouso sem virar rolagem.
   */
  compacto?: boolean;
}

/**
 * Cartão de um local na lista.
 *
 * O parceiro em Destaque não é só marcado — ele é maior: miniatura de 96px em
 * vez de 74px, nome um ponto acima, fundo creme e sombra própria. É o que
 * cumpre a regra do design de "prioridade na lista" sem precisar de uma seção
 * separada.
 *
 * É um `<button>` de verdade porque a lista é navegável por teclado: o mapa é
 * a visualização, a lista é o controle.
 */
function CartaoLista({ local, ativo, onSelect, onHover, compacto }: Props) {
  const emDestaque = Boolean(local.destaque);
  const lado = emDestaque ? 'size-24' : 'size-[74px]';

  return (
    <button
      type='button'
      onClick={() => onSelect(local.id)}
      onMouseEnter={() => onHover?.(local.id)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(local.id)}
      onBlur={() => onHover?.(null)}
      aria-current={ativo ? 'true' : undefined}
      style={{
        background: emDestaque
          ? 'var(--map-featured-card)'
          : 'var(--map-surface)',
        borderColor: ativo
          ? 'var(--map-green)'
          : emDestaque
            ? 'var(--map-featured-bd)'
            : 'var(--map-line)',
        boxShadow: emDestaque ? '0 6px 18px rgb(138 107 59 / 0.14)' : undefined,
      }}
      className={cn(
        'flex w-full gap-3 rounded-2xl border p-3 text-left transition-colors',
        'hover:brightness-[0.985] focus-visible:outline-2 focus-visible:outline-offset-2',
        ativo && 'ring-1',
      )}
    >
      <div
        className={cn(
          'relative shrink-0 overflow-hidden rounded-xl',
          compacto ? 'size-[74px]' : lado,
        )}
      >
        <FotoLocal
          local={local}
          sizes='(max-width: 768px) 96px, 96px'
          className='rounded-xl'
        />
      </div>

      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
          <EtiquetaCategoria local={local} />
          {emDestaque && <SeloDestaque />}
        </div>

        <p
          style={{ color: 'var(--map-ink)' }}
          className={cn(
            'font-display mt-0.5 leading-tight font-semibold',
            emDestaque ? 'text-[17px]' : 'text-[15.5px]',
          )}
        >
          {local.nome}
        </p>

        {local.nota && (
          <p className='mt-1.5 flex items-center gap-2 text-xs'>
            <Nota local={local} />
          </p>
        )}

        {!compacto && <Horario local={local} className='mt-1.5 block' />}

        <p
          style={{ color: 'var(--map-body)' }}
          className={cn(
            'mt-1.5 text-xs leading-normal text-pretty',
            compacto ? 'line-clamp-2' : 'line-clamp-3',
          )}
        >
          {local.resumo}
        </p>
      </div>
    </button>
  );
}

export default CartaoLista;
