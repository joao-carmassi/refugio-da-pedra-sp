'use client';

import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props extends ButtonProps {
  /** `solido` = ação principal (verde mata). `contorno` = ação de apoio. */
  tom?: 'solido' | 'contorno';
}

/**
 * Botão do mapa.
 *
 * Reaproveita o `Button` do shadcn (foco, `asChild`, estados) mas troca a
 * paleta: dentro de `/mapa` a cor de ação é o verde mata da
 * identidade do mapa, não o âmbar da marca do Refúgio. As cores vêm por
 * `style` porque os tokens do mapa são escopados em `[data-mapa]` — uma
 * classe utilitária do tema global apontaria para o âmbar.
 */
function BotaoMapa({ tom = 'solido', className, ...props }: Props) {
  const solido = tom === 'solido';

  return (
    <Button
      variant='ghost'
      style={
        solido
          ? { background: 'var(--map-green)', color: '#fff' }
          : {
              background: 'transparent',
              color: 'var(--map-stone)',
              borderColor: 'rgb(138 107 59 / 0.3)',
            }
      }
      className={cn(
        'h-11 rounded-xl text-sm font-semibold',
        solido
          ? 'hover:brightness-90'
          : 'border hover:bg-[color:var(--map-chip)]',
        className,
      )}
      {...props}
    />
  );
}

export default BotaoMapa;
