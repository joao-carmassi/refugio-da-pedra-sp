'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { CATEGORIAS, estaAberto, type Local } from '@/lib/mapa-turistico';
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
 * Se o lugar está aberto neste minuto, ou `null` quando o cadastro não permite
 * afirmar — ver `estaAberto` em `@/lib/mapa-turistico`.
 *
 * A resposta só existe depois da montagem, e tem que ser assim: a página é
 * gerada uma vez e servida por horas, então um selo vindo do HTML do servidor
 * estaria errado para quase todo mundo que o lê, além de não bater com a
 * hidratação. Reconfere de minuto em minuto porque a folha do mapa fica aberta
 * enquanto o hóspede escolhe, e a hora de fechar chega com ela aberta.
 */
export function useAberto(local: Local): boolean | null {
  const [aberto, setAberto] = useState<boolean | null>(null);

  useEffect(() => {
    const conferir = () => setAberto(estaAberto(local));

    conferir();

    const relogio = setInterval(conferir, 60_000);

    return () => clearInterval(relogio);
  }, [local]);

  return aberto;
}

/**
 * Selo de aberto/fechado. Some quando não há como afirmar, e some sem deixar
 * nada no lugar: a lista e a prévia mostram só o selo, e a tabela de dias e
 * faixas mora na ficha, que é onde ela cabe em mais de uma linha.
 */
export function SeloAberto({
  local,
  className,
}: {
  local: Local;
  className?: string;
}) {
  const aberto = useAberto(local);

  if (aberto === null) return null;

  return (
    <span
      title={local.horario}
      style={{
        color: aberto ? 'var(--map-open-fg)' : 'var(--map-closed-fg)',
        background: aberto ? 'var(--map-open-bg)' : 'var(--map-closed-bg)',
      }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap',
        className,
      )}
    >
      <span aria-hidden='true' className='size-1.5 rounded-full bg-current' />
      {aberto ? 'Aberto agora' : 'Fechado'}
      {local.horario && <span className='sr-only'>. {local.horario}</span>}
    </span>
  );
}
