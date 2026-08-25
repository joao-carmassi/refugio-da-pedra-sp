import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  /** Ícone à esquerda, opcional. Vem tingido pelo chamador quando é cor de dado. */
  icone?: LucideIcon;
  className?: string;
}

/**
 * Rótulo de seção da identidade do mapa: Archivo 600 em caixa alta com
 * tracking largo, na cor de metadado. Não há terceira família de fonte no
 * sistema — o eyebrow se distingue por caixa e espacejamento, não por fonte.
 *
 * É o mesmo desenho do `Rotulo` da tela do mapa
 * (`components/mapa-turistico/etiquetas.tsx`), reescrito aqui em token de tema
 * em vez de `var(--map-meta)`: nesta página os tokens do shadcn já apontam
 * para a paleta do mapa (escopo `[data-mapa-tema]` em globals.css), e a faixa
 * escura de fecho precisa que a cor acompanhe a inversão.
 */
function Rotulo({ children, icone: Icone, className }: Props): React.ReactNode {
  return (
    <p
      className={cn(
        'flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase',
        className,
      )}
    >
      {Icone && <Icone aria-hidden='true' className='size-4 shrink-0' />}
      {children}
    </p>
  );
}

export default Rotulo;
