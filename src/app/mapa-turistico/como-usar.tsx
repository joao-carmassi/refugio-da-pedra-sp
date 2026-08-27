'use client';

import { Button } from '@/components/ui/button';
import { useReveal } from '@/hooks/use-reveal';
import { ArrowRight, Compass } from 'lucide-react';
import Link from 'next/link';
import Rotulo from './rotulo';

interface Passo {
  titulo: string;
  texto: React.ReactNode;
}

/**
 * Os passos descrevem o que a tela faz hoje — filtro, busca tolerante a
 * acento e erro de digitação, cartão no pino e o botão "Como chegar", que é o
 * rótulo literal do mapa (`cartao-rapido.tsx`, `painel-detalhes.tsx`). Mudou
 * a interface, muda esta lista.
 */
const PASSOS: Passo[] = [
  {
    titulo: 'Filtre por categoria',
    texto:
      'A fila de pílulas no topo troca o que aparece no mapa e na lista lateral. Só entram categorias que têm lugar cadastrado.',
  },
  {
    titulo: 'Ou busque pelo nome',
    texto: (
      <>
        O campo aceita nome do lugar e nome de categoria, sem acento e com letra
        trocada: digitar <em>bau</em> traz a Pedra do Baú, o Bauzinho e a
        portaria do Monumento Natural de uma vez.
      </>
    ),
  },
  {
    titulo: 'Toque num pino',
    texto:
      'No celular sobe um cartão com foto, categoria e o resumo do lugar. No computador o cartão aparece ao passar o ponteiro, e o clique abre a ficha completa, com endereço, horário e telefone quando existem — e a distância a partir do Refúgio, que em cume e cachoeira vem com o trecho que ainda falta a pé.',
  },
  {
    titulo: 'Toque em Como chegar',
    texto:
      'O Google Maps abre com a rota traçada até onde o carro chega, saindo de onde você estiver. Em cume e trilha esse ponto não é a atração: no Complexo da Pedra do Baú a rota vai para o estacionamento de onde sai a trilha daquele ponto — o do Chico Bento para o cume do Baú, a Ana Chata e o Campo Escola, o da portaria para o Bauzinho. As distâncias da ficha são medidas de um ponto fixo, e a rota é medida de onde você está. O botão no canto devolve o mapa a esse ponto fixo quando você quiser recomeçar.',
  },
];

/**
 * Ponte entre a página e a ferramenta. Fica logo antes do FAQ porque é o
 * último empurrão antes de o visitante ou abrir o mapa ou ir tirar dúvida.
 */
function ComoUsar(): React.ReactNode {
  const scope = useReveal<HTMLElement>();

  return (
    <section
      id='como-usar-anchor'
      ref={scope}
      className='py-12 md:py-20 bg-card'
    >
      {/* Em `lg` o título gruda enquanto os passos correm ao lado — mesma
          composição da ficha de comodidades da homepage. `items-start` é o que
          permite o `sticky`: sem ele o item do grid estica até a altura da
          linha e nunca chega a destacar. */}
      <div className='container lg:grid lg:grid-cols-[19rem_1fr] lg:items-start lg:gap-16'>
        <header
          data-reveal
          className='max-w-3xl lg:sticky lg:top-24 lg:max-w-none'
        >
          <Rotulo icone={Compass} className='mb-3'>
            A ferramenta
          </Rotulo>
          <h2 className='text-2xl tracking-tight text-pretty md:text-4xl lg:text-5xl'>
            Como usar o mapa
          </h2>
          <p className='mt-3 max-w-prose text-muted-foreground'>
            O mapa abre em tela cheia, já enquadrado na região. Não precisa de
            cadastro, de aplicativo nem de conta — é de uso livre, para quem
            estiver na cidade e para quem ainda está planejando a viagem.
          </p>

          <div className='mt-6'>
            <Button
              effect='expandIcon'
              iconPlacement='right'
              icon={ArrowRight}
              asChild
              size='lg'
              className='w-full rounded-full sm:w-auto'
            >
              <Link href='/mapa/'>Abrir o mapa turístico</Link>
            </Button>
          </div>
        </header>

        {/* Fila de `@shadcnblocks/process1`: número em bloco de fundo sólido à
            esquerda, passo à direita, régua de 1px entre eles. O que mudou em
            relação ao bloco foi a decoração — asterisco laranja e o SVG de
            canto vermelho saíram, porque a paleta da casa é areia e pedra. */}
        <ol data-reveal className='mt-8 md:mt-12 lg:mt-0'>
          {PASSOS.map(({ titulo, texto }, indice) => (
            <li
              key={titulo}
              className='flex flex-col gap-4 border-t border-border py-6 last:border-b md:flex-row md:gap-10 md:py-8'
            >
              <span
                aria-hidden='true'
                className='flex size-12 shrink-0 items-center justify-center bg-muted tracking-tight tabular-nums'
              >
                {String(indice + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className='text-lg font-semibold tracking-tight text-pretty md:text-xl'>
                  {titulo}
                </h3>
                <p className='mt-2 max-w-prose text-muted-foreground'>
                  {texto}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default ComoUsar;
