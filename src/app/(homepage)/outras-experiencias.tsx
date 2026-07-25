'use client';

import { Droplet, MountainSnow, UtensilsCrossed, Wine } from 'lucide-react';
import features from '@/data/parceiros.json';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { memo, useState } from 'react';
import Image from 'next/image';

const iconsMap = {
  Wine,
  Droplet,
  MountainSnow,
  UtensilsCrossed,
};

/**
 * Único acordeão da página — e aqui ele tem função: abrir um parceiro troca a
 * fotografia grande à direita. Restilizado para o sistema (réguas de 1px em vez
 * da caixa arredondada com borda). Sem reveal: a seção já tem movimento próprio
 * na troca de imagem.
 */
const OutrasExperiencias = () => {
  const [activeItem, setActiveItem] = useState('santaMaria');
  const activeFeature = features.find((f) => f.id === activeItem);

  return (
    <section id='outras-experiencias-anchor' className='py-12 md:py-20'>
      <div className='container'>
        <header className='max-w-3xl'>
          <h2 className='text-2xl tracking-tight text-pretty md:text-4xl lg:text-5xl'>
            Complete sua experiência
          </h2>
          <p className='mt-3 max-w-prose text-muted-foreground'>
            Garanta sua reserva no Refúgio da Pedra SP e viva os melhores
            passeios de São Bento do Sapucaí.
          </p>
        </header>

        <div className='mt-8 flex flex-col-reverse gap-8 md:mt-12 lg:flex-row lg:items-start lg:gap-12'>
          <div className='flex-1'>
            <Accordion
              value={activeItem}
              onValueChange={setActiveItem}
              type='single'
              className='rounded-none border-0 border-y bg-transparent'
            >
              {features.map(
                ({
                  title,
                  id,
                  description,
                  imgCell,
                  imgCellAlt,
                  linkMapa,
                  icon,
                }) => {
                  const Icon = iconsMap[icon as keyof typeof iconsMap];

                  return (
                    <AccordionItem
                      key={id}
                      value={id}
                      className='data-[state=open]:bg-transparent'
                    >
                      <AccordionTrigger className='items-center gap-3 px-0 py-4 text-base font-medium data-[state=open]:text-foreground'>
                        <Icon aria-hidden='true' size={18} />
                        {title}
                      </AccordionTrigger>
                      {/* `-mx-4` anula o `px-4` fixo do wrapper do
                          AccordionContent, alinhando o texto com o gatilho. */}
                      <AccordionContent className='-mx-4 pb-5 text-muted-foreground'>
                        {description}
                        <iframe
                          title={`${title} - Mapa`}
                          className='mt-3 hidden w-full rounded-xl md:block md:h-40 lg:h-60'
                          src={linkMapa}
                          loading='lazy'
                        />
                        {imgCell && (
                          <Image
                            loading='lazy'
                            alt={imgCellAlt || title}
                            src={`/assets/${id}/${imgCell}`}
                            className='mt-3 aspect-video w-full rounded-xl object-cover object-center md:hidden'
                            width={544}
                            height={306}
                            sizes='100vw'
                          />
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                },
              )}
            </Accordion>
          </div>

          {activeFeature?.imgPc && (
            <div className='hidden flex-1 md:block'>
              <Image
                width={724}
                height={724}
                loading='lazy'
                alt={activeFeature.imgPcAlt || activeFeature.title}
                src={`/assets/${activeFeature.id}/${activeFeature.imgPc}`}
                className='aspect-9/12 w-full rounded-2xl object-cover xl:aspect-square'
                sizes='(max-width: 1024px) 100vw, 50vw'
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default memo(OutrasExperiencias);
