/* Hallmark · genre: editorial · macrostructure: Catalogue · F6 knobs: 3-up, 4/3, view-link · design-system: design.md · designed-as-app */
'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import chales from '@/data/chales.json';
import { getAlt } from '@/lib/image-alt';
import { useReveal } from '@/hooks/use-reveal';
import { ArrowRight, Check, Home, PawPrint } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import slugify from 'slugify';

const EAGER_LOAD_COUNT = 3;

// Grid 3-up: cada card ocupa ~1/3 da largura do container em telas grandes.
const CARD_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

function ChalePage(): React.ReactNode {
  // Reveal único da página (design.md § Motion): o grid é o único grupo
  // animado, com o estado inicial aplicado por JS — nunca `opacity-0` no
  // markup, para os cards continuarem visíveis sem JS.
  const gridRef = useReveal<HTMLDivElement>({ stagger: 0.08 });

  return (
    <main className='min-h-container bg-background py-12 md:py-20'>
      <div className='container space-y-12 md:space-y-20'>
        {/* Cabeçalho de inventário: o que é, quantos são, onde ficam.
            Sem `space-y-*`: a folga breadcrumb→h1 é a padrão de todas as rotas
            (`mt-6 md:mt-8`) e não pode ser a mesma do ritmo interno do bloco,
            que continua em 1rem. Por isso as margens são explícitas. */}
        <header>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink aria-label='Homepage' href='/'>
                  <Home className='h-4 w-4' />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Chalés</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className='mt-6 text-2xl tracking-tight text-pretty md:mt-8 md:text-4xl lg:text-5xl'>
            Chalés, cabana e domo em São Bento do Sapucaí
          </h1>
          <p className='mt-4 text-sm text-muted-foreground'>
            Cinco acomodações · Serra da Mantiqueira · Pedra do Baú a 1,5 km
          </p>
          <p className='mt-4 max-w-[62ch] leading-relaxed text-muted-foreground'>
            Todas independentes, com entrada própria. Escolha pela capacidade,
            pelas camas e pelo que cada uma tem — lareira, cozinha equipada,
            mezanino ou deck com vista.
          </p>
        </header>

        {/* Inventário: cards de tamanho idêntico, separados por fios de 1px. */}
        <div
          ref={gridRef}
          className='grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3'
        >
          {chales.map((chale, index) => {
            const capaSrc = `/assets/refugio/chales/${chale.id}/refugio-${chale.banner[0]}.webp`;
            const hoverSrc = `/assets/refugio/chales/${chale.id}/refugio-${chale.banner[1]}.webp`;

            return (
              <Link
                href={`/chales/${slugify(chale.nome, { lower: true, strict: true })}/`}
                key={chale.id}
                data-reveal
                className='group block rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50'
              >
                <article className='space-y-4 border-t border-border pt-5'>
                  <div className='relative overflow-hidden rounded-2xl bg-muted'>
                    <Image
                      src={capaSrc}
                      alt={getAlt(capaSrc, chale.nome)}
                      className='aspect-4/3 w-full object-cover'
                      width={600}
                      height={450}
                      sizes={CARD_SIZES}
                      priority={index < EAGER_LOAD_COUNT}
                    />
                    {/* Crossfade de duas fotos no hover — padrão da casa. */}
                    <Image
                      src={hoverSrc}
                      alt={getAlt(
                        hoverSrc,
                        `${chale.nome} - vista alternativa`,
                      )}
                      className='absolute top-0 aspect-4/3 w-full object-cover opacity-0 transition duration-400 ease-out group-hover:scale-103 group-hover:opacity-100'
                      width={600}
                      height={450}
                      sizes={CARD_SIZES}
                    />
                    {chale.politica.pets_permitidos && (
                      <div className='absolute top-3 right-3 text-muted-foreground'>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {/* área de toque de 44x44 sem alterar o tamanho visual do chip */}
                            <div className='relative rounded-full border border-border bg-card p-[0.4rem] after:absolute after:-inset-[7px] after:content-[""]'>
                              <PawPrint size={17} strokeWidth={2.2} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className='font-semibold'>
                              Pets permitidos{' '}
                              <Check size={14} className='inline' />
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                  <div className='space-y-1.5'>
                    <h2 className='text-xl tracking-tight md:text-2xl'>
                      {chale.nome}
                    </h2>
                    <p className='text-sm leading-snug text-muted-foreground'>
                      {chale.capacidade} · {chale.camas} · {chale.banheiros}
                    </p>
                    {/* Micro-ação C3: palavra + seta + fio de 1px. */}
                    <span className='inline-flex items-center gap-1 pt-1 text-sm font-medium text-accent-deep underline decoration-1 underline-offset-4'>
                      Ver o chalé
                      <ArrowRight className='h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5' />
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        <section className='space-y-3 border-t border-border pt-8'>
          <h2 className='text-xl tracking-tight text-pretty md:text-3xl'>
            Onde ficam os chalés e como escolher o seu
          </h2>
          <p className='leading-relaxed text-muted-foreground'>
            O Refúgio da Pedra SP fica em São Bento do Sapucaí, no interior de
            São Paulo, dentro da Serra da Mantiqueira e a 1,5 km da Pedra do
            Baú. É esse endereço que define o resto: as acomodações foram
            construídas voltadas para as montanhas, e quem se hospeda aqui
            costuma dividir o dia entre a trilha e a varanda.
          </p>
          <p className='leading-relaxed text-muted-foreground'>
            São cinco unidades, todas independentes e com entrada própria. Duas
            foram pensadas para casais: o Domo Colmeia, o mais reservado deles,
            e a Cabana Ametista, com lareira para as noites de inverno. O Chalé
            Jade tem sala integrada com cozinha equipada, para quem prefere
            cozinhar em vez de sair para jantar. Esmeralda e Turmalina acomodam
            até três pessoas, com mezanino e duas camas de casal — são as
            escolhas de famílias e de grupos que sobem para escalar.
          </p>
          <p className='leading-relaxed text-muted-foreground'>
            Quatro das cinco acomodações recebem pets. Todas incluem café da
            manhã, wi-fi e estacionamento na propriedade, e todas têm deck ou
            varanda voltados para a serra.
          </p>
          <p className='leading-relaxed text-muted-foreground'>
            O tempo na montanha muda rápido: manhã de neblina, tarde aberta e
            noite fria mesmo no verão. Por isso quatro unidades têm aquecedor e
            duas têm lareira acesa quando a temperatura cai. Se ficar na dúvida
            entre duas delas, escreva para a gente antes de reservar — a gente
            conhece cada chalé e ajuda a escolher pelo tipo de viagem que você
            está planejando.
          </p>
        </section>
      </div>
    </main>
  );
}

export default ChalePage;
