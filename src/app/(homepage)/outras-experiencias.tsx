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

const OutrasExperiencias = () => {
  const [activeItem, setActiveItem] = useState('santaMaria');
  const activeFeature = features.find((f) => f.id === activeItem);

  return (
    <section className='py-6 lg:py-12'>
      <div className='container flex flex-col-reverse lg:flex-row items-center gap-6 md:gap-12'>
        <div className='flex flex-col gap-3 md:gap-6 text-start flex-1'>
          <h2 className='text-2xl tracking-tight md:text-4xl lg:text-5xl'>
            Complete sua experiência
          </h2>
          <p className='text-muted-foreground leading-snug'>
            Garanta sua reserva no Refúgio da Pedra e viva os melhores passeios
            de São Bento do Sapucaí!
          </p>
          <div className='space-y-3'>
            {features.map(
              ({ title, id, description, imgCell, linkMapa, icon }, index) => {
                const Icon = iconsMap[icon as keyof typeof iconsMap];
                return (
                  <Accordion
                    value={activeItem}
                    onValueChange={setActiveItem}
                    type='single'
                    className='w-full bg-card'
                    key={index}
                  >
                    <AccordionItem value={id}>
                      <AccordionTrigger className='items-center'>
                        <Icon size={18} />
                        {title}
                      </AccordionTrigger>
                      <AccordionContent>
                        {description}
                        <iframe
                          title={`${title} - Mapa`}
                          className='hidden md:block md:h-40 lg:h-60 mt-2 w-full'
                          src={linkMapa}
                          loading='lazy'
                        />
                        {imgCell && (
                          <Image
                            loading='lazy'
                            alt={title}
                            src={`/assets/${id}/${imgCell}`}
                            className='mt-3 mb-2 md:hidden aspect-video w-full bg-card rounded-xl object-cover object-center'
                            width={544}
                            height={306}
                          />
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              },
            )}
          </div>
        </div>
        {activeFeature?.imgPc && (
          <div className='flex-1 hidden md:block '>
            <Image
              width={724}
              height={724}
              loading='lazy'
              alt={activeFeature.title}
              src={`/assets/${activeFeature.id}/${activeFeature.imgPc}`}
              className='rounded-xl object-cover aspect-9/12 xl:aspect-square w-full'
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(OutrasExperiencias);
