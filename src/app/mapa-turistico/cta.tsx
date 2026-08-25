'use client';

import { Button } from '@/components/ui/button';
import { useReveal } from '@/hooks/use-reveal';
import { ArrowRight, TentTree } from 'lucide-react';
import Link from 'next/link';
import LinkLeitura from './link-leitura';
import Rotulo from './rotulo';

/**
 * Fecho da página, na mesma faixa escura que fecha a homepage — é a voz de
 * CTA da casa e ela não muda de rota para rota.
 *
 * É o único bloco da rota em que a pousada fala de si, e por isso ele está no
 * fim: o visitante chega aqui depois de já ter usado o guia. O argumento não é
 * "você precisa se hospedar para usar o mapa", é "quem fez o mapa também
 * recebe na serra". Nada de foto: depois de seis blocos de conteúdo a
 * macroestrutura pede uma faixa de tipografia, não uma sétima imagem.
 */
function Cta(): React.ReactNode {
  const scope = useReveal<HTMLElement>();

  return (
    <section
      id='cta-anchor'
      ref={scope}
      className='dark border-t border-border bg-background py-16 md:py-24'
    >
      {/* Corte de `@shadcnblocks/cta10`: argumento de um lado, ações do outro,
          empilhados abaixo de `lg`. O bloco original põe isso num painel de
          canto arredondado sobre `bg-accent`; aqui a faixa escura de parede a
          parede continua sendo a voz de CTA da casa, e só a divisão em duas
          colunas veio de lá. */}
      <div className='container flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16'>
        <div className='max-w-2xl flex-1'>
          {/* `text-foreground` explícito: sem ele o h2 herda a cor já resolvida
              do `<body>` (o preto do tema claro) e some no fundo escuro — a
              classe `dark` troca as variáveis, mas herança de `color` carrega o
              valor computado, não a variável. */}
          <div data-reveal className='mb-3'>
            <Rotulo icone={TentTree}>Quem mantém o mapa</Rotulo>
          </div>
          <h2
            data-reveal
            className='text-2xl tracking-tight text-pretty text-foreground md:text-4xl lg:text-5xl'
          >
            A pousada por trás do mapa
          </h2>
          <p data-reveal className='mt-3 text-muted-foreground md:text-lg'>
            Este mapa é um projeto do Refúgio da Pedra SP, a pousada que fica
            no pé da serra e mantém o cadastro. Se você ainda está escolhendo
            onde dormir em São Bento do Sapucaí, são cinco acomodações — três
            chalés, uma cabana com lareira e um domo geodésico — a 3,5 km da
            primeira cachoeira e a 1,5 km do pé da Pedra do Baú, com café da
            manhã e a conversa sobre o que rende mais no dia que a serra der.
          </p>

          <p data-reveal className='mt-6 text-sm text-muted-foreground'>
            O cadastro deste mapa foi levantado a pé e por estrada, por quem
            mora na serra e recebe visitantes desde 2018.{' '}
            <Link
              className='underline underline-offset-4 hover:text-foreground'
              href='/sobre/'
            >
              Conheça o Refúgio da Pedra SP
            </Link>
            .
          </p>
        </div>

        <div
          data-reveal
          className='flex shrink-0 flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8 lg:flex-col lg:items-start'
        >
          <Button
            effect='expandIcon'
            iconPlacement='right'
            icon={ArrowRight}
            asChild
            size='lg'
            className='w-full rounded-full text-primary-foreground! sm:w-auto'
          >
            <Link href='/reservar/'>Reservar sua estadia</Link>
          </Button>

          <LinkLeitura href='/chales/'>Ver as acomodações</LinkLeitura>
        </div>
      </div>
    </section>
  );
}

export default Cta;
