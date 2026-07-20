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
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Home, PawPrint } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import slugify from 'slugify';

// Only the cards in the first row on a typical desktop viewport (lg:grid-cols-3)
// are above the fold, so only those need eager/priority loading.
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
    <main className='min-h-container bg-card py-6 md:py-12 grid place-items-center'>
      <section className='container space-y-6 md:space-y-12'>
        <div className='space-y-3 md:space-y-6'>
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
            Acomodações
          </h1>
          <p className='text-muted-foreground leading-snug mx-auto text-center md:max-w-2/3'>
            Conheça nossos chalés, cabanas e domos, cada um projetado para
            oferecer uma experiência única de conforto e contato com a natureza.
            Escolha o seu refúgio perfeito para uma estadia inesquecível.
          </p>
        </div>
        <div
          id='chales-grid-anchor'
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
        >
          {chales.map((chale, index) => (
            <Link
              href={`/chales/${slugify(chale.nome, { lower: true, strict: true })}`}
              key={chale.id}
            >
              <Card className='gsap-reveal-chales-card opacity-0 group py-0 ring-0 gap-3 rounded-2xl'>
                <div className='relative rounded-2xl overflow-hidden'>
                  <Image
                    src={`/assets/refugio/chales/${chale.id}/refugio-${chale.banner[0]}.webp`}
                    alt={chale.nome}
                    className='aspect-square object-cover w-full'
                    width={356}
                    height={356}
                    sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw'
                    priority={index < EAGER_LOAD_COUNT}
                  />
                  <Image
                    src={`/assets/refugio/chales/${chale.id}/refugio-${chale.banner[1]}.webp`}
                    alt={`${chale.nome} - vista alternativa`}
                    className='aspect-square object-cover w-full absolute top-0 opacity-0 group-hover:opacity-100 group-hover:scale-103 transition duration-400 ease-out'
                    width={356}
                    height={356}
                    sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw'
                  />
                  <div className='font-semibold text-muted-foreground absolute top-3 right-3'>
                    {chale.politica.pets_permitidos && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className='rounded-full bg-card p-[0.4rem] border border-border'>
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
                <CardContent className='pb-6 text-base px-0'>
                  <h2 className='font-semibold'>{chale.nome}</h2>
                  <p className='text-muted-foreground'>{chale.capacidade}</p>
                  <p className='text-muted-foreground'>{chale.camas}</p>
                  <p className='text-muted-foreground'>{chale.banheiros}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default ChalePage;
