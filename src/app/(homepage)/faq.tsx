'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Coffee,
  Calendar,
  Wifi,
  PawPrint,
  Baby,
  Car,
  Bed,
  MountainSnow,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const questions = [
  {
    question: 'Café da manhã',
    Icon: <Coffee size={18} />,
    answer:
      'O nosso café utiliza produtos típicos da região, como pães caseiros, bolos, pão de queijo, geleias, manteiga, leite, café, sucos e frutas. O hóspede pode consumi-lo no deck principal, desfrutando de uma bela vista das montanhas.O nosso café utiliza produtos típicos da região, como pães caseiros, bolos, pão de queijo, geleias, manteiga, leite, café, sucos e frutas. O hóspede pode consumi-lo no deck principal, desfrutando de uma bela vista das montanhas.',
  },
  {
    question: 'Check-in e check-out',
    Icon: <Calendar size={18} />,
    answer:
      'O seu descanso começa às 14h (check-in), e se estende até o meio-dia (check-out), para que você possa aproveitar cada minuto da estadia.',
  },
  {
    question: 'Wifi Gratuito',
    Icon: <Wifi size={18} />,
    answer:
      'Fique sempre conectado! Nossos chalés oferecem Wi-Fi gratuito para que você possa compartilhar os melhores momentos da sua estadia, sem perder o contato com o mundo',
  },
  {
    question: 'Pet Friendly',
    Icon: <PawPrint size={18} />,
    answer:
      'Entendemos que os animais de estimação são parte da família. Por isso, somos pet-friendly e ficaremos felizes em receber o seu amigo peludo durante a sua estadia.',
  },
  {
    question: 'Crianças',
    Icon: <Baby size={18} />,
    answer:
      'Valorizamos a presença das famílias em nosso espaço. Para tornar a experiência ainda mais acessível, permitimos a estadia de crianças a partir dos 13 anos. É nossa maneira de compartilhar momentos especiais com todos, oferecendo conforto e praticidade para a família.',
  },
  {
    question: 'Estacionamento privativo',
    Icon: <Car size={18} />,
    answer:
      'Cada chalé possui seu próprio estacionamento individual, oferecendo segurança e praticidade durante toda a sua hospedagem.',
  },
  {
    question: 'Roupas de cama e toalhas',
    Icon: <Bed size={18} />,
    answer:
      'Roupas de cama macias, toalhas de banho e rosto estão incluidas na reserva sempre prontas para o seu conforto.',
  },
  {
    question: 'Pedra do Baú',
    Icon: <MountainSnow size={18} />,
    answer:
      'A apenas 1,5 km da Pedra do Baú, nossa pousada esta localizada no local perfeito para quem gosta de explorar a natureza.',
  },
];

const Faq = () => {
  const [open, setOpen] = useState<number>(0);

  return (
    <section className='py-6 lg:py-12'>
      <div className='container'>
        <div className='flex flex-col-reverse lg:flex-row items-center gap-6 md:gap-12'>
          <div className='flex-1'>
            <Image
              width={724}
              height={884}
              className='rounded-xl object-cover aspect-9/12 xl:aspect-9/11'
              src='/assets/refugio/geral/refugio-28.webp'
              alt='Café da manhã'
            />
          </div>
          <div className='flex flex-col gap-3 md:gap-6 text-start flex-1'>
            <h2 className='text-2xl tracking-tight md:text-4xl lg:text-5xl'>
              Comodidades:
            </h2>
            <p className='text-muted-foreground leading-snug'>
              Nos importamos com o seu conforto, por isso sua reserva inclui uma
              série de comodidades para tornar sua estadia ainda mais especial:
            </p>
            <div className='space-y-3'>
              {questions.map((item, i) => (
                <Accordion
                  type='single'
                  collapsible
                  className='w-full bg-card'
                  key={i}
                  value={open.toString()}
                  onValueChange={(value) => setOpen(Number(value))}
                >
                  <AccordionItem value={`${i}`}>
                    <AccordionTrigger className='items-center'>
                      {item.Icon} {item.question}
                    </AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
