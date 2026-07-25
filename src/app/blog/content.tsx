import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Home } from 'lucide-react';
import type { PostListItem } from '@/lib/posts';

interface Props {
  blogPosts: PostListItem[];
}

/**
 * Índice do blog — macroestrutura Index-First (design.md § Macrostructure):
 * a página É a lista. Sem cards, sem sombra, sem hero; cada post é uma linha
 * separada por fio de 1px, e o link ocupa a linha inteira.
 *
 * Sem reveal: índices são listas, e a Index-First pede "Reveal: none".
 * Por isso este arquivo deixou de ser client component — não há mais GSAP nem
 * `opacity-0` no markup (design.md § Motion).
 *
 * A data não é exibida porque `getAllPostsMeta()` não a expõe em
 * `PostListItem` (só slug/title/description/tags) — nada de inventar campo.
 */
const BlogContent = ({ blogPosts }: Props) => {
  return (
    // `pt-12 md:pt-20` é a folga padrão entre o header e o breadcrumb, a mesma
    // de /chales/, /sobre/ e dos posts. Só o topo é padronizado — o rodapé de
    // cada rota continua com o respiro que já tinha.
    <main className='min-h-container container pt-12 pb-8 md:pt-20 md:pb-14 animate-in fade-in duration-300 fill-mode-both'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink aria-label='Homepage' href='/'>
              <Home className='h-4 w-4' />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Blog</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Abertura curta, no espírito Index-First: um rótulo do que vem abaixo. */}
      {/* `mt-6 md:mt-8`: folga padrão breadcrumb→título das cinco rotas. */}
      <header className='mt-6 max-w-[70ch] md:mt-8'>
        <h1 className='text-3xl tracking-tight text-balance md:text-4xl'>
          Blog
        </h1>
        <p className='mt-3 text-muted-foreground text-pretty md:text-lg'>
          São Bento do Sapucaí e a Serra da Mantiqueira, do jeito de quem mora
          aqui — trilhas, roteiros, épocas do ano e o que fazer na região.
        </p>
      </header>

      <ul className='mt-8 border-t border-border md:mt-12'>
        {blogPosts.map((post) => (
          <li key={post.slug} className='border-b border-border'>
            {/* Barra final obrigatória: `trailingSlash: true` no next.config.ts
                — sem ela o link cai num 308 antes de chegar no post. */}
            <Link
              href={`/blog/${post.slug}/`}
              className='group block rounded-sm py-5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:py-6'
            >
              <h2 className='text-lg tracking-tight text-pretty underline-offset-4 decoration-1 transition-colors duration-200 group-hover:text-accent-deep group-hover:underline md:text-2xl'>
                {post.title}
              </h2>
              <p className='mt-2 line-clamp-1 max-w-[75ch] text-sm text-muted-foreground'>
                {post.description}
              </p>
              {post.tags.length > 0 && (
                <div className='mt-3 flex flex-wrap items-center gap-1.5'>
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant='outline'
                      className='bg-transparent px-2 text-[0.6875rem] font-normal text-muted-foreground'
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default BlogContent;
