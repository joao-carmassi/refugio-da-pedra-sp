import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className='py-6 md:py-12 min-h-screen grid place-items-center'>
      <div className='container'>
        <div className='grid items-center gap-6 lg:grid-cols-2 lg:gap-12'>
          <div className='flex flex-col items-center gap-5 text-center lg:items-start lg:text-left'>
            <Badge variant='outline'>
              Pousada
              <ArrowUpRight className='ml-2 size-4' />
            </Badge>
            <h1 className='text-4xl font-bold text-pretty lg:text-6xl'>
              <span className='text-primary'>Refúgio da Pedra SP</span> Sua
              jornada de tranquilidade.
            </h1>
            <p className='max-w-xl text-muted-foreground lg:text-xl'>
              Venha se aventurar em um mundo onde a natureza e o conforto se
              encontram, em meio à grandiosa Serra da Mantiqueira.
            </p>
            <div className='flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start'>
              <Button
                variant='outline'
                asChild
                size='lg'
                className='w-full sm:w-auto'
              >
                <Link href='#'>Entre em contato</Link>
              </Button>
              <Button
                asChild
                effect='ringHover'
                size='lg'
                className='w-full sm:w-auto text-primary-foreground!'
              >
                <Link href='#'>
                  Reservar
                  <ArrowRight className='size-4' />
                </Link>
              </Button>
            </div>
          </div>
          <div
            className='lg:pl-5 lg:pb-5 rounded-xl'
            style={{
              backgroundImage:
                'conic-gradient(from 60deg at 50% 50%, var(--background), var(--background), var(--background), #e5e7eb, #e5e7eb, var(--background), var(--background), var(--background))',
            }}
          >
            <Image
              className='w-full aspect-8/9 rounded-xl object-cover'
              alt='Refúgio da Pedra SP'
              src='/assets/refugio/geral/refugio-14.webp'
              width={704}
              height={792}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
