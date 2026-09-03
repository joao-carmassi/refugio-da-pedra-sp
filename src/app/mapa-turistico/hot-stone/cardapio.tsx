/* Origem: @shadcnblocks/feature132 · vitrine hot-stone · adaptado */
'use client';

import { Button } from '@/components/ui/button';
import { useReveal } from '@/hooks/use-reveal';
import { getAlt } from '@/lib/image-alt';
import { getLocal, getWhatsLocal } from '@/lib/mapa-turistico';
import { MessageCircle, UtensilsCrossed } from 'lucide-react';
import Image from 'next/image';
import Rotulo from '../rotulo';

/**
 * As quatro frentes da casa, uma por foto.
 *
 * São quatro e não seis (o bloco vinha com seis) porque quatro é o que a casa
 * faz: o cadastro federal traz restaurante como atividade principal e bar,
 * bufê e comida para consumo em casa como secundárias. Cada cartão é uma
 * dessas frentes, com a foto que a própria casa publica.
 *
 * Os cartões **não são links**. O bloco original envolvia cada um num `<a>`
 * para uma página de detalhe; aqui não existe página de detalhe de categoria,
 * e link que não leva a lugar nenhum sai.
 */
const FRENTES = [
  {
    foto: '/assets/mapa/hot-stone/hot-stone-12.webp',
    titulo: 'Pizza',
    texto:
      'Massa aberta e assada na hora, salgada ou doce. O cardápio tem mais de trinta sabores, da muçarela à da casa — muçarela, calabresa, cebola e azeitona.',
    fallback: 'Pizza da casa, na chapa preta',
  },
  {
    foto: '/assets/mapa/hot-stone/hot-stone-4.webp',
    titulo: 'Hambúrguer',
    texto:
      'Artesanal, montado na hora e servido no papel estampado da casa. É a outra metade do letreiro: aqui pizzaria e hamburgueria dividem a mesma cozinha.',
    fallback: 'Hambúrguer artesanal da Hot Stone',
  },
  {
    foto: '/assets/mapa/hot-stone/hot-stone-5.webp',
    titulo: 'Porção e prato',
    texto:
      'Porção para dividir na mesa, parmegiana, executivo, panqueca e a batata cremosa da casa. Quem chega cedo janta; quem chega tarde divide uma tábua.',
    fallback: 'Tábua com carne, fritas e chope',
  },
  {
    foto: '/assets/mapa/hot-stone/hot-stone-6.webp',
    titulo: 'Chope e bar',
    texto:
      'Chope na torneira — o da Cervejaria Sapucaí, da região —, cerveja artesanal, vinho, suco feito na hora e a fileira de drinques do balcão.',
    fallback: 'Fileira de drinques no balcão da Hot Stone',
  },
];

function Cardapio(): React.ReactNode {
  const scope = useReveal<HTMLElement>();
  const local = getLocal('hot-stone');

  if (!local) return null;

  const whats = getWhatsLocal(
    local,
    `Olá! Vi a página da ${local.nome} no mapa de São Bento e queria o cardápio com os preços.`,
  );

  return (
    <section ref={scope} className='py-12 md:py-20'>
      <div className='container'>
        {/* Cabeçalho à esquerda: o bloco vinha centrado em `mx-auto max-w-5xl
            text-center`, que é a medida dele e não a da página — e texto
            centrado no meio de quatro seções alinhadas à esquerda cria duas
            linhas de leitura na mesma tela. */}
        <header data-reveal className='max-w-3xl'>
          <Rotulo icone={UtensilsCrossed} className='mb-3 text-[var(--primary-forte)]'>
            O que se come
          </Rotulo>
          <h2 className='text-2xl tracking-tight text-pretty md:text-4xl lg:text-5xl'>
            Pizza, hambúrguer e chope no mesmo endereço
          </h2>
          {/* A casa não publica preço em lugar nenhum — nem no site dela, que
              registra o cardápio como pendência. Esta página não inventa
              faixa de valor: diz onde o preço está e manda perguntar. Quando o
              cardápio chegar, é aqui que os valores entram. */}
          <p className='mt-3 max-w-prose text-muted-foreground'>
            O cardápio completo, com os preços do dia, sai por WhatsApp — é
            onde a casa o mantém atualizado.
          </p>
        </header>

        {whats && (
          <div data-reveal className='mt-6'>
            <Button variant='outline' asChild>
              <a href={whats} target='_blank' rel='noopener noreferrer'>
                <MessageCircle aria-hidden='true' />
                Pedir o cardápio
              </a>
            </Button>
          </div>
        )}

        <div className='mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-12 lg:grid-cols-4'>
          {FRENTES.map((frente) => (
            <article
              key={frente.titulo}
              data-reveal
              className='flex h-full min-w-0 flex-col'
            >
              {/* `fill` num quadro 4:3 e não `width`/`height`: as quatro fotos
                  vieram de enquadramentos diferentes (a da pizza é quase
                  quadrada), e o que precisa bater aqui é a fileira, não a
                  proporção de cada arquivo. */}
              <div className='relative aspect-4/3 w-full shrink-0 overflow-hidden border border-border'>
                <Image
                  src={frente.foto}
                  alt={getAlt(frente.foto, frente.fallback)}
                  fill
                  sizes='(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw'
                  className='object-cover transition duration-300 hover:brightness-90'
                />
              </div>
              <div className='mt-6 flex flex-1 flex-col'>
                <h3 className='mb-2 text-lg tracking-tight'>{frente.titulo}</h3>
                <p className='text-sm text-muted-foreground'>{frente.texto}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Cardapio;
