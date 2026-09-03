/* Origem: @shadcnblocks/gallery49 · vitrine hot-stone · adaptado */
'use client';

import { useReveal } from '@/hooks/use-reveal';
import { getAlt } from '@/lib/image-alt';
import { cn } from '@/lib/utils';
import { Images } from 'lucide-react';
import Image from 'next/image';
import Rotulo from '../rotulo';

/**
 * Seis fotos do lugar, em moldura de retrato revelado.
 *
 * A moldura branca torta é escolha de marca, não enfeite: o site que a casa
 * mantém é feito de adesivo, fita crepe e vinil, e a fachada é um painel
 * canelado vermelho. Uma grade limpa de fotos sangradas seria mais sóbria e
 * seria de outra pizzaria.
 *
 * Seis e do mesmo tamanho — o bloco vinha com nove e com dois vãos duplos.
 * Nove exigiria fotos que não existem, e vão duplo com foto deitada obriga a
 * cortar o que está na borda do quadro, que aqui é justamente o salão.
 */
const FOTOS = [
  {
    src: '/assets/mapa/hot-stone/hot-stone-1.webp',
    legenda: 'A fachada',
    giro: '-rotate-2',
    fallback: 'Fachada da Hot Stone à noite',
  },
  {
    src: '/assets/mapa/hot-stone/hot-stone-10.webp',
    legenda: 'O balcão',
    giro: 'rotate-1',
    fallback: 'Balcão do bar da Hot Stone',
  },
  {
    src: '/assets/mapa/hot-stone/hot-stone-11.webp',
    legenda: 'Os boxes',
    giro: '-rotate-1',
    fallback: 'Boxes de capitonê no salão da Hot Stone',
  },
  {
    src: '/assets/mapa/hot-stone/hot-stone-9.webp',
    legenda: 'A vitrola',
    giro: 'rotate-2',
    fallback: 'Vitrola tocando disco no salão da Hot Stone',
  },
  {
    /* Não é a `hot-stone-2` do cadastro, que também é o balcão: as duas são o
       mesmo canto em ângulos parecidos, e lado a lado na grade pareciam a
       mesma foto repetida. Esta é o salão de mesas, com os discos na parede de
       cimento — o outro assunto do lugar. */
    src: '/assets/mapa/hot-stone/hot-stone-13.webp',
    legenda: 'O salão',
    giro: 'rotate-1',
    fallback: 'Salão de mesas de madeira da Hot Stone',
  },
  {
    src: '/assets/mapa/hot-stone/hot-stone-8.webp',
    legenda: 'O forno',
    giro: '-rotate-2',
    fallback: 'Pizza saindo do forno da Hot Stone',
  },
];

function Ambiente(): React.ReactNode {
  const scope = useReveal<HTMLElement>();

  return (
    /* Única faixa de fundo da página, alternando com as seções sem faixa — a
       mesma alternância da landing do mapa. `bg-muted` e não `bg-card`: neste
       tema `--card` é igual ao fundo, e a faixa não pintaria nada. */
    <section ref={scope} className='bg-muted py-12 md:py-20'>
      <div className='container'>
        <header data-reveal className='max-w-3xl'>
          <Rotulo icone={Images} className='mb-3 text-[var(--primary-forte)]'>
            Por dentro
          </Rotulo>
          <h2 className='text-2xl tracking-tight text-pretty md:text-4xl lg:text-5xl'>
            Salão de bar, não de praça de alimentação
          </h2>
          <p className='mt-3 max-w-prose text-muted-foreground'>
            Painel vermelho na fachada, chapa preta no balcão, boxes de
            capitonê branco e uma vitrola tocando disco no canto. Dá para
            sentar à mesa, no balcão ou no box — e dá para levar embora.
          </p>
        </header>

        <div className='mt-10 grid grid-cols-2 gap-6 md:mt-12 md:grid-cols-3 md:gap-8'>
          {FOTOS.map((foto) => (
            <figure
              key={foto.src}
              data-reveal
              className={cn(
                'origin-center transition-transform duration-200 hover:z-10 hover:scale-[1.03] hover:rotate-0',
                foto.giro,
              )}
            >
              <div className='bg-background p-2 pb-6 shadow-xl shadow-foreground/10'>
                {/* Quadro 4:3 para todas: as seis são deitadas, e um quadro
                    retrato (o do bloco original) cortaria fora justamente as
                    laterais do salão. */}
                <div className='relative aspect-4/3 w-full'>
                  <Image
                    src={foto.src}
                    alt={getAlt(foto.src, foto.fallback)}
                    fill
                    sizes='(min-width: 768px) 30vw, 45vw'
                    className='object-cover'
                  />
                </div>
                {/* Legenda encostada à esquerda, e não centrada como no
                    bloco: é o mesmo eixo em que os cinco cabeçalhos da página
                    nascem. Retrato revelado também se anota no canto. */}
                <figcaption className='mt-3 pl-1 text-[0.6875rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase'>
                  {foto.legenda}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Ambiente;
