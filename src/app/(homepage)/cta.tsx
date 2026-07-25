'use client';

import { Button } from '@/components/ui/button';
import { getAlt } from '@/lib/image-alt';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Não é decorativa: é a foto que ilustra o CTA "Reserve seu chalé", então tem
// alt real (antes vinha com `alt=''`, que a marcava como decorativa).
const ctaSrc = '/assets/refugio/chales/jade/refugio-6.webp';

function Cta(): React.ReactNode {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(
      '.gsap-reveal-cta',
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: { trigger: '#cta-anchor', start: 'top 80%' },
      },
    );
  }, []);

  return (
    <section id='cta-anchor' className='py-6 md:py-12 dark bg-background'>
      <div className='container flex gap-6 md:gap-12 flex-col items-center md:flex-row'>
        <div className='gsap-reveal-cta opacity-0 flex-1'>
          <Image
            width={724}
            height={482}
            className='w-full rounded-2xl md:rounded-3xl'
            src={ctaSrc}
            alt={getAlt(
              ctaSrc,
              'Hóspede apoiada no parapeito do deck de troncos, olhando para as montanhas da Serra da Mantiqueira',
            )}
            sizes='(max-width: 768px) 100vw, 50vw'
          />
        </div>
        <div className='space-y-3 md:space-y-6 flex-1'>
          <h2 className='gsap-reveal-cta opacity-0 text-2xl tracking-tight md:text-4xl lg:text-5xl text-foreground'>
            Reserve seu chalé
          </h2>
          <p className='gsap-reveal-cta opacity-0 text-muted-foreground leading-snug'>
            Garanta sua estadia no Refúgio da Pedra SP e viva uma experiência única
            em meio ao ar livre!
          </p>
          <Button
            effect={'expandIcon'}
            iconPlacement='right'
            icon={ArrowRight}
            asChild
            className='gsap-reveal-cta opacity-0 w-full md:w-fit rounded-full'
            size={'lg'}
          >
            <Link href='/chales/'>Ver chalés</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Cta;
