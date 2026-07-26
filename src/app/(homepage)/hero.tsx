'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Rating, RatingButton } from '@/components/kibo-ui/rating';
import generateWhatsLink from '@/lib/generate-whats-link';
import { getAlt } from '@/lib/image-alt';
import { useReveal } from '@/hooks/use-reveal';

const msgText =
  'Ola, vim pelo site da pousada e gostaria de fazer uma reserva!';

// Stable Google Maps link built from the listing's CID (0xfbaf5cb9454d9009 =
// 18135816175245692937), the same feature id used by the map embed in mapa.tsx.
// A `maps/search/?api=1&query=<texto>` link is a text search and can resolve to
// the wrong place; a CID link always opens this listing.
const googleReviewsLink =
  'https://www.google.com/maps?cid=18135816175245692937';

const bookingLink =
  'https://www.booking.com/hotel/br/chale-refugio-da-pedra-sp-sao-bento-do-sapucai-sp.pt-br.html';

// Paisagem 1620×1080 — a mesma imagem declarada como `primaryImageOfPage` no
// JSON-LD da homepage; retrato aqui geraria upscale ~1.5× no full-bleed.
const heroSrc = '/assets/refugio/geral/refugio-1.webp';

/**
 * Dobra fotográfica (H6). A foto ocupa a largura inteira e o texto entra como
 * legenda ancorada no canto inferior esquerdo, sobre um scrim que garante
 * contraste AA em qualquer trecho da imagem.
 *
 * A caixa é `flex … justify-end` com `min-h`, e não uma legenda `absolute`:
 * assim o bloco de texto nunca transborda a foto em telas baixas — a imagem
 * cresce junto com ele.
 */
const Hero = () => {
  const scope = useReveal<HTMLElement>({ onMount: true, delay: 0.15 });

  return (
    <section ref={scope}>
      {/* Em qualquer largura a foto ocupa o que sobra da viewport depois do
          masthead — `--header-height` é publicada pelo próprio cabeçalho, que
          já mede a altura expandida em toda breakpoint. Os fallbacks cobrem o
          primeiro paint (antes da hidratação): ~5rem é a barra mobile
          (py-4 + alvo de toque de 44px), 10.5rem o masthead em `md`+.
          `svh` e não `dvh`: a barra de endereço aparecendo e sumindo mudaria a
          altura do hero no meio da rolagem.
          É `min-h`, então em telas muito baixas o bloco cresce em vez de cortar
          o texto — melhor passar da dobra do que esconder o H1. */}
      <div className='relative isolate flex min-h-[calc(100svh-var(--header-height,5rem))] flex-col justify-end overflow-hidden md:min-h-[calc(100svh-var(--header-height,10.5rem))]'>
        {/* LCP da página: `priority` (sem lazy) e sem animação de opacity. */}
        <Image
          className='-z-10 object-cover object-center'
          alt={getAlt(heroSrc, 'Refúgio da Pedra SP')}
          src={heroSrc}
          fill
          sizes='100vw'
          priority
        />
        <div
          aria-hidden='true'
          className='absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/5'
        />

        {/* `dark` troca os tokens do bloco (foreground, border, primary) para a
            variante escura — nada de cor solta no markup. */}
        {/* O bloco é `justify-end`: em telas altas sobra espaço acima e o `pt`
            não desloca nada — ele só entra em jogo quando a viewport aperta,
            como folga mínima entre o masthead e o H1. Por isso o valor em `md`
            é modesto: um `pt` generoso aqui não embelezaria a tela alta e
            estouraria a dobra num notebook 720p. */}
        <div className='dark container pt-28 pb-8 md:pt-16 md:pb-14'>
          <div className='max-w-3xl'>
            <h1
              data-reveal
              className='text-4xl font-semibold tracking-tight text-pretty text-foreground md:text-5xl lg:text-6xl'
            >
              <span className='text-primary'>Pousada Refúgio da Pedra SP</span>{' '}
              — Chalés em São Bento do Sapucaí, na Serra da Mantiqueira
            </h1>

            <p
              data-reveal
              className='mt-4 max-w-xl text-foreground/90 md:mt-5 md:text-lg'
            >
              Chalés rústicos e confortáveis com vista para as montanhas, a
              poucos minutos do centro de São Bento do Sapucaí. Natureza,
              silêncio e descanso real.
            </p>

            <div
              data-reveal
              className='mt-6 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-8'
            >
              <Button
                asChild
                effect='ringHover'
                size='lg'
                className='w-full rounded-full text-primary-foreground! sm:w-auto'
              >
                <Link href='/reservar/'>
                  Reservar
                  <ArrowRight className='size-4' />
                </Link>
              </Button>
              <Button
                variant='outline'
                asChild
                size='lg'
                className='w-full rounded-full border-foreground/40 bg-transparent text-foreground hover:bg-foreground/10 hover:text-foreground sm:w-auto'
              >
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  href={generateWhatsLink(msgText)}
                >
                  Entre em contato
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Linha de prova. Fica fora do scrim, no papel creme, porque o logotipo
          do Booking é azul-marinho e ficaria ilegível sobre a fotografia. */}
      <div data-reveal className='bg-card shadow-2xs'>
        <div className='container flex flex-wrap items-center gap-x-4 gap-y-2 py-3 sm:gap-x-8 sm:gap-y-3 sm:py-4'>
          <a
            href={bookingLink}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Ver no Booking.com'
            className='inline-block rounded-xs outline-none focus-visible:ring-3 focus-visible:ring-ring/50'
          >
            <Image
              src='/booking-logo.svg'
              alt='Refúgio da Pedra SP no Booking.com'
              width={188}
              height={32}
              className='h-5 w-auto sm:h-6 md:h-7'
              sizes='188px'
            />
          </a>

          {/* Some no mobile: com a linha quebrando em duas, o traço sobraria
              pendurado no fim da primeira — o gap já separa os dois blocos. */}
          <span aria-hidden='true' className='hidden h-5 w-px bg-border sm:block' />

          <a
            href={googleReviewsLink}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Ver avaliações no Google'
            className='inline-flex items-center gap-1.5 rounded-xs text-xs text-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:gap-2 sm:text-sm'
          >
            <span className='text-primary'>
              <Rating value={4.8} readOnly>
                {Array.from({ length: 5 }).map((_, index) => (
                  <RatingButton
                    aria-hidden
                    aria-label={`Rating ${index + 1}`}
                    size={16}
                    key={index}
                  />
                ))}
              </Rating>
            </span>
            <span className='tabular-nums'>
              <span className='font-medium text-foreground'>4.8</span> / 5 no
              Google
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
