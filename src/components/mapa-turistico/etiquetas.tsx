import { Star } from 'lucide-react';
import { CATEGORIAS, type Local } from '@/lib/mapa-turistico';
import { cn } from '@/lib/utils';

/**
 * Rótulo de seção. Na identidade do mapa o eyebrow é Archivo 600 em caixa
 * alta com tracking largo — não há terceira família de fonte no sistema.
 */
export function Rotulo({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      style={{ color: 'var(--map-meta)' }}
      className={cn(
        'text-[10px] font-semibold tracking-[0.14em] uppercase',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Categoria do local, com o ícone tingido na cor da categoria. */
export function EtiquetaCategoria({
  local,
  className,
}: {
  local: Local;
  className?: string;
}) {
  const categoria = CATEGORIAS[local.cat];
  const Icone = categoria.icone;

  return (
    <span className={cn('flex items-center gap-1.5', className)}>
      <Icone
        aria-hidden='true'
        className='size-3.5 shrink-0'
        style={{ color: categoria.cor }}
      />
      <Rotulo>{categoria.label}</Rotulo>
    </span>
  );
}

/**
 * Selo de parceiro. É o único lugar da interface onde o marrom pedra aparece
 * como fundo — é ele que amarra o mapa de volta à marca do Refúgio.
 */
export function SeloDestaque({ className }: { className?: string }) {
  return (
    <span
      style={{
        color: 'var(--map-featured-fg)',
        background: 'var(--map-featured-bg)',
        borderColor: 'var(--map-featured-bd)',
      }}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold whitespace-nowrap',
        className,
      )}
    >
      <Star className='size-2.5' fill='currentColor' aria-hidden='true' />
      Destaque
    </span>
  );
}

/** Nota do Google. Não renderiza nada quando a nota ainda não foi conferida. */
export function Nota({
  local,
  className,
}: {
  local: Local;
  className?: string;
}) {
  if (!local.nota) return null;

  return (
    <span
      style={{ color: 'var(--map-ink)' }}
      className={cn('flex items-center gap-1 font-bold', className)}
    >
      <Star
        aria-hidden='true'
        className='size-3.5'
        fill='currentColor'
        style={{ color: 'var(--map-stone)' }}
      />
      {local.nota}
      <span className='sr-only'>
        de 5{local.avaliacoes ? ` em ${local.avaliacoes} avaliações` : ''}
      </span>
    </span>
  );
}

/**
 * Horário de funcionamento. Some quando não há horário conferido — ver o
 * comentário do campo `horario` em `@/lib/mapa-turistico`.
 */
export function Horario({
  local,
  className,
}: {
  local: Local;
  className?: string;
}) {
  if (!local.horario) return null;

  return (
    <span
      style={{ color: 'var(--map-meta)' }}
      className={cn('truncate text-[11px]', className)}
    >
      {local.horario}
    </span>
  );
}
