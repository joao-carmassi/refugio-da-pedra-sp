'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Rating, RatingButton } from '../../components/kibo-ui/rating';
import generateWhatsLink from '@/lib/generate-whats-link';
import { gsap } from 'gsap';
import { getAlt } from '@/lib/image-alt';
import { useGSAP } from '@gsap/react';

const msgText =
  'Ola, vim pelo site da pousada e gostaria de fazer uma reserva!';

// Stable Google Maps link built from the listing's CID (0xfbaf5cb9454d9009 =
// 18135816175245692937), the same feature id used by the map embed in mapa.tsx.
// A `maps/search/?api=1&query=<texto>` link is a text search and can resolve to
// the wrong place; a CID link always opens this listing.
const googleReviewsLink = 'https://www.google.com/maps?cid=18135816175245692937';

// Também é o item 14 da galeria da homepage — o alt sai do mapa único.
const heroSrc = '/assets/refugio/geral/refugio-14.webp';

const Hero = () => {
  useGSAP(() => {
    const tl = gsap.timeline();
    const items = document.querySelectorAll('.gsap-reveal-hero');
    tl.set(items, { y: 75, opacity: 0 });
    tl.to(
      items,
      {
        y: 0,
        opacity: 1,
        duration: 1.15,
        delay: 0.3,
        ease: 'expo.out',
        stagger: 0.05,
      },
      0,
    );
  }, []);

  return (
    <section className='py-6 min-h-container grid place-items-center bg-card'>
      <div className='container'>
        <div className='grid items-center gap-6 lg:grid-cols-2 lg:gap-12'>
          <div className='flex flex-col items-center gap-5 text-center lg:items-start lg:text-left'>
            <h1 className='gsap-reveal-hero opacity-0 text-4xl font-bold text-pretty lg:text-6xl'>
              <span className='text-primary'>Pousada Refúgio da Pedra</span> —
              Chalés em São Bento do Sapucaí, na Serra da Mantiqueira
            </h1>
            <p className='gsap-reveal-hero opacity-0 max-w-xl text-muted-foreground lg:text-xl'>
              Hospede-se em chalés rústicos e confortáveis com vista para as
              montanhas, a poucos minutos do centro de São Bento do Sapucaí.
              Natureza, silêncio e descanso real para quem precisa escapar da
              cidade.
            </p>
            <div className='gsap-reveal-hero opacity-0 flex w-full flex-col-reverse justify-center gap-2 sm:flex-row lg:justify-start'>
              <Button
                variant='outline'
                asChild
                size='lg'
                className='w-full sm:w-auto rounded-full'
              >
                <a target='_blank' href={generateWhatsLink(msgText)}>
                  Entre em contato
                </a>
              </Button>
              <Button
                asChild
                effect='ringHover'
                size='lg'
                className='w-full sm:w-auto text-primary-foreground! rounded-full'
              >
                <Link href='/reservar/'>
                  Reservar
                  <ArrowRight className='size-4' />
                </Link>
              </Button>
            </div>
            <div className='gsap-reveal-hero opacity-0 space-y-3'>
              <a
                href='https://www.booking.com/hotel/br/chale-refugio-da-pedra-sp-sao-bento-do-sapucai-sp.pt-br.html'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Ver no Booking.com'
                className='inline-block'
              >
                <Image
                  src='/booking-logo.svg'
                  alt='Refúgio da Pedra SP no Booking.com'
                  width={188}
                  height={32}
                  className='h-8'
                  sizes='188px'
                />
              </a>
              <a
                href={googleReviewsLink}
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Ver avaliações no Google'
                className='flex flex-col items-center lg:items-start'
              >
                <Rating value={4.8} readOnly>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <RatingButton
                      aria-hidden
                      aria-label={`Rating ${index + 1}`}
                      key={index}
                    />
                  ))}
                </Rating>
                <span className='text-lg'>
                  <span className='font-medium'>4.8</span> / 5
                </span>
              </a>
            </div>
          </div>
          <div
            className='gsap-reveal-hero opacity-0 lg:pl-5 lg:pb-5 rounded-3xl'
            style={{
              backgroundImage:
                'conic-gradient(from 60deg at 50% 50%, var(--card), var(--card), var(--card), #e5e7eb, #e5e7eb, var(--card), var(--card), var(--card))',
            }}
          >
            <Image
              className='w-full aspect-8/9 rounded-2xl md:rounded-3xl object-cover'
              alt={getAlt(heroSrc, 'Refúgio da Pedra SP')}
              src={heroSrc}
              width={704}
              height={792}
              sizes='(max-width: 1024px) 100vw, 50vw'
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
