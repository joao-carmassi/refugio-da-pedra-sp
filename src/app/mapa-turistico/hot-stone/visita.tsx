/* Origem: @shadcnblocks/cta3 · vitrine hot-stone · adaptado */
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useReveal } from '@/hooks/use-reveal';
import {
  getChegada,
  getLocal,
  getRotaUrl,
  getWhatsLocal,
  linhasHorario,
  ORIGEM_CENTRO,
} from '@/lib/mapa-turistico';
import { ChevronRight, Clock, Map, MapPin, Route } from 'lucide-react';
import Link from 'next/link';
import Rotulo from '../rotulo';

/**
 * Fecho: onde é, a que horas abre e os dois botões.
 *
 * Endereço, telefone e horário saem de `getLocal('hot-stone')` — redigitados
 * aqui virariam uma segunda verdade que sai do ar na primeira mudança do
 * cadastro, e é o cadastro que o pino do mapa também lê.
 *
 * A entrega não ganha botão nem horário: o cadastro registra que ela tem grade
 * própria e nem sempre acompanha a do salão, e o link de delivery que a casa
 * publica ainda aponta para a loja antiga. As duas pendências estão em
 * `vitrines/hot-stone/formulario.md`.
 */
function Visita(): React.ReactNode {
  const scope = useReveal<HTMLElement>();
  const local = getLocal('hot-stone');

  if (!local) return null;

  const chegada = getChegada(local, ORIGEM_CENTRO);
  const whats = getWhatsLocal(
    local,
    `Olá! Vi a página da ${local.nome} no mapa de São Bento e queria falar sobre uma mesa.`,
  );

  return (
    <section ref={scope} className='pb-12 md:pb-20'>
      <div className='container'>
        {/* O cartão ocupa o `.container` inteiro: é a última faixa da página e
            fecha na mesma margem em que a galeria e os números fecham.

            `bg-muted` e não `bg-accent`: o `--accent` deste tema é meio tom
            mais escuro, e o endereço em `text-muted-foreground` cai para
            4,4:1 em cima dele — abaixo de AA para texto de 16 px, que é o
            tamanho no celular. O `--muted` é o tom que o gerador de tema
            testou (4,6:1). */}
        <div className='grid grid-cols-1 gap-10 border border-border bg-muted p-8 lg:grid-cols-2 lg:p-12'>
          <div>
            <header data-reveal>
              <Rotulo icone={MapPin} className='mb-3 text-[var(--primary-forte)]'>
                Chegar lá
              </Rotulo>
              <h2 className='text-2xl tracking-tight text-pretty md:text-4xl lg:text-5xl'>
                Onde fica, e como é a noite lá
              </h2>
            </header>
            <p data-reveal className='mt-4 max-w-prose text-muted-foreground lg:text-lg'>
              {local.endereco}. {chegada.carro} do centro de São Bento.
            </p>
            <div
              data-reveal
              className='mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4'
            >
              {whats && (
                <Button size='lg' className='w-full sm:w-auto' asChild>
                  <a href={whats} target='_blank' rel='noopener noreferrer'>
                    Chamar no WhatsApp
                  </a>
                </Button>
              )}
              <Button
                variant='outline'
                size='lg'
                className='w-full sm:w-auto'
                asChild
              >
                <a
                  href={getRotaUrl(local)}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Route aria-hidden='true' />
                  Traçar a rota
                </a>
              </Button>
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            {/* O primeiro cartão é informação e não vai a lugar nenhum, então
                não é link — o bloco original envolvia os dois num `<a>`. O
                segundo é o vínculo com o mapa, que é o que esta página é: uma
                ficha do guia da cidade com endereço próprio. */}
            <Card
              data-reveal
              className='flex flex-row items-start gap-3 border-border px-6 py-4 shadow-none'
            >
              <Clock aria-hidden='true' className='mt-0.5 size-4 shrink-0' />
              <div>
                <h3 className='mb-2 leading-4 font-medium'>Horário</h3>
                {linhasHorario(local.horario ?? '').map((linha) => (
                  <p key={linha} className='text-sm text-muted-foreground'>
                    {linha}
                  </p>
                ))}
              </div>
            </Card>

            <Link href='/mapa/' data-reveal>
              <Card className='flex flex-row items-center justify-between gap-2 border-border px-6 py-4 shadow-none transition-colors hover:border-[var(--primary-forte)]'>
                <div className='flex items-start gap-3'>
                  <Map aria-hidden='true' className='mt-0.5 size-4 shrink-0' />
                  <div>
                    <h3 className='mb-2 leading-4 font-medium'>
                      O mapa de São Bento do Sapucaí
                    </h3>
                    <p className='text-sm text-muted-foreground'>
                      Cachoeira, mirante, trilha e o resto do centro — com a
                      distância até cada um.
                    </p>
                  </div>
                </div>
                <ChevronRight aria-hidden='true' className='size-6 shrink-0' />
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Visita;
