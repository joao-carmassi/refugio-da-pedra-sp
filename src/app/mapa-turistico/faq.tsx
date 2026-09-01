'use client';

import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import Link from 'next/link';
import { useReveal } from '@/hooks/use-reveal';
import LinkLeitura from './link-leitura';
import { PERGUNTAS } from './perguntas';
import Rotulo from './rotulo';

/**
 * As perguntas que quem planeja a viagem faz antes de subir a serra — taxa de
 * entrada, horário de portaria, obrigatoriedade de guia.
 *
 * Composição de `@shadcnblocks/faq7`, irmão do `faq20` que estava aqui antes:
 * mesma divisão em duas colunas, com o título, a chamada e o link de contato
 * numa e a lista na outra, só que a lista agora é um acordeão. Onze respostas
 * abertas empilhadas passavam de três telas de altura e engoliam o fecho da
 * página; fechadas, a seção cabe em pouco mais de uma.
 *
 * O acordeão não é o do `@/components/ui/accordion`, e a razão é o requisito
 * que manda nesta seção: as respostas precisam estar no HTML servido, porque
 * metade destas visitas chega da busca atrás de uma delas e o `FAQPage` do
 * JSON-LD do layout descreve texto que tem de existir na página. O acordeão
 * do Radix não serve para isso nem com `forceMount` — conferido no fonte de
 * `@radix-ui/react-collapsible`, o `Content` calcula `isOpen = context.open ||
 * isPresent` e renderiza `isOpen && children`; sem `forceMount` o item fechado
 * some do DOM, e com `forceMount` o `isPresent` fica preso em `true` e o item
 * nunca mais fecha. Um dos dois lados do requisito se perderia sempre.
 *
 * Daí `<details>`/`<summary>` nativo, que resolve os dois: o navegador guarda
 * o conteúdo no documento em qualquer estado e só deixa de pintá-lo enquanto
 * o `open` não está lá, então o parágrafo sai no HTML do servidor mesmo com o
 * item fechado — é o mesmo texto para o leitor e para o rastreador, sem
 * duplicar nada. De quebra o acordeão funciona antes da hidratação e sem JS,
 * que é mais do que o Radix entregava aqui.
 *
 * O que o `<details>` não dá de graça é a transição: ele abre e fecha de um
 * quadro para o outro, e num acordeão o salto lê como falha de renderização,
 * não como resposta ao clique. Quem devolve o deslize é a classe
 * `detalhe-animado`, definida em `globals.css` sobre o pseudo-elemento
 * `::details-content` — o comentário dela explica o mecanismo. Onde o
 * navegador não a entender, o acordeão volta a abrir instantaneamente e nada
 * mais muda.
 *
 * O `name` compartilhado é o que faz um item fechar quando outro abre, do
 * jeito que um acordeão `type="single"` faria; onde o navegador for velho
 * demais para entendê-lo, os itens apenas abrem de forma independente e nada
 * quebra. O primeiro vem aberto para a seção não parecer uma lista de títulos
 * mudos, e o `<h3>` continua sendo cabeçalho de verdade dentro do `<summary>`
 * — a especificação permite conteúdo de cabeçalho ali, e a hierarquia da
 * página (`<h1>` no hero, `<h2>` por seção) segue inteira.
 *
 * A fonte é `./perguntas`, o mesmo módulo que o layout usa para montar o
 * markup — as duas coisas não têm como divergir.
 */
function Faq(): React.ReactNode {
  const scope = useReveal<HTMLElement>({ stagger: 0.06 });

  return (
    <section id='faq-anchor' ref={scope} className='py-12 md:py-20'>
      <div className='container lg:grid lg:grid-cols-2 lg:items-start lg:gap-16'>
        <header
          data-reveal
          className='max-w-3xl lg:sticky lg:top-24 lg:max-w-none'
        >
          <Rotulo icone={MessageCircleQuestion} className='mb-3'>
            Antes de subir a serra
          </Rotulo>
          <h2 className='text-2xl tracking-tight text-pretty md:text-4xl lg:text-5xl'>
            Perguntas frequentes
          </h2>
          <p className='mt-3 max-w-prose text-muted-foreground'>
            Quanto tempo a cidade pede, o que se paga para entrar, o que é
            obrigatório em cada trilha e como o mapa funciona. Onde o dado
            público diverge, dizemos que diverge em vez de publicar um número
            que manda alguém subir a serra à toa.
          </p>
          <p className='mt-4 max-w-prose text-muted-foreground'>
            Ficou faltando alguma, ou você conhece um lugar que devia estar no
            mapa?{' '}
            <Link
              className='underline underline-offset-4 hover:text-foreground'
              href='/reservar/'
            >
              Fale com a gente
            </Link>{' '}
            — quem mantém o cadastro mora na serra e responde.
          </p>
        </header>

        <div className='mt-8 lg:mt-0'>
          {PERGUNTAS.map(({ pergunta, resposta, leitura }, indice) => (
            <details
              key={pergunta}
              data-reveal
              name='faq-mapa-turistico'
              open={indice === 0}
              className='detalhe-animado group border-t border-border first:border-t-0 first:[&>summary]:pt-0'
            >
              <summary className='flex cursor-pointer list-none items-start justify-between gap-4 rounded-xs py-5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:py-6 [&::-webkit-details-marker]:hidden'>
                <h3 className='text-base font-medium text-pretty md:text-lg'>
                  {pergunta}
                </h3>
                <ChevronDown
                  aria-hidden='true'
                  className='mt-0.5 size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180'
                />
              </summary>
              <div className='pb-5 md:pb-6'>
                <p className='max-w-prose text-sm text-muted-foreground md:text-base'>
                  {resposta}
                </p>
                {leitura && (
                  <p className='mt-3'>
                    <LinkLeitura href={leitura.href}>
                      {leitura.texto}
                    </LinkLeitura>
                  </p>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
