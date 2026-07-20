'use client';

import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function Mapa() {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(
      '.gsap-reveal-mapa',
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: { trigger: '#mapa-anchor', start: 'top 80%' },
      },
    );
  }, []);

  return (
    <section id='mapa-anchor' className='py-6 md:py-12 bg-card'>
      <div className='container flex flex-col items-center gap-6 md:gap-12'>
        <div className='gsap-reveal-mapa opacity-0 space-y-3 md:space-y-6 text-center'>
          <h2 className='text-2xl tracking-tight md:text-4xl lg:text-5xl'>
            Localização
          </h2>
          <p className='text-muted-foreground leading-snug md:max-w-2/3 mx-auto'>
            A apenas 1,5 km do pé da Pedra do Baú, um dos destinos mais
            incríveis da Serra da Mantiqueira. Aqui, você estará cercado por
            trilhas deslumbrantes, montanhas imponentes e vistas de tirar o
            fôlego, perfeitas para quem busca aventura e contato com a natureza.
          </p>
        </div>
        <div className='gsap-reveal-mapa opacity-0 w-full'>
          <iframe
            loading='lazy'
            title='Localização do Refúgio da Pedra SP no Google Maps'
            className='w-full h-120 lg:h-140 rounded-2xl md:rounded-3xl'
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3681.3469548877215!2d-45.66375792387372!3d-22.67812457941675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cc7de7a1085cab%3A0xfbaf5cb9454d9009!2sRef%C3%BAgio%20da%20Pedra%20Sp!5e0!3m2!1spt-BR!2sbr!4v1741976848192!5m2!1spt-BR!2sbr'
            referrerPolicy='no-referrer-when-downgrade'
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export default Mapa;
