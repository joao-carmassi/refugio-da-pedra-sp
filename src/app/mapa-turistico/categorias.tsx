'use client';

import { ChevronRight, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { useReveal } from '@/hooks/use-reveal';
import { CATEGORIAS } from '@/lib/mapa-turistico';
import { cn } from '@/lib/utils';
import { CATEGORIAS_DA_PAGINA } from './dados';
import Rotulo from './rotulo';

/**
 * As oito categorias que esta seção mostra.
 *
 * Estrutura de `@shadcnblocks/feature210`: etiqueta e título sobre uma grade
 * de quatro colunas sem moldura, em que cada item é ícone, nome e uma linha de
 * texto. Continua sendo fio e ar, o vocabulário da casa; a bandeja de `hover`
 * só aparece onde há link, para não prometer clique em bloco que não leva a
 * lugar nenhum.
 *
 * São oito, e não as nove do mapa, porque café não tem o que oferecer aqui:
 * é a única categoria sem nenhum lugar cadastrado e sem guia no blog, ou
 * seja, um bloco que descreve um eixo e não leva a nada — nem a pino, nem a
 * leitura. Experiência guiada está no mesmo caso quanto a pino, mas tem post
 * para onde mandar o leitor, e por isso continua na grade. De quebra, oito
 * fecham as duas fileiras de `lg:grid-cols-4` sem deixar um item sozinho na
 * terceira. O que não aparece continua sendo número: nem contagem por
 * categoria, nem etiqueta dizendo qual está vazia. Quem quiser contar abre o
 * mapa.
 */
function Categorias(): React.ReactNode {
  const scope = useReveal<HTMLElement>();

  return (
    <section
      id='categorias-anchor'
      ref={scope}
      className='py-12 md:py-20 bg-card'
    >
      <div className='container'>
        {/* O `@shadcnblocks/feature210` abre com cabeçalho partido — título de
            um lado, chamada do outro. A chamada saiu, e com ela a divisão:
            um `basis-1/2` sozinho deixaria o título ocupando metade da largura
            com o resto vazio. */}
        <div data-reveal className='flex max-w-2xl flex-col gap-3'>
          <Rotulo icone={LayoutGrid}>O que tem no mapa</Rotulo>
          <h2 className='text-2xl tracking-tight text-balance md:text-4xl lg:text-5xl'>
            Oito maneiras de olhar para São Bento do Sapucaí
          </h2>
          {/* A linha existe para a página não prometer no título o que o
              cadastro ainda não tem: experiência guiada aparece aqui como eixo
              e leva ao guia do blog, não a um pino que não existe. Quando o
              cadastro receber o primeiro registro dela, esta ressalva sai. */}
          <p className='text-muted-foreground'>
            Sete eixos já estão marcados ponto a ponto no mapa. O oitavo —
            experiência guiada — está sendo cadastrado e, por enquanto, mora
            no guia do blog, linkado abaixo.
          </p>
        </div>

        <div
          data-reveal
          className='mt-12 grid gap-6 sm:grid-cols-2 sm:gap-8 md:mt-16 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-10'
        >
          {CATEGORIAS_DA_PAGINA.map(
            ({ id, label, texto, leitura }) => {
              const { icone: Icone, cor } = CATEGORIAS[id];

              const classe = cn(
                'group flex flex-col gap-1 rounded-lg transition-colors md:p-4',
                leitura && 'md:hover:bg-muted',
              );

              const conteudo = (
                <>
                  <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                    {/* Cor de dado, não de interface: é a mesma cor com que
                      esta categoria pinta o pino no mapa, e é o que amarra
                      as duas telas. Por isso hex do cadastro, por `style`, e
                      não classe de tema. */}
                    <Icone
                      aria-hidden='true'
                      className='size-5 shrink-0'
                      style={{ color: cor }}
                    />
                    <h3 className='font-semibold'>{label}</h3>
                    {leitura && (
                      <ChevronRight
                        aria-hidden='true'
                        className='size-4 shrink-0 text-muted-foreground transition-transform md:group-hover:translate-x-0.5'
                      />
                    )}
                  </div>

                  <p className='text-sm text-muted-foreground'>{texto}</p>

                  {leitura && (
                    <p className='mt-1 text-sm text-accent-deep'>
                      {leitura.texto}
                    </p>
                  )}
                </>
              );

              /* O bloco só vira link quando há para onde ir. Um `<a href="#">`
               posto ali por simetria visual é um alvo que não leva a nada. */
              return leitura ? (
                <Link key={id} href={leitura.href} className={classe}>
                  {conteudo}
                </Link>
              ) : (
                <div key={id} className={classe}>
                  {conteudo}
                </div>
              );
            },
          )}
        </div>

      </div>
    </section>
  );
}

export default Categorias;
