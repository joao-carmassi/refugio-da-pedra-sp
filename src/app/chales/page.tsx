'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import chales from '@/data/chales.json';
import { gsap } from 'gsap';
import { getAlt } from '@/lib/image-alt';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, Home, PawPrint } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import slugify from 'slugify';

const EAGER_LOAD_COUNT = 3;

function ChalePage(): React.ReactNode {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    // grid de cards de chalés (com scroll)
    gsap.fromTo(
      '.gsap-reveal-chales-card',
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '#chales-grid-anchor', start: 'top 85%' },
      },
    );
  }, []);

  return (
    <main className='min-h-container bg-card py-4 md:py-12 grid place-items-center'>
      <section className='container space-y-6 md:space-y-12'>
        <div className='space-y-2 md:space-y-4'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink aria-label='Homepage' href='/'>
                  <Home className='h-4 w-4' />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Chalés</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className='text-2xl tracking-tight md:text-4xl lg:text-5xl text-center'>
            Chalés, cabana e domo em São Bento do Sapucaí
          </h1>
          <p className='text-muted-foreground leading-snug mx-auto text-center md:max-w-2/3'>
            Cinco acomodações independentes na Serra da Mantiqueira, a 1,5 km da
            Pedra do Baú. Escolha pela capacidade, pelas camas e pelo que cada
            uma tem — lareira, cozinha equipada, mezanino ou deck com vista.
          </p>
        </div>
        <div
          id='chales-grid-anchor'
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
        >
          {chales.map((chale, index) => {
            const capaSrc = `/assets/refugio/chales/${chale.id}/refugio-${chale.banner[0]}.webp`;
            const hoverSrc = `/assets/refugio/chales/${chale.id}/refugio-${chale.banner[1]}.webp`;

            return (
              <Link
                href={`/chales/${slugify(chale.nome, { lower: true, strict: true })}/`}
                key={chale.id}
              >
                <Card className='gsap-reveal-chales-card opacity-0 group py-0 ring-0 gap-3 rounded-2xl'>
                  <div className='relative rounded-2xl overflow-hidden'>
                    <Image
                      src={capaSrc}
                      alt={getAlt(capaSrc, chale.nome)}
                      className='aspect-4/3 md:aspect-square object-cover w-full'
                      width={356}
                      height={356}
                      sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw'
                      priority={index < EAGER_LOAD_COUNT}
                    />
                    <Image
                      src={hoverSrc}
                      alt={getAlt(
                        hoverSrc,
                        `${chale.nome} - vista alternativa`,
                      )}
                      className='aspect-4/3 md:aspect-square object-cover w-full absolute top-0 opacity-0 group-hover:opacity-100 group-hover:scale-103 transition duration-400 ease-out'
                      width={356}
                      height={356}
                      sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw'
                    />
                    <div className='font-semibold text-muted-foreground absolute top-3 right-3'>
                      {chale.politica.pets_permitidos && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {/* área de toque de 44x44 sem alterar o tamanho visual do chip */}
                            <div className='relative rounded-full bg-card p-[0.4rem] border border-border after:absolute after:-inset-[7px] after:content-[""]'>
                              <PawPrint size={17} strokeWidth={2.2} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className='font-semibold'>
                              Pets permitidos{' '}
                              <Check size={14} className='inline' />
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                  <CardContent className='pb-6 text-base px-0 space-y-1'>
                    <h2 className='font-semibold'>{chale.nome}</h2>
                    <p className='text-muted-foreground leading-snug'>
                      {chale.capacidade} · {chale.camas} · {chale.banheiros}
                    </p>
                    <span className='inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4 group-hover:no-underline'>
                      Ver o chalé
                      <ArrowRight className='h-4 w-4' />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
        <div className='space-y-3 md:max-w-3xl'>
          <h2 className='text-xl tracking-tight md:text-3xl'>
            Onde ficam os chalés e como escolher o seu
          </h2>
          <p className='text-muted-foreground leading-snug'>
            O Refúgio da Pedra SP fica em São Bento do Sapucaí, no interior de São
            Paulo, dentro da Serra da Mantiqueira e a 1,5 km da Pedra do Baú. É
            esse endereço que define o resto: as acomodações foram construídas
            voltadas para as montanhas, e quem se hospeda aqui costuma dividir o
            dia entre a trilha e a varanda.
          </p>
          <p className='text-muted-foreground leading-snug'>
            São cinco unidades, todas independentes e com entrada própria. Duas
            foram pensadas para casais: o Domo Colmeia, o mais reservado deles,
            e a Cabana Ametista, com lareira para as noites de inverno. O Chalé
            Jade tem sala integrada com cozinha equipada, para quem prefere
            cozinhar em vez de sair para jantar. Esmeralda e Turmalina acomodam
            até três pessoas, com mezanino e duas camas de casal — são as
            escolhas de famílias e de grupos que sobem para escalar.
          </p>
          <p className='text-muted-foreground leading-snug'>
            Quatro das cinco acomodações recebem pets. Todas incluem café da
            manhã, wi-fi e estacionamento na propriedade, e todas têm deck ou
            varanda voltados para a serra.
          </p>
          <p className='text-muted-foreground leading-snug'>
            O tempo na montanha muda rápido: manhã de neblina, tarde aberta e
            noite fria mesmo no verão. Por isso quatro unidades têm aquecedor e
            duas têm lareira acesa quando a temperatura cai. Se ficar na dúvida
            entre duas delas, escreva para a gente antes de reservar — a gente
            conhece cada chalé e ajuda a escolher pelo tipo de viagem que você
            está planejando.
          </p>
        </div>
      </section>
    </main>
  );
}

export default ChalePage;
