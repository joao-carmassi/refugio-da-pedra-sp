'use client';

import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export type Altura = 'fechada' | 'baixa' | 'media' | 'alta';

/** Fração da altura do mapa ocupada em cada parada. */
const PARADAS: Record<Altura, number> = {
  fechada: 0,
  baixa: 0.19,
  media: 0.5,
  alta: 0.88,
};

const ORDEM: Altura[] = ['baixa', 'media', 'alta'];

interface Props {
  altura: Altura;
  onAltura: (altura: Altura) => void;
  children: React.ReactNode;
  rotulo: string;
}

/**
 * Folha inferior do mobile.
 *
 * Feita à mão em vez de com o `Drawer` (vaul) porque esta folha não é um
 * modal: ela divide a tela com o mapa, que continua arrastável atrás dela, e
 * vive dentro do quadro do mapa — não do viewport. Um drawer modal escureceria
 * o mapa, travaria a rolagem da página e cobriria o header do site.
 *
 * A alça responde a arrasto e a clique: arrastar leva à parada mais próxima,
 * clicar avança para a próxima. As duas coisas porque o clique é o que
 * funciona com teclado e leitor de tela.
 */
function FolhaMobile({ altura, onAltura, children, rotulo }: Props) {
  const trilho = useRef<HTMLDivElement>(null);
  const arrasto = useRef<{ y: number; fracao: number } | null>(null);
  const [fracaoViva, setFracaoViva] = useState<number | null>(null);

  const fracao = fracaoViva ?? PARADAS[altura];

  function paradaMaisProxima(valor: number): Altura {
    return [...ORDEM, 'fechada' as const].reduce((melhor, parada) =>
      Math.abs(PARADAS[parada] - valor) < Math.abs(PARADAS[melhor] - valor)
        ? parada
        : melhor,
    );
  }

  function onPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    arrasto.current = { y: event.clientY, fracao: PARADAS[altura] };
  }

  function onPointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    const inicio = arrasto.current;
    const caixa = trilho.current?.getBoundingClientRect();
    if (!inicio || !caixa) return;

    const delta = (inicio.y - event.clientY) / caixa.height;
    setFracaoViva(Math.min(0.88, Math.max(0, inicio.fracao + delta)));
  }

  function onPointerUp() {
    if (fracaoViva !== null) onAltura(paradaMaisProxima(fracaoViva));
    arrasto.current = null;
    setFracaoViva(null);
  }

  function proxima() {
    const indice = ORDEM.indexOf(altura as (typeof ORDEM)[number]);
    onAltura(ORDEM[(indice + 1) % ORDEM.length]);
  }

  return (
    <div
      ref={trilho}
      className='pointer-events-none absolute inset-0 z-40 flex flex-col justify-end'
    >
      <div
        role='region'
        aria-label={rotulo}
        style={{
          height: `${fracao * 100}%`,
          background: 'var(--map-surface)',
          boxShadow: '0 -10px 44px rgb(27 36 32 / 0.26)',
        }}
        className={cn(
          'pointer-events-auto flex flex-col overflow-hidden rounded-t-3xl',
          fracaoViva === null &&
            'transition-[height] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
        )}
      >
        <button
          type='button'
          onClick={proxima}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-label='Ajustar altura da lista'
          className='grid shrink-0 touch-none place-items-center pt-2.5 pb-1.5'
        >
          <span
            aria-hidden='true'
            style={{ background: 'var(--map-line)' }}
            className='h-1 w-10 rounded-full'
          />
        </button>

        <div className='flex min-h-0 flex-1 flex-col'>{children}</div>
      </div>
    </div>
  );
}

export default FolhaMobile;
