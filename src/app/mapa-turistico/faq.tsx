'use client';

import { MessageCircleQuestion } from 'lucide-react';
import Link from 'next/link';
import { useReveal } from '@/hooks/use-reveal';
import LinkLeitura from './link-leitura';
import { PERGUNTAS } from './perguntas';
import Rotulo from './rotulo';

/**
 * As perguntas que chegam no WhatsApp antes de cada reserva.
 *
 * Composição de `@shadcnblocks/faq20`: título e chamada numa coluna, a lista
 * na outra, separada por réguas de 1px. O que não veio do bloco é o acordeão —
 * ele monta o conteúdo só quando o item abre, e aqui as respostas precisam
 * estar no HTML servido: metade destas visitas chega da busca atrás de uma
 * delas, e o `FAQPage` do JSON-LD descreve texto que tem de existir na página.
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
            Taxas, horários e o que é obrigatório em cada trilha. Onde o dado
            público diverge, dizemos que diverge em vez de publicar um número
            que manda alguém subir a serra à toa.
          </p>
          <p className='mt-4 max-w-prose text-muted-foreground'>
            Ficou faltando alguma?{' '}
            <Link
              className='underline underline-offset-4 hover:text-foreground'
              href='/reservar/'
            >
              Fale com a gente
            </Link>{' '}
            — respondemos antes da reserva, sem compromisso.
          </p>
        </header>

        <div className='mt-8 lg:mt-0'>
          {PERGUNTAS.map(({ pergunta, resposta, leitura }) => (
            <div
              key={pergunta}
              data-reveal
              className='border-t border-border py-5 first:border-t-0 first:pt-0 md:py-6 lg:first:pt-0'
            >
              <h3 className='text-base font-medium text-pretty md:text-lg'>
                {pergunta}
              </h3>
              <p className='mt-2 max-w-prose text-sm text-muted-foreground md:text-base'>
                {resposta}
              </p>
              {leitura && (
                <p className='mt-3'>
                  <LinkLeitura href={leitura.href}>{leitura.texto}</LinkLeitura>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
