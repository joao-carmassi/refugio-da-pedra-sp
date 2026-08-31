'use client';

import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useReveal } from '@/hooks/use-reveal';
import { CATEGORIAS } from '@/lib/mapa-turistico';
import { PONTOS } from './dados';
import FotoPlaceholder from './foto-placeholder';
import LinkLeitura from './link-leitura';
import Rotulo from './rotulo';

/**
 * A galeria de lugares — o miolo da página.
 *
 * Substituiu a lista de três trechos por um carrossel: com 31 pontos, o texto
 * corrido virava três parágrafos que ninguém lê até o fim, e cada lugar merece
 * a própria fotografia. A fita corre na ordem editorial dos trechos — complexo
 * da Pedra do Baú, centro histórico, lado oeste — e não tem filtro em cima:
 * quem quer recortar por categoria ou por região tem o mapa, que é a
 * ferramenta feita para isso.
 *
 * As setas ficam no cabeçalho, à direita do título, em vez de flutuarem sobre
 * as fotos: o cartão é conteúdo, não banner.
 */
function Pontos(): React.ReactNode {
  const scope = useReveal<HTMLElement>();
  const [api, setApi] = useState<CarouselApi>();
  const [podeVoltar, setPodeVoltar] = useState(false);
  const [podeAvancar, setPodeAvancar] = useState(false);

  useEffect(() => {
    if (!api) return;

    const atualizar = () => {
      setPodeVoltar(api.canScrollPrev());
      setPodeAvancar(api.canScrollNext());
    };

    atualizar();
    api.on('select', atualizar);
    api.on('reInit', atualizar);

    return () => {
      api.off('select', atualizar);
      api.off('reInit', atualizar);
    };
  }, [api]);

  return (
    <section id='pontos-anchor' ref={scope} className='py-12 md:py-20'>
      <div className='container'>
        {/* As setas ficam na mesma linha do título, encostadas na direita.
            Somem no celular, onde o gesto é arrastar e dois alvos de 36 px só
            roubariam largura do texto. */}
        <div data-reveal className='flex items-end justify-between gap-8'>
          <header className='max-w-3xl'>
            <Rotulo icone={MapPin} className='mb-3'>
              Onde ir na serra
            </Rotulo>
            <h2 className='text-2xl tracking-tight text-pretty md:text-4xl lg:text-5xl'>
              Os lugares, um por um
            </h2>
            <p className='mt-3 max-w-prose text-muted-foreground'>
              Cada ponto do mapa com o que ele é e em que canto do município
              fica. Estão na ordem em que a serra se organiza: primeiro o
              complexo da Pedra do Baú, depois o centro histórico e por fim o
              lado oeste do município.
            </p>
          </header>

          <div className='hidden shrink-0 gap-2 md:flex'>
            <Button
              size='icon'
              variant='outline'
              aria-label='Ver os lugares anteriores'
              disabled={!podeVoltar}
              onClick={() => api?.scrollPrev()}
              className='rounded-full disabled:pointer-events-auto'
            >
              <ArrowLeft className='size-5' />
            </Button>
            <Button
              size='icon'
              variant='outline'
              aria-label='Ver os próximos lugares'
              disabled={!podeAvancar}
              onClick={() => api?.scrollNext()}
              className='rounded-full disabled:pointer-events-auto'
            >
              <ArrowRight className='size-5' />
            </Button>
          </div>
        </div>

        {/* A fita fica dentro do container, para o primeiro cartão nascer
            alinhado com o título — e sangra até a borda direita da tela pelo
            `viewportClassName` abaixo, porque é o cartão cortado que avisa que
            há mais coisa adiante. */}
        <div data-reveal className='mt-8 md:mt-12'>
          {/* `skipSnaps` deixa o arrasto passar de mais de um cartão por gesto,
            em vez de sempre parar no vizinho: com 31 pontos na fita, um
            arrastão longo tem de andar o que a mão andou. */}
          <Carousel
            setApi={setApi}
            opts={{
              skipSnaps: true,
              breakpoints: { '(max-width: 768px)': { dragFree: true } },
            }}
          >
            {/* `calc(50% - 50vw)` dá exatamente menos o `padding-inline` do
              `.container`: dentro dele, 50% da largura de conteúdo menos meia
              viewport é o próprio padding, com sinal trocado. A conta fecha
              para qualquer valor e não quebra se ele mudar — nada de repetir
              `2rem` aqui. Quem se estica até a borda da tela é o recorte
              (`overflow-hidden`); o `-ml-6` do trilho, junto com o `pl-6` do
              item, devolve o primeiro cartão à coluna do texto. */}
            <CarouselContent
              viewportClassName='mr-[calc(50%-50vw)]'
              className='-ml-6'
            >
              {PONTOS.map((ponto) => {
                const { icone: IconeCategoria, cor } =
                  CATEGORIAS[ponto.categoria];

                return (
                  <CarouselItem
                    key={ponto.id}
                    className='max-w-80 pl-6 lg:max-w-88'
                  >
                    {/* Sem `padding` em volta da foto: ela encosta na borda e é
                      o `overflow-hidden` do cartão que arredonda os cantos de
                      cima. Foto emoldurada dentro de moldura são dois raios
                      concêntricos disputando a mesma atenção — o texto é que
                      recua. */}
                    <article className='flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card'>
                      {ponto.imagem ? (
                        <div className='relative aspect-3/2 w-full'>
                          <Image
                            src={ponto.imagem.src}
                            alt={ponto.imagem.alt}
                            fill
                            sizes='(max-width: 1024px) 20rem, 22rem'
                            loading='lazy'
                            className='object-cover'
                          />
                        </div>
                      ) : (
                        <FotoPlaceholder
                          compacta
                          legenda={ponto.foto}
                          className='aspect-3/2 w-full'
                        />
                      )}

                      <div className='p-5'>
                        {/* Etiqueta de categoria no desenho da identidade do
                          mapa: ícone tingido na cor da categoria e rótulo em
                          caixa alta. É o mesmo par que o cartão do mapa mostra
                          (`mapa-turistico/etiquetas.tsx`) — o visitante que
                          vem de lá reconhece o lugar pela cor antes de ler o
                          nome. Substituiu um `Badge`, que era um retângulo
                          cinza sem vínculo nenhum com a tela do mapa. */}
                        <p className='flex items-center gap-1.5'>
                          <IconeCategoria
                            aria-hidden='true'
                            className='size-3.5 shrink-0'
                            style={{ color: cor }}
                          />
                          <span className='text-[0.625rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase'>
                            {ponto.categoriaLabel}
                          </span>
                        </p>

                        <h3 className='mt-2 text-lg font-semibold text-pretty md:text-xl'>
                          {ponto.nome}
                        </h3>

                        <p className='mt-2 text-sm text-muted-foreground'>
                          {ponto.resumo}
                        </p>
                      </div>
                    </article>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>

        <div
          data-reveal
          className='mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-10 md:mt-10'
        >
          <LinkLeitura href='/mapa/'>Ver tudo isso no mapa</LinkLeitura>
        </div>
      </div>
    </section>
  );
}

export default Pontos;
