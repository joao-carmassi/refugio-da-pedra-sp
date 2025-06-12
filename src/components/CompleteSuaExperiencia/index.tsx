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

const CompleteSuaExperiencia = () => {
  const [activeItem, setActiveItem] = useState('santaMaria');
  const activeFeature = features.find((f) => f.id === activeItem);
  const iconsMap = {
    Wine,
    // ChefHat,
    Droplet,
    MountainSnow,
    UtensilsCrossed,
  };

  //   {
  //   "icon": "ChefHat",
  //   "id": "refugio/chales/ametista",
  //   "title": "Restaurante Rancho da Tilápia",
  //   "description": "Nosso restaurante é simples e aconchegante servimos parmegiana de filé de Tilápia, preparado com molho de tomates totalmente natural. Aos finais de semana servimos almoço no fogão a lenha. Servimos também uma porção de Tilápia empanada muito deliciosa.",
  //   "imgPc": "refugio-2.webp",
  //   "imgCell": "refugio-9.webp",
  //   "linkMapa": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.2274750503825!2d-45.78934073368812!3d-22.719784952953972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cc710036abbc5b%3A0xfbc2e3465d7eeccc!2sRancho%20da%20Til%C3%A1pia!5e0!3m2!1spt-BR!2sbr!4v1748897657913!5m2!1spt-BR!2sbr"
  // }

  const path = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-7xl px-6 md:px-12 py-6 md:py-12">
        <h2 className="block text-3xl font-bold text-foreground sm:text-4xl lg:text-6xl lg:leading-tight">
          Complete sua experiência
        </h2>
        <p className="mb-2 mt-3 md:text-lg text-foreground/85 dark:text-neutral-400">
          Garanta sua reserva no Refúgio da Pedra e viva os melhores passeios de
          São Bento do Sapucaí!
        </p>
        <div className="mt-2 md:mt-6 w-full mx-auto grid items-center md:grid-cols-2 gap-12">
          {activeFeature?.imgPc && (
            <img
              loading="lazy"
              alt=""
              src={`${path}/assets/${activeFeature.id}/${activeFeature.imgPc}`}
              className="hidden md:block w-full md:h-[40rem] md:w-full bg-card rounded-xl object-cover object-center"
            />
          )}
          <div>
            <Accordion
              value={activeItem}
              onValueChange={setActiveItem}
              type="single"
              className="w-full"
            >
              {features.map(
                (
                  { title, id, description, imgCell, linkMapa, icon },
                  index
                ) => {
                  const Icon = iconsMap[icon as keyof typeof iconsMap];
                  return (
                    <AccordionItem
                      key={index}
                      value={id}
                      className="data-[state=open]:border-b-2 data-[state=open]:border-primary"
                    >
                      <AccordionTrigger className="text-lg data-[state=open]:text-primary">
                        <div className="flex items-center gap-2">
                          <Icon />
                          {title}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-[17px] leading-relaxed text-muted-foreground">
                        {description}
                        <iframe
                          className="hidden md:block md:h-40 lg:h-60 mt-2"
                          src={linkMapa}
                          width="600"
                          height="450"
                          loading="lazy"
                        ></iframe>
                        {imgCell && (
                          <img
                            loading="lazy"
                            alt=""
                            src={`${path}/assets/${id}/${imgCell}`}
                            className="mt-3 mb-2 md:hidden aspect-video w-full bg-card rounded-xl object-cover object-center"
                          />
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                }
              )}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CompleteSuaExperiencia);
