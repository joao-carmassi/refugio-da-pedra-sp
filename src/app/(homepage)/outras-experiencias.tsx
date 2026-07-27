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
import { useReveal } from '@/hooks/use-reveal';

const iconsMap = {
  Wine,
  Droplet,
  MountainSnow,
  UtensilsCrossed,
};

/**
 * Único acordeão da página — e aqui ele tem função: abrir um parceiro troca a
 * fotografia grande à direita. Restilizado para o sistema (réguas de 1px em vez
 * da caixa arredondada com borda). O reveal de entrada é o mesmo das outras
 * seções (um único grupo: cabeçalho · foto · acordeão); a troca de imagem
 * acontece depois e é independente dele.
 */
const OutrasExperiencias = () => {
  const [activeItem, setActiveItem] = useState('santaMaria');
  const activeFeature = features.find((f) => f.id === activeItem);
  const scope = useReveal<HTMLElement>();

  return (
    <section
      id='outras-experiencias-anchor'
      ref={scope}
      className='py-12 md:py-20'
    >
      {/* Em `lg` são duas colunas: título, texto e acordeão empilhados à
          esquerda; a foto ocupando a coluna direita inteira (`row-span-2`),
          alinhada pelo topo com o título. Abaixo de `lg` continua uma coluna
          só, com a foto entre o cabeçalho e o acordeão — ela precisa ficar à
          vista de quem abre um item, senão a troca de imagem acontece fora da
          tela. É por isso que a ordem do DOM é cabeçalho · foto · acordeão, e o
          posicionamento em `lg` é explícito em vez de depender dessa ordem. */}
      <div className='container md:grid md:gap-y-12 lg:grid-cols-2 lg:items-start lg:gap-x-12 lg:gap-y-8'>
        <header
          data-reveal
          className='max-w-3xl lg:col-start-1 lg:row-start-1 lg:max-w-none'
        >
          <h2 className='text-2xl tracking-tight text-pretty md:text-4xl lg:text-5xl'>
            Complete sua experiência
          </h2>
          <p className='mt-3 max-w-prose text-muted-foreground'>
            Garanta sua reserva no Refúgio da Pedra SP e viva os melhores
            passeios de São Bento do Sapucaí.
          </p>
        </header>

        {activeFeature?.imgPc && (
          <div
            data-reveal
            className='mt-8 hidden md:mt-0 md:block lg:col-start-2 lg:row-span-2 lg:row-start-1'
          >
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

        <div data-reveal className='mt-8 md:mt-0 lg:col-start-1 lg:row-start-2'>
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
      </div>
    </section>
  );
};

export default memo(OutrasExperiencias);
