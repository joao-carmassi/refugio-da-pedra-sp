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
import { getAlt } from '@/lib/image-alt';
import { ArrowRight, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Foto de abertura, em constante porque o caminho é usado duas vezes: na
 * `src` e na consulta ao mapa de alt text, que é chaveado por ele. É o
 * paredão da Pedra do Baú visto da pousada — o assunto do guia, fotografado
 * de onde o projeto é mantido.
 */
const FOTO = '/assets/refugio/geral/refugio-2.webp';

interface Props {
  /** Endereço do mapa interativo, ou `null` quando ele não está configurado. */
  mapaAppUrl: string | null;
}

/**
 * Abertura da página.
 *
 * Não é a dobra fotográfica da homepage: aqui a rota é editorial e abre como
 * /chales/, /blog/ e /sobre/ — breadcrumb primeiro, `pt-12 md:pt-20` de folga
 * abaixo do cabeçalho. A fotografia entra logo depois do texto, em largura
 * total.
 *
 * `onMount` porque o bloco está acima da dobra: esperar o ScrollTrigger aqui
 * significaria abrir a página com o título invisível.
 */
function Hero({ mapaAppUrl }: Props): React.ReactNode {
  const scope = useReveal<HTMLElement>({ onMount: true, delay: 0.15 });

  return (
    <section ref={scope} className='py-12 md:py-20'>
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

        {/* Assinatura do projeto: o nome do mapa, régua de 1px e o crédito em
            caixa alta, sempre menor que o nome. É o único ponto da rota onde
            as duas marcas aparecem lado a lado; o resto da página é do mapa. */}
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
          <span className='text-[0.6875rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase'>
            um projeto do Refúgio da Pedra
          </span>
        </div>

        <h1
          data-reveal
          className='mt-4 max-w-4xl text-2xl tracking-tight text-pretty md:mt-5 md:text-4xl lg:text-5xl'
        >
          Mapa turístico de São Bento do Sapucaí: o que visitar, onde comer e o
          que fazer na serra
        </h1>

        <p
          data-reveal
          className='mt-3 max-w-prose text-muted-foreground md:mt-4 md:text-lg'
        >
          Um guia da cidade em forma de mapa, aberto a quem estiver planejando a
          viagem: as trilhas do Complexo da Pedra do Baú, as cachoeiras do vale,
          as igrejas e os mirantes do centro histórico. Cada ponto traz
          endereço, horário quando existe horário publicado e a rota de carro
          medida por estrada de verdade — e, onde o carro não chega, o que ainda
          falta caminhar.
        </p>

        {/* Números fixos, conferidos no cadastro do mapa em 15/09/2026. O
            cadastro mora no projeto do mapa e esta página não o lê: se ele
            crescer, o texto aqui precisa ser atualizado à mão. */}
        <p
          data-reveal
          className='mt-3 max-w-prose text-muted-foreground md:text-lg'
        >
          São 32 lugares marcados, divididos nos três trechos em que a serra se
          organiza: 8 no Vale do Baú, 18 no Centro e 6 na rota rural, a oeste e
          ao norte da cidade.
        </p>

        <div
          data-reveal
          className='mt-8 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-10'
        >
          {/* Sem endereço do mapa configurado o botão principal some: um link
              que não leva a lugar nenhum é pior que nenhum botão. */}
          {mapaAppUrl && (
            <Button
              asChild
              effect='ringHover'
              size='lg'
              className='w-full rounded-full sm:w-auto'
            >
              <a href={mapaAppUrl}>
                Abrir o mapa
                <ArrowRight className='size-4' />
              </a>
            </Button>
          )}
          <Button
            variant='outline'
            asChild
            size='lg'
            className='w-full rounded-full sm:w-auto'
          >
            <Link href='#como-usar-anchor'>Como o mapa funciona</Link>
          </Button>
        </div>

        {/* Moldura de `@shadcnblocks/hero263`: a fotografia fica dentro do
            container, com régua de 1px em volta e canto arredondado, em vez de
            sangrar de borda a borda — esta rota é editorial, e o texto que vem
            acima e abaixo dela corre no mesmo container. A proporção abre em
            4/3 no celular e vira 16/9 no resto. `object-cover` porque o
            recorte muda com a proporção.

            `priority`: com o cabeçalho travado em compacto, esta imagem entra
            na primeira tela em telas grandes e é a candidata a LCP da rota. */}
        <div data-reveal className='mt-10 md:mt-14'>
          <Image
            src={FOTO}
            alt={getAlt(
              FOTO,
              'Paredão da Pedra do Baú visto da pousada, com a mata da Mantiqueira',
            )}
            width={1620}
            height={1080}
            sizes='100vw'
            priority
            className='aspect-4/3 max-h-[70svh] w-full rounded-lg border border-border object-cover md:aspect-video'
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
