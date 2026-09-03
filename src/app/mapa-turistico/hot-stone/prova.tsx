/* Origem: @shadcnblocks/stats8 · vitrine hot-stone · adaptado */
'use client';

import { useReveal } from '@/hooks/use-reveal';
import {
  formatarDistancia,
  getLocal,
  getRota,
  ORIGEM_CENTRO,
} from '@/lib/mapa-turistico';
import { Star } from 'lucide-react';
import Rotulo from '../rotulo';

/**
 * A vaga de prova social, com três números e nenhum depoimento.
 *
 * A casa tem nota e tem volume de avaliação — 4,7 com 169 votos, que ela mesma
 * publica no próprio site —, mas **não escolheu os comentários** que quer
 * destacar: o site dela carrega um pedido em aberto exatamente para isso. Sem
 * essa escolha, a saída não é escrever um elogio plausível e assinar com um
 * primeiro nome. É mostrar o que dá para conferir e dizer o que falta, que é o
 * que o parágrafo abaixo faz.
 *
 * Nota e contagem saem do cadastro (`local.nota`, `local.avaliacoes`), como no
 * cartão do mapa — e continuam sem virar `aggregateRating` no JSON-LD: marcar
 * como dado estruturado uma nota que este site não hospeda nem apurou é o tipo
 * de marcação que derruba o domínio inteiro, não só a página.
 *
 * A distância é medida: sai do OSRM gravado em `rotas.json`, do Centro, que é
 * de onde vem quem está na cidade decidindo onde jantar.
 */
function Prova(): React.ReactNode {
  const scope = useReveal<HTMLElement>();
  const local = getLocal('hot-stone');
  const rota = local ? getRota(local, ORIGEM_CENTRO) : null;

  if (!local) return null;

  return (
    <section ref={scope} className='py-12 md:py-20'>
      <div className='container'>
        <header data-reveal className='max-w-3xl'>
          <Rotulo icone={Star} className='mb-3 text-[var(--primary-forte)]'>
            Antes de escolher
          </Rotulo>
          <h2 className='text-2xl tracking-tight text-pretty md:text-4xl lg:text-5xl'>
            Três números que não são opinião
          </h2>
          <p className='mt-3 max-w-prose text-muted-foreground'>
            A nota é a que a própria casa publica; a distância foi medida pela
            estrada; o horário é o do cadastro deste mapa. Comentário de cliente
            esta página ainda não tem — quando a Hot Stone escolher os dela,
            entram aqui.
          </p>
        </header>

        {/* Alinhado à esquerda com uma régua de 1px em cima de cada coluna, e
            não o texto solto do bloco original: a linha horizontal é o que
            amarra os três números à margem em que a página inteira lê. */}
        <dl className='mt-10 grid gap-8 md:mt-12 md:grid-cols-3 md:gap-10'>
          {local.nota && (
            <div data-reveal className='border-t border-border pt-5'>
              <dt className='text-sm font-medium text-muted-foreground'>
                No Google, a casa tem
              </dt>
              <dd className='mt-3 text-5xl text-[var(--primary-forte)] lg:text-6xl'>
                {local.nota}
              </dd>
              <dd className='mt-1 text-lg text-muted-foreground'>
                de 5
                {local.avaliacoes
                  ? `, em ${local.avaliacoes.toLocaleString('pt-BR')} avaliações`
                  : ''}
              </dd>
            </div>
          )}
          <div data-reveal className='border-t border-border pt-5'>
            <dt className='text-sm font-medium text-muted-foreground'>
              Abre, sem folga na semana,
            </dt>
            <dd className='mt-3 text-5xl text-[var(--primary-forte)] lg:text-6xl'>
              7 noites
            </dd>
            <dd className='mt-1 text-lg text-muted-foreground'>
              todas a partir das 18h
            </dd>
          </div>
          <div data-reveal className='border-t border-border pt-5'>
            <dt className='text-sm font-medium text-muted-foreground'>
              Do centro de São Bento até a porta
            </dt>
            <dd className='mt-3 text-5xl text-[var(--primary-forte)] lg:text-6xl'>
              {rota ? formatarDistancia(rota.metros) : '—'}
            </dd>
            <dd className='mt-1 text-lg text-muted-foreground'>
              pela avenida que corta a cidade
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export default Prova;
