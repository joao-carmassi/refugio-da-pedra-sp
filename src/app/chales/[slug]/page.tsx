/* eslint-disable @next/next/no-img-element */

import { Separator } from '@/components/ui/separator';
import chales from '@/data/chales.json';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import slugify from 'slugify';
import CardReserva from './card-reserva';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const comodidades = [
  'Wifi gratuito',
  'Café da manhã incluso',
  'Estacionamento privativo',
];

async function ChalePage({ params }: Props): Promise<React.ReactNode> {
  const { slug } = await params;
  const chale = chales.find(
    (c) => slugify(c.nome, { lower: true, strict: true }) === slug,
  );

  if (!chale) redirect('/chales');

  return (
    <main className='min-h-container pb-6 lg:py-12 bg-card'>
      <img
        src={`/assets/refugio/chales/${chale.id}/refugio-${chale.banner[0]}.webp`}
        alt={chale.nome}
        className='aspect-square object-cover lg:hidden'
      />
      <section className='px-8 lg:container rounded-4xl lg:rounded-none bg-card -mt-14 pt-6 lg:mt-0 z-10 relative'>
        <div className='grid lg:grid-cols-[3fr_1fr] gap-6'>
          <div className='space-y-6'>
            <img
              src={`/assets/refugio/chales/${chale.id}/refugio-${chale.banner[0]}.webp`}
              alt={chale.nome}
              className='rounded-2xl aspect-video object-cover shadow-md inset-shadow-2xs hidden lg:block'
            />
            <div className='space-y-0.5'>
              <h1 className='text-2xl tracking-tight md:text-3xl'>
                {chale.nome}
              </h1>
              <p className='text-muted-foreground leading-snug'>
                {chale.capacidade} · {chale.camas} · {chale.banheiros}
              </p>
              <p className='text-muted-foreground leading-snug'>
                {chale.ambientes.join(' · ')} · {chale.area_externa.join(' · ')}
              </p>
            </div>
            <CardReserva
              chale={chale.nome}
              petsPermitidos={chale.politica.pets_permitidos}
              className='h-fit space-y-3 lg:hidden'
            />
            <div className='space-y-2 border border-border p-6 rounded-2xl'>
              <h2 className='text-2xl tracking-tight md:text-3xl'>
                Refúgio ao Entardecer
              </h2>
              <p className='text-muted-foreground leading-snug'>
                No alto da serra, um pergolado se abre para as montanhas,
                oferecendo um lugar perfeito para contemplar o pôr do sol. A
                brisa suave e o canto dos pássaros tornam o momento ainda mais
                especial.
              </p>
              <p className='text-muted-foreground leading-snug'>
                Ao lado, uma ducha com água pura da mina refresca e revigora. O
                jardim, vivo e colorido, atrai borboletas e beija-flores,
                criando um ambiente harmonioso e acolhedor.
              </p>
              <p className='text-muted-foreground leading-snug'>
                Um refúgio onde o tempo desacelera e a natureza convida à paz e
                ao descanso.
              </p>
            </div>
            <div className='space-y-2'>
              <h2 className='text-2xl tracking-tight md:text-3xl'>
                Comodidades
              </h2>
              <div className='grid grid-cols-2 gap-3'>
                {chale.comodidades.concat(comodidades).map((comodidade) => (
                  <p
                    className='text-muted-foreground leading-snug'
                    key={comodidade}
                  >
                    {comodidade}
                  </p>
                ))}
              </div>
            </div>
            <Separator />
            <div className='space-y-3'>
              <h2 className='text-2xl tracking-tight md:text-3xl'>
                Fotografias
              </h2>
              <div className='columns-1 md:columns-2 lg:columns-3'>
                {Array.from({ length: chale.fotos }, (_, index) => (
                  <div key={index}>
                    <Image
                      className='w-full h-auto mb-2.5 md:mb-5 shadow-md inset-shadow-2xs'
                      src={`/assets/refugio/chales/${chale.id}/refugio-${index + 1}.webp`}
                      alt={`Foto ${index + 1} da pousada`}
                      width={500}
                      height={500}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <CardReserva
            chale={chale.nome}
            petsPermitidos={chale.politica.pets_permitidos}
            className='h-fit sticky top-22 space-y-3 hidden lg:block'
          />
        </div>
      </section>
    </main>
  );
}

export default ChalePage;
