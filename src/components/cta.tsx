import { Button } from '@/components/ui/button';
import Image from 'next/image';

const Cta = () => {
  return (
    <section>
      <div className='container'>
        <div className='flex w-full flex-col overflow-hidden rounded-lg bg-card md:rounded-xl lg:flex-row lg:items-center shadow-md inset-shadow-2xs'>
          <div className='w-full shrink-0 self-stretch lg:w-1/2'>
            <Image
              width={748}
              height={499}
              src='/assets/refugio/geral/refugio-1.webp'
              alt='placeholder hero'
              className='aspect-3/2 w-full rounded-t-md object-cover md:rounded-t-none md:rounded-l-md'
            />
          </div>
          <div className='w-full shrink-0 p-4 md:p-8 lg:p-16 lg:w-1/2 space-y-3 md:space-y-6'>
            <h3 className='text-xl tracking-tight md:text-3xl lg:text-4xl'>
              Garanta sua experiência no Refúgio da Pedra
            </h3>
            <p className='text-muted-foreground lg:text-lg'>
              Reserve agora seu chalé e viva momentos inesquecíveis em meio à
              natureza, conforto e exclusividade. Aproveite as melhores datas e
              garanta sua hospedagem na pousada mais charmosa de São Bento do
              Sapucaí.
            </p>
            <Button
              size='lg'
              className='rounded-full'
              effect={'shineHover'}
              asChild
            >
              <a href='/reservar'>Reservar agora</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
