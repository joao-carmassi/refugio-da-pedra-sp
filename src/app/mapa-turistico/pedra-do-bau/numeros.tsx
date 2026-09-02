/* Origem: @shadcnblocks/stats1 · vitrine pedra-do-bau · adaptado */
'use client';

import { useReveal } from '@/hooks/use-reveal';
import { Ruler } from 'lucide-react';
import Rotulo from '../rotulo';
import {
  formatarDistancia,
  formatarDuracao,
  getLocal,
  getRota,
  ORIGEM_CENTRO,
} from '@/lib/mapa-turistico';

/**
 * A vaga que numa vitrine de comércio seria a prova social.
 *
 * Aqui não há nota do Google nem depoimento de cliente: a Pedra do Baú não é
 * um negócio e o cadastro não guarda avaliação dela. Inventar um depoimento
 * para preencher a seção seria o pior erro possível numa página cujo trabalho
 * é ser confiável — então a vaga trocou de assunto e ficou com três fatos
 * verificáveis, dois do cadastro e um medido por estrada de verdade.
 *
 * A distância sai do OSRM gravado em `rotas.json`, contada até a **parada**
 * (o estacionamento onde a trilha começa), não até o pino no cume. Sai do
 * Centro porque é de onde vem quem está planejando o dia — a origem padrão do
 * mapa é essa, e esta página não tem o seletor de origem da landing.
 */
function Numeros(): React.ReactNode {
  const scope = useReveal<HTMLElement>();
  const local = getLocal('pedra-do-bau');
  const rota = local ? getRota(local, ORIGEM_CENTRO) : null;

  if (!local) return null;

  return (
    <section ref={scope} className='py-12 md:py-20'>
      <div className='container'>
        <header data-reveal className='max-w-3xl'>
          <Rotulo icone={Ruler} className='mb-3 text-[var(--primary-forte)]'>
            A escala da coisa
          </Rotulo>
          <h2 className='text-2xl tracking-tight text-pretty md:text-4xl lg:text-5xl'>
            Três números para dimensionar o dia
          </h2>
        </header>
        {/* À esquerda, como o cabeçalho e como o resto da página. Centrado, o
            bloco original punha três eixos de leitura no meio de uma página
            que lê pela margem esquerda inteira. A régua de 1px em cima de
            cada coluna é o que dá a linha horizontal que a grade da galeria
            acima já sugere. */}
        <dl className='mt-10 grid gap-8 md:mt-12 md:grid-cols-3 md:gap-10'>
          <div data-reveal className='border-t border-border pt-5'>
            <dt className='text-sm font-medium text-muted-foreground'>
              O cume está a
            </dt>
            <dd className='mt-3 text-5xl text-[var(--primary-forte)] lg:text-6xl'>
              1.950 m
            </dd>
            <dd className='mt-1 text-lg text-muted-foreground'>
              acima do nível do mar
            </dd>
          </div>
          <div data-reveal className='border-t border-border pt-5'>
            <dt className='text-sm font-medium text-muted-foreground'>
              A face norte é um paredão de
            </dt>
            <dd className='mt-3 text-5xl text-[var(--primary-forte)] lg:text-6xl'>
              350 m
            </dd>
            <dd className='mt-1 text-lg text-muted-foreground'>
              de rocha limpa
            </dd>
          </div>
          <div data-reveal className='border-t border-border pt-5'>
            <dt className='text-sm font-medium text-muted-foreground'>
              Do centro até onde a trilha começa
            </dt>
            <dd className='mt-3 text-5xl text-[var(--primary-forte)] lg:text-6xl'>
              {rota ? formatarDistancia(rota.metros) : '—'}
            </dd>
            <dd className='mt-1 text-lg text-muted-foreground'>
              {rota ? `${formatarDuracao(rota.segundos)} de carro` : 'de carro'}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export default Numeros;
