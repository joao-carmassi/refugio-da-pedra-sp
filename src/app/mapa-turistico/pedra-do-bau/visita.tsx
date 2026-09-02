/* Origem: @shadcnblocks/cta13 · vitrine pedra-do-bau · adaptado */
'use client';

import { Button } from '@/components/ui/button';
import { useReveal } from '@/hooks/use-reveal';
import {
  getChegada,
  getLocal,
  getRotaUrl,
  ORIGEM_CENTRO,
} from '@/lib/mapa-turistico';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import Rotulo from '../rotulo';

/**
 * Fecho: endereço, o que o carro alcança, o que sobra a pé e os dois botões.
 *
 * O horário mostrado é o da **portaria**, e vem do cadastro dela
 * (`mona-pedra-bau`), não deste ponto — o cume não tem horário publicado, e
 * atribuir um a ele faria a página prometer o que ninguém confirmou. Por isso
 * a frase diz de quem é o horário em vez de exibir um selo de aberto/fechado.
 *
 * O botão secundário abre `/mapa/`, a ferramenta, e não uma âncora desta
 * página no guia: não existe rota que abra o mapa já centrado num ponto, e
 * link que promete isso e entrega o mapa inteiro é pior que link honesto.
 */
function Visita(): React.ReactNode {
  const scope = useReveal<HTMLElement>();
  const local = getLocal('pedra-do-bau');
  const portaria = getLocal('mona-pedra-bau');

  if (!local) return null;

  const chegada = getChegada(local, ORIGEM_CENTRO);

  return (
    <section ref={scope} className='pb-12 md:pb-20'>
      <div className='container'>
        {/* O cartão ocupa o `.container` inteiro, sem `max-w-5xl`: ele é a
            última faixa da página e precisa fechar na mesma margem em que a
            galeria e os números fecham. Preso mais estreito, o fecho parecia
            um aviso solto embaixo da página em vez do rodapé dela. */}
        <div className='rounded-lg bg-accent p-8 lg:p-12'>
          <div className='flex flex-col gap-4 lg:gap-6'>
            <header data-reveal className='max-w-3xl'>
              <Rotulo icone={MapPin} className='mb-3 text-[var(--primary-forte)]'>
                Chegar lá
              </Rotulo>
              <h2 className='text-2xl tracking-tight text-pretty md:text-4xl lg:text-5xl'>
                Onde fica, e até onde o carro vai
              </h2>
            </header>
            <p data-reveal className='max-w-prose text-muted-foreground lg:text-lg'>
              {local.endereco}. {chegada.carro} do centro de São Bento.
              {chegada.aPe ? ` ${chegada.aPe}` : ''}
            </p>
            {portaria?.horario && (
              <p data-reveal className='max-w-prose text-muted-foreground lg:text-lg'>
                A portaria do Monumento Natural abre {portaria.horario.toLowerCase()},
                e a subida ao cume só pode começar até as 14h.
              </p>
            )}
            <div
              data-reveal
              className='mt-4 flex flex-col gap-3 sm:flex-row sm:gap-4'
            >
              <Button size='lg' className='w-full sm:w-auto' asChild>
                <a
                  href={getRotaUrl(local)}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Traçar a rota no Google Maps
                </a>
              </Button>
              <Button
                variant='outline'
                size='lg'
                className='w-full sm:w-auto'
                asChild
              >
                <Link href='/mapa/'>Abrir o mapa da cidade</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Visita;
