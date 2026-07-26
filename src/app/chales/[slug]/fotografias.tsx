'use client';

import { useReveal } from '@/hooks/use-reveal';
import { getAlt } from '@/lib/image-alt';
import Image from 'next/image';
import type { Chale } from './types';

interface Props {
  chale: Chale;
}

/**
 * Mosaico de fotos da unidade, no mesmo formato da galeria da homepage:
 * colunas CSS com altura automática. Cada foto entra no enquadramento em que
 * foi tirada — a grade de proporções fixas que estava aqui antes cortava
 * varanda, mezanino e vista para caber em 4/3 ou 21/9, e foto de chalé cortada
 * perde justamente o que tinha para mostrar.
 *
 * As duas fotos de capa ficam de fora: já apareceram na dobra e na quebra de
 * grade, e repeti-las aqui seria a terceira vez.
 */
function Fotografias({ chale }: Props): React.ReactNode {
  // Reveal escalonado como o da homepage, mas pelo hook da casa: o estado
  // inicial entra por JS, então sem JS as fotos continuam visíveis. Passo curto
  // (0.03) para o total ficar dentro de meio segundo mesmo nas unidades com
  // dezoito fotos.
  const scope = useReveal<HTMLElement>({ stagger: 0.03 });

  const fotos = Array.from({ length: chale.fotos }, (_, i) => i + 1).filter(
    (n) => !chale.banner.includes(n),
  );

  return (
    // Folga de topo maior que a das outras seções, de propósito: é a única
    // troca de registro da página.
    <section ref={scope} className='pt-16 pb-8 md:pt-24 md:pb-24'>
      <div className='container space-y-6 md:space-y-8'>
        <h2 className='text-xl tracking-tight md:text-2xl'>Fotografias</h2>

        <div className='columns-1 md:columns-2 lg:columns-3'>
          {fotos.map((n) => {
            const src = `/assets/refugio/chales/${chale.id}/refugio-${n}.webp`;

            return (
              // `break-inside-avoid` para nenhuma foto ser partida entre o pé
              // de uma coluna e a cabeça da seguinte.
              <div key={n} data-reveal className='break-inside-avoid'>
                <Image
                  className='mb-2.5 h-auto w-full rounded-xl md:mb-5'
                  src={src}
                  alt={getAlt(src, `${chale.nome} - foto ${n}`)}
                  width={500}
                  height={500}
                  sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Fotografias;
