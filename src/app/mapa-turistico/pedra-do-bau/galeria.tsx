/* Origem: @shadcnblocks/gallery45 · vitrine pedra-do-bau · adaptado */
'use client';

import { useReveal } from '@/hooks/use-reveal';
import { getAlt } from '@/lib/image-alt';
import { cn } from '@/lib/utils';
import { Images } from 'lucide-react';
import Image from 'next/image';
import Rotulo from '../rotulo';

/**
 * As seis fotos, na grade assimétrica do bloco.
 *
 * Cinco são do cadastro do ponto (`fotos.arquivos` menos a que abre a página).
 * A sexta é do Bauzinho — e está aqui de propósito: é a única do acervo que
 * mostra o Baú inteiro de frente, porque foi tirada do cume vizinho. Ninguém
 * fotografa a Pedra do Baú de dentro dela. O `alt` que já existe em
 * `image-alt.json` diz exatamente isso, então a foto não passa por outra coisa.
 *
 * Repetir a foto da dobra aqui era a alternativa, e é pior: o visitante vê a
 * mesma imagem duas vezes e a galeria deixa de acrescentar.
 */
const TILES = [
  {
    src: '/assets/mapa/pedra-do-bau/pedra-do-bau-3.webp',
    className: 'col-span-2 row-span-1 lg:col-span-4',
  },
  {
    src: '/assets/mapa/pedra-do-bau/pedra-do-bau-1.webp',
    className: 'col-span-2 row-span-1 lg:col-span-2 lg:row-span-2',
  },
  {
    src: '/assets/mapa/pedra-do-bau/pedra-do-bau-5.webp',
    className: 'col-span-1 row-span-1 lg:col-span-2',
  },
  {
    src: '/assets/mapa/pedra-do-bau/pedra-do-bau-4.webp',
    className: 'col-span-1 row-span-1 lg:col-span-2',
  },
  {
    src: '/assets/mapa/bauzinho/bauzinho-2.webp',
    className: 'col-span-2 row-span-1 lg:col-span-3',
  },
  {
    src: '/assets/mapa/pedra-do-bau/pedra-do-bau-6.webp',
    className: 'col-span-2 row-span-1 lg:col-span-3',
  },
];

function Galeria(): React.ReactNode {
  const scope = useReveal<HTMLElement>();

  return (
    /* `bg-muted` e não `bg-background`: no tema desta vitrine `--card` é igual
       ao fundo, então a faixa só existe pelo muted. É a única seção com faixa,
       e ela alterna com as vizinhas sem faixa — a mesma alternância que a
       landing do mapa usa. */
    <section ref={scope} className='bg-muted py-12 md:py-20'>
      <div className='container'>
        <header data-reveal className='max-w-3xl'>
          <Rotulo icone={Images} className='mb-3 text-[var(--primary-forte)]'>
            O maciço
          </Rotulo>
          <h2 className='text-2xl tracking-tight text-pretty md:text-4xl lg:text-5xl'>
            De longe é que se vê o tamanho
          </h2>
          <p className='mt-3 max-w-prose text-muted-foreground'>
            Do alto, do cume vizinho e por dentro das nuvens — a face norte, o
            paredão sobre a mata e o fim de tarde que a serra devolve quase todo
            dia.
          </p>
        </header>

        <div className='mt-10 grid auto-rows-[140px] grid-cols-2 gap-4 sm:auto-rows-[180px] lg:auto-rows-auto lg:grid-cols-6 lg:grid-rows-[240px_180px_220px] md:mt-12'>
          {TILES.map((tile) => (
            <div
              key={tile.src}
              data-reveal
              className={cn(
                'relative min-h-0 overflow-hidden rounded-lg border border-border',
                tile.className,
              )}
            >
              {/* `fill` e não `width`/`height`: o tamanho de cada tile é a
                  linha da grade, não a proporção do arquivo. As seis fotos são
                  1620 px no maior lado, então `sizes` pede metade da tela no
                  celular e um terço no desktop. */}
              <Image
                src={tile.src}
                alt={getAlt(tile.src, 'Complexo da Pedra do Baú')}
                fill
                sizes='(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw'
                className='object-cover'
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Galeria;
