'use client';

import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAlt } from '@/lib/image-alt';

function Galeria() {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(
      '.gsap-reveal-galeria-header',
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: { trigger: '#galeria-anchor', start: 'top 80%' },
      },
    );
    gsap.fromTo(
      '.gsap-reveal-galeria',
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power2.out',
        stagger: 0.04,
        scrollTrigger: { trigger: '#galeria-anchor', start: 'top 80%' },
      },
    );
  }, []);

  return (
    <section id='galeria-anchor' className='py-6 md:py-12'>
      <div className='container flex flex-col items-center gap-6 md:gap-12'>
        <div className='space-y-3 md:space-y-6 text-center'>
          <h2 className='gsap-reveal-galeria-header opacity-0 text-2xl tracking-tight md:text-4xl lg:text-5xl'>
            Nossa pousada:
          </h2>
          <p className='gsap-reveal-galeria-header opacity-0 text-muted-foreground leading-snug md:max-w-2/3 mx-auto'>
            Aqui, cada detalhe foi pensado para proporcionar conforto, conexão
            com a natureza e momentos inesquecíveis. Veja mais sobre a nossa
            pousada nas fotos abaixo!
          </p>
        </div>
        <div className='columns-1 md:columns-2 lg:columns-3'>
          {Array.from({ length: 29 }, (_, index) => {
            const src = `/assets/refugio/geral/refugio-${index + 1}.webp`;

            return (
              <div key={index} className='gsap-reveal-galeria opacity-0'>
                <Image
                  className='w-full rounded-xl h-auto mb-2.5 md:mb-5'
                  src={src}
                  alt={getAlt(src, `Foto ${index + 1} da pousada`)}
                  width={500}
                  height={500}
                  sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Galeria;
