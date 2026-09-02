/* Origem: @shadcnblocks/hero78 · vitrine pedra-do-bau · adaptado */
'use client';

import { Button } from '@/components/ui/button';
import { useReveal } from '@/hooks/use-reveal';
import { getAlt } from '@/lib/image-alt';
import { getLocal, getRotaUrl, ZONAS } from '@/lib/mapa-turistico';
import { Mountain } from 'lucide-react';
import Image from 'next/image';
import Rotulo from '../rotulo';

/**
 * Foto de abertura, em constante porque o caminho é usado duas vezes: na
 * `src` e na consulta ao mapa de alt text, que é chaveado por ele.
 *
 * Não é a mesma foto da landing do mapa (`pedra-do-bau-4`, o complexo entre
 * nuvens): duas páginas do mesmo site abrindo com a mesma imagem parecem a
 * mesma página. Esta é o maciço na luz do fim de tarde, que é quando a face
 * norte — a que o visitante sobe — pega sol.
 */
const FOTO = '/assets/mapa/pedra-do-bau/pedra-do-bau-2.webp';

/**
 * Dobra da página do ponto.
 *
 * Diferente da abertura editorial de `/mapa-turistico/`, que começa por
 * breadcrumb e texto: aqui a foto é o argumento inteiro. Quem chega buscando
 * "pedra do baú" já sabe o nome e quer ver o tamanho da coisa — e o único
 * ativo forte de um atrativo é a fotografia dele.
 *
 * O bloco original punha um `<img>` de fundo com `alt=""` e `aria-hidden`,
 * tratando a foto como decoração. Aqui ela é o conteúdo: leva alt de verdade,
 * vindo do mesmo `image-alt.json` que o resto do acervo.
 *
 * `onMount` porque o bloco está acima da dobra: esperar o ScrollTrigger aqui
 * significaria abrir a página com o título invisível.
 */
function Dobra(): React.ReactNode {
  const scope = useReveal<HTMLElement>({ onMount: true, delay: 0.15 });
  const local = getLocal('pedra-do-bau');

  if (!local) return null;

  return (
    <section
      ref={scope}
      /* `dark` inverte os tokens desta faixa — e é por isso que `tema.css`
         declara o bloco escuro do parceiro. Sem ele a faixa herdaria o marrom
         do Refúgio por baixo de uma foto de granito. */
      className='dark relative flex min-h-[calc(100svh-var(--header-height,5rem))] w-full overflow-hidden'
    >
      <Image
        src={FOTO}
        alt={getAlt(FOTO, 'Maciço da Pedra do Baú à luz do fim de tarde')}
        fill
        sizes='100vw'
        priority
        className='z-0 object-cover object-center'
      />
      {/* Véu em gradiente, não a lâmina uniforme do bloco original: a foto é
          clara no céu e escura na mata, e um `bg-black/20` plano deixava o
          subtítulo ilegível sobre a faixa de nuvem. O escuro se concentra
          embaixo, onde o texto está. */}
      <div
        aria-hidden
        className='absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-black/40 to-black/15'
      />
      {/* Mesmo `.container` das seções de baixo, e à esquerda como elas: o
          <h1> nasce na régua vertical em que nasce todo <h2> da página. O
          bloco original centrava o texto, e texto centrado aqui com tudo
          alinhado à esquerda embaixo é o que faz uma página parecer cinco
          blocos avulsos empilhados em vez de uma peça só. */}
      <div className='relative z-30 container mt-auto mb-16 flex flex-col items-start gap-5 md:mb-24'>
        <div data-reveal>
          <Rotulo icone={Mountain} className='text-[var(--primary-forte)]'>
            {ZONAS[local.zona]} · São Bento do Sapucaí
          </Rotulo>
        </div>
        <h1
          data-reveal
          className='max-w-4xl text-4xl tracking-tight text-pretty text-foreground md:text-6xl'
        >
          {local.nome}
        </h1>
        <p
          data-reveal
          className='max-w-prose text-pretty text-foreground md:text-lg'
        >
          {local.resumo}
        </p>
        <Button data-reveal size='lg' className='mt-2 h-fit w-fit px-7 py-4' asChild>
          {/* `getRotaUrl` manda o Google Maps para a parada — o estacionamento
              de onde a trilha sai —, não para o pino no cume. Mandar um carro
              para o cume da Pedra do Baú é mandá-lo para onde não há estrada. */}
          <a href={getRotaUrl(local)} target='_blank' rel='noopener noreferrer'>
            Como chegar
          </a>
        </Button>
      </div>
    </section>
  );
}

export default Dobra;
