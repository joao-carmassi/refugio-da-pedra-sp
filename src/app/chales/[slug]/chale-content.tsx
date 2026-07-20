'use client';

import { Separator } from '@/components/ui/separator';
import chales from '@/data/chales.json';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Home } from 'lucide-react';
import Image from 'next/image';
import CardReserva from './card-reserva';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const comodidades = ['Wifi gratuito', 'Café da manhã', 'Estacionamento'];

interface Props {
  chale: (typeof chales)[number];
  description: { title: string; paragraphs: string[] };
}

function ChaleContent({ chale, description }: Props): React.ReactNode {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // header/galeria/título (acima da dobra, sem scroll)
    const tl = gsap.timeline();
    tl.set('.gsap-reveal-chale-header', { y: 40, opacity: 0 });
    tl.to(
      '.gsap-reveal-chale-header',
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.2,
        ease: 'expo.out',
        stagger: 0.08,
      },
      0,
    );
  }, []);

  return (
    <main className='min-h-container pb-6 lg:py-12 bg-background'>
      <Image
        src={`/assets/refugio/chales/${chale.id}/refugio-${chale.banner[0]}.webp`}
        alt={chale.nome}
        className='gsap-reveal-chale-header opacity-0 aspect-square object-cover lg:hidden w-full'
        width={800}
        height={800}
        sizes='100vw'
        priority
      />
      <section className='lg:container rounded-4xl lg:rounded-none bg-background px-6 pt-6 -mt-14 lg:mt-0 lg:pt-0 z-10 relative'>
        <div className='grid lg:grid-cols-[3fr_1fr] gap-6'>
          <div className='space-y-6'>
            <Breadcrumb className='gsap-reveal-chale-header opacity-0 hidden lg:flex'>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink aria-label='Homepage' href='/'>
                    <Home className='h-4 w-4' />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href='/chales'>Chalés</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{chale.nome}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Image
              src={`/assets/refugio/chales/${chale.id}/refugio-${chale.banner[0]}.webp`}
              alt={chale.nome}
              className='gsap-reveal-chale-header opacity-0 rounded-3xl aspect-video object-cover hidden lg:block'
              width={1104}
              height={621}
              sizes='(min-width: 1024px) 75vw, 100vw'
              priority
            />
            <div className='space-y-2'>
              <h1 className='gsap-reveal-chale-header opacity-0 text-2xl tracking-tight md:text-3xl text-center lg:text-left'>
                {chale.nome}
              </h1>
              <p className='gsap-reveal-chale-header opacity-0 text-muted-foreground leading-snug text-center lg:text-left'>
                {chale.capacidade} · {chale.camas} · {chale.banheiros}
              </p>
              <p className='gsap-reveal-chale-header opacity-0 text-muted-foreground leading-snug text-center lg:text-left'>
                {chale.ambientes.join(' · ')} · {chale.area_externa.join(' · ')}
              </p>
            </div>
            <CardReserva
              chale={chale.nome}
              petsPermitidos={chale.politica.pets_permitidos}
              className='h-fit space-y-3 lg:hidden'
            />
            <div
              id='chale-detalhes-anchor'
              className='space-y-3 border border-border p-6 rounded-2xl md:rounded-3xl bg-card'
            >
              <h2 className='text-2xl tracking-tight md:text-3xl'>
                {description.title}
              </h2>
              {description.paragraphs.map((paragraph, index) => (
                <p className='text-muted-foreground leading-snug' key={index}>
                  {paragraph}
                </p>
              ))}
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <h2 className='text-2xl tracking-tight md:text-3xl col-span-2'>
                Comodidades
              </h2>
              {chale.comodidades.concat(comodidades).map((comodidade) => (
                <p
                  className='text-muted-foreground leading-snug'
                  key={comodidade}
                >
                  {comodidade}
                </p>
              ))}
            </div>
            <Separator className='gsap-reveal-chale-detalhes opacity-0' />
            <div className='space-y-3'>
              <h2 className='text-2xl tracking-tight md:text-3xl'>
                Fotografias
              </h2>
              <div className='columns-1 md:columns-2 lg:columns-3'>
                {Array.from({ length: chale.fotos }, (_, index) => (
                  <div key={index}>
                    <Image
                      className='w-full rounded-xl h-auto mb-2.5 md:mb-5'
                      src={`/assets/refugio/chales/${chale.id}/refugio-${index + 1}.webp`}
                      alt={`${chale.nome} - foto ${index + 1}`}
                      width={500}
                      height={500}
                      sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <CardReserva
            chale={chale.nome}
            petsPermitidos={chale.politica.pets_permitidos}
            className='h-fit sticky top-22 space-y-3 hidden lg:block'
          />
        </div>
      </section>
    </main>
  );
}

export default ChaleContent;
