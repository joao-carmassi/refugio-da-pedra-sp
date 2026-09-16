import { ChevronDown } from 'lucide-react';
import Markdown from 'react-markdown';
import type { PostFaqItem } from '@/lib/posts';

interface Props {
  id: string;
  itens: PostFaqItem[];
}

/**
 * Perguntas frequentes do post, renderizadas de `faq_schema` no frontmatter —
 * a mesma fonte do `FAQPage` do JSON-LD (`layout.tsx`). Antes o corpo do
 * markdown trazia uma seção "FAQ" escrita à mão que divergia do schema; agora
 * só existe esta, e o markup não tem como descrever pergunta que não está na
 * tela.
 *
 * Mesmo desenho do FAQ de `/mapa-turistico/` (`mapa-turistico/faq.tsx`, onde
 * está a justificativa completa): `<details>` nativo em vez do acordeão do
 * Radix, porque a resposta precisa estar no HTML servido mesmo com o item
 * fechado, e `detalhe-animado` (globals.css) devolve o deslize. Aqui nenhum
 * item compartilha `name`: num post a leitura é linear, e abrir uma resposta
 * não deveria fechar a que o leitor acabou de ler.
 *
 * `not-prose` porque a seção mora dentro do `<article className='prose'>` e
 * o tipográfico do plugin brigaria com o espaçamento do acordeão.
 */
function PostFaq({ id, itens }: Props): React.ReactNode {
  return (
    <section id={id} className='not-prose my-8 scroll-mt-24'>
      <h2 className='text-2xl tracking-tight text-pretty md:text-3xl'>
        Perguntas frequentes
      </h2>
      <div className='mt-4 md:mt-6'>
        {itens.map(({ pergunta, resposta }, indice) => (
          <details
            key={pergunta}
            open={indice === 0}
            className='detalhe-animado group border-t border-border last:border-b'
          >
            <summary className='flex cursor-pointer list-none items-start justify-between gap-4 rounded-xs py-5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:py-6 [&::-webkit-details-marker]:hidden'>
              <h3 className='text-base font-medium text-pretty md:text-lg'>
                {pergunta}
              </h3>
              <ChevronDown
                aria-hidden='true'
                className='mt-0.5 size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180'
              />
            </summary>
            <div className='max-w-prose pb-5 text-sm text-muted-foreground md:pb-6 md:text-base [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-foreground [&_strong]:font-medium [&_strong]:text-foreground'>
              <Markdown>{resposta}</Markdown>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

export default PostFaq;
