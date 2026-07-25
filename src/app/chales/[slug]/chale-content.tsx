import { Separator } from '@/components/ui/separator';
import chales from '@/data/chales.json';
import { getAlt } from '@/lib/image-alt';
import { Home, MapPin } from 'lucide-react';
import Image from 'next/image';
import CardReserva from './card-reserva';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Comodidades da pousada — valem para as cinco acomodações. Ficam em um único
// bloco compartilhado, renderizado uma vez por página, em vez de serem
// concatenadas na lista de comodidades de cada unidade.
const COMODIDADES_DA_POUSADA = [
  'Café da manhã incluso',
  'Wi-Fi gratuito',
  'Estacionamento na propriedade',
];

export interface ChaleDescription {
  title: string;
  paragraphs: string[];
  /** Diferenciais só desta unidade, exibidos em lista. */
  destaques?: string[];
  /** Para quem esta acomodação foi pensada. */
  idealPara: string;
  /** Política de pets escrita para esta unidade específica. */
  politicaPet: string;
}

interface Props {
  chale: (typeof chales)[number];
  description: ChaleDescription;
}

function ComodidadesDaPousada(): React.ReactNode {
  return (
    <div className='space-y-2'>
      <h2 className='text-2xl tracking-tight md:text-3xl'>
        Incluído em todas as hospedagens
      </h2>
      <ul className='grid grid-cols-2 gap-2 text-muted-foreground leading-snug'>
        {COMODIDADES_DA_POUSADA.map((comodidade) => (
          <li key={comodidade}>{comodidade}</li>
        ))}
      </ul>
    </div>
  );
}

function ChaleContent({ chale, description }: Props): React.ReactNode {
  // Campo opcional vindo dos dados. Ainda não preenchido em chales.json —
  // quando existir, entra como um parágrafo exclusivo da unidade.
  const destaqueExclusivo = (chale as { destaque_exclusivo?: string })
    .destaque_exclusivo;

  const nomeCorrido = chale.nome.replace(' · ', ' ');

  // Capa da unidade: mesma `src` no banner mobile e no desktop, então o alt é
  // resolvido uma única vez.
  const bannerSrc = `/assets/refugio/chales/${chale.id}/refugio-${chale.banner[0]}.webp`;
  const bannerAlt = getAlt(bannerSrc, chale.nome);

  return (
    <main className='min-h-container pb-6 lg:py-12 bg-background animate-in fade-in duration-300 fill-mode-both'>
      <Image
        src={bannerSrc}
        alt={bannerAlt}
        className='aspect-square object-cover lg:hidden w-full'
        width={800}
        height={800}
        sizes='100vw'
        priority
      />
      <section className='lg:container rounded-4xl lg:rounded-none bg-background px-6 pt-6 -mt-14 lg:mt-0 lg:pt-0 z-10 relative'>
        <div className='grid lg:grid-cols-[3fr_1fr] gap-6'>
          <div className='space-y-6'>
            <Breadcrumb className='hidden lg:flex'>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink aria-label='Homepage' href='/'>
                    <Home className='h-4 w-4' />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href='/chales/'>Chalés</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{chale.nome}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Image
              src={bannerSrc}
              alt={bannerAlt}
              className='rounded-3xl aspect-video object-cover hidden lg:block'
              width={1104}
              height={621}
              sizes='(min-width: 1024px) 75vw, 100vw'
              priority
            />
            <div className='space-y-2'>
              <h1 className='text-2xl tracking-tight md:text-3xl text-center lg:text-left'>
                {chale.nome}
              </h1>
              <p className='text-muted-foreground leading-snug text-center lg:text-left'>
                {chale.capacidade} · {chale.camas} · {chale.banheiros}
              </p>
              <p className='text-muted-foreground leading-snug text-center lg:text-left'>
                {chale.ambientes.join(' · ')} · {chale.area_externa.join(' · ')}
              </p>
              <p className='flex items-start gap-2 justify-center lg:justify-start text-muted-foreground leading-snug'>
                <MapPin className='h-4 w-4 shrink-0 mt-1' aria-hidden='true' />
                <span>
                  {nomeCorrido} fica em São Bento do Sapucaí (SP), na Serra da
                  Mantiqueira, a 1,5 km da Pedra do Baú — ponto de partida das
                  trilhas e das vias de escalada da região.
                </span>
              </p>
            </div>
            <CardReserva
              chale={chale.nome}
              petsPermitidos={chale.politica.pets_permitidos}
              className='h-fit space-y-3 lg:hidden'
            />
            <div
              id='chale-detalhes-anchor'
              className='space-y-3 border border-border p-6 rounded-2xl md:rounded-3xl bg-card'
            >
              <h2 className='text-2xl tracking-tight md:text-3xl'>
                {description.title}
              </h2>
              {description.paragraphs.map((paragraph, index) => (
                <p className='text-muted-foreground leading-snug' key={index}>
                  {paragraph}
                </p>
              ))}
              {destaqueExclusivo && (
                <p className='text-muted-foreground leading-snug'>
                  {destaqueExclusivo}
                </p>
              )}
              {description.destaques && (
                <ul className='list-disc pl-5 text-muted-foreground leading-snug space-y-1'>
                  {description.destaques.map((destaque) => (
                    <li key={destaque}>{destaque}</li>
                  ))}
                </ul>
              )}
              <p className='leading-snug'>
                <strong className='font-semibold'>Ideal para:</strong>{' '}
                <span className='text-muted-foreground'>
                  {description.idealPara}
                </span>
              </p>
              <p className='text-muted-foreground leading-snug'>
                {description.politicaPet}
              </p>
            </div>
            <div className='space-y-2'>
              <h2 className='text-2xl tracking-tight md:text-3xl'>
                Comodidades do {nomeCorrido}
              </h2>
              <ul className='grid grid-cols-2 gap-2 text-muted-foreground leading-snug'>
                {chale.comodidades.map((comodidade) => (
                  <li key={comodidade}>{comodidade}</li>
                ))}
              </ul>
            </div>
            <ComodidadesDaPousada />
            <Separator />
            <div className='space-y-3'>
              <h2 className='text-2xl tracking-tight md:text-3xl'>
                Fotografias
              </h2>
              <div className='columns-1 md:columns-2 lg:columns-3'>
                {Array.from({ length: chale.fotos }, (_, index) => {
                  const src = `/assets/refugio/chales/${chale.id}/refugio-${index + 1}.webp`;

                  return (
                    <div key={index}>
                      <Image
                        className='w-full rounded-xl h-auto mb-2.5 md:mb-5'
                        src={src}
                        alt={getAlt(src, `${chale.nome} - foto ${index + 1}`)}
                        width={500}
                        height={500}
                        sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                      />
                    </div>
                  );
                })}
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

export default ChaleContent;
