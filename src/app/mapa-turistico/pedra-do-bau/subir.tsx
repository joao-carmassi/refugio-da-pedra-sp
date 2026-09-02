/* Origem: @shadcnblocks/feature15 · vitrine pedra-do-bau · adaptado */
'use client';

import { useReveal } from '@/hooks/use-reveal';
import { getLocal } from '@/lib/mapa-turistico';
import { Footprints, Mountain, TriangleAlert, Users } from 'lucide-react';
import Rotulo from '../rotulo';

/**
 * O que a página vende, na vaga que numa vitrine de comércio seria o cardápio.
 *
 * Num atrativo público não há preço nem produto: o que o visitante precisa
 * saber antes de decidir é o que a subida exige dele. Os quatro blocos saem
 * inteiros de `descricao` e de `acesso.aPe` no cadastro — nada aqui foi
 * escrito de cabeça, porque errar o número de horas de uma trilha difícil não
 * é erro de copy, é gente na serra sem água.
 *
 * O bloco original abre até doze itens e corta em quatro. Ficaram os quatro
 * que existem: dois sobre a exigência e dois sobre os dois acessos. Não há um
 * quinto assunto e a grade 2×2 não pede um.
 */
function Subir(): React.ReactNode {
  const scope = useReveal<HTMLElement>();
  const local = getLocal('pedra-do-bau');

  if (!local) return null;

  return (
    <section ref={scope} className='py-12 md:py-20'>
      <div className='container'>
        <header data-reveal className='max-w-3xl'>
          <Rotulo icone={TriangleAlert} className='mb-3 text-[var(--primary-forte)]'>
            Antes de subir
          </Rotulo>
          <h2 className='text-2xl tracking-tight text-pretty md:text-4xl lg:text-5xl'>
            A subida não é livre, e é isso que a mantém possível
          </h2>
          <p className='mt-3 max-w-prose text-muted-foreground'>
            {local.descricao}
          </p>
        </header>
        {/* Quatro colunas no monitor grande, não a grade 2x2 do bloco: presa
            em `max-w-5xl` ela terminava antes da borda em que a galeria e os
            números terminam, e duas larguras diferentes na mesma página leem
            como erro de montagem. */}
        <div className='mt-10 grid gap-6 md:mt-12 md:grid-cols-2 xl:grid-cols-4'>
          <div
            data-reveal
            className='flex flex-col justify-between rounded-lg bg-accent p-6 md:min-h-[260px] md:p-8'
          >
            <span className='mb-6 flex size-11 items-center justify-center rounded-full bg-background'>
              <Mountain className='size-5' />
            </span>
            <div>
              <h3 className='text-lg tracking-tight md:text-2xl'>
                Via ferrata no trecho final
              </h3>
              <p className='mt-2 text-muted-foreground'>
                Degraus e grampos fixados na rocha. É o que resolve os últimos
                metros do paredão — e é também o que torna equipamento e
                experiência obrigatórios, não recomendados.
              </p>
            </div>
          </div>
          <div
            data-reveal
            className='flex flex-col justify-between rounded-lg bg-accent p-6 md:min-h-[260px] md:p-8'
          >
            <span className='mb-6 flex size-11 items-center justify-center rounded-full bg-background'>
              <Users className='size-5' />
            </span>
            <div>
              <h3 className='text-lg tracking-tight md:text-2xl'>
                Guia credenciado, um a cada seis
              </h3>
              <p className='mt-2 text-muted-foreground'>
                Obrigatório, na proporção de um monitor a cada seis pessoas, com
                agendamento feito pelo menos um dia antes. Chegar sem agendar é
                não subir.
              </p>
            </div>
          </div>
          <div
            data-reveal
            className='flex flex-col justify-between rounded-lg bg-accent p-6 md:min-h-[260px] md:p-8'
          >
            <span className='mb-6 flex size-11 items-center justify-center rounded-full bg-background'>
              <Footprints className='size-5' />
            </span>
            <div>
              <h3 className='text-lg tracking-tight md:text-2xl'>
                Pela portaria: 4 km e 3 horas
              </h3>
              <p className='mt-2 text-muted-foreground'>
                A trilha mais curta sai da portaria do Monumento Natural, em
                nível difícil. O preço é o carro: ele contorna o maciço inteiro
                para chegar lá.
              </p>
            </div>
          </div>
          <div
            data-reveal
            className='flex flex-col justify-between rounded-lg bg-accent p-6 md:min-h-[260px] md:p-8'
          >
            <span className='mb-6 flex size-11 items-center justify-center rounded-full bg-background'>
              <TriangleAlert className='size-5' />
            </span>
            <div>
              <h3 className='text-lg tracking-tight md:text-2xl'>
                Pelo Chico Bento: 5 km e 5 horas
              </h3>
              <p className='mt-2 text-muted-foreground'>
                O estacionamento fica bem mais perto de carro, e a conta se
                inverte a pé: cerca de 5 km ida e volta, umas 5 horas, com muita
                subida.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Subir;
