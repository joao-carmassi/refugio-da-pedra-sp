/* Hallmark · H6 dobra fotográfica · knobs: area=full-bleed, caption=lower-left, text=overlaid */
'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { FIM_DA_DOBRA_ID } from '@/hooks/use-after-fold';
import { useReveal } from '@/hooks/use-reveal';
import { getAlt } from '@/lib/image-alt';
import { ArrowDown, Home } from 'lucide-react';
import Image from 'next/image';
import type { Chale } from './types';

interface Props {
  chale: Chale;
}

/**
 * Abertura da página: a capa da unidade ocupa a dobra inteira e o nome do
 * chalé entra como legenda ancorada no canto inferior esquerdo. É o único
 * componente cliente do corpo — carrega o reveal orquestrado da página.
 */
function Dobra({ chale }: Props): React.ReactNode {
  // Entrada da página: a legenda revela na montagem. O outro (e único outro)
  // grupo animado é o mosaico de fotos, que revela na rolagem — a ficha e a
  // coluna de texto entram sem motion nenhuma.
  const scope = useReveal<HTMLElement>({ onMount: true, delay: 0.15 });

  const src = `/assets/refugio/chales/${chale.id}/refugio-${chale.banner[0]}.webp`;
  const alt = getAlt(src, chale.nome);

  return (
    <>
      {/* A foto ocupa o que sobra da viewport depois do masthead.
          `--header-height` é publicada pelo próprio cabeçalho; os fallbacks
          cobrem o primeiro paint. `svh` e não `dvh`: a barra de endereço
          aparecendo e sumindo mudaria a altura no meio da rolagem.
          É `min-h`, então em telas muito baixas o bloco cresce em vez de
          cortar o H1. */}
      <section
        ref={scope}
        className='relative isolate flex min-h-[calc(100svh-var(--header-height,5rem))] flex-col justify-end overflow-hidden md:min-h-[calc(100svh-var(--header-height,10.5rem))]'
      >
        {/* LCP da página: `priority`, sem lazy e sem animação de opacity. */}
        <Image
          src={src}
          alt={alt}
          fill
          sizes='100vw'
          priority
          className='-z-10 object-cover object-center'
        />
        {/* Dois scrims: o de baixo garante AA na legenda; o de cima existe só
            para o breadcrumb branco não flutuar sobre céu claro. */}
        <div
          aria-hidden='true'
          className='absolute inset-0 -z-10 bg-linear-to-t from-black/85 via-black/40 to-black/10'
        />
        <div
          aria-hidden='true'
          className='absolute inset-x-0 top-0 -z-10 h-32 bg-linear-to-b from-black/55 to-transparent'
        />

        <div className='dark absolute inset-x-0 top-0'>
          <Breadcrumb className='container pt-5'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink aria-label='Homepage' href='/'>
                  <Home className='h-4 w-4' />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='/chales/'>Chalés</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{chale.nome}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Legenda ancorada no canto inferior esquerdo — nunca centrada. */}
        <div className='dark container pt-28 pb-10 md:pb-14'>
          <div className='max-w-3xl'>
            <h1
              data-reveal
              className='opacity-0 text-4xl leading-[1.05] font-semibold tracking-tight text-pretty text-foreground wrap-anywhere md:text-6xl lg:text-7xl'
            >
              {chale.nome}
            </h1>
            <p
              data-reveal
              className='opacity-0 mt-4 text-foreground/90 tabular-nums md:text-lg'
            >
              {chale.capacidade} · {chale.camas} · {chale.banheiros}
            </p>
            {/* C3: verbo, seta e um fio de 1px. Sem caixa na dobra — quem
                decide reservar nesta altura ainda não viu o chalé. */}
            <a
              data-reveal
              href='#reservar'
              className='opacity-0 group mt-6 inline-flex min-h-11 items-center gap-2 rounded-xs text-sm font-medium whitespace-nowrap text-foreground underline decoration-1 underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50'
            >
              Reservar
              <ArrowDown
                aria-hidden='true'
                className='h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-y-0.5 motion-reduce:transition-none'
              />
            </a>
          </div>
        </div>
      </section>

      {/* Sentinela lida pela barra de reserva do mobile (ver `use-after-fold`).
          Fica fora da `<section>` de propósito: dentro dela, o `overflow-hidden`
          da dobra a esconderia do observer. */}
      <div id={FIM_DA_DOBRA_ID} aria-hidden='true' className='h-px' />
    </>
  );
}

export default Dobra;
