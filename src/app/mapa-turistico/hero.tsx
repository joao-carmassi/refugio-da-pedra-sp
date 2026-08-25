'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { useReveal } from '@/hooks/use-reveal';
import { ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';
import FotoPlaceholder from './foto-placeholder';

/**
 * Abertura da página.
 *
 * Não é a dobra fotográfica da homepage: aqui a rota é editorial e abre como
 * /chales/, /blog/ e /sobre/ — breadcrumb primeiro, `pt-12 md:pt-20` de folga
 * abaixo do cabeçalho. A fotografia entra logo depois do texto, em largura
 * total, e por enquanto é um espaço reservado.
 *
 * `onMount` porque o bloco está acima da dobra: esperar o ScrollTrigger aqui
 * significaria abrir a página com o título invisível.
 */
function Hero(): React.ReactNode {
  const scope = useReveal<HTMLElement>({ onMount: true, delay: 0.15 });

  return (
    <section ref={scope} className='pt-12 md:py-20'>
      <div className='container'>
        <div data-reveal>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink aria-label='Homepage' href='/'>
                  <Home className='h-4 w-4' />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Mapa Turístico</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Assinatura de marca da identidade do mapa: nome do projeto em
            Piazzolla, régua de 1px e o crédito em Archivo 600, caixa alta,
            marrom pedra — sempre menor que o nome. É o único ponto da rota
            onde as duas marcas aparecem lado a lado; o resto da página é do
            mapa. O marrom vem por `style` porque é cor de marca, não papel de
            interface: não há token de tema que signifique "vínculo com o
            refúgio". */}
        <div
          data-reveal
          className='mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 md:mt-10'
        >
          <span className='font-display text-base leading-none font-semibold tracking-tight md:text-lg'>
            Mapa de São Bento do Sapucaí
          </span>
          <span
            aria-hidden='true'
            className='hidden h-5 w-px bg-border sm:block'
          />
          <span
            style={{ color: 'var(--map-stone)' }}
            className='text-[0.6875rem] font-semibold tracking-[0.12em] uppercase'
          >
            um projeto do Refúgio da Pedra
          </span>
        </div>

        <h1
          data-reveal
          className='mt-4 max-w-4xl text-2xl tracking-tight text-pretty md:mt-5 md:text-4xl lg:text-5xl'
        >
          Mapa turístico de São Bento do Sapucaí, com a distância real até cada
          lugar
        </h1>

        <p
          data-reveal
          className='mt-3 max-w-prose text-muted-foreground md:mt-4 md:text-lg'
        >
          Reunimos num mapa só os lugares que indicamos a quem se hospeda aqui:
          as trilhas do Complexo da Pedra do Baú, as cachoeiras do vale, as
          igrejas e os mirantes do centro. No mapa, cada ponto traz a
          quilometragem e o tempo de carro medidos por estrada de verdade, a
          partir da porta do Refúgio da Pedra SP.
        </p>

        <div
          data-reveal
          className='mt-8 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-10'
        >
          <Button
            asChild
            effect='ringHover'
            size='lg'
            className='w-full rounded-full sm:w-auto'
          >
            <Link href='/mapa/'>
              Abrir o mapa
              <ArrowRight className='size-4' />
            </Link>
          </Button>
          <Button
            variant='outline'
            asChild
            size='lg'
            className='w-full rounded-full sm:w-auto'
          >
            <Link href='/reservar/'>Reservar sua estadia</Link>
          </Button>
        </div>

        {/* Moldura de `@shadcnblocks/hero263`: a fotografia fica dentro do
            container, com régua de 1px em volta e canto arredondado, em vez de
            sangrar de borda a borda. Sangria é gesto de fotografia; enquanto o
            que está ali é hachura, uma faixa cheia de parede a parede vira uma
            laje cinza no topo da página. A proporção abre em 4/3 no celular e
            vira 16/9 no resto — 21/9 numa tela estreita seria uma tarja de
            100 px. */}
        <div data-reveal className='mt-10 md:mt-14'>
          <FotoPlaceholder
            className='aspect-4/3 max-h-[70svh] w-full rounded-lg border border-border md:aspect-video'
            legenda='Vista do maciço da Pedra do Baú a partir do Refúgio da Pedra SP, com névoa subindo do vale ao amanhecer'
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
