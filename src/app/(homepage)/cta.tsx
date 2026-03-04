import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

function Cta(): React.ReactNode {
  return (
    <section className='py-6 md:py-12 bg-card'>
      <div className='container flex gap-6 md:gap-12 flex-col items-center md:flex-row'>
        <div className='space-y-3 md:space-y-6 flex-1'>
          <h2 className='text-2xl tracking-tight md:text-4xl lg:text-5xl'>
            Reserve seu chalé
          </h2>
          <p className='text-muted-foreground leading-snug'>
            Garanta sua estadia no Refúgio da Pedra e viva uma experiência única
            em meio ao ar livre!
          </p>
          <Button asChild className='w-full md:w-fit' size={'lg'}>
            <Link href='/chales'>Ver chalés</Link>
          </Button>
        </div>
        <div className='flex-1'>
          <Image
            width={724}
            height={482}
            className='w-full rounded-xl'
            src='/assets/refugio/chales/jade/refugio-6.webp'
            alt=''
          />
        </div>
      </div>
    </section>
  );
}

export default Cta;
