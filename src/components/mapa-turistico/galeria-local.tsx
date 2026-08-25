'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { getAlt } from '@/lib/image-alt';
import type { Local } from '@/lib/mapa-turistico';
import { cn } from '@/lib/utils';
import FotoLocal from './foto-local';

interface Props {
  local: Local;
  /** Repassado ao `sizes` do next/image das fotos grandes. */
  sizes: string;
  className?: string;
}

/**
 * Fotos do topo da ficha.
 *
 * Com uma foto só (ou nenhuma) é a própria `FotoLocal` — não faz sentido
 * montar carrossel de um slide. Com mais de uma, vira carrossel de arrastar,
 * sem setas: quem está no celular já arrasta por instinto e quem está no
 * desktop tem as miniaturas, que aqui não são enfeite — cada uma pula direto
 * para a sua foto.
 */
function GaleriaLocal({ local, sizes, className }: Props) {
  const fotos = local.fotos;
  const [api, setApi] = useState<CarouselApi>();
  const [atual, setAtual] = useState(0);

  useEffect(() => {
    if (!api) return;

    const sincronizar = () => setAtual(api.selectedScrollSnap());

    sincronizar();
    api.on('select', sincronizar);
    api.on('reInit', sincronizar);

    return () => {
      api.off('select', sincronizar);
      api.off('reInit', sincronizar);
    };
  }, [api]);

  if (!fotos || fotos.arquivos.length < 2) {
    return <FotoLocal local={local} sizes={sizes} className={className} />;
  }

  const caminho = (arquivo: string) => `/assets/${fotos.pasta}/${arquivo}`;

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: 'start' }}
      aria-label={`Fotos de ${local.nome}`}
      className={cn('absolute inset-0', className)}
    >
      <CarouselContent viewportClassName='h-full' className='-ml-0 h-full'>
        {fotos.arquivos.map((arquivo, i) => (
          <CarouselItem key={arquivo} className='relative h-full pl-0'>
            <Image
              src={caminho(arquivo)}
              alt={getAlt(caminho(arquivo), local.nome)}
              fill
              sizes={sizes}
              priority={i === 0}
              loading={i === 0 ? undefined : 'lazy'}
              className='object-cover'
              draggable={false}
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className='absolute right-3.5 bottom-3.5 flex gap-1.5'>
        {fotos.arquivos.map((arquivo, i) => (
          <button
            key={arquivo}
            type='button'
            onClick={() => api?.scrollTo(i)}
            aria-label={`Ver foto ${i + 1} de ${fotos.arquivos.length}`}
            aria-current={i === atual}
            style={{
              borderColor:
                i === atual ? 'rgb(255 255 255)' : 'rgb(255 255 255 / 0.7)',
            }}
            className={cn(
              'relative block h-6.5 w-8.5 overflow-hidden rounded-md border transition-opacity',
              i === atual ? 'opacity-100' : 'opacity-60 hover:opacity-90',
            )}
          >
            <Image
              src={caminho(arquivo)}
              alt=''
              aria-hidden='true'
              fill
              sizes='34px'
              loading='lazy'
              className='object-cover'
            />
          </button>
        ))}
      </div>
    </Carousel>
  );
}

export default GaleriaLocal;
