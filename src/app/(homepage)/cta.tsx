'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useReveal } from '@/hooks/use-reveal';

/**
 * Fecho da página. Não é uma segunda dobra fotográfica: depois da banda do mapa
 * a macroestrutura Photographic pede uma faixa de texto estreita. Por isso o
 * bloco perdeu a foto e virou tipografia — a voz de CTA não se repete, o pill
 * âmbar é o mesmo do topo e o link tipográfico (C3) leva ao catálogo.
 *
 * O `<Cta />` compartilhado (`src/components/cta.tsx`) NÃO é usado nesta rota —
 * ele só entra no rodapé dos posts do blog. Não há duas faixas de CTA aqui.
 */
function Cta(): React.ReactNode {
  const scope = useReveal<HTMLElement>();

  return (
    <section
      id='cta-anchor'
      ref={scope}
      // `dark bg-background` é a cor do CTA que já estava no site: faixa escura
      // fechando a página. No redisign esta seção é clara — aqui só a estrutura
      // foi trazida, a paleta continua a de casa.
      className='border-t border-border bg-background py-16 md:py-24 dark'
    >
      <div className='container'>
        <div className='max-w-2xl'>
          {/* `text-foreground` explícito: sem ele o h2 herda a cor já resolvida
              do `<body>` (o preto do tema claro) e some no fundo escuro — a
              classe `dark` troca as variáveis, mas herança de `color` carrega o
              valor computado, não a variável. */}
          <h2
            data-reveal
            className='text-2xl tracking-tight text-pretty text-foreground md:text-4xl lg:text-5xl'
          >
            Reserve seu chalé
          </h2>
          <p data-reveal className='mt-3 text-muted-foreground md:text-lg'>
            Garanta sua estadia no Refúgio da Pedra SP e viva uma experiência única
            em meio ao ar livre.
          </p>

          <div
            data-reveal
            className='mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8'
          >
            <Button
              effect='expandIcon'
              iconPlacement='right'
              icon={ArrowRight}
              asChild
              size='lg'
              className='w-full rounded-full text-primary-foreground! sm:w-auto'
            >
              <Link href='/reservar/'>Reservar</Link>
            </Button>

            {/* C3 · link tipográfico: palavra, seta e sublinhado de 1px. */}
            <Link
              href='/chales/'
              className='inline-flex items-center gap-1.5 rounded-xs text-accent-deep underline underline-offset-4 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50'
            >
              Ver chalés
              <ArrowRight aria-hidden='true' className='size-4' />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cta;
