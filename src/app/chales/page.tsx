import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import chales from '@/data/chales.json';
import { Check, PawPrint } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import slugify from 'slugify';

function ChalePage(): React.ReactNode {
  return (
    <main className='min-h-container bg-card py-6 md:py-12 grid place-items-center'>
      <section className='container space-y-6 md:space-y-12'>
        <div className='text-center space-y-3 md:space-y-6'>
          <h1 className='text-2xl tracking-tight md:text-4xl lg:text-5xl'>
            Acomodações
          </h1>
          <p className='text-muted-foreground leading-snug mx-auto md:max-w-2/3'>
            Conheça nossos chalés, cabanas e domos, cada um projetado para
            oferecer uma experiência única de conforto e contato com a natureza.
            Escolha o seu refúgio perfeito para uma estadia inesquecível.
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {chales.map((chale) => (
            <Link
              href={`/chales/${slugify(chale.nome, { lower: true, strict: true })}`}
              key={chale.id}
            >
              <Card className='group py-0 ring-0 gap-3 rounded-2xl'>
                <div className='relative rounded-2xl overflow-hidden'>
                  <Image
                    src={`/assets/refugio/chales/${chale.id}/refugio-${chale.banner[0]}.webp`}
                    alt={chale.nome}
                    className='aspect-square object-cover'
                    width={356}
                    height={356}
                    loading='eager'
                  />
                  <Image
                    src={`/assets/refugio/chales/${chale.id}/refugio-${chale.banner[1]}.webp`}
                    alt={chale.nome}
                    className='aspect-square object-cover absolute top-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition duration-300'
                    width={356}
                    height={356}
                    loading='eager'
                  />
                  <div className='font-semibold text-muted-foreground absolute top-3 right-3'>
                    {chale.politica.pets_permitidos && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='outline'
                            size='icon-sm'
                            className='rounded-full'
                          >
                            <PawPrint strokeWidth={2.5} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='font-semibold'>
                            Pets permitidos{' '}
                            <Check size={14} className='inline' />
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
                <CardContent className='pb-6 text-base px-0'>
                  <h2 className='font-semibold'>{chale.nome}</h2>
                  <p className='text-muted-foreground'>{chale.capacidade}</p>
                  <p className='text-muted-foreground'>{chale.camas}</p>
                  <p className='text-muted-foreground'>{chale.banheiros}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default ChalePage;
