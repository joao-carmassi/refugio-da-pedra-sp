import { NextResponse, type NextRequest } from 'next/server';
import chales from '@/data/chales.json';
import slugify from 'slugify';

const BLOG_REDIRECTS: Record<string, string> = {
  '/blog/sao-bento-do-sapucai-a-toscana-brasileira-da-serra-da-mantiqueira/':
    '/blog/toscana-brasileira-sao-bento-do-sapucai/',
  '/blog/o-que-fazer-em-sao-bento-do-sapucai-em-1-dia-roteiro-completo/':
    '/blog/o-que-fazer-em-sao-bento-do-sapucai-guia-completo-de-pontos-turisticos/',
  '/blog/o-que-fazer-em-sao-bento-do-sapucai-a-noite-programas-noturnos-na-serra/':
    '/blog/o-que-fazer-em-sao-bento-do-sapucai-guia-completo-de-pontos-turisticos/',
  '/blog/campos-do-jordao-por-que-e-chamada-de-suica-brasileira/':
    '/blog/suica-brasileira-campos-do-jordao/',
};

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const url = request.nextUrl.clone();

  // Blog slug redirects (SEO consolidation)
  if (pathname in BLOG_REDIRECTS) {
    url.pathname = BLOG_REDIRECTS[pathname];
    return NextResponse.redirect(url, { status: 301 });
  }

  // Chalé ID → slug redirects
  const chale = chales.find((chale) => pathname === `/chales/${chale.id}/`);
  if (chale) {
    url.pathname = `/chales/${slugify(chale.nome, { lower: true, strict: true })}/`;
    return NextResponse.redirect(url, { status: 301 });
  }
}

export const config = {
  matcher: ['/chales/:path*', '/blog/:path*'],
};
